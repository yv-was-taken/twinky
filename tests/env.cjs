const fs = require("fs");
const { expect } = require("chai");

const { setEnv, getEnv } = require("../utils/env.cjs");

describe("setEnv", () => {
  it("should set the environment variable", () => {
    const apiKey = "your-api-key";

    setEnv(apiKey);

    const envFileContent = fs.readFileSync(".env.json", "utf8");
    const env = JSON.parse(envFileContent);

    expect(env.API_KEY).to.equal(apiKey);
  });
});

describe("getEnv", () => {
  it("should return the environment variable", () => {
    fs.writeFileSync(".env.json", JSON.stringify({ API_KEY: "test-api-key" }));
    const env = getEnv();

    expect(env.API_KEY).to.equal("test-api-key");
  });

  it("should throw an error if the env file does not exist", () => {
    fs.unlinkSync(".env.json");

    expect(getEnv).to.throw(Error);
  });
});
