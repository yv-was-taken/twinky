const fs = require("fs");

async function setConfig({
  exchange,
  market,
  quoteCurrency,
  asset,
  isDefault,
}) {
  const defaultConfig = {
    exchange: "bybit",
    market: "perp",
    quoteCurrency: "USDT",
    asset: "BTC",
  };

  let config;
  try {
    const configFileContent = fs.readFileSync(".blinkConfig.json", "utf8");
    config = JSON.parse(configFileContent);
  } catch (err) {
    config = defaultConfig;
  }

  if (isDefault) {
    fs.writeFileSync(".blinkConfig.json", JSON.stringify(config));
  } else {
    if (exchange) config.exchange = exchange;
    if (market) config.market = market;
    if (quoteCurrency) config.quoteCurrency = quoteCurrency;
    if (asset) config.asset = asset;

    fs.writeFileSync(".blinkConfig.json", JSON.stringify(config));
  }
}

async function getConfig() {
  const config = JSON.parse(
    fs.readFileSync(".blinkConfig.json", { encoding: "utf8", flag: "a+" }),
  );
  return {
    exchange: config.exchange,
    market: config.market,
    quoteCurrency: config.quoteCurrency,
    asset: config.asset,
  };
}

module.exports = {
  setConfig: setConfig,
  getConfig: getConfig,
};
