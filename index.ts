import { verifySettings } from "./cli/verifySettings";
import main from "./cli/main";
import { inputs, flags } from "./parse/cli";

async function app() {
  await verifySettings({ initialConfig: true, initialEnv: true });
  await main({ args: inputs, flags: flags });
}

app();
