const world = {};

world.init = function (Y) {
  console.log('world.init', Y);
}

world.tick = function (gamestate) {
  let Y = this.Y; // YantraClient instance reference
  console.log(Y);
  console.log('gamestate', gamestate);
}

export default world;