import snake from '../snake.js';
import getSnakeSpeed from './getSnakeSpeed.js';

// Constants
const BASE_RATE = 32;
const ADJUSTMENT_FACTOR = 0.5;
const TAIL_OFFSET = 64;

function getTailDropRate(speed) {
  const safeSpeed = Math.max(speed, 0.1); // prevent divide by zero
  const adjustedRate = BASE_RATE / (safeSpeed * ADJUSTMENT_FACTOR);
  return Math.max(adjustedRate, 1);
}

function getTailPosition(player, lastDirection) {
  let tailX = player.x;
  let tailY = player.y;

  // Adjust tail's position based on last direction
  if (lastDirection.x > 0) {
    tailX -= TAIL_OFFSET;
  } else if (lastDirection.x < 0) {
    tailX += TAIL_OFFSET;
  } else if (lastDirection.y > 0) {
    tailY -= TAIL_OFFSET;
  } else if (lastDirection.y < 0) {
    tailY += TAIL_OFFSET;
  }

  return { tailX, tailY };
}

function generateTailTile(tailX, tailY, ownerId) {
  return {
    type: 'TILE',
    shape: 'rectangle',
    owner: ownerId,
    kind: 'tail',
    texture: 'tile-titanium',
    isSensor: true,
    x: tailX,
    y: tailY,
    width: TAIL_OFFSET,
    height: TAIL_OFFSET,
    emitCollisionEvents: true
  };
}

function pruneExtraTails(tailCount, player, stateUpdates) {
  // console.log('cache', snake.cache)
  if (tailCount >= player.score + 3) {
    // Filtering tiles belonging to the player and of kind 'tail' from the cache
    const playerTails = Object.values(snake.cache).filter(
      entity => entity.type === 'TILE' && entity.kind === 'tail' && entity.owner === player.id
    );

    if (playerTails.length > 0) {
      // Identifying the oldest tile by comparing ctime values
      const oldestTile = playerTails.reduce((oldest, tile) => {
        if (oldest.ctime < tile.ctime) {
          return oldest;
        } else {
          return tile;
        }
      }, playerTails[0]); // Default to the first tile when reducing

      // Enqueue state update to destroy the oldest tail tile
      stateUpdates.push({
        id: oldestTile.id,
        type: 'TILE',
        destroy: true
      });
    }

  }
}

function tail(gameTick, player) {
  let stateUpdates = [];

  // Ensure cachedPlayer and its tail exist
  snake.cache[player.id] = snake.cache[player.id] || {};
  let cachedPlayer = snake.cache[player.id];
  cachedPlayer.tail = cachedPlayer.tail || [];

  let { tailX, tailY } = getTailPosition(player, cachedPlayer.lastDirection);

  // Dynamic tail drop rate based on speed / score
  let tailDropRate = Math.round(getTailDropRate(getSnakeSpeed(player.score)));

  if (gameTick % tailDropRate === 0) {
    const tailTile = generateTailTile(tailX, tailY, player.id);
    stateUpdates.push(tailTile);
    cachedPlayer.tail.push(tailTile.id);
  }

  // Get tail count from the cache
  let tailCount = Object.values(snake.cache).filter(
    entity => entity.type === 'TILE' && entity.kind === 'tail' && entity.owner === player.id
  ).length;

  // If too many tails, prune the oldest one
  pruneExtraTails(tailCount, player, stateUpdates);

  return stateUpdates;
}

export default tail;
