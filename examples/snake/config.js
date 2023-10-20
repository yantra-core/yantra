let config = {
  id: 'snake',
  mode: 'snake',
  // movement: 'default',
  border: 'rect', // border is optional, will automatically create a solid / static / impassable border around map size
  width: 2560 * 4,
  height: 1440 * 4,
  gravity: {
    x: 0,
    y: 0
  },
  maxPlayers: 111,
  player: {
    width: 64,
    height: 64
  },
  client: {                  // client is optional, used to render games at ayyo.gg
    camera: {
      mode: 'follow'
    },
    miniLeaderboard: true,   // optional, AYYO custom game component, keeps track of top player scores 
    itemBar: {               // optional, AYYO custom game component, itemBar HUD access
      visible: false         // default state hidden, press 'H' key to toggle visibility
    }
  }
};

export default config;