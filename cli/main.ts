import { input, select, confirm } from "@inquirer/prompts";
import ccxt from "ccxt";
import {
  getConfig,
  setConfig,
  getEnv,
  setEnv,
  distributeNumbers,
  sleep,
  splitBy,
} from "../utils/index";
import {
  exchanges,
  markets,
  quoteCurrencies,
  getTickers,
} from "../options/index";
import { cli } from "../parse/index";
import trade from "../actions/trade";
import view from "../actions/view";
import { verifySettings, verifyConfig } from "./verifySettings";

type Props = {
  args: string[];
  flags: {
    action: string;
  };
};

export default async function main({ args, flags }: Props) {
  const config = getConfig();
  const env = getEnv();
  const exchange = getConfig().exchange;
  //@ts-ignore
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });

  console.log(cli.help);
  while (true) {
    console.log(
      "\nselect action when ready. or type 'help' for list of actions.",
    );

    const action =
      flags.action === "none" && !args.length
        ? await input({
            message: `\n>`,
          })
        : flags.action;
    switch (action) {
      case "help":
      case "h":
        console.log(cli.help);
        break;
      case "trade":
      case "t":
        await (async () => {
          const { exchange, market, quoteCurrency } = getConfig();
          const tickers = await getTickers(exchange, market, quoteCurrency);

          let symbolCheck = false;
          let symbol: string | undefined;
          while (!symbolCheck) {
            symbol = await input({ message: "symbol? (enter for default)" });
            if (symbol === "exit") return;

            symbolCheck = true;

            let asset;
            let quoteCurrency;
            if (symbol === "") {
              asset = config.asset;
              quoteCurrency = config.quoteCurrency;
            } else {
              if (!symbol.includes("/")) {
                asset = symbol;
                quoteCurrency = config.quoteCurrency;
              } else {
                let symbolArr = symbol.split("/");
                asset = symbolArr[0];
                quoteCurrency = symbolArr[1];
              }
            }
            symbol = asset + "/" + quoteCurrency + ":" + quoteCurrency;
            let tickerCheck = asset + quoteCurrency;
            if (!tickers.includes(tickerCheck)) {
              console.log(
                tickerCheck,
                "not found for: ",
                exchange,
                ".. try again",
              );
              symbolCheck = false;
            }
          }
          let leverage;
          const isDefaultLeverage = await confirm({
            message: "use default leverage?",
          });
          if (isDefaultLeverage) {
            leverage = getConfig().leverage;
          } else {
            let leverageCheck = true;
            while (leverageCheck) {
              try {
                leverage = parseFloat(await input({ message: "leverage?" }));
                leverageCheck = false;
              } catch (err) {
                console.log("input must be a number, please try again.");
                leverageCheck = true;
              }
            }
          }
          //throws err if leverage is already set to the same number
          try {
            await connect.setLeverage(leverage, symbol);
          } catch {}

          console.log("trading:", symbol);

          let type = await select({
            message: "order type?",
            choices: [{ value: "market" }, { value: "limit" }],
          });

          let executionStyle;
          if (type === "limit") {
            executionStyle = await select({
              message: "execution style?",
              choices: [{ value: "point" }, { value: "range" }],
            });
          }
          let side = await select({
            message: "long or short?",
            choices: [
              { name: "long", value: "buy" },
              { name: "short", value: "sell" },
            ],
          });
          let amountCheck = false;
          let amount: number | undefined;
          while (!amountCheck) {
            try {
              amount = parseFloat(await input({ message: "order size?" }));
              amountCheck = true;
              if (!amount) {
                console.log("amount cannot be blank.");
                amountCheck = false;
              }
            } catch (err) {
              console.log("input must be a number. please try again.");
            }
          }

          let price;
          let executionPrices;
          let scale: "linear" | "exponential";
          if (executionStyle === "point")
            price = parseFloat(await input({ message: "price?" }));
          if (executionStyle === "range") {
            let from = parseFloat(await input({ message: "from?" }));
            let to = parseFloat(await input({ message: "to?" }));
            let iterations = parseInt(await input({ message: "iterations?" }));
            executionPrices = distributeNumbers(from, to, iterations);

            scale = await select({
              message: "range sizing distribution?",
              choices: [{ value: "linear" }, { value: "exponential" }],
            });
          }
          let isStop = await confirm({ message: "stop loss?" });
          let stopLossPrice;
          if (isStop)
            stopLossPrice = parseFloat(await input({ message: "stop price?" }));

          let isTakeProfit = await confirm({ message: "take profit?" });
          let takeProfitPrice;
          if (isTakeProfit)
            takeProfitPrice = parseFloat(
              await input({ message: "take profit price?" }),
            );
          let isReduce = await confirm({ message: "reduce only?" });

          //@todo add strict typing
          let params: any = {};
          if (isReduce) params.reduceOnly = true;
          //   if (isStop) {
          //       params.stopLoss = {
          //           "type": "market",
          //           "triggerPrice": stopLossPrice

          //       }
          //   }
          //   if (isTakeProfit) {
          //       params.takeProfit = {
          //           "type": "market",
          //           "triggerPrice": takeProfitPrice
          //       }
          //   }
          if (isStop) {
            params.stopLoss = stopLossPrice;
          }
          if (isTakeProfit) {
            params.takeProfit = takeProfitPrice;
          }

          if (executionPrices) {
            let splitPricesIntoChunks = splitBy(executionPrices, 10);
            console.log("\nplacing trades...");
            //@ts-ignore
            //cannot be undefined as determined from var defining above
            let amountPerIteration = amount / executionPrices.length;
            let j = 1;
            let amountPerIterationExp: number;
            let lastAmount = 0;
            let currentAmount = 0;

            for (let i = 0; i < splitPricesIntoChunks.length; i++) {
              await Promise.all(
                splitPricesIntoChunks[i].map(async (executionPrice: number) => {
                  if (scale === "exponential") {
                    amountPerIterationExp = amountPerIteration * j * j;
                    amountPerIterationExp =
                      amountPerIterationExp / executionPrices.length;
                    amountPerIterationExp =
                      Math.round(amountPerIterationExp * 10) / 10;
                    currentAmount = amountPerIterationExp;
                    amountPerIterationExp = currentAmount - lastAmount;
                    lastAmount = currentAmount;
                    j++;
                  }

                  await trade({
                    connect: connect,
                    symbol: symbol,
                    type: type,
                    side: side,
                    amount:
                      scale === "exponential"
                        ? amountPerIterationExp
                        : amountPerIteration,
                    price: executionPrice,
                    params: params,
                  });
                }),

                //avoid rate limiting
                //@ts-ignore ts wants Promise.all to only accept one argument for some reason
                await sleep(1000),
              );
            }
            console.log("trades placed!");
          } else {
            await trade({
              connect: connect,
              // _exchange: exchange,
              symbol: symbol,
              type: type,
              side: side,
              amount: amount,
              price: price,
              params: params,
            });
          }

          //trade thing
        })();
        break;

      case "listen":
      case "l":
        console.log("listen");
        //wss listening for new positions opened, closed.
        break;
      case "view":
      case "v":
        await (async () => {
          const target = await select({
            message: "what would you like to view?",
            choices: [
              { value: "balance" },
              { value: "open orders" },
              { value: "closed orders" },
              { value: "open positions" },
              { value: "back" },
            ],
          });
          if (target === "back") return;
          await view(target);
        })();
        break;
      case "settings":
      case "s":
        await (async () => {
          let configAction = await select({
            message: "config actions: ",
            choices: [
              { value: "view" },
              { value: "modify" },
              { value: "back" },
            ],
          });
          if (configAction === "back") return;
          switch (configAction) {
            case "view":
              let answer = await confirm({ message: "view config?" });
              if (answer) console.log(await getConfig());
              answer = await confirm({ message: "view env?" });
              if (answer) console.log(await getEnv());
              break;
            case "modify":
              const option = await select({
                message: "what would you like to modify?",
                choices: [{ value: "config" }, { value: "env" }],
              });
              switch (option) {
                case "config":
                  await verifyConfig({});
                  break;
                case "env":
                  const exchange = await select({
                    message: "exchange?",
                    choices: exchanges,
                  });
                  const newApiKey = await input({ message: "API Key:" });
                  const newApiSecret = await input({ message: "API Secret:" });
                  await setEnv({
                    exchange: exchange,
                    apiKey: newApiKey,
                    apiSecret: newApiSecret,
                  });
              }

              break;
          }
        })();

        break;
      case "exit":
        console.log("bye!");
        return;
      case "none":
        break;
      default:
        console.log("action not valid! please try again");
    }
    if (flags.action === "exit" || (!!args.length && flags.action === "none"))
      return;
  }
}
