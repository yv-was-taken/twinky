import * as fs from "fs";

type Props = {
  exchange: string;
  apiKey: string;
  apiSecret: string;
};
export function setEnv({ exchange, apiKey, apiSecret }: Props) {
  if (!apiKey || !apiSecret) {
    console.log(
      "error: key and secret both have to be defined. please try again",
    );
    return;
  }
  const env = getEnv();

  env[exchange] = {
    API_KEY: apiKey,
    API_SECRET: apiSecret,
  };

  //const env = {
  //  [exchange]: {
  //    API_KEY: apiKey,
  //    API_SECRET: apiSecret,
  //  },
  //};
  fs.writeFileSync(".env.json", JSON.stringify(env, null, 2));
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
