const fs = require("fs");
function setEnv({ exchange, apiKey, apiSecret }) {
  if (!apiKey || !apiSecret) {
    console.log(
      "error: key and secret both have to be defined. please try again",
    );
    return;
  }
  const env = {
    [exchange]: {
      API_KEY: apiKey,
      API_SECRET: apiSecret,
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
