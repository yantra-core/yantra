import playerDied from './playerDied.js';

// TODO: why are A and B switched here? do walls get created first?
// TODO: make these either return true or false
function playerWallCollision(state) {

  let bodyA = state.states[0];
  let bodyB = state.states[1];

  if (
    (bodyB.type === 'PLAYER') &&
    (bodyA.type === 'WALL')) {
      return playerDied(bodyB);
  }
}

export default playerWallCollision;