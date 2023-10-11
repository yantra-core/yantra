#!/usr/bin/env node
import yantra from '../sdk.js';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenPath = path.resolve(__dirname + '/../config/token.json');

async function go() {
  const client = yantra.createClient({});

  if (!client.accessToken) {
    console.log('You are not currently logged in.');
    console.log('Run `yantra login` to login to Yantra.');
    return;
  }

  const worlds = await client.list(client.owner);
  if (worlds.length === 0) {
    console.log(owner, 'has not created any worlds yet...');
    console.log('Run `yantra init` to create a new world.');
    console.log('Run `yantra clone` to copy an existing Yantra world.');

  } else {
    console.log('Available Worlds:', worlds);
  }
}

// Invoke the function to display worlds
go();