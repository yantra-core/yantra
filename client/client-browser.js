import YantraClient from './YantraClient.js';

const sdk = {};

sdk.createClient = function createClient(options) {
  // browser-specific logic
  return new YantraClient(options);
}

export default sdk;