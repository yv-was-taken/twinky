const fs = require("fs");
function setEnv(exchange, apiKey = undefined, apiSecret = undefined) {
  const currentEnv = getEnv()[exchange];
  const currentKey = currentEnv.API_KEY;
  const currentSecret = currentEnv.API_SECRET;
  const key = apiKey ?? currentKey;
  const secret = apiSecret ?? currentSecret;
  if (!key || !secret) {
    console.log(
      "error: key and secret both have to be defined. please try again",
    );
    return;
  }
  const env = {
    [exchange]: {
      API_KEY: key,
      API_SECRET: secret,
    },
  };
  fs.writeFileSync(".env.json", JSON.stringify(env, null, 2));
}

function getEnv() {
  try {
    const envFileContent = fs.readFileSync(".env.json", "utf8");
    const env = JSON.parse(envFileContent);
    return env;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  setEnv: setEnv,
  getEnv: getEnv,
};
