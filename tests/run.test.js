import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createField, spawn } from '../src/entities.js';

function setup(charId = 'yute') {
  return { cart: createCart(getCharacter(charId)), field: createField(), run: createRun() };
}

test('rolling over a coin (same lane, at player plane) collects it, banks a coin, repairs a little', () => {
  const { cart, field, run } = setup();
  cart.condition.value = 50;
  const coin = spawn(field, 'coin', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(run.coins, 1);
  assert.ok(cart.condition.value > 50);
  assert.equal(coin.active, false);
});
test('hitting a pothole damages the cart once, not every frame', () => {
  const { cart, field, run } = setup();
  spawn(field, 'pothole', 1, 0);
  resolveHits(run, cart, field);
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 89); // one 11-pt pothole hit, not two
});
test('manhole is an instant wreck', () => {
  const { cart, field, run } = setup();
  spawn(field, 'manhole', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 0);
});
test('entity far ahead is not hit yet', () => {
  const { cart, field, run } = setup();
  spawn(field, 'pothole', 1, 9);
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 100);
});
test('a coin a full lane away is not collected even with the rasta magnet', () => {
  const { cart, field, run } = setup('rasta');
  spawn(field, 'coin', 2, 0); // lane index 2 = x 0.6, cart at x 0
  resolveHits(run, cart, field);
  assert.equal(run.coins, 0);
});
test('fragile conductor takes more pothole damage than tough rasta', () => {
  const c = setup('conductor');
  const r = setup('rasta');
  spawn(c.field, 'pothole', 1, 0); resolveHits(c.run, c.cart, c.field);
  spawn(r.field, 'pothole', 1, 0); resolveHits(r.run, r.cart, r.field);
  assert.ok(c.cart.condition.value < r.cart.condition.value);
});
test('a bus passing in the next lane gusts the cart sideways without damaging it', () => {
  const { cart, field, run } = setup();   // cart in middle lane (x = 0)
  spawn(field, 'bus', 2, 0);              // bus in the right lane (x = 0.6)
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 100); // no contact, no damage
  assert.ok(cart.vx < 0);                  // shoved left, away from the bus
  assert.equal(cart.gusted, true);
});
test('a vehicle in the same lane still collides (damages), no free pass', () => {
  const { cart, field, run } = setup();
  spawn(field, 'bus', 1, 0);             // same lane as cart
  resolveHits(run, cart, field);
  assert.ok(cart.condition.value < 100);
});
