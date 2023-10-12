#!/usr/bin/env node
import { existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import configManager from '../core/lib/configManager.js';

function logout() {
  configManager.unlinkConfig();
  console.log('Logged out successfully.');
}

// Calling the logout function
logout();