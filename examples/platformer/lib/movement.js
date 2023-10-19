import config from '../config.js';

const GRAVITY = config.gravity.y;  // Constant force pulling player down
const JUMP_STRENGTH = 15;  // Strength of jump
const MOVE_SPEED = 10;  // Speed of horizontal movement

function movement(player) {
  const controls = player.controls;
  console.log(player)
  let moveDirectionX = 0;  // -1 for left, 1 for right, 0 for stationary
  let velocityY = player.velocityY ? player.velocityY : 0;  // If player's current vertical velocity is not provided, initialize to 0
  
  // Update moveDirection based on LEFT or RIGHT controls
  if (controls.LEFT) {
    moveDirectionX = -1;
  } else if (controls.RIGHT) {
    moveDirectionX = 1;
  }

  // Gravity always acts on the player
  velocityY += GRAVITY;

  // If the UP control is pressed and the player is on the ground (or a platform),
  // then apply a negative force to simulate a jump. 
  if (controls.UP /*&& Math.abs(player.velocityY < 1*/) { // TODO: this should work with 0
    velocityY = -JUMP_STRENGTH;
  }

  // Create a new state update
  const stateUpdate = {
    id: player.id,
    type: player.type,
    velocity: { 
      x: MOVE_SPEED * moveDirectionX,
      y: velocityY
    }
  };

  return stateUpdate;
}

export default movement;