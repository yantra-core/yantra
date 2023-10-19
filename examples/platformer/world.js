import config from './config.js';
import movement from './lib/movement.js';
const world = {};

world.init = function (Y) {
  console.log('world.init', Y.set, Y.create, Y.applyForce, Y.setVelocity);

  Y.config(config)

  Y.set({
    id: 'box',
    type: 'BODY',
    x: -900,
    y: 0,
    width: 200,
    height: 200
  });

  // create some platforms to jump around on
  Y.set({
    id: 'box',
    type: 'PLATFORM',
    x: -300,
    y: 100,
    width: 1200,
    height: 100
  });

  Y.set({
    id: 'box',
    type: 'PLATFORM',
    x: 600,
    y: -300,
    width: 1200,
    height: 100
  });

  Y.set({
    id: 'box',
    type: 'PLATFORM',
    x: 1200,
    y: -600,
    width: 1200,
    height: 100
  });

}

world.tick = function (gamestate) {
  let Y = this; // YantraClient instance reference
  gamestate.state.forEach(function (state) {
    if (state.type === 'PLAYER') {
      Y.set(movement(state));
    }
  });
}

export default world;