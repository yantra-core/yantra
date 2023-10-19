import yantra from '@yantra-core/client';
import world from './world.js';
import config from './config.js';

let Y = yantra.createClient({});

async function go () {

  // creates world if it doesnt already exist
  try {
    await Y.setWorld('space-melee', config);
  } catch (err) {
    console.log(err);
  }

  Y.on('connect', world.init);
  Y.on('gamestate', world.tick);
  await Y.connect('space-melee');

  Y.welcomeLink(Y.owner, config.mode);
  
};

go();