#!/usr/bin/env node
import yantra from '@yantra-core/client';
import inquirer from 'inquirer';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import min from 'minimist';
import fs from 'fs';

const argv = min(process.argv.slice(2));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deployPath = argv._[0] || process.cwd();

async function go() {

  const client = yantra.createClient({});

  if (!client.accessToken) {
    console.log('You are not currently logged in.');
    console.log('Run `yantra login` to login to Yantra.');
    return;
  }
  
  let owner = client.owner;

  const packageJsonPath = path.join(deployPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in current working directory.');
    return;
  }

  const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const worldName = packageJsonContent.name;

  let removeWorldsAllByOwner = argv.all || false;

  if (removeWorldsAllByOwner) {

    let currentWorlds = await client.list(owner);
    let worldIds = currentWorlds.map(world => world.id);

    // TODO: better UX / UI on showing all worlds about to be removed
    //       will most likely went to show metadata and stats about each world
    // Display a prompt showing worlds about to be removed
    console.log('You are about to remove the following worlds:');

    for (let world of currentWorlds) {
        console.log(`${world.owner}/${world.mode}`);
        // If you have other metadata like 'createdDate' or 'lastModified', you can display them too:
        // console.log(`  Created: ${world.createdDate}`);
        // console.log(`  Last Modified: ${world.lastModified}`);
        // console.log('--------------------------');  // Optional line to separate worlds for clarity
    }

    // Display a prompt asking if user is sure about the removal
    const confirmation = await inquirer.prompt([{
        type: 'confirm',
        name: 'shouldRemove',
        message: 'Are you sure you want to remove all the above worlds?',
        prefix: '',
        default: false,
    }]);
    if (!confirmation.shouldRemove) {
      console.log('Operation cancelled.');
      return;
    }

    for (let world of currentWorlds) {
      console.log('Removing world', owner, world.mode);
      await client.removeWorld(owner, world.mode);
    }

    console.log('All worlds removed successfully.');
    return;
  }

  // TODO: Add confirmation prompt when user is about to rm a world
  const confirmation = await inquirer.prompt([{
    type: 'confirm',
    name: 'shouldRemove',
    message: `Are you sure you want to remove the world ${worldName}?`,
    prefix: '',
    default: false,
  }]);

  if (!confirmation.shouldRemove) {
    console.log('Did not remove World!');
    return;
  }

  const removed = await client.removeWorld(owner, worldName);
  console.log(removed);
}

// Invoke the function to display worlds
go();
