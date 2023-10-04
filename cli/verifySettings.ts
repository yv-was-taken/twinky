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
  modifyConfig?: boolean;
  exchange?: string;
  market?: string;
  quoteCurrency?: string;
  asset?: string;
  leverage?: number;
};

type ModifyConfigProps = {
  exchange?: string;
  market?: string;
  quoteCurrency?: string;
  asset?: string;
  leverage?: number;
};

async function _modifyConfig({
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
}: ModifyConfigProps) {
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
    console.log("checking if asset is valid...");
    let assets = await getTickers({
      exchange: newExchange ?? exchange,
      market: newMarket ?? market,
      quoteCurrency: newQuoteCurrency ?? quoteCurrency,
    });
    assetCheck = true;
    if (
      !(assets + "/" + quoteCurrency + ":" + quoteCurrency).includes(newAsset)
    ) {
      console.log(
        "asset not found for: ",
        newExchange,
        newMarket,
        ".. try again",
      );
      assetCheck = false;
    } else {
      console.log("looks good!");
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
  await setConfig({
    exchange: newExchange,
    market: newMarket,
    quoteCurrency: newQuoteCurrency,
    asset: newAsset,
    leverage: newLeverage,
  });
  console.log("config updated!");

  console.log(await getConfig());
  await sleep(1000);
}
export async function verifyConfig({
  modifyConfig = true,
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
}: VerifyConfigProps) {
  if (!fs.existsSync(".blinkConfig.json")) {
    const setInitialConfigAsDefault = await confirm({
      message:
        "config not found! Would you like to set a custom config?  (otherwise load default values.)",
    });
    //if initial, set default config, exit loop.
    if (!setInitialConfigAsDefault) {
      console.log(
        "\ndefault config set! select the `settings` option to view/modify config at any time.\n",
      );
      await sleep(1000);
      setConfig({ isDefault: true });
      return;
    } else {
      await _modifyConfig({ exchange, market, quoteCurrency, asset, leverage });
      return;
    }
    //else proceed with custom value prompts
  } else {
    if (modifyConfig) {
      await _modifyConfig({ exchange, market, quoteCurrency, asset, leverage });
      return;
    }
  }
}

type VerifyEnvProps = {
  newKey?: string;
  newSecret?: string;
  exchange?: string;
};
export async function verifyEnv({
  newKey,
  newSecret,
  exchange,
}: VerifyEnvProps) {
  //    const { exchange } = await getConfig();

  while (true) {
    if (!exchange || !newKey || !newSecret) {
      try {
        fs.readFileSync(".env.json");
        return;
      } catch (err) {
        console.log(
          "Env not found! Please set an API Key. You will need one to perform actions.",
        );
        const exchangeToSet =
          exchange ??
          (await select({
            message: "exchange: ",
            choices: exchanges,
          }));
        console.log("Setting API config for: ", exchangeToSet);
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

        let isEnvSet = await setEnv({
          exchange: exchangeToSet,
          apiKey: apiKey,
          apiSecret: apiSecret,
        });
        if (isEnvSet) return;
      }
    } else {
      const exchangeToSet =
        exchange ??
        (await select({
          message: "exchange: ",
          choices: exchanges,
        }));
      console.log("Setting API config for: ", exchangeToSet);
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
      let isEnvSet = await setEnv({
        exchange: exchangeToSet,
        apiKey: apiKey,
        apiSecret: apiSecret,
      });
      if (isEnvSet) return;
    }
  }
}
export async function verifySettings({ modifyConfig = false }) {
  await verifyConfig({ modifyConfig: modifyConfig });
  await verifyEnv({});
}
