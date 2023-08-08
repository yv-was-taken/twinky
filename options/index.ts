export const exchanges = [{ value: "bybit" }];
export const markets = {
  bybit: [{ value: "spot" }, { value: "perp" }, { value: "inverse" }],
};
export const quoteCurrencies = {
  bybit: {
    spot: [{ value: "USDT" }, { value: "USDC" }],
    perp: [{ value: "USDT" }, { value: "USDC" }],
    inverse: [{ value: "BTC" }, { value: "ETH" }],
  },
};

type Props = {
  exchange: string;
  market: string;
  quoteCurrency: string;
};
export async function getTickers({ exchange, market, quoteCurrency }: Props) {
  if (exchange === "bybit") {
    let category;
    switch (market) {
      case "perp":
        category = "linear";
        break;
      case "spot":
        category = "spot";
        break;
      case "inverse":
        category = "inverse";
        break;
    }

    const api = `https://api.bybit.com/v5/market/instruments-info?category=${category}`;
    let tickers = await fetch(api)
      .then((resp: any) => resp.json())
      .then((json: any) => json.result.list);
    return tickers
      .map((item: any) => item.symbol)
      .filter((ticker: string) => ticker.includes(quoteCurrency));
  }
}
