#!/usr/bin/env node
import config from '../config/config.js';
import { existsSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import configManager from '../lib/configManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let etherspaceEndpoint = config.etherspaceEndpoint;

async function go() {

  console.log('Please enter your email address and we will send you a list of your account names.');
  // Prompt for account email first
  const { email } = await inquirer.prompt([{
    type: 'input',
    name: 'email',
    message: 'Enter your email address:',
    prefix: '',
    validate: input => input.includes('@') ? true : 'Please enter a valid email address.'
  }]);

  // Make a call to the etherspace endpoint with the email address
  let response;
  try {
    response = await axios.post(etherspaceEndpoint + '/api/v1/recover', { email });
  } catch (error) {
    console.error('Error contacting Etherspace server. Please contact support and try again soon.');
    return;
  }

  console.log('Check your email for a list of your account names.');

}

go();