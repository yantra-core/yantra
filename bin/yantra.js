#!/usr/bin/env node

import { Command } from 'commander';
import yantra from '@yantra-core/sdk';
import minimist from 'minimist';

const program = new Command();

program
  .version('0.0.2') // You can set your CLI version here
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
  .command('whoami', 'Display the current user')
  .command('login', 'Login to Yantra using OTP or create an account if it does not exist')
  .command('logout', 'Logs CLI client out of Yantra')



  

  if (process.argv.length <= 2 || program.args.includes('--help') || program.args.includes('-h')) {
    console.log(yantraAsciiArt);
    program.outputHelp();
  } else {
    program.parse(process.argv);
}
  

