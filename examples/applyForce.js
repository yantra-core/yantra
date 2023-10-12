import yantra from '@yantra-core/sdk';

let client = yantra.createClient({});

async function go() {

  // connects to existing World
  await client.connect('my-world');

  // apply force to a body
  client.applyForce('game-ball', {
    x: 30,
    y: 30
  });

  // set velocity of a body
  client.setVelocity('game-ball', {
    x: 100, // change to 0 to stop the ball
    y: 0
  });

  // detect collisions
  client.on('collision', (collision) => {
    console.log('collision', collision);
  });

}

go();

