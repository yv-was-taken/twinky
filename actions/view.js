import ccxt from "ccxt";
import { getConfig, getEnv } from "../utils/index.cjs";

export default async function view(target) {
  const env = getEnv();
  const exchange = getConfig().exchange;
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });

  switch (target) {
    case "balance":
      console.log("fetching balance...");
      let balance = await connect.fetchBalance();
      let freeBalance = {};
      let usedBalance = {};
      let totalBalance = {};
      for (const asset in balance) {
        if (balance[asset].free > 0) {
          freeBalance[asset] = freeBalance[asset]
            ? freeBalance[asset] + balance[asset].free
            : balance[asset].free;
        }
        if (balance[asset].used > 0) {
          usedBalance[asset] = usedBalance[asset]
            ? usedBalance[asset] + balance[asset].used
            : balance[asset].used;
        }
        if (balance[asset].total > 0) {
          totalBalance[asset] = totalBalance[asset]
            ? totalBalance[asset] + balance[asset].total
            : balance[asset].total;
        }
      }
      console.log("free balance: ", freeBalance);
      console.log("used balance: ", usedBalance);
      console.log("total balance: ", totalBalance);
      break;

    case "open orders":
      console.log("fetching open orders...");
      let openOrders = await connect.fetchOpenOrders();
      if (openOrders.length === 0) {
        console.log("no orders open!");
      } else {
        for (const i in openOrders) {
          let order = openOrders[i];
          let symbol = order.info.symbol;
          let closingPrice = order.average;
          let entryPrice = order.price;
          let side = order.id.side;
          let amount = order.amount;
          let filled = order.filled;
          let remaining = order.remaining;
          let isReduceOnly = order.reduceOnly;

          let trade;
          let tradeAction = isReduceOnly ? " CLOSE " : " OPEN";
          let tradeDirection = side === "BUY" ? " SHORT" : " LONG";
          trade = "\n" + "------ " + tradeAction + symbol + tradeDirection;

          console.log(trade);
          console.log("entry price: ", entryPrice);
          console.log("closing price: ", closingPrice);
          console.log("amount: ", amount);
          console.log("filled: ", filled);
          console.log("remaining: ", remaining);
        }
      }

      break;
    case "closed orders":
      console.log("fetching closed orders...");
      let closedOrders = await connect.fetchClosedOrders();
      if (!closedOrders.length === 0) {
        console.log("no orders closed!");
      } else {
        for (const i in closedOrders) {
          let order = closedOrders[i];
          let symbol = order.info.symbol;
          let entryPrice = order.price;
          let closingPrice = order.average;
          let side = order.info.side;
          let amount = order.amount;
          let filled = order.filled;
          let remaining = order.remaining;
          let isReduceOnly = order.reduceOnly;
          let cost = order.cost;

          let trade;
          let tradeDirection = side === "BUY" ? " SHORT" : " LONG";
          trade = "\n" + "------ " + symbol + " " + side;

          let profit = closingPrice / entryPrice;
          profit = profit * amount;
          profit = profit - amount;
          profit = profit * closingPrice;

          console.log(trade);
          console.log("entry price: ", entryPrice);
          console.log("closing price: ", closingPrice);
          console.log("reduce only? ", isReduceOnly);
          console.log("amount: ", amount);
          console.log("filled: ", filled);
          console.log("remaining: ", remaining);
          console.log("realized PnL: ", profit);
        }
      }

      break;
    case "open positions":
      console.log("fetching open positions...");
      let positions = await connect.fetchPositions();
      if (positions.length === 0) {
        console.log("no open positions!");
      } else {
        for (const i in positions) {
          let position = positions[i];
          let side = position.info.side === "Buy" ? "LONG" : "SHORT";
          let symbol = position.symbol;

          let size = position.info.size;
          let averagePrice = position.info.avgPrice;
          let liqPrice = position.info.liqPrice;
          let unrealizedPnL = position.info.unrealisedPnl;
          let realizedPnL = position.info.cumRealisedPnl;
          let notionalValue = position.notional;

          let trade = "\n" + "------ " + symbol + " " + side;
          console.log(trade);
          console.log("size: ", parseFloat(size));
          console.log("notional value: ", notionalValue);
          console.log("average price: ", parseFloat(averagePrice));
          console.log("liquidation price: ", parseFloat(liqPrice));
          console.log("unrealized PnL: ", parseFloat(unrealizedPnL));
          console.log("realized PnL", parseFloat(realizedPnL));
        }
      }

      break;
  }
}
