import { verifySettings } from "./cli/verifySettings.ts";
import main from "./cli/main.ts";
import { inputs, flags } from "./parse/cli.ts";

async function app() {
  await verifySettings({ initialSetup: true });
  //meow cli flag types do not play nice with tsc
  //@ts-ignore
  await main({ args: inputs, flags: flags });
}

app();
