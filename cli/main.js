import { input, select, confirm } from "@inquirer/prompts";
import { getConfig, setConfig, getEnv, setEnv } from "../utils/index.cjs";
import {
  exchanges,
  markets,
  quoteCurrencies,
  getTickers,
} from "../options/index.mjs";
import { cli } from "../parse/index.mjs";
import trade from "../actions/trade.js";
import { verifySettings } from "./verifySettings.mjs";

export default async function main(args, flags) {
  console.log(cli.help);
  console.log(
    "\nselect action when ready. or type 'help' for list of actions.",
  );
  while (true) {
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
        const { exchange, market, quoteCurrency } = getConfig();
        const tickers = await getTickers(exchange, market, quoteCurrency);

        let symbolCheck = false;
        let symbol;
        while (!symbolCheck) {
          symbol = await input({ message: "symbol? (enter for default)" });
          symbolCheck = true;
          if (!tickers.includes(symbol)) {
            console.log("ticker not found for: ", exchange, ".. try again");
            symbolCheck = false;
          }
        }

        if (symbol === "") symbol = config.asset + "/" + config.quoteCurrency;
        let type = await select({
          message: "order type?",
          choices: [{ value: "market" }, { value: "limit" }],
        });
        let side = await select({
          message: "long or short?",
          choices: [
            { name: "long", value: "buy" },
            { name: "short", value: "sell" },
          ],
        });
        let amount = parseInt(await input({ message: "order size?" }));
        let price;
        if (type === "limit") price = await input({ message: "price?" });

        let isStop = await confirm({ message: "stop loss?" });
        let stopLossPrice;
        if (isStop)
          stopLossPrice = parseInt(await input({ message: "stop price?" }));

        let isTakeProfit = await confirm({ message: "take profit?" });
        let takeProfitPrice;
        if (isTakeProfit)
          takeProfitPrice = parseInt(await input({ message: "take profit?" }));
        let isReduce = await confirm({ message: "reduce only?" });

        let params = {};
        if (isReduce) params.type = "reduce-only";
        if (isStop) params.stopLossPrice = stopLossPrice;
        if (isTakeProfit) params.takeProfitPrice = takeProfitPrice;

        await trade({
          _exchange: exchange,
          symbol: symbol,
          type: type,
          side: side,
          amount: amount,
          price: price,
          params: params,
        });

        //trade thing
        break;

      case "listen":
      case "l":
        console.log("listen");
        //wss listening for new positions opened, closed.
        break;
      case "view":
      case "v":
        console.log("view");
        //view thing
        break;
      case "settings":
      case "s":
        let configAction = await select({
          message: "config actions: ",
          choices: [{ value: "view" }, { value: "modify" }],
        });
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
                const response = await select({
                  message: "",
                  choices: [
                    { value: "exchange" },
                    { value: "market" },
                    { value: "quoteCurrency" },
                    { value: "asset" },
                    { value: "leverage" },
                  ],
                });
                await setConfig({ [response]: response });
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
                await setEnv({ exchange: exchange, [envChoice]: envResponse });
            }

            await verifySettings({});
            break;
        }
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
