
import yantra from '@yantra-core/sdk';
let owner = 'AYYO-ALPHA-0';
const client = yantra.createClient({});
const worlds = await client.list(owner);
console.log('Available Worlds:', worlds);