import snake from '../snake.js';

import getSnakeSpeed from './getSnakeSpeed.js';

function getTailDropRate(speed) {
  const BASE_RATE = 32;  // base tail drop rate
  const ADJUSTMENT_FACTOR = 0.5;  // for each speed unit increase, how much we adjust the BASE_RATE
  
  // As speed increases, the adjustedRate decreases, leading to more frequent tail drops.
  const adjustedRate = BASE_RATE / (speed * ADJUSTMENT_FACTOR);
  return 3;
  return Math.max(adjustedRate, 1);  // ensuring that tail drop rate never goes below 1 ticks
}

function tail(gameTick, player) {

  // function returns an array of state updates
  // we then pipe these updates to Y.set(stateUpdates)
  // for more explict control, you may pass Y directly to this function
  let stateUpdates = [];

  if (typeof snake.cache[player.id].tail === 'undefined') {
    snake.cache[player.id].tail = [];
  }
  let cachedPlayer = snake.cache[player.id];
  // console.log('cachedPlayer.tail.length', cachedPlayer.tail.length)

  // snake.cache is the local version of the state machine
  // it will update merge automatically as new states enter the local system
  // you can read/write to the cache as you please; however it will not be distributed
  // this is useful for tracking any local gamestate variables that are not distributed

  // Calculate tail position based on the last direction the player moved
  let tailX = player.x;
  let tailY = player.y;
  const tailOffset = 64;  // this is the size of the tail tile

  let lastDirection = cachedPlayer.lastDirection;
  // Adjust tail's position based on last direction
  if (lastDirection.x > 0) { // player moved right
    tailX -= tailOffset;
  } else if (lastDirection.x < 0) { // player moved left
    tailX += tailOffset;
  } else if (lastDirection.y > 0) { // player moved down
    tailY -= tailOffset;
  } else if (lastDirection.y < 0) { // player moved up
    tailY += tailOffset;
  }

  // Dynamic tail drop rate based on speed / score
  let tailDropRate = getTailDropRate(getSnakeSpeed(player.score));
  tailDropRate = Math.round(tailDropRate);
  tailDropRate = 33;
  // console.log('adjusted tailDropRate', tailDropRate)
  //let tailDropRate = 16; // for now
  // console.log(gameTick, 'tailDropRate', tailDropRate)
  if (gameTick % tailDropRate === 0) {
    const tailTile = {
      // id: `tail-${player.id}-${Date.now()}`,  // unique id for each tail tile, needed for local tail reference
      type: 'TILE',
      shape: 'rectangle',
      owner: player.id,
      kind: 'tail',
      texture: 'tile-titanium',
      isSensor: true,
      x: tailX,
      y: tailY,
      width: 64,  // Assuming each tile is 32x32, but you can adjust this
      height: 64,
      emitCollisionEvents: true // emitCollisionEvents is optional, required for listening to collision events on this state
    };
    stateUpdates.push(tailTile);
   //  cachedPlayer.tail.push(tailTile.id); // TODO: do we need this?
  }

  // get current cache from snake.cache and see how many tail tiles we have for player
  //console.log(snake.cache)
  let tailCount = 0;
  let lastTail;

  //console.log('snake.world', snake.world)
  for (let t in snake.world.TILE) {
    let tile = snake.world.TILE[t];
    if (tile.owner === player.id) {
      tailCount++;
      if (typeof lastTail === 'undefined') {
        lastTail = tile;
      }
      // console.log(tile.utime)
      if (tile.utime < lastTail.utime) { // why not ctime?
        lastTail = tile;
      }
    }
  }

  //  if (tailCount >= player.score + 3) {
  if (tailCount >= 10) {
    // Not required?
    // delete snake.cache[lastTail.id];
    // delete snake.world.TILE[lastTail.id];
    if (typeof lastTail !== 'undefined') {
      stateUpdates.push({
        id: lastTail.id,
        type: 'TILE',
        destroy: true
      });
    }
  }
  return stateUpdates;
}

export default tail;