// tests/runover-heat.test.js — the run-over ledger + police-heat consequence subplot:
// plow through people and Babylon starts watching yuh (more cops, fatter fines).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCondition } from '../src/wreck.js';
import { POLICE } from '../src/constants.js';

// A plain, debt-capable driver dead-centre in the road.
const mkCart = () => ({
  x: 0, halfWidth: 0.3, condition: createCondition(100), tipsy: 0,
  character: { id: 'tester', toughness: 1, coinDraw: 1 },
  vehicle: { toughness: 1 },
});
// An entity already at the cart plane, dead ahead — a guaranteed contact.
const contact = (type) => ({ active: true, collected: false, z: -0.5, x: 0, halfWidth: 0.3, type });

test('running over a pedestrian counts in the ledger and raises police heat', () => {
  const run = createRun(), cart = mkCart();
  resolveHits(run, cart, { pool: [contact('hustler')] }, {});
  assert.equal(run.runOvers, 1, 'the ledger counts the victim');
  assert.equal(run.heat, 1, 'police heat rises');
  assert.ok(cart.roadkill && cart.roadkill.type === 'hustler', 'the reaction knows WHO was hit');
});

test('heat is capped at POLICE.heatMax but the ledger keeps counting', () => {
  const run = createRun(), cart = mkCart();
  for (let i = 0; i < POLICE.heatMax + 3; i++) {
    resolveHits(run, cart, { pool: [contact('goat')] }, {});
  }
  assert.equal(run.runOvers, POLICE.heatMax + 3, 'every run-over is remembered');
  assert.equal(run.heat, POLICE.heatMax, 'heat stops climbing at the cap');
});

test('police fines grow with heat (di watched driver pays dearly)', () => {
  const clean = createRun(); clean.coins = 100000;
  const hot = createRun(); hot.coins = 100000; hot.heat = 2;
  const cartA = mkCart(), cartB = mkCart();
  resolveHits(clean, cartA, { pool: [contact('police')] }, {});
  resolveHits(hot, cartB, { pool: [contact('police')] }, {});
  assert.equal(cartA.fineAmount, POLICE.fine, 'no heat → the base fine');
  assert.equal(cartB.fineAmount, Math.round(POLICE.fine * (1 + POLICE.heatFinePer * 2)), 'heat inflates the fine');
  assert.ok(hot.coins < clean.coins, 'the hot driver ends up poorer');
});

test('hopping OVER a pedestrian keeps the ledger clean (no contact, no count)', () => {
  const run = createRun(), cart = mkCart();
  cart.jumpT = 0.5;   // airborne off a sleeping policeman
  resolveHits(run, cart, { pool: [contact('hustler')] }, {});
  assert.equal(run.runOvers, 0, 'sailed clear — nobody hit');
  assert.equal(run.heat, 0, 'no heat for a clean hop');
});
