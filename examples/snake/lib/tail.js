import snake from '../snake.js';
import getSnakeSpeed from './getSnakeSpeed.js';

// Constants
const BASE_RATE = 24;
const ADJUSTMENT_FACTOR = 0.5;
const TAIL_OFFSET = 64;

function getTailDropRate(speed) {
  // Ensure a whole number drop rate
  const safeSpeed = Math.max(speed, 0.1);
  const adjustedRate = BASE_RATE / (safeSpeed * ADJUSTMENT_FACTOR);
  // Ensure the tail drop rate is always an integer
  return Math.ceil(Math.max(adjustedRate, 1));
}

function getTailPosition(player, lastDirection) {
  // Ensuring that the tail position is an integer to avoid fractional position values
  let tailX = Math.round(player.x);
  let tailY = Math.round(player.y);

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

function pruneExtraTails(tailCount, player, stateUpdates) {
  // console.log('cache', snake.cache)
  if (tailCount >= player.score + 3) {
    // Filtering tiles belonging to the player and of kind 'tail' from the cache
    const playerTails = Object.values(snake.cache).filter(
      entity => entity.type === 'BODY' && entity.kind === 'tail' && entity.owner === player.id
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
        type: 'BODY',
        destroy: true
      });
    }

  }
}

function tail(gameTick, player) {
  let stateUpdates = [];

  snake.cache[player.id] = snake.cache[player.id] || {};
  let cachedPlayer = snake.cache[player.id];
  cachedPlayer.tail = cachedPlayer.tail || [];

  let { tailX, tailY } = getTailPosition(player, cachedPlayer.lastDirection);

  // Dynamic tail drop rate based on speed / score
  let tailDropRate = getTailDropRate(getSnakeSpeed(player.score));

  // Use modulo for a stable recurring condition
  if (gameTick % tailDropRate === 0) {
    const tailTile = generateTailTile(tailX, tailY, player.id);
    stateUpdates.push(tailTile);
    cachedPlayer.tail.push(tailTile.id);
  }

  let tailCount = Object.values(snake.cache).filter(
    entity => entity.type === 'BODY' && entity.kind === 'tail' && entity.owner === player.id
  ).length;

  pruneExtraTails(tailCount, player, stateUpdates);

  return stateUpdates;
}

function generateTailTile(tailX, tailY, ownerId) {
  return {
    type: 'BODY',
    shape: 'rectangle',
    owner: ownerId,
    kind: 'tail',
    texture: 'tile-titanium',
    isSensor: true,
    isStatic: true,
    x: tailX,
    y: tailY,
    width: TAIL_OFFSET,
    height: TAIL_OFFSET,
    emitCollisionEvents: true
  };
}

export default tail;
