const fs = require("fs");

function setConfig({ exchange, ticker, market, isDefault }) {
  const defaultConfig = {
    exchange: "bybit",
    ticker: "btcusdt",
    market: "perp",
  };

  let config;
  try {
    const configFileContent = fs.readFileSync("blinkConfig.json", "utf8");
    config = JSON.parse(configFileContent);
  } catch (err) {
    config = defaultConfig;
  }

  if (isDefault) {
    fs.writeFileSync("blinkConfig.json", JSON.stringify(defaultConfig));
  } else {
    config.exchange = exchange ?? defaultConfig.exchange;
    config.ticker = ticker ?? defaultConfig.ticker;
    config.market = market ?? defaultConfig.market;

    fs.writeFileSync("blinkConfig.json", JSON.stringify(config));
  }
}

function getConfig() {
  try {
    const configFileContent = fs.readFileSync("blinkConfig.json", "utf8");
    const config = JSON.parse(configFileContent);
    return {
      exchange: config.exchange,
      ticker: config.ticker,
      market: config.market,
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  setConfig: setConfig,
  getConfig: getConfig,
};
