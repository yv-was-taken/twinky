import { input, select } from "@inquirer/prompts";
import { getConfig, setConfig } from "../utils/index.cjs";
import {
  exchanges,
  markets,
  quoteCurrencies,
  getTickers,
} from "../options/index.mjs";

import { cli } from "../parse/index.mjs";

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
        console.log("trade");
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
            console.log(await getConfig());
            break;
          case "modify":
            const { exchange, market, quoteCurrency, asset } = getConfig();
            let newExchange = await select({
              message: "exchange: ",
              choices: exchanges,
            });
            let newMarket = await select({
              message: "market: ",
              choices: markets[exchange],
            });
            let newQuoteCurrency = await select({
              message: "quote currency: ",
              choices: quoteCurrencies[exchange][market],
            });
            console.log("updating settings...");
            await setConfig();
            console.log("settings updated!");
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
