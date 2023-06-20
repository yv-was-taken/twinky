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
  const exchange = _exchange ?? getConfig().exchange;
  const exchangeClass = ccxt[exchange];
  const connect = new exchangeClass({
    apiKey: env[exchange].API_KEY,
    secret: env[exchange].API_SECRET,
  });

  try {
    const response = await connect.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      params,
    );
    //    console.log(response);
    console.log("trade placed!");
    console.log("order ID: ", response.id);

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
