import * as fs from "fs";

type Props = {
  exchange?: string;
  market?: string;
  quoteCurrency?: string;
  asset?: string;
  leverage?: number;
  isDefault?: boolean;
};
export function setConfig({
  exchange,
  market,
  quoteCurrency,
  asset,
  leverage,
  isDefault = false,
}: Props) {
  const defaultConfig = {
    exchange: "bybit",
    market: "perp",
    quoteCurrency: "USDT",
    asset: "BTC",
    leverage: 10,
  };

  let config;
  try {
    const configFileContent = fs.readFileSync("twinky/config.json", "utf8");
    config = JSON.parse(configFileContent);
  } catch (err) {
    config = defaultConfig;
  }

  if (isDefault) {
    fs.writeFileSync(
      "twinky/config.json",
      JSON.stringify(defaultConfig, null, 2),
    );
  } else {
    if (exchange) config.exchange = exchange;
    if (market) config.market = market;
    if (quoteCurrency) config.quoteCurrency = quoteCurrency;
    if (asset) config.asset = asset;
    if (leverage) config.leverage = leverage;

    fs.writeFileSync("twinky/config.json", JSON.stringify(config, null, 2));
  }
}

export function getConfig() {
  const config = JSON.parse(
    fs.readFileSync("twinky/config.json", { encoding: "utf8", flag: "a+" }),
  );
  return {
    //if not set for whatever reason, revert to default values
    exchange: config.exchange ?? "bybit",
    market: config.market ?? "perp",
    quoteCurrency: config.quoteCurrency ?? "USDT",
    asset: config.asset ?? "BTC",
    leverage: config.leverage ?? "10",
  };
}
