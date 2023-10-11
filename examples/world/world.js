const world = {};

world.init = function (Y) {
  console.log('world.init', Y.set, Y.create, Y.applyForce, Y.setVelocity);

  Y.set({
    id: 'box',
    type: 'BODY',
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });

}

world.tick = function (gamestate) {
  // TODO: every 100 game ticks output the gamestate
  let Y = this; // YantraClient instance reference

  if (gamestate.gameTick % 100 === 0) {
    console.log(this.set);
    console.log(this.create);
    console.log(this.applyForce);
    console.log(this.setVelocity);
    console.log('gamestate', gamestate);
  }

}

export default world;