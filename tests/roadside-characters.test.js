// tests/roadside-characters.test.js — locks the two new roadside characters (broom-selling
// rasta + donkey coconut cart) and that the redesigned wholesome pickups + the new figures
// all render without throwing. Pure-logic asserts for the spawn gating; a stub-canvas smoke
// for the draws (headless rAF is parked, so this is how we prove the sprite code paths run).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HAZARD_TYPES } from '../src/hazardTypes.js';
import { STAGES, getStage } from '../src/stages.js';
import { drawEntity } from '../src/sprites.js';

const RURAL = ['fern-gully', 'holland-bamboo'];
const URBANISH = ['negril', 'new-kingston'];

test('broom man is a walking pedestrian on every stage', () => {
  const b = HAZARD_TYPES.broomman;
  assert.equal(b.category, 'pedestrian');
  assert.equal(b.walk, true);
  for (const s of STAGES) {
    assert.ok(s.hazardWeights.some(w => w.type === 'broomman'), `${s.id} should spawn the broom seller`);
  }
});

test('coconut cart is rural-ONLY and RARE (never in the city / tourist strip)', () => {
  const c = HAZARD_TYPES.coconutcart;
  assert.equal(c.category, 'traffic');     // a slow road occupant, not a pedestrian roadkill
  assert.ok(!c.walk, 'the cart does not stroll across the lanes');
  for (const id of RURAL) {
    const w = getStage(id).hazardWeights.find(w => w.type === 'coconutcart');
    assert.ok(w, `${id} should include the coconut cart`);
    assert.ok(w.weight <= 1, `coconut cart must be rare in ${id} (weight ${w.weight})`);
  }
  for (const id of URBANISH) {
    assert.ok(!getStage(id).hazardWeights.some(w => w.type === 'coconutcart'),
      `${id} must NOT show the rural donkey cart`);
  }
});

test('the coconut cart is rarer than the broom seller where they share a stage', () => {
  for (const id of RURAL) {
    const ws = getStage(id).hazardWeights;
    const cart = ws.find(w => w.type === 'coconutcart').weight;
    const broom = ws.find(w => w.type === 'broomman').weight;
    assert.ok(cart < broom, `${id}: cart (${cart}) should be rarer than broom man (${broom})`);
  }
});

test('redesigned pickups + the new figures all render without throwing', () => {
  // recursive stub canvas context — any property is itself, any call returns itself
  const ctx = new Proxy(function () {}, { get: () => ctx, apply: () => ctx });
  const types = ['bagjuice', 'books', 'stationery', 'lasco', 'broomman', 'coconutcart'];
  for (const t of types) {
    for (const size of [10, 28, 64]) {   // tiny (culled detail) → large (text + bubble)
      assert.doesNotThrow(() => drawEntity(ctx, t, 480, 300, size, 0.42, 1), `${t} @ ${size}px`);
    }
  }
});
