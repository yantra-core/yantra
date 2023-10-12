#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import configManager from '../client/lib/configManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.resolve(__dirname + '/../config/token.json');

function whoami() {

  let config = configManager.readConfig();
  if (!config) {
    console.log('You are not currently logged in.');
    return;
  }

  console.log('Current config:', config);

}

// Calling the whoami function
whoami();
