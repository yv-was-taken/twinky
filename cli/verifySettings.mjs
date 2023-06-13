import { getConfig, setConfig, getEnv, setEnv } from "../utils/index.cjs";
import {
  getTickers,
  exchanges,
  markets,
  quoteCurrencies,
} from "../options/index.mjs";
import { select, input } from "@inquirer/prompts";

export async function setAsset(exchange, market, quoteCurrency) {
  while (true) {
    const asset = await input({ message: "asset: " });
    const tickers = await getTickers(exchange, market, quoteCurrency);
    if (tickers.includes(asset.toUpperCase().concat(quoteCurrency))) {
      return asset;
    } else {
      console.log(
        "asset not found for exchange: ",
        asset.toUpperCase().concat(quoteCurrency),
        "please try again.",
      );
    }
  }
}

async function verifyConfig() {
  try {
    await fs.readFile("config.json");
  } catch (err) {
    const doConfig = await select({
      message:
        "config not found! Would you like to set a config? (select 'no' for default values",
      choices: [{ value: "yes" }, { value: "no" }],
    });
    if (doConfig === "yes") {
      console.log("xxx", exchanges);
      const exchange = await select({
        message: "exchange: ",
        choices: exchanges,
      });
      const market = await select({
        message: "market: ",
        choices: markets[exchange],
      });
      const quoteCurrency = await select({
        message: "quote currency: ",
        choices: quoteCurrencies[exchange][market],
      });
      const asset = await setAsset(exchange, market, quoteCurrency);

      await setConfig({
        exchange: exchange,
        market: market,
        quoteCurrency: quoteCurrency,
        asset: asset,
      });
      console.log(await getConfig());
    } else if (doConfig === "no") {
      await setConfig({ isDefault: true });
    }
  }
}
async function verifyEnv() {
  try {
    await fs.readFile(".env.json");
  } catch (err) {
    const { exchange } = await getConfig();
    const apiKey = await input({
      message: `API Key not found! Please set api key for ${exchange}`,
    });
    setEnv(exchange, apiKey);
  }
}
export async function verifySettings() {
  await verifyConfig();
  await verifyEnv();

  console.log("settings imported.");
}
