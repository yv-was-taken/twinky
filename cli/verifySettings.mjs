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

async function verifyConfig({
  initialSetup = false,
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
}) {
  try {
    fs.readFileSync(".blinkConfig.json");
  } catch (err) {
    console.log(err);
    if (initialSetup) {
      const doConfig = await select({
        message:
          "config not found! Would you like to set a config? (select 'no' for default values",
        choices: [{ value: "yes" }, { value: "no" }],
      });
      if (doConfig === "yes") {
        console.log("xxx", exchanges);
        let newExchange = exchange
          ? exchange
          : await select({
              message: "exchange: ",
              choices: exchanges.unshift({
                value: undefined,
                name: "enter to skip",
              }),
            });

        let newMarket = market
          ? market
          : await select({
              message: "market: ",
              choices: markets[newExchange].unshift({
                value: undefined,
                name: "enter to skip",
              }),
            });
        let newQuoteCurrency = quoteCurrency
          ? quoteCurrency
          : await select({
              message: "quote currency: ",
              choices: quoteCurrencies[newExchange][newMarket].unshift({
                value: undefined,
                name: "enter to skip",
              }),
            });
        let assetCheck = false;
        while (!assetCheck) {
          let newAsset = asset
            ? asset
            : await input({
                message: 'default asset (ex. "BTC")',
              });
          let assets = await getTickers(
            newExchange ?? exchange,
            newMarket ?? market,
            newQuoteCurrency ?? quoteCurrency,
          );
          assetCheck = true;
          if (!assets.includes(newAsset)) {
            console.log(
              "asset not found for: ",
              exchange,
              market,
              ".. try again",
            );
            assetCheck = false;
          }
        }

        let levCheck = false;
        while (!levCheck) {
          let newLeverage = leverage
            ? leverage
            : await input({
                message: "leverage: (max 10)",
              });
          levCheck = true;
          if (leverage > 10) {
            console.log("leverage too high. try again");
            levCheck = false;
          }
        }
        console.log("updating settings...");
        await setConfig({
          exchange: newExchange,
          market: newMarket,
          quoteCurrency: newQuoteCurrency,
          asset: newAsset,
          newLeverage: leverage,
        });
        console.log("settings updated!");

        await setConfig({
          exchange: newExchange,
          market: newMarket,
          quoteCurrency: newQuoteCurrency,
          asset: newAsset,
          leverage: newLeverage,
        });
        console.log(await getConfig());
      } else if (doConfig === "no") {
        await setConfig({ isDefault: true });
      }
    }
  }
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
  console.log("settings imported.");
}
