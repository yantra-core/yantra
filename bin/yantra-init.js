#!/usr/bin/env node
import init from '../core/lib/cli/init.js';

async function go() {
  init.scaffold();
}

go();