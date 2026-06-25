import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, steer, updateCart, onShoulder } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

test('createCart starts centred (slot 2 of 5), full condition', () => {
  const cart = createCart(getCharacter('yute'));
  assert.equal(cart.laneIndex, 2);   // middle of 5 slots: shoulder, lane, lane, lane, shoulder
  assert.equal(cart.x, 0);
  assert.equal(cart.condition.value, 100);
  assert.equal(onShoulder(cart), false);
});
test('steer can reach the soft shoulder and clamps at the edge', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1); assert.equal(cart.laneIndex, 3);
  steer(cart, +1); assert.equal(cart.laneIndex, 4); assert.equal(onShoulder(cart), true);
  steer(cart, +1); assert.equal(cart.laneIndex, 4); // clamped at the right shoulder
  steer(cart, -1); assert.equal(cart.laneIndex, 3); assert.equal(onShoulder(cart), false);
});
test('updateCart eases x toward the target slot and ramps speed', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1); // target the right lane (x 0.6)
  const before = cart.x;
  updateCart(cart, 0.5);
  assert.ok(cart.x > before);
  assert.ok(cart.x < 0.6);           // eases toward the target slot, not past it
  assert.ok(cart.speed > 72);        // climbing from the eased start speed
});
test('reckless conductor slides looser (less handling) than yute over one step', () => {
  const yute = createCart(getCharacter('yute'));
  const cond = createCart(getCharacter('conductor'));
  steer(yute, +1); steer(cond, +1);
  updateCart(yute, 0.1); updateCart(cond, 0.1);
  assert.ok(cond.x < yute.x);
});
