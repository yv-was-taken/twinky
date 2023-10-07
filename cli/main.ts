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
  findArg,
  formatSymbol,
  checkTicker,
} from "../utils/index.ts";
import {
  exchanges,
  markets,
  quoteCurrencies,
  getTickers,
} from "../options/index.ts";
import { cli } from "../parse/index.ts";
import trade from "../actions/trade.ts";
import view from "../actions/view.ts";
import {
  verifyConfig,
  leverageCheck,
  amountCheck,
  symbolCheck,
} from "./index.ts";

type Props = {
  args: string[];
  flags: {
    //    action?:
    //      | "trade"
    //      | "listen"
    //      | "view"
    //      | "settings"
    //      | "help"
    //      | "exit"
    //      | "none";
    exchange?: "bybit";
    chase?: boolean;
    scale?: boolean;
    scaleType: "linear" | "exponential";
    from?: number;
    to?: number;
    type?: "market" | "limit";
    symbol?: string;
    leverage?: string;
    price?: string;
    amount?: string;
    reduce?: boolean;
    stop?: string;
    takeProfit?: string;
    tpType?: "market" | "limit";
  };
};

export default async function main({ args, flags }: Props) {
  console.log("flags", flags);
  let leverage: string | number | undefined;
  let action: string | undefined;
  let symbol: string | undefined;
  let type: string | undefined;
  let executionStyle: string | undefined;
  let scale: boolean | undefined;
  const config = getConfig();
  const env = getEnv();
  const exchange: string = flags.exchange ?? getConfig().exchange;
  //@dev tricky typing
  //@ts-ignore
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });

  if (!args.length) console.log(cli.help);
  while (true) {
    if (!args.length)
      console.log(
        "\nselect action when ready. or type 'help' for list of actions.",
      );

    action = !args.length
      ? await input({
          message: `\n>`,
        })
      : args[0];
    switch (action) {
      case "help":
      case "h":
        console.log(cli.help);
        break;
      case "trade":
      case "t":
        let tradeActionIndex: number | undefined;
        await (async () => {
          const { market, quoteCurrency } = getConfig();
          const tickers = await getTickers({
            exchange: exchange,
            market: market,
            quoteCurrency: quoteCurrency,
          });

          symbol = await symbolCheck({
            symbol: flags.symbol,
            exchange: exchange,
            retry: flags.symbol ? false : true,
            tickers: tickers,
          });
          //          if (!args.length) {
          //            if (findArg("buy", args) || findArg("sell", args)) {
          //              tradeActionIndex =
          //                args.indexOf("buy") > -1
          //                  ? args.indexOf("buy")
          //                  : args.indexOf("sell");
          //              symbol = await symbolCheck({symbol: args[tradeActionIndex + 1], tickers: tickers, exchange: exchange, retry: false}); //must come after "buy/sell"
          //
          //            }
          //          } else {
          //              console.log("mewo")
          //            symbol = await symbolCheck({tickers: tickers, exchange: exchange, retry: true});
          //              console.log("bark")
          //          }

          console.log("trading:", symbol);
          leverage = await leverageCheck({
            leverage: flags.leverage,
            retry: true,
            connect: connect,
            symbol: symbol,
          });

          let type: string = "";

          if (flags.type) {
            type = flags.type;
          }

          if (!type) {
            type = await select({
              message: "order type?",
              choices: [{ value: "market" }, { value: "limit" }],
            });
          }

          let executionStyle;
          if (type === "limit") {
            executionStyle = flags.scale
              ? "range"
              : await select({
                  message: "execution style?",
                  choices: [{ value: "point" }, { value: "range" }],
                });
          }
          let side =
            (findArg("buy", args) || findArg("sell", args)) ??
            (await select({
              message: "long or short?",
              choices: [
                { name: "long", value: "buy" },
                { name: "short", value: "sell" },
              ],
            }));
          let amount = await amountCheck({
            amount: flags.amount,
            retry: flags.amount !== null ? false : true,
          });

          let price: string = "";
          if (flags.price) {
            price = flags.price;
          }
          let executionPrices;
          let scale = flags.scaleType ?? "";
          if (executionStyle === "point")
            price = await input({ message: "price?" });
          if (executionStyle === "range") {
            let from = parseFloat(await input({ message: "from?" }));
            let to = parseFloat(await input({ message: "to?" }));
            let iterations = parseInt(await input({ message: "iterations?" }));
            executionPrices = distributeNumbers(from, to, iterations);

            scale = flags.scale
              ? flags.scaleType
              : await select({
                  message: "range sizing distribution?",
                  choices: [{ value: "linear" }, { value: "exponential" }],
                });
          }
          let isStop = flags.stop ?? (await confirm({ message: "stop loss?" }));
          let stopLossPrice: number | string | undefined = flags.stop ?? "";
          if (isStop && flags.stop)
            stopLossPrice = parseFloat(await input({ message: "stop price?" }));

          let isTakeProfit =
            !!flags.takeProfit ?? (await confirm({ message: "take profit?" }));
          let takeProfitPrice: number | string | undefined =
            flags.takeProfit ?? "";
          if (isTakeProfit && !flags.takeProfit)
            takeProfitPrice = parseFloat(
              await input({ message: "take profit price?" }),
            );
          let isReduce =
            (flags.reduce || findArg("reduce", args)) ??
            (await confirm({ message: "reduce only?" }));

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
                splitPricesIntoChunks[i].map(async (executionPrice: any) => {
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
            //         //  console.log(`trade success! placed ${amount} ${symbol} ${side} ${type} order`);
            //console.log('trade success!');
            //console.log("symbol", symbol);
            //console.log("type", type);
            //console.log("side", side);
            //console.log("amount", amount);
            //console.log("price", price);
            //console.log('params', params);
          }
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
          const target =
            args[1] === "balance" || args[1] === "positions"
              ? args[1]
              : await select({
                  message: "what would you like to view?",
                  choices: [
                    { value: "balance" },
                    { value: "open orders" },
                    { value: "closed orders" },
                    { name: "open positions", value: "positions" },
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
          let configAction =
            (findArg("view", args) || findArg("modify", args)) ??
            (await select({
              message: "config actions: ",
              choices: [
                { value: "view" },
                { value: "modify" },
                { value: "back" },
              ],
            }));
          if (configAction === "back") return;
          switch (configAction) {
            case "view":
              let answer = await confirm({ message: "view config?" });
              if (answer) console.log(await getConfig());
              answer = await confirm({ message: "view env?" });
              if (answer) console.log(await getEnv());
              break;
            case "modify":
              const option =
                (findArg("config", args) || findArg("env", args)) ??
                (await select({
                  message: "what would you like to modify?",
                  choices: [{ value: "config" }, { value: "env" }],
                }));
              switch (option) {
                case "config":
                  await verifyConfig({});
                  break;
                case "env":
                  const exchange =
                    flags.exchange ??
                    (await select({
                      message: "exchange?",
                      choices: exchanges,
                    }));
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
    if (action === "exit" || action === "none" || !!args.length) return;
  }
}
