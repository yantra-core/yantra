#!/usr/bin/env node
import init from '../client/lib/cli/init.js';

async function go() {

  // Extract world name from command line arguments
  const [worldname] = process.argv.slice(2);

  init.clone(worldname);
}

go();