// Create the walls of the room, the left and right wall will be goals
// Remark: You can also use try using `border: "rect"` config option in your World config
function createWalls(Y) {

  // console.log(Y.worldConfig.room)
  const WALL_THICKNESS = 50;

  // Define the walls of the room, the left and right wall will be goals
  let height = Y.worldConfig.room.height;
  let width = Y.worldConfig.room.width;

  const walls = {
    top: {
      position: { x: 0, y: -height / 2 - WALL_THICKNESS / 2 },
      size: { width: width, height: WALL_THICKNESS }
    },
    bottom: {
      position: { x: 0, y: height / 2 + WALL_THICKNESS / 2 },
      size: { width: width, height: WALL_THICKNESS }
    },
    left: {
      position: { x: -width / 2 - WALL_THICKNESS / 2, y: 0 },
      size: { width: WALL_THICKNESS, height: height }
    },
    right: {
      position: { x: width / 2 + WALL_THICKNESS / 2, y: 0 },
      size: { width: WALL_THICKNESS, height: height }
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