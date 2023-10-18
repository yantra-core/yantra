import yantra from '@yantra-core/client';
import tap from 'tape';
import TestManager from '../helpers/TestManager.js';
import sleep from '../helpers/sleep.js';

const config = {
  id: "test-world",
  mode: "test-world",
  movement: "default",
  width: 2560,
  height: 1440,
  gravity: { x: 0, y: 0 },
  maxPlayers: 44
};

const sizes = {
  large: 400,
  medium: 200,
  small: 100
};

const Y = yantra.createClient({});
const testManager = new TestManager(Y);

tap.test('Create new world with default settings', async (t) => {
  await Y.setWorld('test-world', config);
  t.ok(true, "World set");
  t.end();
});

tap.test('Connect to world and set initial body state', async (t) => {
  await Y.connect({ wsConnectionString: 'ws://localhost:8888' });
  t.ok(true, "Connected to world");

  Y.destroy({ id: 'ball-0', type: 'BODY' });
  await sleep(1000);
  t.ok(true, "Body state cleared");

  Y.create({
    id: 'ball-0',
    type: 'BODY',
    shape: 'rectangle',
    kind: 'ball',
    x: 111,
    y: 111,
    height: sizes['small'],
    width: sizes['small'],
    mass: 500,
    emitCollisionEvents: true
  });
  t.ok(true, "Ball created");

  await sleep(100);
  t.end();
});

tap.test('Validate initial body state', (t) => {
  testManager.currentTick = 0;
  testManager.queueTest(1, () => {
    const ball = Y.world.BODY['ball-0'];
    t.ok(ball, "Ball should exist in game state");
    t.equal(Object.keys(Y.world.BODY).length, 1, "Only one BODY should exist");

    // Validating properties of ball
    t.equal(ball.id, 'ball-0', "Ball ID validation");
    t.equal(ball.x, 111, "X-coordinate validation");
    t.equal(ball.y, 111, "Y-coordinate validation");
    t.equal(ball.height, sizes['small'], "Height validation");
    t.equal(ball.width, sizes['small'], "Width validation");

    t.end();
  });
});

tap.test('Update and validate body state', (t) => {
  Y.set({
    id: 'ball-0',
    type: 'BODY',
    shape: 'rectangle',
    kind: 'ball',
    x: 222,
    y: 222,
    height: sizes['small'],
    width: sizes['small'],
    mass: 500,
    emitCollisionEvents: true
  });

  testManager.queueTest(10, () => {
    const ball = Y.world.BODY['ball-0'];
    t.ok(ball, "Ball should exist in game state");
    t.equal(Object.keys(Y.world.BODY).length, 1, "Only one BODY should exist");

    // Validating updated properties of ball
    t.equal(ball.id, 'ball-0', "Ball ID validation");
    t.equal(ball.x, 222, "X-coordinate validation after update");
    t.equal(ball.y, 222, "Y-coordinate validation after update");

    t.end();
  });
});

tap.test('Destroy the body state', async (t) => {
  Y.destroy({ id: 'ball-0', type: 'BODY' });
  await sleep(1000);

  testManager.queueTest(10, () => {
    t.equal(Object.keys(Y.world.BODY).length, 0, "No BODY should exist after destruction");
    t.end();
  });
});

tap.test('Disconnect client', (t) => {
  t.ok(true, "Disconnecting client");
  Y.disconnect();
  t.end();
});
