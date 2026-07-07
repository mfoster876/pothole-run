import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FOODS, foodFor, foodWeightsFor, applyFood, eligibleFoods } from '../src/foods.js';
import { CART } from '../src/constants.js';

test('ackee is ital / no meat and heals + steadies', () => {
  const fx = {}; const cart = { condition: { value: 50, max: 100 }, blessing: null };
  applyFood(fx, cart, 'ackee', null, { id: 'yute' });
  assert.ok(cart.condition.value > 50, 'ackee heals');
  assert.ok(fx.steady > 0, 'ackee steadies the hands');
  assert.equal(fx.super, undefined, 'ackee is not a dash');
});

test('beef patty dashes, heals and pays pocket change for non-Rasta', () => {
  const fx = {}; const cart = { condition: { value: 40, max: 100 }, blessing: null }; const run = { coins: 0 };
  applyFood(fx, cart, 'patty', run, { id: 'conductor' });
  assert.ok(fx.super > 0, 'patty is a dash');
  assert.ok(cart.condition.value > 40, 'patty heals');
  assert.equal(run.coins, 200, 'patty pays a little cash');
});

test('Rasta is served the ITAL veggie patty, never beef', () => {
  assert.equal(foodFor({ id: 'rasta' }, 'patty'), 'veggiepatty');
  assert.equal(foodFor({ id: 'yute' }, 'patty'), 'patty');
  assert.equal(FOODS.veggiepatty.ital, true);
  // spawn pool for the Rasta contains veggiepatty and NOT beef patty
  const w = foodWeightsFor({ id: 'rasta' });
  const types = w.map(x => x.type);
  assert.ok(types.includes('veggiepatty'));
  assert.ok(!types.includes('patty'));
});

test('applyFood on beef "patty" id for a Rasta still resolves to ital veggie effect', () => {
  const fx = {}; const cart = { condition: { value: 40, max: 100 }, blessing: null }; const run = { coins: 0 };
  applyFood(fx, cart, 'patty', run, { id: 'rasta' });
  // same beneficial numbers, but via the veggie variant
  assert.ok(fx.super > 0 && cart.condition.value > 40 && run.coins === 200);
});

test('blessing lengthens the patty dash', () => {
  const base = {}; const c1 = { condition: { value: 40, max: 100 }, blessing: null };
  applyFood(base, c1, 'patty', { coins: 0 }, { id: 'yute' });
  const blessed = {}; const c2 = { condition: { value: 40, max: 100 }, blessing: { invincExtend: 0.5 } };
  applyFood(blessed, c2, 'patty', { coins: 0 }, { id: 'yute' });
  assert.ok(blessed.super > base.super, 'blessed dash lasts longer');
});

test('eligibleFoods lists Ackee + the correct patty per driver + the fruits', () => {
  assert.deepEqual(eligibleFoods({ id: 'yute' }).map(f => f.id), ['ackee', 'patty', 'plantain', 'breadfruit']);
  assert.deepEqual(eligibleFoods({ id: 'rasta' }).map(f => f.id), ['ackee', 'veggiepatty', 'plantain', 'breadfruit']);
});

test('ripe plantain is quick energy: a modest heal + a short dash', () => {
  const fx = {}; const cart = { condition: { value: 50, max: 100 }, blessing: null };
  applyFood(fx, cart, 'plantain', null, { id: 'yute' });
  assert.ok(cart.condition.value > 50, 'plantain heals a little');
  assert.ok(fx.super > 0, 'plantain gives a short dash');
});

test('roast breadfruit is the filling staple: biggest food heal + steady hands', () => {
  const fx = {}; const cart = { condition: { value: 30, max: 100 }, blessing: null };
  applyFood(fx, cart, 'breadfruit', null, { id: 'rasta' });
  assert.equal(cart.condition.value, 30 + CART.maxCondition * FOODS.breadfruit.heal / 100, 'the big heal lands');
  assert.ok(fx.steady > 0, 'and it steadies the hands');
  assert.ok(FOODS.breadfruit.heal > FOODS.ackee.heal && FOODS.breadfruit.heal > FOODS.patty.heal, 'the biggest food heal');
});

test('breadfruit spawns only on rural stages; plantain everywhere', () => {
  const town = foodWeightsFor({ id: 'yute' }, { rural: false }).map(w => w.type);
  const country = foodWeightsFor({ id: 'yute' }, { rural: true }).map(w => w.type);
  assert.ok(town.includes('plantain') && country.includes('plantain'), 'plantain island-wide');
  assert.ok(!town.includes('breadfruit'), 'no breadfruit in town');
  assert.ok(country.includes('breadfruit'), 'breadfruit pon di country road');
});
