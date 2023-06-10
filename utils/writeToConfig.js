const fs = require("fs");
const defaultConfig = {
  exchange: "bybit",
  ticker: "btcusdt",
  market: "perp",
};

function updateConfig() {
  let isBlinkConfig = false;
  try {
    const configFile = fs.readFileSync("blinkConfig.json");
    isBlinkConfig = true;
  } catch (err) {
    console.log("blink config not found!");
  }

  if (!isBlinkConfig) {
    fs.writeFile("blinkConfig.json", JSON.stringify(defaultConfig));
  } else {
    fs.writeFile;
  }
}
