const FOOD_SIZE = 64; // Change this to whatever size you want the food to be

function generatePosition(width, height, buffer) {
  // Ensure buffer is not larger than half the width or height
  buffer = Math.min(buffer, width / 4, height / 4);  // Adjusted to width / 4 and height / 4
  
  // Calculate half width and height
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  // Generate random position within the buffered area
  let x = Math.floor(Math.random() * (width - 2 * buffer) - halfWidth + buffer);
  let y = Math.floor(Math.random() * (height - 2 * buffer) - halfHeight + buffer);

  return { x, y };
}

function spawnFood(Y) {

  let position = generatePosition(Y.worldConfig.room.width, Y.worldConfig.room.height, 100);
  // console.log('spawnFood', position);
  Y.set({
    type: 'TILE',
    shape: 'rectangle',
    kind: 'food',
    isSensor: true,
    x: position.x,
    y: position.y,
    height: FOOD_SIZE,
    width: FOOD_SIZE,
    isStatic: true, // Assuming food doesn't move, but you can change this
    fillColor: 0x00ff00, // Green color for food, adjust as necessary
    emitCollisionEvents: true // emitCollisionEvents is optional, required for listening to collision events on this state
  });
}

export default spawnFood;