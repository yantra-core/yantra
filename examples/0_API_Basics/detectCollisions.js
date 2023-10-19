import yantra from '@yantra-core/client';

let client = yantra.createClient({});

async function go() {

  // connects to existing World
  await client.connect('my-world');

  // detect collisions
  client.on('collision', (collision) => {
    console.log('collision', collision);
  });

}

go();