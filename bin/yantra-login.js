#!/usr/bin/env node
import config from '../config/config.js';
import { existsSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let etherspaceEndpoint = config.etherspaceEndpoint;

async function go() {

  // Check for existence of token
  const tokenPath = path.resolve(__dirname + '/../config/token.json');

  /* Remark: Better just to start new login instead of throwing error
  if (existsSync(tokenPath)) {
    console.log('You are already logged in.');
    return;
  } */

  // Prompt for account name first
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Enter your account name:',
    prefix: '',
  }]);

  // Make a call to the etherspace endpoint with the account name
  let response;
  try {
    response = await axios.post(etherspaceEndpoint + '/api/v1/login', { name });
  } catch (error) {
    console.error('Error contacting Etherspace server. Please contact support and try again soon.');
    return;
  }

  console.log("response.data", response.data)
  if (response.data.status === 'NEEDS_ACCOUNT') {
    console.log(name, 'does not exist. Please register with email.');
    const { email } = await inquirer.prompt([{
      type: 'input',
      name: 'email',
      message: 'Enter your email address:',
      prefix: '',
      validate: input => input.includes('@') ? true : 'Please enter a valid email address.'
    }]);

    // Send the username and email to register
    try {
      await axios.post(etherspaceEndpoint + '/api/v1/register', { email, name });
    } catch (error) {
      console.error('Error registering the user. Please try again later.');
      return;
    }

    console.log('Registration successful! Check your email for the One Time Password (OTP).');
  } else {
    console.log('Check your email for the One Time Password (OTP).');
  }

  // Prompt for OTP
  const { otp } = await inquirer.prompt([{
    type: 'input',
    name: 'otp',
    message: 'Enter the OTP sent to your email:',
    prefix: ''
  }]);

  // Send OTP for verification
  let tokenResponse;
  try {
    tokenResponse = await axios.post(etherspaceEndpoint + '/api/v1/verify', { name, otp });
  } catch (error) {
    console.error('Error verifying OTP. Please try again.');
    console.log(error.data)
    return;
  }

  // Save the token
  writeFileSync(tokenPath, JSON.stringify({ 
    account: name,
    // email: tokenResponse.data.token,
    token: tokenResponse.data.token
  }));

  console.log('Login successful!');
}

// ...
go();
