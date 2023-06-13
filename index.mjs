import { verifySettings } from "./cli/verifySettings.mjs";
import main from "./cli/main.js";
import { inputs, flags } from "./parse/cli.mjs";

async function app() {
  await verifySettings();
  await main(inputs, flags);
}

app();
