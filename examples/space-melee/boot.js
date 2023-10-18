import yantra from '@yantra-core/client';
import world from './world.js';
import config from './config.js';

let client = yantra.createClient({});

async function go () {

  // creates world if it doesnt already exist
  try {
    await client.setWorld('space-melee', config);
  } catch (err) {
    console.log(err);
  }

  client.on('connect', world.init);
  client.on('gamestate', world.tick);
  await client.connect('space-melee');
  
};

go();