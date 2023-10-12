import YantraClient from './client/YantraClient.js';
import deployWorld from './client/lib/world/deployWorld.js';
import zipWorld from './client/lib/world/zipWorld.js';
import configManager from './client/lib/configManager.js';

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

YantraClient.prototype.configManager = configManager;
YantraClient.prototype.deploy = deployWorld;
YantraClient.prototype.zip = zipWorld;

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