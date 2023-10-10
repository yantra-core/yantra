//
// Simple custom movement() function
// Set `movement: "default" in your World config if you do not wish to write your own movement function
//
// Simple custom movement() function
// Set `movement: "default" in your World config if you do not wish to write your own movement function
function movement(player) {
  const MOVE_SPEED = 10;  // This determines how fast the paddle moves, adjust as needed

  // `controls` is an object of boolean values for each game req control
  const controls = player.controls;
  // console.log('controlscontrolscontrols', controls)

  let moveDirectionY = 0; // -1 for up, 1 for down, 0 for stationary
  let moveDirectionX = 0; // -1 for left, 1 for right, 0 for stationary

  // Update moveDirection based on UP or DOWN controls
  if (controls.UP) {
    moveDirectionY = -1;
  } else if (controls.DOWN) {
    moveDirectionY = 1;
  }

  // Update moveDirection based on LEFT or RIGHT controls
  if (controls.LEFT) {
    moveDirectionX = -1;
  } else if (controls.RIGHT) {
    moveDirectionX = 1;
  }
  // console.log('moveDirectionX', moveDirectionX, 'moveDirectionY', moveDirectionY)
  // If there is any movement
  if (moveDirectionY !== 0 || moveDirectionX !== 0) {
    const stateUpdate = {
      id: player.id,
      type: player.type,
      velocity: { 
          y: MOVE_SPEED * moveDirectionY,
          x: MOVE_SPEED * moveDirectionX
      } 
    };
    // console.log('stateUpdate', stateUpdate)
    return stateUpdate;
  }
}

export default movement;