// tests/charitems.test.js — character-specific bleach / wholesome pickups
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, canUseItem, applyItem, itemWeightsFor } from '../src/charitems.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createEffects, effectActive, tickEffects } from '../src/powerups.js';

const conductor = { id: 'conductor' };
const yute      = { id: 'yute' };
const rasta     = { id: 'rasta' };

// ---- eligibility (each item gated to one driver) ----

test('conductor can use bleach items; yute cannot', () => {
  assert.ok(canUseItem(conductor, 'cakesoap'));
  assert.equal(canUseItem(yute, 'cakesoap'), false);
});
test('yute can use wholesome items; conductor cannot', () => {
  assert.ok(canUseItem(yute, 'books'));
  assert.equal(canUseItem(conductor, 'books'), false);
});
test('rasta gets no character items (keeps his drink edge)', () => {
  assert.deepEqual(itemWeightsFor(rasta), []);
  assert.equal(canUseItem(rasta, 'lasco'), false);
});
test('unknown character / item → false', () => {
  assert.equal(canUseItem(null, 'books'), false);
  assert.equal(canUseItem(yute, 'nope'), false);
});

// ---- bleach items: boost THEN backfire ----

test('a bleach item grants a boost (super) and an impairing burn tail', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('conductor'));
  applyItem(fx, cart, 'cakesoap');
  assert.ok(effectActive(fx, 'super'), 'boost is active immediately');
  assert.ok(effectActive(fx, 'burn'), 'burn timer is set');
  assert.ok(cart.tipsy > 0, 'steering impairment magnitude is set');
  // the burn outlasts the boost (it lingers after invincibility ends)
  assert.ok((fx.burn) > (fx.super), 'burn lasts longer than the boost');
});

test('the burn lingers after the boost ends, then clears', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('conductor'));
  applyItem(fx, cart, 'toothpaste');     // boost 1.8 + tail 2.5 = burn 4.3
  // advance past the boost but not the burn
  for (let i = 0; i < 120; i++) tickEffects(fx, 1 / 60);  // 2.0s
  assert.equal(effectActive(fx, 'super'), false, 'boost has ended');
  assert.ok(effectActive(fx, 'burn'), 'burn still lingering (the backfire)');
  // advance well past the burn
  for (let i = 0; i < 200; i++) tickEffects(fx, 1 / 60);  // +3.3s
  assert.equal(effectActive(fx, 'burn'), false, 'burn cleared');
});

// ---- wholesome items: pure benefit ----

test('a Lasco shake heals the cart and gives a brief dash, no burn', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('yute'));
  cart.condition.value = 50;
  applyItem(fx, cart, 'lasco');
  assert.ok(cart.condition.value > 50, 'healed condition');
  assert.ok(effectActive(fx, 'super'), 'brief refreshment dash');
  assert.equal(effectActive(fx, 'burn'), false, 'no downside');
  assert.equal(cart.tipsy, 0, 'no steering impairment');
});

test('books give steadiness + a small heal, no boost', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('yute'));
  cart.condition.value = 60;
  applyItem(fx, cart, 'books');
  assert.ok(effectActive(fx, 'steady'), 'steadier hands');
  assert.ok(cart.condition.value > 60, 'small heal');
  assert.equal(effectActive(fx, 'super'), false);
});

test('heal never overflows max condition', () => {
  const fx = createEffects();
  const cart = createCart(getCharacter('yute'));    // condition 100
  applyItem(fx, cart, 'lasco');
  assert.ok(cart.condition.value <= cart.condition.max);
});

// ---- ITEMS table sanity ----

test('every ITEM is eligible for exactly the character it is gated to', () => {
  for (const [id, it] of Object.entries(ITEMS)) {
    assert.ok(canUseItem({ id: it.char }, id), `${id} usable by ${it.char}`);
  }
});
