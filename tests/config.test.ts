import * as chai from "chai";
import * as fs from "fs";
import { setConfig, getConfig } from "../utils/config.ts";

const expect = chai.expect;

describe("setConfig", () => {
  beforeEach(() => {
    // Clear the config file before each test
    fs.writeFileSync(".json", JSON.stringify({}, null, 2));
  });

  afterEach(() => {
    // Clean up the config file after each test
    fs.unlinkSync(".json");
  });

  it("should set config with default values when isDefault is true", async () => {
    const expectedConfig = {
      exchange: "bybit",
      leverage: 10,
      market: "perp",
      quoteCurrency: "USDT",
      asset: "BTC",
    };

    setConfig({ isDefault: true });
    const configFileContent = getConfig();
    expect(configFileContent).to.deep.equal(expectedConfig);
  });

  it("should set config with custom values when isDefault is false", async () => {
    const customConfig = {
      exchange: "bybit",
      market: "spot",
      quoteCurrency: "USDC",
      asset: "ETH",
      leverage: 10,
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
      leverage: 10,
    };

    // fs.writeFileSync(
    //     ".blinkConfig.json",
    //     JSON.stringify(expectedConfig, null, 2),
    // );
    setConfig({
      exchange: expectedConfig.exchange,
      market: expectedConfig.market,
      quoteCurrency: expectedConfig.quoteCurrency,
      asset: expectedConfig.asset,
      leverage: expectedConfig.leverage,
    });

    const config = getConfig();

    expect(config).to.deep.equal(expectedConfig);
  });

  it("should throw an error if the config file does not exist", () => {
    fs.unlinkSync(".blinkConfig.json");

    expect(getConfig).to.throw(Error);
  });
});
