import snake from '../snake.js';

function playerFoodCollision(state) {

  let bodyA = state.states[0];
  let bodyB = state.states[1];

  let player, food;

  if ((bodyA.type === 'PLAYER') && (bodyB.kind === 'food')) {
    player = bodyA;
    food = bodyB;
  }

  if ((bodyB.type === 'PLAYER') && (bodyA.kind === 'food')) {
    player = bodyB;
    food = bodyA;
  }

  if (!player || !food) {
    return;
  }

  let stateUpdates = [];

  // Remove the eaten food
  stateUpdates.push({ id: food.id, type: 'TILE', destroy: true });

  // Update the player score
  stateUpdates.push({ id: player.id, type: 'PLAYER', score: player.score + 1});

  return stateUpdates;

}

export default playerFoodCollision;