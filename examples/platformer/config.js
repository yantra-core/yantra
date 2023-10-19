let config = {
  "id": "my-platformer",
  "mode": "my-platformer",
  "movement": "default", // optional, see ./examples/pong for custom movement example
  "border": "rect",      // optional, will automatically create a solid / static / impassable border around map size
  "width": 2560 * 4,     // grow as needed
  "height": 1440,
  "gravity": {
    "x": 0,
    "y": 0.98
  },
  "maxPlayers": 44,
  "player": {
    width: 32,
    height: 32,
    texture: 'triangle'
  },
  "client": {           // client is optional, used to render games at ayyo.gg
    camera: {
      mode: 'follow'
    },
    "itemBar": {        // this will create itemBar with default state hidden
      "visible": false  // press 'H' key to toggle visibility
    }
  }
}

export default config;