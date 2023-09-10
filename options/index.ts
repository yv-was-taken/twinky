import ccxt from "ccxt";

export const exchanges = [
  { value: "binance" },
  { value: "binancecoinm" },
  { value: "binanceusdm" },
  { value: "bingx" },
  { value: "bitget" },
  { value: "bitmart" },
  { value: "bitmex" },
  { value: "bitvavo" },
  { value: "bybit" },
  { value: "cryptocom" },
  { value: "gate" },
  { value: "huobi" },
  { value: "kucoin" },
  { value: "kucoinfutures" },
  { value: "mexc" },
  { value: "okx" },
  { value: "wavesexchange" },
  { value: "woo" },
];

//@TODO verify all markets listed are accurate on each exchange's respective website/documentation
export const markets = {
  binance: [{ value: "spot" }],
  binancecoinm: [{ value: "perp" }],
  binanceusdm: [{ value: "perp" }],
  bingx: [{ value: "spot" }, { value: "perp" }],
  bitget: [{ value: "spot" }, { value: "perp" }],
  bitmart: [{ value: "spot" }, { value: "perp" }],
  bitmex: [{ value: "spot" }, { value: "perp" }],
  bitvavo: [{ value: "spot" }, { value: "perp" }],
  bybit: [{ value: "spot" }, { value: "perp" }, { value: "inverse" }],
  cryptocom: [{ value: "spot" }],
  gate: [{ value: "spot" }, { value: "perp" }],
  huobi: [{ value: "spot" }, { value: "perp" }],
  kucoin: [{ value: "spot" }],
  kucoinfutures: [{ value: "perp" }],
  mexc: [{ value: "spot" }, { value: "perp" }],
  okx: [{ value: "spot" }, { value: "perp" }],
  wavesexchange: [{ value: "spot" }],
  woo: [{ value: "spot" }, { value: "perp" }],
};

//unfortunately, ccxt doesn't offer any API routes that return quote currencies, so have to hardcode each one.

export const quoteCurrencies = {
  //@TODO verify via each respective exchange's documentation
  // (as of rn) just estimated guess for convenience sake.

  bybit: {
    spot: [{ value: "USDT" }, { value: "USDC" }],
    perp: [{ value: "USDT" }, { value: "USDC" }],
    inverse: [{ value: "BTC" }, { value: "ETH" }],
  },
  binancecoinm: {
    perp: [{ value: "BTC" }, { value: "BNB" }, { value: "ETH" }],
  },
  binanceusdm: {
    perp: [{ value: "USDT" }, { value: "BUSD" }],
  },
  bingx: {
    perp: [{ value: "USDT" }, { value: "BUSD" }],
  },
  bitget: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  bitmart: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  bitmex: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  bitvavo: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  cryptocom: {
    spot: [{ value: "USDT" }],
  },
  gate: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  huobi: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },

  kucoin: {
    spot: [{ value: "USDT" }],
  },
  kucoinfutures: {
    perp: [{ value: "USDT" }],
  },
  mexc: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  okx: {
    spot: [{ value: "USDT" }],
    perp: [{ value: "USDT" }],
  },
  wavesexchange: {
    spot: [{ value: "USDT" }],
  },
  woo: {},
};

type Props = {
  exchange: string;
  market: string;
  quoteCurrency: string;
};
export async function getTickers({ exchange, market, quoteCurrency }: Props) {
  //@ts-ignore
  const exchangeClass: any = ccxt[exchange];
  const connect = new exchangeClass().loadMarkets();
  const tickers = await connect.symbols();
  return tickers
    .map((item: any) => item.symbol)
    .filter((ticker: string) => ticker.includes(quoteCurrency));

  // if (exchange === "bybit") {
  //   let category;
  //   switch (market) {
  //     case "perp":
  //       category = "linear";
  //       break;
  //     case "spot":
  //       category = "spot";
  //       break;
  //     case "inverse":
  //       category = "inverse";
  //       break;
  //   }

  //    const api = `https://api.bybit.com/v5/market/instruments-info?category=${category}`;
  //    let tickers = await fetch(api)
  //      .then((resp: any) => resp.json())
  //      .then((json: any) => json.result.list);
  //    return tickers
  //      .map((item: any) => item.symbol)
  //      .filter((ticker: string) => ticker.includes(quoteCurrency));
  //  }
}
