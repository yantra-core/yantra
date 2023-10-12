import YantraClient from './YantraClient.js';
import configManager from './lib/configManager.js';

// Remark: Client does not include deploy or zip functions

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.resolve(__dirname + '/config/token.json');

const sdk = {};

sdk.createClient = function createClient(options) {
  let config = configManager.readConfig();

  if (!config) {
    console.log('local config not found.');
  } else {
    console.log('found config', config)
    options.accessToken = config.token;
    options.owner = config.account;
  }

  return new YantraClient(options);
}

export default sdk;