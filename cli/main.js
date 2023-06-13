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
  while (true) {
    const action =
      flags.action === "none"
        ? await input({
            message:
              "select action when ready. or type 'help' for list of actions.",
          })
        : flags.action;
    switch (action) {
      case "help":
        console.log(cli.help);
        break;
      case "trade":
      case "t":
        //trade thing
        break;

      case "listen":
      case "l":
        //wss listening for new positions opened, closed.
        break;
      case "view":
      case "v":
        //view thing
        break;
      case "settings":
      case "s":
        let configAction = await select({
          message: "config actions: ",
          choices: ["view", "modify"],
        });
        switch (configAction) {
          case "view":
            console.log(getConfig());
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
      default:
        console.log("action not valid! please try again");
    }
    if (!!args && !!flags) return;
  }
}
