#!/usr/bin/env bun

import { main, verifySettings } from "./cli/index.ts";
import { inputs, flags } from "./parse/cli.ts";

async function app() {
  await verifySettings({ modifyConfig: false });
  //meow cli flag types do not play nice with tsc

  //@ts-ignore
  await main({ args: inputs, flags: flags });
}

app();
