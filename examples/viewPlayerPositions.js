import yantra from '@yantra-core/client';

let client = yantra.createClient({});

async function go() {

  // connects to existing World
  await client.connect('my-world');

  client.on('gamestate', (snapshot) => {
    snapshot.state.forEach(function(state){
      if (state.type === 'PLAYER') {
        console.log(state.id, state.x, state.y)
      }
    });
  });

}

go();

