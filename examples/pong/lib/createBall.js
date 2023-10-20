function createBall(Y) {
  Y.create({
    id: 'game-ball',
    type: 'BODY',       // type is required, BODY is a generic physics body
    shape: 'rectangle', // shape is required, defaults to 'rectangle`
    kind: 'ball',       // kind is optional, used to informally identify state sub-types
    emitCollisionEvents: true, // emitCollisionEvents is optional, required for listening to collision events on this state
    x: 100,             // x is required, defaults to 0
    y: 100,             // y is required, defaults to 0
    height: 100,         // height is required for rectangles, defaults to 100
    width: 100,          // width is required for rectangles, defaults to 100
    mass: 500,          // mass is required, defaults to 9001
    restitution: 1,     // restitution (bounciness) is required, defaults to 1
    velocity: {         // set an initial velocity
      x: 9.4,             // resets the X velocity to 0
      y: 9.4             // resets the Y velocity to 0
    }
  });
};

export default createBall;
