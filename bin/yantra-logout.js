import { existsSync, unlinkSync } from 'fs';

const tokenPath = './config/token.json';

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
