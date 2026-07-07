// tests/charitems.test.js — School-Yute wholesome pickups (bleach items are now
// AVOID-hazards in negatives.js, not pickups).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ITEMS, canUseItem, applyItem, itemWeightsFor } from '../src/charitems.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createEffects, effectActive, tickEffects } from '../src/powerups.js';

const conductor = { id: 'conductor' };
const yute      = { id: 'yute' };
const rasta     = { id: 'rasta' };
const taximan   = { id: 'taximan' };

// ---- eligibility (each item gated to one driver) ----

test('the Conductor has NO pickups now (his bleach items became avoid-hazards)', () => {
  assert.deepEqual(itemWeightsFor(conductor), []);
  assert.equal(canUseItem(conductor, 'cakesoap'), false);
  assert.equal(canUseItem(conductor, 'books'), false);
});
test('yute can use wholesome items', () => {
  assert.ok(canUseItem(yute, 'books'));
});
test('the Lady of di Night is open to the Rasta and the Taxi Man (but not yute items)', () => {
  for (const ch of [rasta, taximan]) {
    assert.deepEqual(itemWeightsFor(ch).map(w => w.type), ['ladynight'], `${ch.id} can call the lady`);
    assert.ok(canUseItem(ch, 'ladynight'), `${ch.id} eligible for ladynight`);
    assert.equal(canUseItem(ch, 'lasco'), false, `${ch.id} keeps no school-yute items`);
    assert.equal(canUseItem(ch, 'privatebribe'), false, `${ch.id} gets no politician bribe`);
  }
});
test('unknown character / item → false', () => {
  assert.equal(canUseItem(null, 'books'), false);
  assert.equal(canUseItem(yute, 'nope'), false);
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

// ---- Di Principal — authority perks ----

test('di Principal school bell steadies her AND clears the road (pickney scatter)', () => {
  const fx = createEffects();
  const cart = { condition: { value: 50, max: 100 }, tipsy: 0 };
  applyItem(fx, cart, 'schoolbell');
  assert.ok(effectActive(fx, 'steady'), 'steadier hands');
  assert.ok((fx.clearRoads || 0) > 0, 'road clears while di pickney scatter');
  assert.ok(cart.condition.value > 50, 'a small heal');
});

test('extra-lessons fees pay fixed side money', () => {
  const fx = createEffects();
  const cart = { condition: { value: 80, max: 100 }, tipsy: 0 };
  const run = { coins: 100 };
  applyItem(fx, cart, 'extralessons', run);
  assert.equal(run.coins, 900, 'the $800 fee lands');
});

test('principal items are gated to the principal only', () => {
  assert.ok(canUseItem(getCharacter('principal'), 'schoolbell'));
  assert.equal(canUseItem(yute, 'schoolbell'), false);
  assert.equal(canUseItem(getCharacter('principal'), 'books'), false);
});
