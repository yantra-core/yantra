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

const Y = yantra.createClient({});
const testManager = new TestManager(Y);

let player;

tap.test('Create new world with default settings', async (t) => {
  await Y.setWorld('test-world', config);
  t.ok(true, "World set");
  t.end();
});

tap.test('Connect to world and join', async (t) => {
  await Y.connect({ wsConnectionString: 'ws://localhost:8888' });
  t.ok(true, "Connected to world");

  Y.joinWorld();
  await sleep(1000);
  t.end();
});

tap.test('Validate initial player state', (t) => {
  const players = Object.keys(Y.world.PLAYER);
  t.equal(players.length, 1, "Only one PLAYER should exist");

  player = Y.world.PLAYER[players[0]];
  t.ok(player, "Player should exist in game state");
  t.end();
});

tap.test('Update and validate player position', async (t) => {
  Y.set({
    id: player.id,
    type: 'PLAYER',
    x: 222,
    y: 222
  });

  await sleep(1000);
  const updatedPlayer = Y.cache[player.id];
  t.ok(updatedPlayer, "Cached player should exist in game state");

  // Validating updated properties of player
  t.equal(updatedPlayer.x, 222, "X-coordinate validation after update");
  t.equal(updatedPlayer.y, 222, "Y-coordinate validation after update");

  t.end();
});

tap.test('Disconnect client', (t) => {
  Y.disconnect();
  t.ok(true, "Client disconnected");
  t.end();
});
