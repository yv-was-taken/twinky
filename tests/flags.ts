import chaiExec from "@jsdevtools/chai-exec";
import * as chai from "chai";

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
    const command = chaiExec("node index.ts--help");
    chai.expect(command.stdout.trim()).to.contain(helpMessage.trim());
  });
  it("should output version when --version flag is called", () => {
    const command = chaiExec("node index.ts--version");
    chai
      .expect(command.stdout.trim())
      .to.equal(process.env.npm_package_version);
  });
  it("should require from and to flags when --scale flag is passed.", () => {
    const command = chaiExec("npm run start -- --scale --from 1");
    chai.expect(command.exitCode).to.equal(2);
  });
});
