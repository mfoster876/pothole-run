// tests/drinks.test.js — TDD for the drinks power-up system
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DRINKS, canDrink, applyDrink, drinkWeightsFor } from '../src/drinks.js';
import { DRINK } from '../src/constants.js';

// Character stubs — match real character ids
const yute      = { id: 'yute' };
const conductor = { id: 'conductor' };
const rasta     = { id: 'rasta' };
const nobody    = { id: 'unknown' };

// ---- Eligibility ----

test('yute can drink ting', () => {
  assert.ok(canDrink(yute, 'ting'));
});
test('yute can drink boom', () => {
  assert.ok(canDrink(yute, 'boom'));
});
test('yute CANNOT drink redstripe', () => {
  assert.equal(canDrink(yute, 'redstripe'), false);
});
test('yute CANNOT drink whiterum', () => {
  assert.equal(canDrink(yute, 'whiterum'), false);
});
test('yute CANNOT drink spirulina', () => {
  assert.equal(canDrink(yute, 'spirulina'), false);
});
test('yute CANNOT drink rootstonic', () => {
  assert.equal(canDrink(yute, 'rootstonic'), false);
});

test('conductor can drink whiterum', () => {
  assert.ok(canDrink(conductor, 'whiterum'));
});
test('conductor can drink redstripe', () => {
  assert.ok(canDrink(conductor, 'redstripe'));
});
test('conductor CANNOT drink spirulina', () => {
  assert.equal(canDrink(conductor, 'spirulina'), false);
});
test('conductor CANNOT drink rootstonic', () => {
  assert.equal(canDrink(conductor, 'rootstonic'), false);
});

test('rasta can drink spirulina', () => {
  assert.ok(canDrink(rasta, 'spirulina'));
});
test('rasta can drink rootstonic', () => {
  assert.ok(canDrink(rasta, 'rootstonic'));
});
test('rasta can drink whiterum', () => {
  assert.ok(canDrink(rasta, 'whiterum'));
});
test('rasta can drink all four adult drinks plus health drinks', () => {
  for (const id of ['ting', 'boom', 'redstripe', 'whiterum', 'spirulina', 'rootstonic']) {
    assert.ok(canDrink(rasta, id), `rasta should be able to drink ${id}`);
  }
});

test('unknown character returns false for any drink', () => {
  assert.equal(canDrink(nobody, 'ting'), false);
  assert.equal(canDrink(nobody, 'whiterum'), false);
});
test('null character returns false', () => {
  assert.equal(canDrink(null, 'ting'), false);
});
test('unknown drink id returns false', () => {
  assert.equal(canDrink(rasta, 'kool-aid'), false);
});

// ---- applyDrink — non-alcoholic (boom) ----

test('applyDrink boom sets effects.super > 0', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'boom');
  assert.ok(fx.super > 0, 'effects.super should be positive');
});
test('applyDrink boom sets effects.superMax === effects.super', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'boom');
  assert.equal(fx.superMax, fx.super);
});
test('applyDrink boom does NOT set effects.tipsy', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'boom');
  assert.equal(fx.tipsy, undefined);
});
test('applyDrink boom sets cart.tipsy === 0', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'boom');
  assert.equal(cart.tipsy, 0);
});

// ---- applyDrink — ting (also zero alcohol) ----

test('applyDrink ting sets no tipsy on cart', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'ting');
  assert.equal(cart.tipsy, 0);
  assert.equal(fx.tipsy, undefined);
});

// ---- applyDrink — alcoholic (whiterum) ----

test('applyDrink whiterum sets effects.super > 0', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'whiterum');
  assert.ok(fx.super > 0);
});
test('applyDrink whiterum sets effects.tipsy > effects.super (lingers past boost)', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'whiterum');
  assert.ok(fx.tipsy > fx.super, `tipsy (${fx.tipsy}) should outlast boost (${fx.super})`);
});
test('applyDrink whiterum sets effects.tipsy = boostDur + DRINK.tipsyExtra', () => {
  const fx = {}, cart = {};
  const boostDur = applyDrink(fx, cart, 'whiterum');
  assert.equal(fx.tipsy, boostDur + DRINK.tipsyExtra);
});
test('applyDrink whiterum sets cart.tipsy === 0.85 (alcohol magnitude)', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'whiterum');
  assert.equal(cart.tipsy, 0.85);
});
test('applyDrink whiterum superMax equals super', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'whiterum');
  assert.equal(fx.superMax, fx.super);
});

// ---- applyDrink — rootstonic (low alcohol) ----

test('applyDrink rootstonic sets cart.tipsy === 0.10', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'rootstonic');
  assert.equal(cart.tipsy, 0.10);
});
test('applyDrink rootstonic sets effects.tipsy', () => {
  const fx = {}, cart = {};
  applyDrink(fx, cart, 'rootstonic');
  assert.ok(fx.tipsy > 0);
});

// ---- applyDrink — return value ----

test('applyDrink returns boostDur', () => {
  const fx = {}, cart = {};
  const result = applyDrink(fx, cart, 'boom');
  const expected = DRINK.baseDur * (0.5 + DRINKS.boom.potency);
  assert.equal(result, expected);
});
test('applyDrink returns 0 for unknown drink id', () => {
  const fx = {}, cart = {};
  const result = applyDrink(fx, cart, 'nope');
  assert.equal(result, 0);
});

// ---- Potency ordering ----

test('whiterum boostDur > ting boostDur (higher potency = longer boost)', () => {
  const fxW = {}, fxT = {}, cart = {};
  const durW = applyDrink(fxW, cart, 'whiterum');
  const durT = applyDrink(fxT, cart, 'ting');
  assert.ok(durW > durT, `whiterum dur (${durW}) should exceed ting dur (${durT})`);
});
test('boom boostDur > ting boostDur', () => {
  const fxB = {}, fxT = {}, cart = {};
  const durB = applyDrink(fxB, cart, 'boom');
  const durT = applyDrink(fxT, cart, 'ting');
  assert.ok(durB > durT);
});

// ---- drinkWeightsFor ----

test('drinkWeightsFor yute returns only ting and boom', () => {
  const weights = drinkWeightsFor(yute);
  const types = weights.map(w => w.type);
  assert.deepEqual(types.sort(), ['boom', 'ting'].sort());
});
test('drinkWeightsFor yute entries have a weight property', () => {
  const weights = drinkWeightsFor(yute);
  for (const w of weights) {
    assert.ok(typeof w.weight === 'number' && w.weight > 0, `${w.type} weight should be positive`);
  }
});
test('drinkWeightsFor rasta includes spirulina', () => {
  const weights = drinkWeightsFor(rasta);
  const types = weights.map(w => w.type);
  assert.ok(types.includes('spirulina'), 'rasta should get spirulina in weights');
});
test('drinkWeightsFor rasta includes rootstonic', () => {
  const weights = drinkWeightsFor(rasta);
  const types = weights.map(w => w.type);
  assert.ok(types.includes('rootstonic'));
});
test('drinkWeightsFor rasta includes all 6 drinks', () => {
  const weights = drinkWeightsFor(rasta);
  const types = weights.map(w => w.type).sort();
  assert.deepEqual(types, ['boom', 'redstripe', 'rootstonic', 'spirulina', 'ting', 'whiterum'].sort());
});
test('drinkWeightsFor conductor excludes spirulina and rootstonic', () => {
  const weights = drinkWeightsFor(conductor);
  const types = weights.map(w => w.type);
  assert.equal(types.includes('spirulina'), false);
  assert.equal(types.includes('rootstonic'), false);
});
test('drinkWeightsFor conductor includes redstripe and whiterum', () => {
  const weights = drinkWeightsFor(conductor);
  const types = weights.map(w => w.type);
  assert.ok(types.includes('redstripe'));
  assert.ok(types.includes('whiterum'));
});
test('drinkWeightsFor unknown character returns empty array', () => {
  assert.deepEqual(drinkWeightsFor(nobody), []);
});
test('drinkWeightsFor null returns empty array', () => {
  assert.deepEqual(drinkWeightsFor(null), []);
});
