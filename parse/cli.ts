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
        //@ts-ignore
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
        //@ts-ignore
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
