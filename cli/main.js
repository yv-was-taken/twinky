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
        trade();
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
            await verifySettings();
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
