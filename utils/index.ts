import { getConfig, setConfig } from "./config.ts";
export { getEnv, setEnv } from "./env.ts";

export { getConfig, setConfig };
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
export function findArg(arg: string, array: Array<string>): string | null {
  let indexOfArg = array.indexOf(arg);
  if (indexOfArg > -1) {
    return array[indexOfArg];
  } else return null;
}

export function formatSymbol(
  symbol: string,
  tickers: string[],
  exchange: string,
): { symbol: string; isSymbolValid: boolean } {
  const config = getConfig();
  let asset;
  let quoteCurrency;
  if (!symbol) {
    asset = config.asset;
    quoteCurrency = config.quoteCurrency;
  } else {
    if (!symbol.includes("/")) {
      asset = symbol;
      quoteCurrency = config.quoteCurrency;
    } else {
      let symbolArr = symbol.split("/");
      asset = symbolArr[0];
      quoteCurrency = symbolArr[1];
    }
  }
  return {
    symbol: asset + "/" + quoteCurrency + ":" + quoteCurrency,
    isSymbolValid: checkTicker(asset, quoteCurrency, tickers, exchange),
  };
}
export function checkTicker(
  asset: string,
  quoteCurrency: string,
  tickers: string[],
  exchange: string,
): boolean {
  let tickerCheck = asset + quoteCurrency;
  if (!tickers.includes(tickerCheck)) {
    console.log(tickerCheck, "no found for: ", exchange, "please try again.");
    return false;
  }
  return true;
}
