import YantraClient from './YantraClient.js';
import deployWorld from './lib/world/deployWorld.js';
import zipWorld from './lib/world/zipWorld.js';

import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

YantraClient.prototype.deploy = deployWorld;
YantraClient.prototype.zip = zipWorld;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.resolve(__dirname + '/config/token.json');

const sdk = {};

sdk.createClient = function createClient(options) {
  if (existsSync(tokenPath)) {
    const tokenContent = JSON.parse(readFileSync(tokenPath, 'utf-8'));
    options.accessToken = tokenContent.token;
    options.owner = tokenContent.account;
    // console.log('found token.json file, using local settings', options.owner);
  } else {
    console.log(tokenPath, 'not found');
  }

  return new YantraClient(options);
}

export default sdk;