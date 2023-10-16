#!/usr/bin/env node
import yantra from '@yantra-core/client';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import fs from 'fs';
import minimist from 'minimist';
let argv = minimist(process.argv.slice(2));

async function go() {
  const client = yantra.createClient({});

  if (!client.accessToken) {
    console.log('You are not currently logged in.');
    console.log('Run `yantra login` to login to Yantra.');
    return;
  }

  // check to see if a package.json exists in the cwd
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (existsSync(packageJsonPath) === false) {
    console.log('Error: package.json not found in the current directory');
    return;
  }

  console.log('Found package.json in the current directory');

  // load the file into memory
  const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (typeof packageJsonContent.name !== 'string') {
    console.log('Error: package.json does not contain a "name" property');
    return;
  }

  // Check for existence of "dependencies" and that @yantra-core/client is a dependency
  if (!packageJsonContent.dependencies || !packageJsonContent.dependencies['@yantra-core/client']) {
    console.log('Error: @yantra-core/client is not listed as a dependency in package.json');
    return;
  }

  // Check that the main entry point exists as a property in package.json
  if (!packageJsonContent.main) {
    console.log('Error: package.json does not contain a "main" property');
    return;
  }

  // Check that the main entry point file exists in the current directory
  const mainFilePath = path.join(process.cwd(), packageJsonContent.main);
  if (!existsSync(mainFilePath)) {
    console.log(`Error: The main entry point file "${packageJsonContent.main}" does not exist in the current directory`);
    return;
  }

  let worldId = packageJsonContent.name;
  console.log(worldId);

  console.log('Found local world', worldId, packageJsonPath);
  console.log('Checking remote server for world', worldId);

  // get the world from the server
  let world = await client.getWorld(client.owner, worldId);

  if (!world) {
    console.log('World not found on server. Running the examples locally will create the world on the server. You may also `yantra deploy`');
  }

  if (world) {
    console.log('World found on server', JSON.stringify(world, null, 2));
  }

  if (typeof world.source !== 'undefined' && world.source !== null && world.source !== '') {
    console.log('World source code found on server', world.source);
    console.log('Whenever the world URL is accessed, the source code will run.');
  } else {
    console.log('World source NOT found on server. You may run `yantra deploy` to deploy the source code for production.');
    console.log('Running the examples locally will create the world on the server and send state from local dev.');
  }

}

go();