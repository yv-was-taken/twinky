const fs = require("fs");
function setEnv(apiKey) {
  const env = {
    API_KEY: apiKey,
  };
  fs.writeFileSync(".env.json", JSON.stringify(env));
}

function getEnv() {
  try {
    const envFileContent = fs.readFileSync(".env.json", "utf8");
    const env = JSON.parse(envFileContent);
    return {
      API_KEY: env.API_KEY,
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  setEnv: setEnv,
  getEnv: getEnv,
};
