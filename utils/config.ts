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
    const configFileContent = fs.readFileSync(".blinkConfig.json", "utf8");
    config = JSON.parse(configFileContent);
  } catch (err) {
    config = defaultConfig;
  }

  if (isDefault) {
    fs.writeFileSync(
      ".blinkConfig.json",
      JSON.stringify(defaultConfig, null, 2),
    );
  } else {
    if (exchange) config.exchange = exchange;
    if (market) config.market = market;
    if (quoteCurrency) config.quoteCurrency = quoteCurrency;
    if (asset) config.asset = asset;
    if (leverage) config.leverage = leverage;

    fs.writeFileSync(".blinkConfig.json", JSON.stringify(config, null, 2));
  }
}

export function getConfig() {
  const config = JSON.parse(
    fs.readFileSync(".blinkConfig.json", { encoding: "utf8", flag: "a+" }),
  );
  return {
    exchange: config.exchange,
    market: config.market,
    quoteCurrency: config.quoteCurrency,
    asset: config.asset,
    leverage: config.leverage,
  };
}