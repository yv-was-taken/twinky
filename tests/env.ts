import * as fs from "fs";
import { expect } from "chai";

import { setEnv, getEnv } from "../utils/env";

describe("setEnv", () => {
  it("should set the environment variable", () => {
    const apiKey = "your-api-key";
    const apiSecret = "your-secret-is-safe-with-me";
    const exchange = "test-exchange";

    setEnv({ exchange: exchange, apiKey: apiKey, apiSecret: apiSecret });

    const envFileContent = fs.readFileSync(".env.json", "utf8");
    const env = JSON.parse(envFileContent);

    expect(env[exchange].API_KEY).to.equal(apiKey);
    expect(env[exchange].API_SECRET).to.equal(apiSecret);
  });
});

describe("getEnv", () => {
  it("should return the environment variable", () => {
    fs.writeFileSync(
      ".env.json",
      JSON.stringify({ API_KEY: "test-api-key" }, null, 2),
    );
    const env = getEnv();

    expect(env.API_KEY).to.equal("test-api-key");
  });

  it("should throw an error if the env file does not exist", () => {
    fs.unlinkSync(".env.json");

    expect(getEnv).to.throw(Error);
  });
});
