import { getConfig, setConfig, getEnv, setEnv } from "../utils/index.cjs";
import {
  getTickers,
  exchanges,
  markets,
  quoteCurrencies,
} from "../options/index.mjs";
import { select, input } from "@inquirer/prompts";
import * as fs from "fs";

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

export async function verifyConfig({
  initialSetup = false,
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
}) {
  if (!initialSetup) {
    //     const doConfig = await confirm({
    //       message:
    //         "config not found! Would you like to set a config? (select 'no' for default values",
    //     });
    let newExchange =
      exchange ??
      (await select({
        message: "exchange: ",
        choices: exchanges,
      }));

    let newMarket =
      market ??
      (await select({
        message: "market: ",
        choices: markets[newExchange],
      }));
    let newQuoteCurrency =
      quoteCurrency ??
      (await select({
        message: "quote currency: ",
        choices: quoteCurrencies[newExchange][newMarket],
      }));
    let assetCheck = false;
    let newAsset;
    while (!assetCheck) {
      newAsset =
        asset ??
        (await input({
          message: 'default asset (ex. "BTC")',
        }));
      let assets = await getTickers(
        newExchange ?? exchange,
        newMarket ?? market,
        newQuoteCurrency ?? quoteCurrency,
      );
      assetCheck = true;
      if (
        !(assets + "/" + quoteCurrency + ":" + quoteCurrency).includes(newAsset)
      ) {
        console.log("asset not found for: ", exchange, market, ".. try again");
        assetCheck = false;
      }
    }

    let levCheck = false;
    let newLeverage;
    while (!levCheck) {
      newLeverage =
        leverage ??
        parseInt(
          await input({
            message: "leverage: (max 10)",
          }),
        );
      levCheck = true;
      if (leverage > 10) {
        console.log("leverage too high. try again");
        levCheck = false;
      }
    }
    console.log("updating config...");
    await setConfig({
      exchange: newExchange,
      market: newMarket,
      quoteCurrency: newQuoteCurrency,
      asset: newAsset,
      leverage: newLeverage,
    });
    console.log("config updated!");

    console.log(await getConfig());
  } else setConfig({ isDefault: true });
}

async function verifyEnv({ initialSetup = false, newKey, newSecret }) {
  const { exchange } = await getConfig();
  if (initialSetup) {
    try {
      fs.readFileSync(".env.json");
    } catch (err) {
      console.log("Setting API config for: ", exchange);
      const apiKey = newKey
        ? newKey
        : await input({
            message: `API Key:`,
          });
      const apiSecret = newSecret
        ? newSecret
        : await input({
            message: `API Secret:`,
          });
      setEnv({ exchange: exchange, apiKey: apiKey, apiSecret: apiSecret });
    }
  } else {
    setEnv({ exchange: exchange, apiKey: newKey, apiSecret: newSecret });
  }
}
export async function verifySettings({
  initialConfig = false,
  initialEnv = false,
}) {
  await verifyConfig({ initialSetup: initialConfig });
  await verifyEnv({ initialSetup: initialEnv });
}
