// tests/mechshop-feel.test.js — mech-shop upgrades must CHANGE how the ride feels.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, applyGust, updateCart, gustFactor, steer } from '../src/cart.js';
import { stabilityBonus } from '../src/upgrades.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';

// A handcart with `bonus` worth of mech-shop stability (0 = stock, 0.8 = fully kitted).
const ride = (bonus) => createCart(getCharacter('yute'), getVehicle('handcart'), bonus, 100);
const FULL_RIG = stabilityBonus(['weighted-base', 'shock-pads', 'true-wheels', 'wide-axle'], 'handcart');

test('a full rig set is the advertised +0.8 stability', () => {
  assert.ok(Math.abs(FULL_RIG - 0.8) < 1e-9, 'four +0.2 rungs');
});

test('gustFactor pivots at the stock handcart and falls hard with upgrades', () => {
  assert.ok(Math.abs(gustFactor(0.70) - 1.0) < 1e-9, 'stock handcart unchanged — base game preserved');
  assert.ok(gustFactor(1.50) < 0.7, 'a fully-kitted ride soaks up most of the shove');
  assert.equal(gustFactor(5), 0.4, 'clamped floor');
  assert.equal(gustFactor(0.1), 1.2, 'clamped ceiling for a featherweight ride');
});

test('the SAME passing-bus gust shoves a kitted ride far less than a stock one', () => {
  const stock = ride(0), kitted = ride(FULL_RIG);
  applyGust(stock, 1, 1.6);
  applyGust(kitted, 1, 1.6);
  assert.ok(kitted.vx < stock.vx, 'less sideways velocity');
  assert.ok(kitted.vx < stock.vx * 0.7, 'meaningfully less — a felt difference, not a rounding error');
});

test('a kitted ride settles back to its line faster after the knock', () => {
  const stock = ride(0), kitted = ride(FULL_RIG);
  applyGust(stock, 1, 1.6); applyGust(kitted, 1, 1.6);
  for (let i = 0; i < 18; i++) { updateCart(stock, 1 / 60); updateCart(kitted, 1 / 60); }
  assert.ok(Math.abs(kitted.x) < Math.abs(stock.x), 'closer back to centre — it wallows less');
});

test('upgrades make the steering snappier — a kitted ride reaches the new lane sooner', () => {
  const stock = ride(0), kitted = ride(FULL_RIG);
  steer(stock, 1); steer(kitted, 1);            // both aim one slot right (x: 0 → 0.6)
  const frames = (c) => { let n = 0; while (Math.abs(c.x - 0.6) > 0.02 && n < 600) { updateCart(c, 1 / 60); n++; } return n; };
  assert.ok(frames(kitted) < frames(stock), 'fewer frames to settle into the new lane');
});
