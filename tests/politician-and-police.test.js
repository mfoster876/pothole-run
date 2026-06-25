// tests/politician-and-police.test.js — immunities, police fines, negatives & toasts
// driven through the REAL collision path (resolveHits).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createField, spawn } from '../src/entities.js';
import { POLICE } from '../src/constants.js';

function setup(charId) {
  const cart = createCart(getCharacter(charId));
  return { cart, field: createField(), run: createRun() };
}

// ---- police fine ----

test('an ordinary driver hitting police takes damage AND a cash fine', () => {
  const { cart, field, run } = setup('yute');
  run.coins = 1000;
  spawn(field, 'police', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(run.coins, 1000 - POLICE.fine, 'fine skimmed off the fare');
  assert.ok(cart.condition.value < 100, 'and a knock to the cart');
  assert.equal(cart.fined, true, 'flagged for the HUD toast');
});

test('a police fine cannot push coins below zero', () => {
  const { cart, field, run } = setup('yute');
  run.coins = 100;
  spawn(field, 'police', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(run.coins, 0);
});

// ---- politician immunities ----

test('the Politician is immune to police (no damage, no fine)', () => {
  const { cart, field, run } = setup('politician');
  run.coins = 1000;
  spawn(field, 'police', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(run.coins, 1000, 'no fine');
  assert.equal(cart.condition.value, 100, 'no damage — plows through');
});

test('the Politician shrugs off pedestrians and roadkill', () => {
  for (const type of ['jaywalker', 'hustler', 'goat', 'dog', 'cat', 'cattle']) {
    const { cart, field, run } = setup('politician');
    spawn(field, type, 1, 0);
    resolveHits(run, cart, field);
    assert.equal(cart.condition.value, 100, `${type} leaves the motorcade untouched`);
  }
});

test('the Politician takes only HALF damage from other cars', () => {
  const pol = setup('politician'); spawn(pol.field, 'taxi', 1, 0); resolveHits(pol.run, pol.cart, pol.field);
  const yute = setup('yute');      spawn(yute.field, 'taxi', 1, 0); resolveHits(yute.run, yute.cart, yute.field);
  const polLoss = 100 - pol.cart.condition.value, yuteLoss = 100 - yute.cart.condition.value;
  assert.ok(polLoss > 0, 'still takes some');
  assert.ok(polLoss < yuteLoss, 'but less than an ordinary driver');
});

test('potholes and manholes still wreck the Politician at full force', () => {
  const { cart, field, run } = setup('politician');
  spawn(field, 'manhole', 1, 0);
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 0, 'a manhole is still an instant wreck');
});

// ---- negatives routed through the collision path ----

test('hitting a negative drains money and flags it for the toast', () => {
  const { cart, field, run } = setup('yute');
  run.coins = 1000;
  spawn(field, 'teensex', 1, 0);
  resolveHits(run, cart, field);
  assert.ok(run.coins <= 100, 'teenage sex drains almost all the money');
  assert.equal(cart.hitNegative, 'Teenage Sex', 'named for the HUD toast');
});

// ---- pickup labelling (clear notifications) ----

test('collecting a power-up names the EXACT pick-up (not a vague boost)', () => {
  const { cart, field, run } = setup('yute');
  spawn(field, 'water', 1, 0);
  resolveHits(run, cart, field, {});
  assert.equal(cart.pickupLabel, 'water', 'the specific item is named');
});

// ---- invincibility covers the new threats too ----

test('supercharge makes you immune to police fines and negatives', () => {
  const { cart, field, run } = setup('yute');
  run.coins = 1000;
  spawn(field, 'police', 1, 0);
  spawn(field, 'teensex', 2, 0);
  resolveHits(run, cart, field, { super: 5 });
  assert.equal(run.coins, 1000, 'no fine, no drain while invincible');
  assert.equal(cart.condition.value, 100, 'no damage while invincible');
});
