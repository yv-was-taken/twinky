export { getConfig, setConfig } from "./config.ts";
export { getEnv, setEnv } from "./env.ts";

export function distributeNumbers(
  low: number,
  high: number,
  iterations: number,
) {
  const step = (high - low) / (iterations - 1);
  const result = [];

  for (let i = 0; i < iterations; i++) {
    const value = low + i * step;
    result.push(value);
  }

  return result;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function splitBy(list: Array<any>, chunkSize: number) {
  const result = [];
  for (let i = 0; i < list.length; i += chunkSize) {
    result.push(list.slice(i, i + chunkSize));
  }

  return result;
}
//module.exports = {
//  getConfig: getConfig,
//  setConfig: setConfig,
//  getEnv: getEnv,
//  setEnv: setEnv,
//  distributeNumbers: distributeNumbers,
//  sleep: sleep,
//  splitBy: splitBy,
//};
