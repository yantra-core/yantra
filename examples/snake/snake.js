import config from './config.js';
import movement from './lib/movement.js';
import tail from './lib/tail.js';
import playerDied from './lib/playerDied.js';
import playerFoodCollision from './lib/playerFoodCollision.js';
import playerTailCollision from './lib/playerTailCollision.js';
import playerWallCollision from './lib/playerWallCollision.js';
import spawnFood from './lib/spawnFood.js';

const snake = {};
snake.config = config;

// Tail-related constants
const TAIL_TICKS = 33;
const tails = {};

snake.init = async function snakeInit(Y) {
  console.log('snake.init()');

  snake.cache = Y.cache;
  snake.world = Y.world;

  for (let i = 0; i < 1000; i++) {
    // TODO: must buffer these into smaller chunks
    // instead of sending all at once individually
    spawnFood(Y);
  }
}

snake.tick = function (gamestate) {
  let Y = this;
  // console.log('snake.tick()')
  gamestate.state.forEach(function (state) {
    if (state.type === 'PLAYER') {
      // moves the player based on req controls
      // console.log('moving the player', state);
      //movement(state)
      let re = movement(state);
      // console.log('reeee', re)
      Y.set(re);

      // Handle the tail (trail) of the player
      Y.set(tail(gamestate.gameTick, state));
    }

    if (state.type === 'EVENT_COLLISION') {
      // console.log(state)
      let bodyA = state.states[0];
      let bodyB = state.states[1];
  
      //
      // Check to see if player ate food
      //
      Y.set(playerFoodCollision(state));

      //
      // Check to see if player touched a tail tile
      //
      // Y.set(playerTailCollision(state));

      //playerTailCollision(req, res, bodyA, bodyB);
      //playerTailCollision(req, res, bodyB, bodyA);

      // TODO: playerPlayerCollision
      // playerPlayerCollision(req, res, bodyA, bodyB);
      //

      //
      // Check to see if player hit wall ( death )
      //
      Y.set(playerWallCollision(state));

    }
  });
  // Spawn food every 1000 ticks (you can adjust this as needed)
  // if (req.server.gameTick % 1000 === 0) {
    // spawnFood(req, res);
  // }

}

export default snake;