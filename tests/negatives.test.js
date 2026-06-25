// tests/negatives.test.js — the shared negatives / detractors framework
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  NEGATIVES, isNegative, negativesFor, eligibleNegatives, applyNegative,
} from '../src/negatives.js';
import { createCondition } from '../src/wreck.js';
import { getCharacter } from '../src/characters.js';

const fxCart = (coins = 1000, cond = 100) => ({
  effects: {},
  cart: { condition: createCondition(cond), tipsy: 0, blessing: { resist: 0.4 } },
  run: { coins },
});

// ---- catalogue & eligibility ----

test('isNegative recognises framework ids, rejects others', () => {
  assert.ok(isNegative('teensex'));
  assert.ok(isNegative('roadfix'));
  assert.equal(isNegative('water'), false);
  assert.equal(isNegative('pothole'), false);
});

test('eligibility is gated to the right driver', () => {
  assert.deepEqual(negativesFor(getCharacter('yute')).map(n => n.type),
    ['bleaching', 'tightpants', 'weed', 'molly', 'teensex']);
  assert.deepEqual(negativesFor(getCharacter('rasta')).map(n => n.type),
    ['obeah', 'pork', 'jw']);
  assert.deepEqual(negativesFor(getCharacter('politician')).map(n => n.type),
    ['roadfix', 'constituent', 'lightpole', 'hustlerlunch', 'voter', 'contractor']);
  assert.deepEqual(negativesFor(getCharacter('conductor')).map(n => n.type), []);
});

test('every negative belongs to exactly one eligible driver', () => {
  const drivers = ['yute', 'rasta', 'politician'];
  for (const id of Object.keys(NEGATIVES)) {
    const owners = drivers.filter(d => negativesFor(getCharacter(d)).some(n => n.type === id));
    assert.equal(owners.length, 1, `${id} owned by exactly one driver`);
  }
});

// ---- effects ----

test('teenage sex drains almost all the money (and dents condition)', () => {
  const { effects, cart, run } = fxCart(1000);
  const label = applyNegative(effects, cart, run, 'teensex');
  assert.equal(label, 'Teenage Sex');
  assert.ok(run.coins <= 100, 'drained ~92% — almost all of $1000 gone');
  assert.ok(run.coins >= 50, 'but not literally zero');
  assert.ok(cart.condition.value < 100, 'some condition damage too');
});

test('a money drain can never push coins negative', () => {
  const { effects, cart, run } = fxCart(0);
  applyNegative(effects, cart, run, 'contractor');
  assert.equal(run.coins, 0);
});

test('an impairing negative makes the steering sloppy for a while', () => {
  const { effects, cart, run } = fxCart(1000);
  applyNegative(effects, cart, run, 'weed');
  assert.ok(cart.tipsy > 0, 'cart goes tipsy/sloppy');
  assert.ok(effects.tipsy > 0, 'impairment runs on a timer');
});

test('pork costs the Rasta his blessing resilience', () => {
  const { effects, cart, run } = fxCart(1000);
  applyNegative(effects, cart, run, 'pork');
  assert.equal(cart.blessing.resist, 0, 'blessing resilience wiped');
  assert.ok(cart.condition.value < 100, 'and a condition hit');
});

test("the politician's responsibilities only drain money (no condition damage)", () => {
  for (const id of negativesFor(getCharacter('politician')).map(n => n.type)) {
    const { effects, cart, run } = fxCart(10000);
    applyNegative(effects, cart, run, id);
    assert.equal(cart.condition.value, 100, `${id} leaves condition untouched`);
    assert.ok(run.coins < 10000, `${id} drains some cash`);
  }
});

test('drain is proportional to current earnings (a % of the pot)', () => {
  const big = fxCart(100000); applyNegative(big.effects, big.cart, big.run, 'contractor');
  const small = fxCart(1000);  applyNegative(small.effects, small.cart, small.run, 'contractor');
  const bigLoss = 100000 - big.run.coins, smallLoss = 1000 - small.run.coins;
  assert.ok(bigLoss > smallLoss * 10, 'richer politician loses far more in absolute terms');
});

test('eligibleNegatives feeds the legend with id + label pairs', () => {
  const list = eligibleNegatives(getCharacter('rasta'));
  assert.deepEqual(list.map(n => n.id), ['obeah', 'pork', 'jw']);
  assert.ok(list.every(n => typeof n.label === 'string' && n.label.length));
});

test('applyNegative on an unknown id is a harmless no-op', () => {
  const { effects, cart, run } = fxCart(1000);
  assert.equal(applyNegative(effects, cart, run, 'nope'), null);
  assert.equal(run.coins, 1000);
  assert.equal(cart.condition.value, 100);
});
