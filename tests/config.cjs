const chai = require("chai");
const fs = require("fs");
const { setConfig, getConfig } = require("../utils/config.cjs");

const expect = chai.expect;

describe("setConfig", () => {
  beforeEach(() => {
    // Clear the config file before each test
    fs.writeFileSync(".blinkConfig.json", JSON.stringify({}, null, 2));
  });

  afterEach(() => {
    // Clean up the config file after each test
    fs.unlinkSync(".blinkConfig.json");
  });

  it("should set config with default values when isDefault is true", async () => {
    const expectedConfig = {
      exchange: "bybit",
      market: "perp",
      quoteCurrency: "USDT",
      asset: "BTC",
    };

    await setConfig({ isDefault: true });
    const configFileContent = JSON.parse(
      fs.readFileSync(".blinkConfig.json", "utf8"),
    );

    expect(configFileContent).to.deep.equal(expectedConfig);
  });

  it("should set config with custom values when isDefault is false", async () => {
    const customConfig = {
      exchange: "bybit",
      market: "spot",
      quoteCurrency: "USDC",
      asset: "ETH",
    };

    await setConfig({
      exchange: customConfig.exchange,
      market: customConfig.market,
      quoteCurrency: customConfig.quoteCurrency,
      asset: customConfig.asset,
      isDefault: false,
    });

    const configFileContent = JSON.parse(
      fs.readFileSync(".blinkConfig.json", "utf8"),
    );

    expect(configFileContent).to.deep.equal(customConfig);
  });
});

describe("getConfig", () => {
  it("should return the current config", () => {
    const expectedConfig = {
      exchange: "bybit",
      market: "perp",
      quoteCurrency: "USDT",
      asset: "BTC",
    };

    fs.writeFileSync(
      ".blinkConfig.json",
      JSON.stringify(expectedConfig, null, 2),
    );

    const config = getConfig();

    expect(config).to.deep.equal(expectedConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    fs.unlinkSync(".blinkConfig.json");

    expect(getConfig).to.throw(Error);
  });
});
