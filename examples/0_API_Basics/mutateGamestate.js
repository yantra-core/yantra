import yantra from '@yantra-core/client';

let client = yantra.createClient({});

async function go() {
  // on each game tick, call the tick()
  // this is our main game loop, we run each time the server sends us a new gamestate
  client.on('gamestate', tick);
  // connects to existing World
  await client.connect('my-world');
}

let tick = function tick (snapshot) {
  //
  // snapshot.state - incoming differetial state change array from the server
  //
  // We can mutate server state by sending updates via `update(id, data)`
  snapshot.state.forEach(function (state) { 
    // for each existing state in the req
    if (state.type === 'game-ball') {
      // if the state is the ball, send a new state to the server
      // moves the ball to the right and down on each tick
      client.update('game-ball', {
        x: state.x + 1,
        y: state.y + 1
      })
    }
  });
}

go();