// tests/negatives.test.js — the shared negatives / detractors framework
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  NEGATIVES, isNegative, negativesFor, eligibleNegatives, applyNegative, universalNegatives,
} from '../src/negatives.js';
import { NEGATIVE } from '../src/constants.js';
import { createCondition } from '../src/wreck.js';
import { getCharacter } from '../src/characters.js';

const fxCart = (coins = 1000, cond = 100, character = null) => ({
  effects: {},
  cart: { character, condition: createCondition(cond), tipsy: 0, blessing: { resist: 0.4 } },
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
  assert.deepEqual(negativesFor(getCharacter('conductor')).map(n => n.type),
    ['cakesoap', 'blchmix', 'blchtub', 'sunlight']);
});

test('every character-gated negative belongs to exactly one eligible driver', () => {
  const drivers = ['yute', 'rasta', 'politician', 'conductor', 'principal'];
  for (const id of Object.keys(NEGATIVES)) {
    if (NEGATIVES[id].universal) continue;   // universal negatives (unripe ackee) have no owner
    const owners = drivers.filter(d => negativesFor(getCharacter(d)).some(n => n.type === id));
    assert.equal(owners.length, 1, `${id} owned by exactly one driver`);
  }
});

// ---- unripe ackee: the ONE detractor open to every driver ----

test('unripe ackee is a universal negative — never in any single driver’s temptations', () => {
  assert.ok(isNegative('unripeackee'));
  assert.ok(NEGATIVES.unripeackee.universal, 'flagged universal');
  const drivers = ['yute', 'rasta', 'politician', 'conductor', 'principal'];
  for (const d of drivers) {
    assert.ok(!negativesFor(getCharacter(d)).some(n => n.type === 'unripeackee'),
      `unripe ackee is not ${d}'s own temptation`);
  }
});

test('universalNegatives lists the unripe-ackee poison trap (spawns for all drivers)', () => {
  const list = universalNegatives();
  assert.ok(list.some(n => n.type === 'unripeackee'), 'unripe ackee is in the universal pool');
  assert.ok(list.every(n => typeof n.weight === 'number' && n.weight > 0), 'each carries a spawn weight');
});

test('eating unripe ackee poisons: a heavy condition hit + a LONG dizzy steering haze', () => {
  const { effects, cart, run } = fxCart(1000);
  const label = applyNegative(effects, cart, run, 'unripeackee');
  assert.equal(label, 'Unripe Ackee');
  assert.ok(cart.condition.value < 90, 'the sickness weakens the ride (real condition damage)');
  assert.ok(cart.tipsy > 0, 'dizzy, nauseous — the hands go sloppy');
  // Ackee poisoning lingers far longer than an ordinary impairment (weed/molly).
  assert.equal(effects.tipsy, NEGATIVE.poisonSecs, 'the haze runs for the longer poison timer');
  assert.ok(NEGATIVE.poisonSecs > NEGATIVE.impairSecs, 'poison outlasts a normal impairment');
});

// ---- effects ----

test('the sweetheart drains almost all the money (and dents condition)', () => {
  const { effects, cart, run } = fxCart(1000);
  const label = applyNegative(effects, cart, run, 'teensex');
  assert.equal(label, 'Sweetheart', 'child-appropriate label');
  assert.ok(run.coins <= 100, 'drained ~92% — almost all of $1000 gone');
  assert.ok(run.coins >= 50, 'but not literally zero');
  assert.ok(cart.condition.value < 100, 'some condition damage too');
});

test('a PERCENTAGE drain can never push coins negative', () => {
  const { effects, cart, run } = fxCart(0);
  applyNegative(effects, cart, run, 'teensex');   // drainPct — only takes what you have
  assert.equal(run.coins, 0);
});

test("a politician's responsibility CAN plunge him into debt (like everyone else)", () => {
  const { effects, cart, run } = fxCart(1000, 100, getCharacter('politician'));
  applyNegative(effects, cart, run, 'roadfix');   // $500k road repairs
  assert.ok(run.coins < 0, 'a road bill far beyond his cash leaves even the politician in the red');
});

test('a debt-capable driver IS plunged into debt by a flat-cost negative', () => {
  const { effects, cart, run } = fxCart(1000);   // no debt-proof character
  applyNegative(effects, cart, run, 'roadfix');
  assert.ok(run.coins < 0, 'a flat cost beyond his cash leaves an ordinary driver in the red');
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
    const { effects, cart, run } = fxCart(10000, 100, getCharacter('politician'));
    applyNegative(effects, cart, run, id);
    assert.equal(cart.condition.value, 100, `${id} leaves condition untouched`);
    assert.ok(run.coins < 10000, `${id} drains some cash`);
  }
});

test('a percentage drain scales with current earnings (a % of the pot)', () => {
  const big = fxCart(100000); applyNegative(big.effects, big.cart, big.run, 'teensex');
  const small = fxCart(1000);  applyNegative(small.effects, small.cart, small.run, 'teensex');
  const bigLoss = 100000 - big.run.coins, smallLoss = 1000 - small.run.coins;
  assert.ok(bigLoss > smallLoss * 10, 'a richer pot loses far more in absolute terms');
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

// ---- Di Principal — the office's compromises ----

test('the placement bribe PAYS (dirty money lands) but the scandal impairs steering', () => {
  const { effects, cart, run } = fxCart(1000);
  const label = applyNegative(effects, cart, run, 'placementbribe');
  assert.equal(label, 'Placement Bribe');
  assert.ok(run.coins > 1000, 'the brown envelope lands — coins go UP');
  assert.ok((cart.tipsy || 0) > 0, 'scandal follows — sloppy steering');
  assert.ok((effects.tipsy || 0) > 0, 'the impairment runs on a timer');
});

test('a PTA meeting drains a slice of the take and rattles the driver', () => {
  const { effects, cart, run } = fxCart(1000);
  const label = applyNegative(effects, cart, run, 'ptameeting');
  assert.equal(label, 'PTA Meeting');
  assert.ok(run.coins < 1000, 'time is money — some of the take gone');
  assert.ok((cart.tipsy || 0) > 0, 'meeting stress wobbles the hands');
});
