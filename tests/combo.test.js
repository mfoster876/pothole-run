// tests/combo.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

function fieldWith(entities) { return { pool: entities }; }
function ent(type, x, z, extra = {}) {
  return { active: true, collected: false, type, x, z, halfWidth: 0.16, value: 0, ...extra };
}

test('a near-miss raises the combo; a clean pass does not', () => {
  // half-widths sum to 0.32 (overlap threshold); near-miss band is gap in [0, 0.18],
  // i.e. |dx| in [0.32, 0.50]. x=0.42 → gap 0.10 (a near-miss); x=0.95 → no combo.
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0.42, 0)]));  // just outside overlap
  assert.ok(run.combo >= 1);
  const cart2 = createCart(getCharacter('yute')); cart2.x = 0; const run2 = createRun();
  resolveHits(run2, cart2, fieldWith([ent('pothole', 0.95, 0)])); // far away
  assert.equal(run2.combo, 0);
});
test('combo multiplies the next pickup; a hit resets it', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  run.combo = 3;
  resolveHits(run, cart, fieldWith([ent('coin', 0, 0, { value: 10 })]));
  assert.ok(run.coins > 10);                 // multiplied
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.equal(run.combo, 0);                // hit wipes it
});
