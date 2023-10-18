const world = {};

world.init = function (Y) {
  console.log('world.init', Y.set, Y.create, Y.applyForce, Y.setVelocity);

  Y.set({
    id: 'box',
    type: 'BODY',
    nickname: 'I am a box',
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });

}

world.tick = function (gamestate) {
  let Y = this; // YantraClient instance reference
}

export default world;