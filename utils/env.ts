import * as fs from "fs";
import { sleep } from "./index.ts";

type Props = {
  exchange: string;
  apiKey: string;
  apiSecret: string;
};
export async function setEnv({
  exchange,
  apiKey,
  apiSecret,
}: Props): Promise<boolean> {
  if (!apiKey || !apiSecret) {
    console.log(
      "error: key and secret both have to be defined. please try again",
    );
    return false;
  }
  let env: any; //@TODO strict typing
  try {
    env = getEnv();
    env[exchange] = {
      API_KEY: apiKey,
      API_SECRET: apiSecret,
    };
  } catch (err) {
    env = {};
    env[exchange] = {
      API_KEY: apiKey,
      API_SECRET: apiSecret,
    };
  }

  fs.writeFileSync(".env.json", JSON.stringify(env, null, 2));
  await setTimeout(() => {}, 500);
  console.log("Env set!");
  await sleep(500);
  return true;
}

export function getEnv() {
  try {
    const envFileContent = fs.readFileSync(".env.json", "utf8");
    const env = JSON.parse(envFileContent);
    return env;
  } catch (err) {
    throw err;
  }
}
