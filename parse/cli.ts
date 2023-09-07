import meow from "meow";

const cli = meow(
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
      exchange: {
        type: "string",
        choices: ["bybit" /*, "binance", "dydx" */],
        isRequired: false,
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
        choices: ["linear", "exponential"], //, "logarithmic"], //logarithmic choice is actuall f(x) = ln(x-1) [[x-intercept at 0]];
        default: "linear",
      },
      from: {
        type: "number",
        shortflag: "f",
        //@ts-ignore
        isRequired: (flags, inputs) => {
          if (flags.scale) {
            return true;
          }
          return false;
        },
      },
      leverage: {
        type: "number",
        shortFlag: "lev",
        isRequired: false,
      },
      price: {
        type: "number",
        shortFlag: "p",
        isRequired: false,
      },
      to: {
        type: "number",
        shortflag: "t",
        //@ts-ignore
        isRequired: (flags, inputs) => {
          if (flags.scale) {
            return true;
          }
          return false;
        },
      },
      type: {
        type: "string",
        choices: ["market", "limit"],
        isRequired: (flags, inputs) => {
          //@ts-ignore @TODO remove ?
          //weird ts error without:
          //2367: This comparison appears to be unintentional because the types 'AnyFlag' and '"trade"' have no overlap.

          if (flags.action === "trade" || flags.action === "t") {
            return true;
          }
          return false;
        },
      },
      buy: {
        type: "number",
        isRequired: (flags, inputs) => {
          //@ts-ignore
          if (flags.action === "t" || flags.action === "trade") {
            return true;
          }
          return false;
        },
      },
      sell: {
        type: "number",
        isRequired: (flags, inputs) => {
          //@ts-ignore
          if (flags.action === "t" || flags.action === "trade") {
            return true;
          }
          return false;
        },
      },
      reduce: {
        type: "boolean",
        isRequired: false,
      },
      positions: {
        type: "string",
        isRequired: (flags, inputs) => {
          //@ts-ignore
          if (flags.action === "v" || flags.action === "view") {
            return true;
          }
          return false;
        },
      },
      listenType: {
        type: "string",
        choices: ["portfolio", "market"],
        isRequired: (flags, action) => {
          //@ts-ignore
          if (flags.action === "listen") {
            return true;
          }
          return false;
        },
      },
      metric: {
        type: "string",
        choices: ["volume", "rsi"],
        isRequired: (flags, inputs) => {
          //@ts-ignore
          if (flags.listenType === "market") {
            return true;
          }
          return false;
        },
      },
      stop: {
        type: "number",
        isRequired: false,
      },
      tp: {
        type: "number",
        isRequired: false,
      },
      tpType: {
        type: "string",
        choices: ["market", "limit"],
        isRequired: false,
      },
    },
  },
);
const flags = cli.flags;
const inputs = cli.input;

export { inputs, flags, cli };
