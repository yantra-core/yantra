import { existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenPath = path.resolve(__dirname + '/../config/token.json');

function logout() {
  if (existsSync(tokenPath)) {
    unlinkSync(tokenPath);
    console.log('Logged out successfully.');
  } else {
    console.log('You are not currently logged in.');
  }
}

// Calling the logout function
logout();
