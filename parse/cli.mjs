import meow from "meow";

const cli = meow(
  //  `
  //                 Usage:
  //                     $ blink <action> <subcommands> [flags]:wq
  //
  //
  //                 TRADE COMMANDS
  //                    long/short <market/limit> <ticker> <size> <@price (if limit)>
  //                 TRADE FLAGS
  //                    --chase: fill at the next possible tick in the order book with limit order. fill or kill
  //                    --scale: <model> <@low> <@high>: spread your order out within a range
  //                 CORE COMMANDS
  //                    trade: execute orders on the market
  //                    port: inspect market data (open positions)
  //
  //                 Example:
  //                     $ blink long market btcusdt binance 1
  //                     $ blink short limit ethusdt binance 10 @2500 --chase
  //                     $ blink long limit ethusdt binance @0.1 //spread
  //                     $ blink long limit ethusdt bybit 10 layer linear @1920 @2080
  //                     $ blink close all
  //
  //                     you can also omit certain options and blink will prompt you with the rest!
  //
  //                     $ blink open
  //                        > select direction
  //                        >   - long
  //                        >   - short
  //                 `,
  `actions:
        -trade(t)
        --> execute trades.

        -listen(l)
        --> listen for and log portfolio updates in real time.

        -view(v)
        --> view portfolio, open orders, order history.

        -settings(s)
        --> view/modify config settings.

        -help(h)
        --> log this message.

        -exit
        --> exit the program.
    `,
  {
    importMeta: import.meta,
    flags: {
      action: {
        type: "string",
        shortFlag: "a",
        choices: [
          "none",
          "trade",
          "t",
          "listen",
          "l",
          "view",
          "v",
          "settings",
          "s",
          "exit",
        ],
        default: "none",
      },
      chase: {
        type: "string",
        shortFlag: "c",
      },
      scale: {
        type: "boolean",
        shortFlag: "s",
        choices: [true, false],
        default: false,
      },
      scaleType: {
        type: "string",
        shortFlag: "t",
        choices: ["linear", "exponential", "logarithmic"], //logarithmic choice is actuall f(x) = ln(x-1) [[x-intercept at 0]];
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

export { inputs, flags, cli };
