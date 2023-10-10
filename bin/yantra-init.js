#!/usr/bin/env node
import init from '../lib/cli/init.js';

async function go() {
  init.scaffold();
}

go();