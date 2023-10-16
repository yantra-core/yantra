#!/usr/bin/env node
import yantra from '@yantra-core/client';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import minimist from 'minimist';
let argv = minimist(process.argv.slice(2));

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
    console.log(client.owner, 'has not created any worlds yet...');
    console.log('Run `yantra init` to create a new world.');
    console.log('Run `yantra clone` to copy an existing Yantra world.');

  } else {

    if (argv.json || argv.j) {
      console.log(JSON.stringify(worlds, null, 2));
      return;
    }

    console.log('Available Worlds:');
    worlds.forEach(function(world) {
      let gameLink = `https://ayyo.gg/play?mode=${world.mode}&owner=${world.owner}`;
  
      console.log(JSON.stringify(world, null, 2));
      console.log('');
      console.log(gameLink);
      

    })
  }
}

// Invoke the function to display worlds
go();