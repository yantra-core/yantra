import yantra from '@yantra-core/client';

let Y = yantra.createClient({});

async function go() {

  // connects to existing World
  await Y.connect('my-world');

  Y.config({
    movement: 'default'
  });

  let sizes = {
    large: 400,
    medium: 200,
    small: 100
  };

  for (let i = 0; i < 33; i++) {

    let size = 'small';
    if (i % 3 === 0) {
      size = 'medium';
    }
    if (i % 5 === 0) {
      size = 'large';
    }

    Y.config({
      player: {
        height: 300,
        width: 300,
        texture: 'triangle'
      }
    });

    // create a new physics body by inserting a new state object into the world
    Y.create({
      // id: 'game-ball',    // id is optional, will auto-id if not provided
      type: 'BODY',       // type is required, BODY is a generic physics body
      shape: 'rectangle', // shape or points are required for Bodies, defaults to 'rectangle`
      kind: 'ball',       // kind is optional, used to informally identify state sub-types
      x: 100,             // x is required, defaults to 0
      y: 100,             // y is required, defaults to 0
      height: sizes[size],        // height is required for rectangles, defaults to 100
      width: sizes[size],         // width is required for rectangles, defaults to 100
      mass: 500,          // mass is required, defaults to 9001
      emitCollisionEvents: true // emitCollisionEvents is optional, defaults to false
    });
  }


}

go();