import fs from 'fs';
import path from 'path';

const configManager = {};

// Get the user's home directory
import os from 'os';

// set a default homeDir
let homeDir = '/';

// the default homeDir will almost always be overwritten by os.homedir()
// in sandbox or restricted environments, os.homedir() may throw an ENOENT error
try {
  homeDir = os.homedir();
} catch (err) {
  console.log('error in calling os.homedir()', err.message);
}

// Define the path for the Yantra directory
const yantraDir = path.join(homeDir, '.yantra');
console.log('yantraDir', yantraDir);

// Ensure the Yantra directory exists
if (!fs.existsSync(yantraDir)) {
  console.log('Creating Yantra config directory', yantraDir)
  fs.mkdirSync(yantraDir);
}

// Define the path for the token.json file inside the Yantra directory
const tokenPath = path.join(yantraDir, 'token.json');

configManager.readConfig = function readConfig() {
  if (fs.existsSync(tokenPath)) {
    const rawData = fs.readFileSync(tokenPath, 'utf8');
    return JSON.parse(rawData);
  }
  return null;
}

configManager.writeConfig = function writeConfig(configData) {
  fs.writeFileSync(tokenPath, JSON.stringify(configData, null, 2));
}

configManager.unlinkConfig = function unlinkConfig() {
  fs.unlinkSync(tokenPath);
}

export default configManager;