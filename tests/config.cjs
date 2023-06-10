const chai = require("chai");
const fs = require("fs");
const { setConfig, getConfig } = require("../utils/config.cjs");

const expect = chai.expect;

describe("setConfig", () => {
  beforeEach(() => {
    // Clear the config file before each test
    fs.writeFileSync("blinkConfig.json", JSON.stringify({}));
  });

  afterEach(() => {
    // Clean up the config file after each test
    fs.unlinkSync("blinkConfig.json");
  });

  it("should set config with default values when isDefault is true", async () => {
    const expectedConfig = {
      exchange: "bybit",
      ticker: "btcusdt",
      market: "perp",
    };

    await setConfig({ isDefault: true });
    const configFileContent = JSON.parse(
      fs.readFileSync("blinkConfig.json", "utf8"),
    );

    expect(configFileContent).to.deep.equal(expectedConfig);
  });

  it("should set config with custom values when isDefault is false", async () => {
    const customConfig = {
      exchange: "binance",
      ticker: "ethusdt",
      market: "spot",
    };

    await setConfig({
      exchange: customConfig.exchange,
      ticker: customConfig.ticker,
      market: customConfig.market,
      isDefault: false,
    });

    const configFileContent = JSON.parse(
      fs.readFileSync("blinkConfig.json", "utf8"),
    );

    expect(configFileContent).to.deep.equal(customConfig);
  });
});

describe("getConfig", () => {
  it("should return the current config", () => {
    const expectedConfig = {
      exchange: "bybit",
      ticker: "btcusdt",
      market: "perp",
    };

    fs.writeFileSync("blinkConfig.json", JSON.stringify(expectedConfig));

    const config = getConfig();

    expect(config).to.deep.equal(expectedConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    fs.unlinkSync("blinkConfig.json");

    expect(getConfig).to.throw(Error);
  });
});
