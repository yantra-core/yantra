import snake from '../snake.js';

// when the player dies, destroy the player and all their tail tiles
function playerDied(player) {
  let stateUpdates = [];
  stateUpdates.push({
    id: player.id,
    type: 'PLAYER',
    destroy: true
  });
  snake.cache[player.id].tail.forEach(function (tailId) {
    console.log('sending destroy tile event', tailId)
    stateUpdates.push({
      id: tailId,
      type: 'TILE',
      destroy: true
    });
    // TODO: could drop special food / reward tile after player dies
  });
  // can we remove this?
  snake.cache[player.id].tail = []; // immediately clear local cache, may not be needed
  return stateUpdates;
}

export default playerDied;