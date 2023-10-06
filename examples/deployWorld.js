import yantra from '@yantra-core/sdk';

let client = yantra.createClient({});

async function go() {

  await client.deploy('my-world', '.');

  // await client.connect('my-world');

}

go();