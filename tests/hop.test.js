// tests/hop.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

function fieldWith(entities) { return { pool: entities }; }
function ent(type, x, z, extra = {}) {
  return { active: true, collected: false, type, x, z, halfWidth: 0.16, value: 0, ...extra };
}

test('hitting a sleeping policeman launches a hop, no damage', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('bump', 0, 0)]));
  assert.equal(cart.condition.value, 100);   // no damage from the bump itself
  assert.ok(cart.jumpT > 0);                  // airborne now
});
test('airborne, the cart sails over a pothole', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0.5; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.equal(cart.condition.value, 100);   // cleared it
});
test('landing on an obstacle while grounded still damages', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.ok(cart.condition.value < 100);
});
test('coins are collectible mid-hop', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0.5; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('coin', 0, 0, { value: 10 })]));
  assert.equal(run.coins, 10);
});
