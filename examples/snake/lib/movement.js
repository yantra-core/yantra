import snake from '../snake.js';
import getSnakeSpeed from './getSnakeSpeed.js';

function movement(player) {

  // Contains object hash of current player control keys as boolean values
  const controls = player.controls;

  // Contains the local cached version of the player's state
  let cachedPlayer = snake.cache[player.id];
  const SNAKE_SPEED = getSnakeSpeed(player.score || 0);
  // console.log('SNAKE_SPEED', SNAKE_SPEED)
  let direction = { x: 0, y: 0 };

  // store lastPosition to local cache ( not sent to clients )
  // TODO: snake.cache['PLAYER'][player.id].lastDirection = { x: 0, y: SNAKE_SPEED }; // default direction;
  if (typeof cachedPlayer.lastDirection === 'undefined') {
    cachedPlayer.lastDirection = { x: 0, y: SNAKE_SPEED }; // default direction
  }
  // Set direction based on controls. 
  // Note: If both opposite directions (e.g., UP and DOWN) are pressed simultaneously, 
  // priority is given to the direction mentioned first in the following conditions.
  if (controls.UP) {
    direction = { x: 0, y: -SNAKE_SPEED };
  } else if (controls.DOWN) {
    direction = { x: 0, y: SNAKE_SPEED };
  } else if (controls.LEFT) {
    direction = { x: -SNAKE_SPEED, y: 0 };
  } else if (controls.RIGHT) {
    direction = { x: SNAKE_SPEED, y: 0 };
  }

  // Ensure snake is always moving by retaining its last direction if no new direction is given
  if (direction.x === 0 && direction.y === 0 && cachedPlayer.lastDirection) {
    // update speed in-case score has changed from outside source ( like inspector )
    /* TODO: move this elsewhere ( outside of controls )
    if (cachedPlayer.lastDirection.x !== 0) {
      cachedPlayer.lastDirection.x = getSnakeSpeed(player.score);
    }
    if (cachedPlayer.lastDirection.y !== 0) {
      cachedPlayer.lastDirection.y = getSnakeSpeed(player.score);
    }
    */
    direction = cachedPlayer.lastDirection;
  }

  // Store the current direction as lastDirection for the next movement update
  cachedPlayer.lastDirection = direction;

  // console.log('pppp', player, direction)

  // Update the player's position based on the calculated direction
  /*
  const stateUpdate = {
    id: player.id,
    type: player.type,
    x: player.x + direction.x,
    y: player.y + direction.y
  };
  */
  const stateUpdate = {
    id: player.id,
    type: player.type,
    velocity: {
      x: direction.x,
      y: direction.y
    }
  };

  return stateUpdate;
}

export default movement;