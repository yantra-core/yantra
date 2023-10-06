#!/usr/bin/env node
// ln -s "$(npm prefix -g)/lib/node_modules/@yantra-core/sdk/bin/yantra.js" /usr/local/bin/yantra

import yantra from '@yantra-core/sdk';

let client = yantra.createClient({});

async function go() {

  await client.deploy('my-world', '.');

  // await client.connect('my-world');

}

go();