#!/usr/bin/env node
import config from '@yantra-core/client/config/config.js';
import { existsSync, writeFileSync } from 'fs';
import inquirer from 'inquirer';
import axios from 'axios';
import configManager from '@yantra-core/client/lib/configManager.js';

let etherspaceEndpoint = config.etherspaceEndpoint;

async function go() {
  // Check for existence of token

  console.log('Welcome to Yantra. Login with your account name.');
  console.log('If this is a new account, please enter your desired account name.');
  // Prompt for account name first
  const { name } = await inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Account name:',
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

  // console.log("response.data", response.data)
  if (response.data.status === 'NEEDS_ACCOUNT') {
    console.log(name, 'does not exist. Please enter email address to register account name.');
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

  configManager.writeConfig({ 
    account: name,
    // email: tokenResponse.data.token,
    token: tokenResponse.data.token
  });

  console.log('Login successful!');
}

go();