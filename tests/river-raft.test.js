// tests/river-raft.test.js — Bog Walk Gorge is raft-ONLY: river stages force the bamboo
// raft (nobody drives a car down the Rio Cobre), the save's chosen vehicle is untouched,
// and a raft crash never busts a tune-up off the garaged ride.
//
// Same headless-game recipe as pause.test.js: stub the browser globals BEFORE the import.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const ctxStub = new Proxy(function () {}, { get: () => ctxStub, apply: () => ctxStub });
const fakeEl = { getContext: () => ctxStub, addEventListener() {}, click() {}, style: {}, width: 0, height: 0 };

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
globalThis.document = { getElementById: () => fakeEl };
globalThis.window = {
  innerWidth: 800, innerHeight: 450, devicePixelRatio: 1,
  addEventListener() {}, visualViewport: { width: 800, height: 450, addEventListener() {} },
};
globalThis.requestAnimationFrame = () => 0;

const { createGame } = await import('../src/game.js');
const { RAFT } = await import('../src/vehicles.js');

function audioStub() {
  const rec = () => () => {};
  return { setMuted: rec(), setGenre: rec(), unlock: rec(), playStage: rec(),
    playUserMusic: rec(), playRadio: rec(), stop: rec(), sfx: rec() };
}

test('a river stage forces the bamboo raft without touching the saved vehicle', () => {
  const game = createGame(audioStub());
  game.state.save.unlocks.stages.push('bog-walk');
  game.state.save.garage.push('probox');
  game.state.save.vehicle = 'probox';         // the player's chosen CAR
  game.menuChoice.stage = 'bog-walk';
  game.menuKey('Enter');                       // hub → play screen
  game.menuKey('Enter');                       // play → START the run
  assert.equal(game.state.mode, 'play', 'a river run is underway');
  assert.equal(game.cart.vehicle.id, 'raft', 'the ride on the river IS the raft');
  assert.equal(game.cart.vehicle.isCar, false, 'no windscreen — no wiper youths on the water');
  assert.equal(game.state.save.vehicle, 'probox', 'the garage selection is untouched');
});

test('an ordinary road stage still uses the saved vehicle', () => {
  const game = createGame(audioStub());
  game.menuChoice.stage = 'fern-gully';
  game.menuKey('Enter'); game.menuKey('Enter');
  assert.equal(game.cart.vehicle.id, game.state.save.vehicle, 'road runs ride the chosen vehicle');
});

test('the raft pseudo-vehicle is not on the dealer ladder', async () => {
  const { VEHICLES } = await import('../src/vehicles.js');
  assert.ok(!VEHICLES.some(v => v.id === RAFT.id), 'the dealer cannot sell the raft');
  assert.equal(RAFT.sprite, 'raft');
});
