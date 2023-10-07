import { existsSync, readFileSync } from 'fs';

const tokenPath = './config/token.json';

function whoami() {
  if (existsSync(tokenPath)) {
    const tokenContent = readFileSync(tokenPath, 'utf-8');
    console.log('Current token:', tokenContent);
  } else {
    console.log('You are not currently logged in.');
  }
}

// Calling the whoami function
whoami();
