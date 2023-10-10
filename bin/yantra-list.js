#!/usr/bin/env node

import yantra from '@yantra-core/sdk';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokenPath = path.resolve(__dirname + '/../config/token.json');

async function go() {
    // Check for existence of token and extract the owner
    if (!existsSync(tokenPath)) {
        console.log('You are not currently logged in.');
        console.log('Run `yantra login` to login to Yantra.');
        // TODO: prompt for login / run login subcommand
        //       requires we decouple login logic from commander binary
        return;
    }
    
    const tokenContent = JSON.parse(readFileSync(tokenPath, 'utf-8'));
    const owner = tokenContent.account;

    const client = yantra.createClient({
      // TODO: token: tokenContent.token,
    });
    const worlds = await client.list(owner);
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
