import ccxt from "ccxt";
import { getConfig, getEnv } from "../utils/index.cjs";

export default async function trade({
  _exchange,
  symbol,
  type,
  side,
  amount,
  price,
  params,
}) {
  const env = getEnv();
  const leverage = getConfig().leverage;
  const exchange = _exchange ?? getConfig().exchange;
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });

  console.log("placing trade...");
  try {
    //set leverage,
    //throws err if leverage is already set to the same number
    try {
      await connect.setLeverage(leverage, symbol);
    } catch {}
    const response = await connect.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      params,
    );
    console.log("trade placed!");
    console.log(
      `\n${amount} of ${symbol} ${type} ${side} placed successfully.`,
    );

    return;
  } catch (e) {
    // if the exception is thrown, it is "caught" and can be handled here
    // the handling reaction depends on the type of the exception
    // and on the purpose or business logic of your application
    if (e instanceof ccxt.NetworkError) {
      console.log(
        connect.id,
        "order failed due to a network error:",
        e.message,
      );
      // retry or whatever
    } else if (e instanceof ccxt.ExchangeError) {
      console.log(connect.id, "order failed due to exchange error:", e.message);
      // retry or whatever
    } else {
      console.log(connect.id, "order failed with:", e.message);
      // retry or whatever
    }
  }
}
