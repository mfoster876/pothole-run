// tests/powerups.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEffects, applyPowerup, tickEffects, effectActive, toolSpriteFor, POWERUPS } from '../src/powerups.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { applyDamage } from '../src/wreck.js';

function damagedCart(value) {
  const c = createCart(getCharacter('yute'));
  c.condition = applyDamage(c.condition, 100 - value);
  return c;
}

test('water fully heals and sets a boost timer', () => {
  const c = damagedCart(30); const fx = createEffects(); const run = {};
  applyPowerup(fx, c, run, 'water', 500);
  assert.equal(c.condition.value, 100);
  assert.ok(effectActive(fx, 'boost'));
});
test('tools repair a chunk (not full) and steady briefly', () => {
  const c = damagedCart(30); const fx = createEffects(); const run = {};
  applyPowerup(fx, c, run, 'tools', 500);
  assert.ok(c.condition.value > 30 && c.condition.value < 100);
  assert.ok(effectActive(fx, 'steady'));
});
test('coffee opens a smooth-road money window ahead', () => {
  const c = damagedCart(80); const fx = createEffects(); const run = { distance: 1000 };
  applyPowerup(fx, c, run, 'coffee', 1000);
  assert.ok(run.coffeeUntilDist > 1000);
});
test('timers expire', () => {
  const fx = createEffects(); const c = damagedCart(50); const run = {};
  applyPowerup(fx, c, run, 'tools', 0);
  tickEffects(fx, POWERUPS.tools.steady + 0.1);
  assert.equal(effectActive(fx, 'steady'), false);
});
test('tool art swaps by ride', () => {
  assert.equal(toolSpriteFor(getVehicle('handcart')), 'spanner');
  assert.equal(toolSpriteFor(getVehicle('probox')), 'socket');
});
