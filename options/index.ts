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

export async function getTickers(exchange, market, quoteCurrency) {
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
      .then((resp) => resp.json())
      .then((json) => json.result.list);
    return tickers
      .map((item) => item.symbol)
      .filter((ticker) => ticker.includes(quoteCurrency));
  }
}
