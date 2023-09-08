import { getConfig, setConfig, getEnv, setEnv, sleep } from "../utils/index.ts";
import {
  getTickers,
  exchanges,
  markets,
  quoteCurrencies,
} from "../options/index.ts";
import { select, input, confirm } from "@inquirer/prompts";
import * as fs from "fs";

type VerifyConfigProps = {
  initialSetup?: boolean;
  exchange?: string;
  market?: string;
  quoteCurrency?: string;
  asset?: string;
  leverage?: number;
};
export async function verifyConfig({
  initialSetup = false,
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
}: VerifyConfigProps) {
  if (!fs.existsSync(".blinkConfig.json")) {
    const setInitialConfigAsDefault = await confirm({
      message: "config not found! Would you like to set a custom config?",
    });
    //if initial, set default config, exit loop.
    if (!setInitialConfigAsDefault) {
      console.log(
        "\ndefault config set! select the `settings` option to view/modify config at any time.\n",
      );
      await sleep(1000);
      setConfig({ isDefault: true });
      return;
    }
    //else proceed with custom value prompts
  }

  if (initialSetup) {
    let newExchange: string =
      exchange ??
      (await select({
        message: "exchange: ",
        choices: exchanges,
      }));

    let newMarket: string =
      market ??
      (await select({
        message: "market: ",
        //@ts-ignore
        choices: markets[newExchange],
      }));
    let newQuoteCurrency: string =
      quoteCurrency ??
      (await select({
        message: "quote currency: ",
        //@ts-ignore
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
      let assets = await getTickers({
        exchange: newExchange ?? exchange,
        market: newMarket ?? market,
        quoteCurrency: newQuoteCurrency ?? quoteCurrency,
      });
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
      if (leverage && leverage > 10) {
        console.log("leverage too high. try again");
        levCheck = false;
      }
    }
    console.log("updating config...");
    await sleep(250);
    await setConfig({
      exchange: newExchange,
      market: newMarket,
      quoteCurrency: newQuoteCurrency,
      asset: newAsset,
      leverage: newLeverage,
    });
    console.log("config updated!");
    await sleep(500);

    console.log(await getConfig());
  }

  return;
}

type VerifyEnvProps = {
  newKey?: string;
  newSecret?: string;
};
export async function verifyEnv({ newKey, newSecret }: VerifyEnvProps) {
  const { exchange } = await getConfig();
  try {
    fs.readFileSync(".env.json");
  } catch (err) {
    console.log("Setting API config for: ", exchange);
    const apiKey =
      newKey ??
      (await input({
        message: `API Key:`,
      }));
    const apiSecret =
      newSecret ??
      (await input({
        message: `API Secret:`,
      }));
    setEnv({ exchange: exchange, apiKey: apiKey, apiSecret: apiSecret });
  }
}
export async function verifySettings({ initialSetup = false }) {
  await verifyConfig({ initialSetup: initialSetup });
  await verifyEnv({});
}
