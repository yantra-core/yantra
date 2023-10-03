import yantra from '../sdk.js';

let client = yantra.createClient({});

async function go() {

  await client.createWorld('my-world', { // creates a new game world on the server
    width: 2560,         // required, width of the world
    height: 1440,        // required, height of the world
    border: 'rect',      // optional, creates a border around the world
    movement: 'default', // optional, default movement type for players ( keyboard / mouse / gamepad )
    frameRate: 33.33,    // default, can be as high as 60
    regions: 'all',      // default, can also be an array of regions: see: yantra.gg/docs#regions
    gravity: {           // default, gravity setings
      x: 0,
      y: 0.7
    },
    player: {            // players connect to the world and are assigned a unique id
      width: 64,         // define default player width, height, texture, etc
      height: 64
    },
    maxPlayers: 16,      // default, max number of players allowed to connect to the world 
    autoscale: true      // default, new world instances will spawn on demand
  });

  // await client.connect('my-world');

}

go();