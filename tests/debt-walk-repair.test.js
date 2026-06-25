// tests/debt-walk-repair.test.js — going into debt, walking pedestrians, scaled repairs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bankRun, MIN_EARN } from '../src/economy.js';
import { createField, spawn, advance } from '../src/entities.js';
import { repairCost, repairFactor } from '../src/screens/mechshop.js';
import { defaultSave } from '../src/save.js';

// ---- debt ----

test('a profitable run still floors at MIN_EARN', () => {
  const save = { wallet: 0, lifetimeEarned: 0 };
  bankRun(save, 0);
  assert.equal(save.wallet, MIN_EARN);
  assert.equal(save.lifetimeEarned, MIN_EARN);
});

test('a run in the red drags the WALLET negative (debt); rank never drops', () => {
  const save = { wallet: 1000, lifetimeEarned: 5000 };
  bankRun(save, -4000);                 // fines/repairs blew past earnings
  assert.equal(save.wallet, -3000, 'you owe money');
  assert.equal(save.lifetimeEarned, 5000, 'the career odometer does not decrease');
  assert.ok(save.wallet < 0, 'genuine debt');
});

// ---- walking pedestrians ----

test('a jaywalker actually walks across the road; a pothole stays put', () => {
  const field = createField();
  const jay = spawn(field, 'jaywalker', 1, 300);   // lane 1 == x 0
  const hole = spawn(field, 'pothole', 1, 300);
  const x0 = jay.x, hx0 = hole.x;
  for (let i = 0; i < 60; i++) advance(field, 5, 1 / 60);
  assert.notEqual(jay.x, x0, 'the jaywalker has strolled to a new x');
  assert.equal(hole.x, hx0, 'a crater does not wander');
});

test('a walker turns back at the road edge (stays on the road)', () => {
  const field = createField();
  const v = spawn(field, 'vendor', 0, 1000);   // starts at the left lane
  for (let i = 0; i < 600; i++) advance(field, 1, 1 / 60);
  assert.ok(Math.abs(v.x) <= 0.71, 'never wanders off the road');
});

// ---- repairs proportional to the ride ----

test('repairs cost proportionally more on a pricier ride', () => {
  const cheap = repairCost(50, 100, 'handcart');
  const dear  = repairCost(50, 100, 'porsche');
  assert.ok(dear > cheap * 3, `a Porsche repair (${dear}) dwarfs a handcart's (${cheap})`);
  assert.equal(repairFactor('handcart'), 1, 'the free cart is the baseline');
  assert.ok(repairFactor('cybertruck') > repairFactor('swift'), 'pricier ride, dearer upkeep');
});

test('repairCost is zero when nothing to fix', () => {
  assert.equal(repairCost(100, 100, 'porsche'), 0);
});
