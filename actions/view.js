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
    case "order history":
      //do the thing
      break;
    case "open positions":
      //do the thing
      break;
  }
}
