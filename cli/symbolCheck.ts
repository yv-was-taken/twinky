import { input } from "@inquirer/prompts";
import { formatSymbol } from "../utils/index.ts";
type Props = {
  retry: boolean;
  symbol?: string;
  tickers: string[];
  exchange: any; //TODO strict typing
};

export default async function symbolCheck({
  retry,
  symbol,
  tickers,
  exchange,
}: Props): Promise<string> {
  while (true) {
    let s = symbol;
    let _symbol =
      s ?? (await input({ message: "symbol? (enter for default)" }));
    if (_symbol === "exit") return "exit";
    const formatSymbolObject = formatSymbol(_symbol, tickers, exchange);
    if (formatSymbolObject.isSymbolValid) {
      return formatSymbolObject.symbol;
    } else {
      s = "";
    }

    if (retry) {
      console.log("symbol invalid. please try again.");
    } else throw new Error("symbol not valid, please try again.");
  }
}
