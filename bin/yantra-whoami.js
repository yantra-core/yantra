#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.resolve(__dirname + '/../config/token.json');

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
