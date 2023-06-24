import { input, select, confirm } from "@inquirer/prompts";
import ccxt from "ccxt";
import {
  getConfig,
  setConfig,
  getEnv,
  setEnv,
  distributeNumbers,
  sleep,
} from "../utils/index.cjs";
import {
  exchanges,
  markets,
  quoteCurrencies,
  getTickers,
} from "../options/index.mjs";
import { cli } from "../parse/index.mjs";
import trade from "../actions/trade.js";
import view from "../actions/view.js";
import { verifySettings, verifyConfig } from "./verifySettings.mjs";

export default async function main(args, flags) {
  const config = getConfig();
  const env = getEnv();
  const exchange = getConfig().exchange;
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });
  const leverage = getConfig().leverage;
  //set leverage,
  //throws err if leverage is already set to the same number
  try {
    await connect.setLeverage(leverage, symbol);
  } catch {}

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
          let symbol;
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
          console.log("trading:", symbol);

          let type = await select({
            message: "order type?",
            choices: [{ value: "market" }, { value: "limit" }],
          });

          let executionPrices;
          let executionStyle;
          if (type === "limit") {
            executionStyle = await select({
              message: "execution style?",
              choices: [{ value: "point" }, { value: "range" }],
            });
            if (executionStyle === "range") {
              let from = parseFloat(await input({ message: "from?" }));
              let to = parseFloat(await input({ message: "to?" }));
              let iterations = await input({ message: "iterations?" });
              executionPrices = distributeNumbers(from, to, iterations);
            }
          }
          let side = await select({
            message: "long or short?",
            choices: [
              { name: "long", value: "buy" },
              { name: "short", value: "sell" },
            ],
          });
          let amountCheck = false;
          let amount;
          while (!amountCheck) {
            amount = parseFloat(await input({ message: "order size?" }));
            amountCheck = true;
            if (!amount) {
              console.log("amount cannot be blank.");
              amountCheck = false;
            }
          }

          let price;
          if (type === "limit" && executionStyle === "point")
            price = await input({ message: "price?" });

          let isStop = await confirm({ message: "stop loss?" });
          let stopLossPrice;
          if (isStop)
            stopLossPrice = parseFloat(await input({ message: "stop price?" }));

          let isTakeProfit = await confirm({ message: "take profit?" });
          let takeProfitPrice;
          if (isTakeProfit)
            takeProfitPrice = parseFloat(
              await input({ message: "take profit?" }),
            );
          let isReduce = await confirm({ message: "reduce only?" });

          let params = {};
          if (isReduce) params.type = "reduce-only";
          if (isStop) params.stopLossPrice = stopLossPrice;
          if (isTakeProfit) params.takeProfitPrice = takeProfitPrice;

          if (executionPrices) {
            let a = 0;
            await Promise.all(
              executionPrices.map(async (executionPrice) => {
                await trade({
                  connect: connect,
                  symbol: symbol,
                  type: type,
                  side: side,
                  amount: amount / executionPrices.length,
                  price: executionPrice,
                  params: params,
                });
                if (a === 10) await sleep(1000);
                a === 0;
              }),
            );
          } else {
            await trade({
              _exchange: exchange,
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
                    message: "",
                    choices: exchanges,
                  });
                  const envChoice = await select({
                    message: "",
                    choices: [{ value: "apiKey" }, { value: "apiSecret" }],
                  });
                  const envResponse = await input({ message: "new value: " });
                  await setEnv({
                    exchange: exchange,
                    [envChoice]: envResponse,
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
