import yantra from '@yantra-core/sdk';
import world from './world.js';
import config from './config.js';

let client = yantra.createClient({
  owner: 'AYYO-ALPHA-0'
});

async function go () {

  // creates world if it doesnt already exist
  try {
    await client.createWorld('my-world', config);
  } catch (err) {
    console.log(err);
  }

  client.on('connect', world.init);

  // client.on('collision' fn) is optional listener, emits all registered collisions
  // You may also check for `EVENT_COLLISION` type in the gamestate tick ( see snake.js example )
  //client.on('collision', pong.collision);
  client.on('gamestate', world.tick);

  await client.connect();
  
};

go();