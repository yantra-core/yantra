#!/usr/bin/env node

import inquirer from 'inquirer';
import minimist from 'minimist';
import yantra from '@yantra-core/client';
import inspector from '../lib/inspector/inspector.js';

async function selectWorld(client) {
  const worlds = await client.list(client.owner);
  // console.log('worlds', worlds)
  const choices = worlds.map(world => world.mode);

  const { selectedWorld } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedWorld',
      message: 'Please select a world:',
      choices
    }
  ]);

  return selectedWorld;
}

async function go() {
  const client = yantra.createClient({});

  if (!client.accessToken) {
    console.log('You are not currently logged in.');
    console.log('Run `yantra login` to login to Yantra.');
    return;
  }

  const args = minimist(process.argv.slice(2));
  let worldName = args._[0];

  if (!worldName) {
    worldName = await selectWorld(client);
  }

  inspector.start(worldName);
}

go();
