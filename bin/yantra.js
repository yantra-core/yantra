#!/usr/bin/env node

import { Command } from 'commander';
import yantra from '@yantra-core/sdk';
import minimist from 'minimist';

const program = new Command();

program
  .version('0.0.1') // You can set your CLI version here
  .description('Yantra Serverless Physics Platform CLI')


const yantraAsciiArt = `
  __     __         _                _____ _      _____ 
  \\ \\   / /        | |              / ____| |    |_   _|
   \\ \\_/ /_ _ _ __ | |_ _ __ __ _  | |    | |      | |  
    \\   / _\` | '_ \\| __| '__/ _\` | | |    | |      | |  
     | | (_| | | | | |_| | | (_| | | |____| |____ _| |_ 
     |_|\\__,_|_| |_|\\__|_|  \\__,_|  \\_____|______|_____|
                                                        
 `;

console.log(yantraAsciiArt)

let owner = 'AYYO-ALPHA-0';

// Subcommand: deploy
program
  .command('deploy', 'Deploy your physics world')

// Subcommand: worlds
program
  .command('list', 'List your worlds')

program.parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}
