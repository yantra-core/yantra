#!/usr/bin/env node

import { Command } from 'commander';
import yantra from '@yantra-core/client';
import minimist from 'minimist';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Constants for directory reference in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// reading the yantra sdk package.json to get version
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const program = new Command();

program
  .version(packageJson.version) // set from package.json
  .description('Yantra Serverless Physics Platform CLI');

const yantraAsciiArt = `
  __     __         _                _____ _      _____ 
  \\ \\   / /        | |              / ____| |    |_   _|
   \\ \\_/ /_ _ _ __ | |_ _ __ __ _  | |    | |      | |  
    \\   / _\` | '_ \\| __| '__/ _\` | | |    | |      | |  
     | | (_| | | | | |_| | | (_| | | |____| |____ _| |_ 
     |_|\\__,_|_| |_|\\__|_|  \\__,_|  \\_____|______|_____|
                                                        
 `;

let owner = 'AYYO-ALPHA-0';

program
  .command('init', 'Initialize a new world in the current directory')
  .command('clone', 'Clone a world from the Yantra library')
  .command('deploy', 'Deploy your physics world')
  .command('list', 'List your worlds')
  .command('info', 'Checks current directory for a Yantra world and displays information about it')
  .command('rm', 'Remove a world')
  .command('whoami', 'Display the current user')
  .command('login', 'Login to Yantra using OTP or create an account if it does not exist')
  .command('logout', 'Logs CLI client out of Yantra')
  .command('recover', 'Recover your account names by email address')

  if (process.argv.length <= 2 || program.args.includes('--help') || program.args.includes('-h')) {
    console.log(yantraAsciiArt);
    program.outputHelp();
  } else {
    program.parse(process.argv);
}