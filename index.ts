import { verifySettings } from "./cli/verifySettings.ts";
import main from "./cli/main.ts";
import { inputs, flags } from "./parse/cli.ts";

async function app() {
  await verifySettings({ initialConfig: true, initialEnv: true });
  await main({ args: inputs, flags: flags });
}

app();
