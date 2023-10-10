import snake from '../snake.js';

function playerFoodCollision(state) {

  let bodyA = state.states[0];
  let bodyB = state.states[1];

  let player, food;

  // TODO: Determine why this is necessary and why sometimes collision pairs have different orders
  // We could implement a priority system for collision pairs by TYPE so that we always know the precedence
  if (
    (bodyA.type === 'PLAYER') &&
    (bodyB.kind === 'food')) {
    player = bodyA;
    food = bodyB;
  }

  if (
    (bodyB.type === 'PLAYER') &&
    (bodyA.kind === 'food')) {
    player = bodyB;
    food = bodyA;
  }

  if (!player || !food) {
    return;
  }

  // 1. Increase snake's size
  // Let's assume the snake grows in width by 10 units after eating food
  // TODO: growthAmount?
  const growthAmount = 10;

  let stateUpdates = [];

  // 2. Remove the eaten food
  // console.log('removing food', food.id)
  stateUpdates.push({
    id: food.id,
    type: 'TILE',
    destroy: true
  });

  // 3. Update the player score
  // console.log('player.score', player.score)
  stateUpdates.push({
    id: player.id,
    type: 'PLAYER',
    score: player.score + 1
  });

  return stateUpdates;

}

export default playerFoodCollision;