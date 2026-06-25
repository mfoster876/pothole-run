// tests/politician-economy.test.js — the Politician's ridiculous money + his perks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickPoliticianMoney, POLI_MONEY } from '../src/money.js';
import { ITEMS, applyItem, itemWeightsFor } from '../src/charitems.js';
import { getCharacter } from '../src/characters.js';
import { createCart } from '../src/cart.js';
import { POLITICIAN } from '../src/constants.js';

const mul = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

test('politician money is always one of the ridiculous mega-denominations', () => {
  const allowed = new Set(POLI_MONEY.map(m => m.value));
  const rng = mul(7);
  for (let i = 0; i < 200; i++) {
    const v = pickPoliticianMoney(Math.floor(rng() * 4000), rng);
    assert.ok(allowed.has(v), `${v} is a mega-bill`);
    assert.ok(v >= 20000, 'at least $20,000');
  }
});

test('the biggest notes only appear deep into the run', () => {
  // at distance 0 only the $20k is in the pool
  for (let i = 0; i < 30; i++) assert.equal(pickPoliticianMoney(0, mul(i + 1)), 20000);
});

test('a police bribe is a REAL consequence on his huge economy', () => {
  assert.ok(POLITICIAN.bribe >= 100000, 'the bribe genuinely bites');
});

test('the Politician has his own perks: a cash bribe and a draining vice', () => {
  assert.deepEqual(itemWeightsFor(getCharacter('politician')).map(i => i.type), ['privatebribe', 'ladynight']);

  // private-sector bribe = a windfall
  const cart1 = createCart(getCharacter('politician'));
  const run1 = { coins: 0 };
  applyItem({}, cart1, 'privatebribe', run1);
  assert.equal(run1.coins, ITEMS.privatebribe.cash, 'corruption pays');

  // lady of di night = heal + boost but DRAINS cash (can go into debt)
  const cart2 = createCart(getCharacter('politician'));
  cart2.condition.value = 50;
  const run2 = { coins: 0 };
  const fx = {};
  applyItem(fx, cart2, 'ladynight', run2);
  assert.ok(cart2.condition.value > 50, 'a boost to vitality');
  assert.ok(fx.super > 0, 'a quick energy boost');
  assert.equal(run2.coins, 0, 'it drains his cash to zero — but his reserves never go into the red');
});
