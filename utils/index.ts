const { getConfig, setConfig } = require("./config.cjs");
const { getEnv, setEnv } = require("./env.cjs");

function distributeNumbers(low, high, iterations) {
  const step = (high - low) / (iterations - 1);
  const result = [];

  for (let i = 0; i < iterations; i++) {
    const value = low + i * step;
    result.push(value);
  }

  return result;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitBy(list, chunkSize) {
  const result = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }

  return result;
}
module.exports = {
  getConfig: getConfig,
  setConfig: setConfig,
  getEnv: getEnv,
  setEnv: setEnv,
  distributeNumbers: distributeNumbers,
  sleep: sleep,
  splitBy: splitBy,
};
