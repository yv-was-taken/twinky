import ccxt from "ccxt";
import { getConfig, getEnv } from "../utils/index.ts";

type Props = {
  connect: any; //tricky typing
  symbol?: string;
  type: string;
  side: string;
  amount?: number;
  price?: string;
  params: any; //@todo check later
  isVerbose?: boolean;
};
export default async function trade({
  connect,
  symbol,
  type,
  side,
  amount,
  price,
  params,
  isVerbose = true,
}: Props) {
  if (isVerbose) console.log("placing trade...");
  try {
    const response = await connect.createOrder(
      symbol,
      type,
      side,
      amount,
      price,
      params,
    );
    if (isVerbose)
      console.log(
        `\n${amount} of ${symbol} ${type} ${side} placed successfully.`,
      );

    return;
  } catch (e: any) {
    //tricky typing, not worth the hassle

    /*
     * if the exception is thrown, it is "caught" and can be handled here
     * the handling reaction depends on the type of the exception
     * and on the purpose or business logic of your application
     */
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
