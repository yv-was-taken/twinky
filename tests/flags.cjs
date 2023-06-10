const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
const pjson = require("../package.json");

chai.use(chaiExec);

describe("command line flags", () => {
  it("should display help message when --help flag is passed", () => {
    const helpMessage = `
                 Blink: Crypto Trading API Modular CLI Suite

  Usage:
      $ blink <action> <subcommands> [flags]:wq


  TRADE COMMANDS
     long/short <market/limit> <ticker> <size> <@price (if limit)>
  TRADE FLAGS
     --chase: fill at the next possible tick in the order book with limit order. fill or kill
     --scale: <model> <@low> <@high>: spread your order out within a range
  CORE COMMANDS
     trade: execute orders on the market
     port: inspect market data (open positions)

  Example:
      $ blink long market btcusdt binance 1
      $ blink short limit ethusdt binance 10 @2500 --chase
      $ blink long limit ethusdt binance @0.1 //spread
      $ blink long limit ethusdt bybit 10 layer linear @1920 @2080
      $ blink close all

      you can also omit certain options and blink will prompt you with the rest!

      $ blink open 
         > select direction
         >   - long
         >   - short
                 `;
    const command = chaiExec("node index.mjs --help");
    chai.expect(command.stdout.trim()).to.contain(helpMessage.trim());
  });
  it("should output version when --version flag is called", () => {
    const command = chaiExec("node index.mjs --version");
    chai.expect(command.stdout.trim()).to.equal(pjson.version);
  });
  it("should require from and to flags when --scale flag is passed.", () => {
    const command = chaiExec("npm run start -- --scale --from 1");
    chai.expect(command.exitCode).to.equal(2);
  });
});
