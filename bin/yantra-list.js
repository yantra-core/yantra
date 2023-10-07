import yantra from '@yantra-core/sdk';
import { existsSync, readFileSync } from 'fs';

const tokenPath = './config/token.json';

async function displayWorlds() {
    // Check for existence of token and extract the owner
    if (!existsSync(tokenPath)) {
        console.log('You are not currently logged in.');
        return;
    }
    
    const tokenContent = JSON.parse(readFileSync(tokenPath, 'utf-8'));
    const owner = tokenContent.account;

    const client = yantra.createClient({});
    const worlds = await client.list(owner);
    console.log('Available Worlds:', worlds);
}

// Invoke the function to display worlds
displayWorlds();
