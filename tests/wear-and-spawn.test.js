// tests/wear-and-spawn.test.js
// TDD for: vehicle wear → performance, fresh-vehicle-like-new, and the
// drink −15% / repair-tool +20% spawn tuning.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, updateCart, wearFactor } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { drinkWeightsFor } from '../src/drinks.js';
import { buyVehicle, defaultSave } from '../src/save.js';
import { WEAR, SPAWN_TUNE } from '../src/constants.js';

// ---- wearFactor ----

test('wearFactor: a full-condition cart performs at 100% (factor 1.0)', () => {
  const cart = createCart(getCharacter('yute'));      // condition 100
  assert.equal(wearFactor(cart, WEAR.minHandling), 1);
  assert.equal(wearFactor(cart, WEAR.minSpeed), 1);
});

test('wearFactor: damage drags performance down toward the floor', () => {
  const cart = createCart(getCharacter('yute'));
  cart.condition.value = 0;
  assert.equal(wearFactor(cart, WEAR.minHandling), WEAR.minHandling);
  cart.condition.value = 50;
  const mid = wearFactor(cart, WEAR.minHandling);
  assert.ok(mid > WEAR.minHandling && mid < 1);       // monotonic between floor and full
});

test('wearFactor: healing (e.g. tools) lifts performance back up', () => {
  const cart = createCart(getCharacter('yute'));
  cart.condition.value = 30;
  const hurt = wearFactor(cart, WEAR.minHandling);
  cart.condition.value = 30 + 35;                      // a tools pickup heals ~35%
  const healed = wearFactor(cart, WEAR.minHandling);
  assert.ok(healed > hurt);
});

// ---- behavioural: a battered cart drives noticeably worse ----

test('a damaged cart reaches a lower top speed than a fresh one', () => {
  const fresh = createCart(getCharacter('yute'));
  const beat  = createCart(getCharacter('yute'));
  beat.condition.value = 10;
  for (let i = 0; i < 600; i++) { updateCart(fresh, 1 / 60); updateCart(beat, 1 / 60); }
  assert.ok(beat.speed < fresh.speed, `beat ${beat.speed} should trail fresh ${fresh.speed}`);
});

test('a damaged cart steers more sluggishly (eases toward target slower)', () => {
  const fresh = createCart(getCharacter('yute'));
  const beat  = createCart(getCharacter('yute'));
  beat.condition.value = 10;
  fresh.laneIndex = 3; beat.laneIndex = 3;             // both aim for the right lane
  updateCart(fresh, 0.1); updateCart(beat, 0.1);
  assert.ok(beat.x < fresh.x, 'sluggish cart lags the fresh cart toward the target');
});

// ---- fresh vehicle performs like new ----

test('buying a vehicle resets condition to 100 (performs like new)', () => {
  const save = defaultSave();
  save.condition = 42;                                 // previously battered
  save.wallet = 999999;
  const veh = { id: 'taxi', price: 1000 };
  assert.ok(buyVehicle(save, veh));
  assert.equal(save.condition, 100);
});

// ---- spawn tuning ----

test('drinks spawn 15% less than their base weight', () => {
  const weights = drinkWeightsFor(getCharacter('yute'));
  const ting = weights.find(w => w.type === 'ting');
  assert.ok(ting);
  assert.ok(Math.abs(ting.weight - 1 * SPAWN_TUNE.drinkMult) < 1e-9);
});

test('SPAWN_TUNE reflects the −15% / +20% intent', () => {
  assert.ok(Math.abs(SPAWN_TUNE.drinkMult - 0.85) < 1e-9);
  assert.ok(Math.abs(SPAWN_TUNE.toolMult - 1.20) < 1e-9);
});
