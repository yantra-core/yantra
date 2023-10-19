import yantra from '@yantra-core/client';
import world from './world.js';
import config from './config.js';

let Y = yantra.createClient({});

async function go () {

  // creates world if it doesnt already exist
  try {
    await Y.setWorld('my-world', config);
  } catch (err) {
    console.log(err);
  }

  Y.on('connect', world.init);

  // client.on('collision' fn) is optional listener, emits all registered collisions
  // You may also check for `EVENT_COLLISION` type in the gamestate tick ( see snake.js example )
  //client.on('collision', pong.collision);
  Y.on('gamestate', world.tick);

  await Y.connect('my-world');

  Y.welcomeLink(Y.owner, config.mode);
  
};

go();