const { getConfig, setConfig } = require("./config.cjs");
const { getEnv, setEnv } = require("./env.cjs");

module.exports = {
  getConfig: getConfig,
  setConfig: setConfig,
  getEnv: getEnv,
  setEnv: setEnv,
};
