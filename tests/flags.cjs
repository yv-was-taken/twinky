const chaiExec = require("@jsdevtools/chai-exec");
const chai = require("chai");
const pjson = require("../package.json");

chai.use(chaiExec);

describe("command line flags", () => {
  it("should display help message when --help flag is passed", () => {
    const helpMessage = ` Blink: Crypto Trading API Modular CLI Suite

  actions:
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
