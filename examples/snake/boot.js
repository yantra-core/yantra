import config from './config.js';
import yantra from '@yantra-core/client';
import snake from './snake.js';

let Y = yantra.createClient({});

async function go () {

  // create or update world with config
  try {
    await Y.setWorld('snake', config);
  } catch (err) {
    console.log(err);
  }
  
  Y.on('connect', snake.init);
  Y.on('gamestate', snake.tick);

  await Y.connect('snake');
  
};

go();