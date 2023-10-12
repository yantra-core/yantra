#!/usr/bin/env node
import init from '../lib/init.js';

async function go() {
  init.scaffold();
}

go();