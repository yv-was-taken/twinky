const fs = require("fs");
function setEnv(exchange, apiKey) {
  const env = {
    [exchange]: {
      API_KEY: apiKey,
    },
  };
  fs.writeFileSync(".env.json", JSON.stringify(env, null, 2));
}

function getEnv(exchange) {
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
