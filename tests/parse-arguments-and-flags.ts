import { expect } from "chai";
import { spawn } from "child_process";

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
    const command = spawn("npm start", ["-- ", "--help"]);
    command.stdout.on("end", (data) => {
      expect(data.toString().trim().toEqual(helpMessage));
    });
  });
  it("should output version when --version flag is called", () => {
    const command = spawn("npm start", ["-- ", "--version"]);
    command.stdout.on("exit", (data) => {
      expect(data.toString().trim().toEqual("0.1.0"));
    });
  });
  it("should require from and to flags when --scale flag is passed.", () => {
    const command = spawn("npm start", ["-- ", "--scale", "--from", "1"]);
    command.stdout.on("exit", (data) => {
      expect(data.toString().trim().toEqual("Missing required flag --to"));
    });
  });
});
