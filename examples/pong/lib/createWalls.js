// Create the walls of the room, the left and right wall will be goals
// Remark: You can also use try using `border: "rect"` config option in your World config
function createWalls(Y) {
    
  Y.worldConfig.room.center = {
    x: 0,
    y: 0
  };

  // "topLeft" and "bottomRight" are helpers defined for us based on map size
  Y.worldConfig.room.topLeft = {
    x: Y.worldConfig.room.center.x - (Y.worldConfig.room.width),
    y: Y.worldConfig.room.center.y - (Y.worldConfig.room.height)
  };

  Y.worldConfig.room.bottomRight = {
    x: Y.worldConfig.room.center.x + (Y.worldConfig.room.width),
    y: Y.worldConfig.room.center.y + (Y.worldConfig.room.height)
  };

  // console.log(Y.worldConfig.room)

  const topLeft = Y.worldConfig.room.topLeft;
  const bottomRight = Y.worldConfig.room.bottomRight;

  const WALL_THICKNESS = 200;

  // Define the walls of the room, the left and right wall will be goals
  const walls = {
    top: {
      position: { x: (topLeft.x + bottomRight.x) / 2, y: topLeft.y - WALL_THICKNESS / 2 },
      size: { width: bottomRight.x - topLeft.x + 2 * WALL_THICKNESS, height: WALL_THICKNESS }
    },
    bottom: {
      position: { x: (topLeft.x + bottomRight.x) / 2, y: bottomRight.y + WALL_THICKNESS / 2 },
      size: { width: bottomRight.x - topLeft.x + 2 * WALL_THICKNESS, height: WALL_THICKNESS }
    },
    left: {
      position: { x: topLeft.x - WALL_THICKNESS / 2, y: (topLeft.y + bottomRight.y) / 2 },
      size: { width: WALL_THICKNESS, height: bottomRight.y - topLeft.y + 2 * WALL_THICKNESS }
    },
    right: {
      position: { x: bottomRight.x + WALL_THICKNESS / 2, y: (topLeft.y + bottomRight.y) / 2 },
      size: { width: WALL_THICKNESS, height: bottomRight.y - topLeft.y + 2 * WALL_THICKNESS }
    }
  };

  // for each wall we defined above, push a new wall object to the res state
  for (let wall in walls) {

    let fillColor = null; // state.fillColor is just an INT property, the client determines what to do with it
    let owner = 'server';
    if (wall === 'left') { // blue team's goal
      fillColor = 0x0000ff;
      owner = 'blue';
    }
    if (wall === 'right') { // red team's goal
      fillColor = 0xff0000;
      owner = 'red';
    }

    Y.create({
      id: 'wall-' + wall,              // id is optional
      type: 'BODY',                    // type is required, BODY is a generic physics body
      owner: owner,                    // owner is optional, defaults to 'server'
      x: walls[wall].position.x,       // x is required
      y: walls[wall].position.y,       // y is required
      width: walls[wall].size.width,   // width is required is for rectangles
      height: walls[wall].size.height, // height is required is for rectangles
      kind: 'wall',                    // kind is optional, used to identify state sub-types
      isStatic: true,                  // isStatic is optional, defaults to false
      restitution: 1,                  // restitution is optional, increase to make the ball more bouncy
      fillColor: fillColor             // fillColor is optional, defaults to 0x000000
    });
  }

};

export default createWalls;