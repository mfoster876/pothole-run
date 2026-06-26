// tests/throttle.test.js — player throttle (accelerate/brake) + the progressive pace ramp.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, updateCart, paceFor } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { THROTTLE, PACE, CART, SUPERCHARGE } from '../src/constants.js';

// Run a cart at a fixed throttle/distance for ~1.5s and return its settled speed.
function settle(throttle, distance = 0, secs = 1.5) {
  const cart = createCart(getCharacter('yute'));
  cart.throttle = throttle;
  for (let i = 0; i < secs * 60; i++) updateCart(cart, 1 / 60, distance);
  return cart.speed;
}

test('accelerate > coast > brake (throttle orders the speed)', () => {
  const accel = settle(1), coast = settle(0), brake = settle(-1);
  assert.ok(accel > coast, `accel ${accel} > coast ${coast}`);
  assert.ok(coast > brake, `coast ${coast} > brake ${brake}`);
});

test('braking NEVER brings the cart to a full stop', () => {
  const cart = createCart(getCharacter('yute'));
  cart.throttle = -1;
  for (let i = 0; i < 60 * 20; i++) updateCart(cart, 1 / 60, 0);  // brake hard for 20s
  // floored at brakeFloor of capability — comfortably above zero
  assert.ok(cart.speed > 0.3 * CART.maxSpeed * 0.5, `still rolling: ${cart.speed}`);
  assert.ok(cart.speed > 1, 'never zero');
});

test('the run speeds up the deeper you get (pace climbs with distance)', () => {
  assert.equal(paceFor(0), PACE.start, 'starts at the base pace');
  assert.ok(paceFor(1000) > paceFor(0), 'pace climbs with distance');
  assert.equal(paceFor(1e9), PACE.max, 'caps at the ceiling');
  // …and that shows up as faster coasting deep into a run
  const shallow = settle(0, 0), deep = settle(0, 5000);
  assert.ok(deep > shallow * 1.2, `deep ${deep} clearly faster than shallow ${shallow}`);
});

test('the throttle constants are sane (brake floor < cruise < sprint)', () => {
  assert.ok(THROTTLE.brakeFloor < THROTTLE.cruise && THROTTLE.cruise < THROTTLE.sprint);
});

test('a full sprint (Up) clearly outruns the hands-off coast', () => {
  const sprint = settle(1), coast = settle(0);
  assert.ok(sprint > coast * 1.25, `sprint ${sprint} is a clear jump over coast ${coast}`);
});

test('a supercharge override surges speed toward its cap, beating any throttle', () => {
  const cart = createCart(getCharacter('yute'));
  cart.throttle = -1;   // even while the player is BRAKING…
  for (let i = 0; i < 60 * 2; i++) updateCart(cart, 1 / 60, 0, SUPERCHARGE.maxSpeed);
  assert.ok(cart.speed > settle(0), 'water overrides throttle and surges past coast');
  assert.ok(cart.speed > SUPERCHARGE.maxSpeed * 0.9, 'climbs toward the supercharge cap');
});

test('a power-up NEVER throttles a faster cart — it only ever speeds you up', () => {
  // build a deep-run sprint well ABOVE the supercharge cap
  const cart = createCart(getCharacter('yute'));
  cart.throttle = 1;
  for (let i = 0; i < 60 * 3; i++) updateCart(cart, 1 / 60, 9000);
  const sprintSpeed = cart.speed;
  assert.ok(sprintSpeed > SUPERCHARGE.maxSpeed, 'a deep sprint exceeds the supercharge cap');
  // grabbing water here must NOT slow the cart down
  for (let i = 0; i < 60; i++) updateCart(cart, 1 / 60, 9000, SUPERCHARGE.maxSpeed);
  assert.ok(cart.speed >= sprintSpeed * 0.99, `power-up must not brake you: ${cart.speed} vs ${sprintSpeed}`);
});

test('the run starts at a MODERATE pace, then builds with distance', () => {
  assert.ok(PACE.start < 0.8, 'opening pace is held back');
  const early = settle(0, 0), deep = settle(0, 4000);
  assert.ok(deep > early * 1.3, `deep ${deep} clearly outpaces the moderate start ${early}`);
});
