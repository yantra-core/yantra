import yantra from '@yantra-core/sdk';

let client = yantra.createClient({
  owner: 'Marak'
});

async function go() {

  // connects to existing World
  await client.connect('my-world');

  // create a new physics body by inserting a new state object into the world
  await client.create({
    id: 'game-ball',    // id is optional, will auto-id if not provided
    type: 'BODY',       // type is required, BODY is a generic physics body
    shape: 'rectangle', // shape or points are required for Bodies, defaults to 'rectangle`
    kind: 'ball',       // kind is optional, used to informally identify state sub-types
    x: 100,             // x is required, defaults to 0
    y: 100,             // y is required, defaults to 0
    height: 444,        // height is required for rectangles, defaults to 100
    width: 444,         // width is required for rectangles, defaults to 100
    mass: 500,          // mass is required, defaults to 9001
    emitCollisionEvents: true // emitCollisionEvents is optional, defaults to false
  });

}

go();

