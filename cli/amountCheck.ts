import { input } from "@inquirer/prompts";

type Props = {
  amount?: string;
  retry: boolean;
};
export default async function amountCheck({
  amount,
  retry,
}: Props): Promise<number> {
  while (true) {
    let a = amount;
    try {
      let _amount = parseFloat(
        a ?? (await input({ message: "order amount?" })),
      );
      return _amount;
    } catch (err) {
      if (retry) {
        console.log("amount invalid. please try again.");
        a = "";
      } else {
        throw new Error("amount invalid. please try again");
      }
    }
  }
}
