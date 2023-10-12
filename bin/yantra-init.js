#!/usr/bin/env node
import init from '../client/lib/cli/init.js';

async function go() {
  init.scaffold();
}

go();