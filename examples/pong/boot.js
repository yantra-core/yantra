import yantra from '@yantra-core/sdk';
import pong from './pong.js';
import config from './config.js';

let Y = yantra.createClient({
  owner: 'AYYO-ALPHA-0'
});

async function go () {

  // creates world if it doesnt already exist
  try {
    await Y.createWorld('pong', config);
  } catch (err) {
    console.log(err);
  }

  // TODO: can we remove this? can sdk bind this scope instead? is scope already bound?
  Y.worldConfig = {
    room: config
  };

  // ?? TODO: needs center and topLeft / topRight calculations
  Y.world = config;

  Y.on('connect', pong.init);

  // Y.on('collision' fn) is optional listener, emits all registered collisions
  // You may also check for `EVENT_COLLISION` type in the gamestate tick ( see snake.js example )
  //Y.on('collision', pong.collision);
  Y.on('gamestate', pong.tick);

  await Y.connect();
  
};

go();