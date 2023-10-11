import config from './config.js';
import yantra from '@yantra-core/sdk/sdk.js';
import snake from './snake.js';

let Y = yantra.createClient({});

async function go () {

  // create or update world with config
  try {
    await Y.setWorld('snake', config);
  } catch (err) {
    console.log(err);
  }

  // TODO: can we remove this? can sdk bind this scope instead? is scope already bound?
  Y.worldConfig = {
    room: config
  };
  // client.world = worldConfig;
  
  Y.on('connect', snake.init);

  await Y.connect('snake');

  Y.config(config);

  Y.on('gamestate', snake.tick);
  
};

go();