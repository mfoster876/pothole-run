// tests/shoulder-tip.test.js — soft-shoulder tipping: lean to dodge, topple if too long
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, steer, updateCart, tipShoulder } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { SHOULDER, CART_SLOTS } from '../src/constants.js';

test('tilt grows while on the shoulder and stays below topple at first', () => {
  const cart = createCart(getCharacter('yute'));
  const toppled = tipShoulder(cart, true, 0.1);
  assert.ok(cart.tilt > 0, 'tilt accumulates on the shoulder');
  assert.ok(cart.tilt < SHOULDER.toppleAt);
  assert.equal(toppled, false);
});

test('tilt recovers (decreases) once back on the road', () => {
  const cart = createCart(getCharacter('yute'));
  cart.tilt = 0.5;
  tipShoulder(cart, false, 0.1);
  assert.ok(cart.tilt < 0.5, 'leans back upright off the shoulder');
});

test('staying on the shoulder long enough topples the cart', () => {
  const cart = createCart(getCharacter('yute'));
  let toppled = false;
  // ~tipRate^-1 seconds of continuous shoulder riding reaches toppleAt
  for (let i = 0; i < 600 && !toppled; i++) toppled = tipShoulder(cart, true, 1 / 60);
  assert.ok(toppled, 'the cart eventually goes over');
  assert.ok(cart.tilt >= SHOULDER.toppleAt);
});

test('it does NOT topple if you dip onto the shoulder then pull back', () => {
  const cart = createCart(getCharacter('yute'));
  let toppled = false;
  for (let i = 0; i < 60; i++) toppled = tipShoulder(cart, true, 1 / 60);   // 1s out
  for (let i = 0; i < 120; i++) toppled = tipShoulder(cart, false, 1 / 60); // 2s back in
  assert.equal(toppled, false);
  assert.equal(cart.tilt, 0, 'fully recovered');
});

test('a tilted cart on the shoulder leans further out (easier dodge)', () => {
  const upright = createCart(getCharacter('yute'));
  const tilted  = createCart(getCharacter('yute'));
  steer(upright, +2); steer(tilted, +2);   // both to the right shoulder (slot 4)
  assert.equal(upright.laneIndex, CART_SLOTS.length - 1);
  tilted.tilt = 1;
  for (let i = 0; i < 30; i++) { updateCart(upright, 1 / 60); updateCart(tilted, 1 / 60); }
  assert.ok(tilted.x > upright.x, `tilted ${tilted.x} leans further out than upright ${upright.x}`);
});
