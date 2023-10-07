import { confirm, input } from "@inquirer/prompts";
import { getConfig } from "../utils/index.ts";
type Props = {
  leverage?: string;
  retry: boolean;
  connect: any; //tricky typing @TODO make strict
  symbol: string;
};

export default async function leverageCheck({
  leverage,
  retry,
  connect,
  symbol,
}: Props): Promise<number> {
  while (true) {
    let useDefaultLeverage = await confirm({
      message: "use default leverage?",
    });
    if (useDefaultLeverage) {
      return getConfig().leverage;
    } else {
      try {
        let _leverage = parseFloat(
          leverage ?? (await input({ message: "leverage?" })),
        );
        if (leverage !== getConfig().leverage) {
          try {
            await connect.setLeverage(_leverage, symbol);
          } catch {}
        }
        return _leverage;
      } catch (err) {
        if (retry) {
          console.log("input must be a number, please try again.");
        } else {
          throw new Error("leverage must be a number. please try again.");
        }
      }
    }
  }
}
