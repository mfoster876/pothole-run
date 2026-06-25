import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, steer, updateCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

test('createCart starts centred, full condition, in middle lane', () => {
  const cart = createCart(getCharacter('yute'));
  assert.equal(cart.laneIndex, 1);
  assert.equal(cart.x, 0);
  assert.equal(cart.condition.value, 100);
});
test('steer right increments target lane, clamped to track', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1); assert.equal(cart.laneIndex, 2);
  steer(cart, +1); assert.equal(cart.laneIndex, 2);
  steer(cart, -1); assert.equal(cart.laneIndex, 1);
});
test('updateCart eases x toward the target lane and ramps speed', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1);
  const before = cart.x;
  updateCart(cart, 0.5);
  assert.ok(cart.x > before);
  assert.ok(cart.x <= 0.6 + 1e-9);
  assert.ok(cart.speed > 80);
});
test('reckless conductor slides looser (less handling) than yute over one step', () => {
  const yute = createCart(getCharacter('yute'));
  const cond = createCart(getCharacter('conductor'));
  steer(yute, +1); steer(cond, +1);
  updateCart(yute, 0.1); updateCart(cond, 0.1);
  assert.ok(cond.x < yute.x);
});
