/** @format */

import meow from "meow";

const cli = meow(
  `
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
                 `,
  {
    importMeta: import.meta,
    flags: {
      chase: {
        type: "string",
        shortFlag: "c",
      },
      scale: {
        type: "string",
        shortFlag: "s",
        choices: ["linear", "exponential"],
        default: "linear",
      },
      from: {
        type: "number",
        shortflag: "f",
        isRequired: (flags, inputs) => {
          if (flags.scale) {
            return true;
          }
          return false;
        },
      },
      to: {
        type: "number",
        shortflag: "t",
        isRequired: (flags, inputs) => {
          if (flags.scale) {
            return true;
          }
          return false;
        },
      },
    },
  },
);

const flags = cli.flags;
const inputs = cli.input;

export { inputs, flags };
