let config = {
  "id": "my-world",
  "mode": "my-world",
  "movement": "default", // optional, see ./examples/pong for custom movement example
  "border": "rect",      // optional, will automatically create a solid / static / impassable border around map size
  "width": 2560,
  "height": 1440,
  "gravity": {
    "x": 0,
    "y": 0.5
  },
  "maxPlayers": 44,
  "player": {
    "width": 40,
    "height": 480,
    "texture": "pixel"
  },
  "client": {           // client is optional, used to render games at ayyo.gg
    "itemBar": {        // this will create itemBar with default state hidden
      "visible": false  // press 'H' key to toggle visibility
    }
  }
}

export default config;