// tests/politician-economy.test.js — the Politician's ridiculous money + his perks.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickPoliticianMoney, POLI_MONEY } from '../src/money.js';
import { ITEMS, applyItem, itemWeightsFor, pickBribe } from '../src/charitems.js';
import { eligibleDrinks, drinkWeightsFor, applyDrink, DRINKS } from '../src/drinks.js';
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

  // private-sector bribe = a VARIABLE windfall, $50k–$5M (rolled on pickup)
  const cart1 = createCart(getCharacter('politician'));
  const run1 = { coins: 0 };
  applyItem({}, cart1, 'privatebribe', run1);
  assert.ok(run1.coins >= ITEMS.privatebribe.cashMin, 'pays at least the floor ($50k)');
  assert.ok(run1.coins <= ITEMS.privatebribe.cashMax, 'never above the ceiling ($5M)');

  // lady of di night = heal + boost but DRAINS cash (can go into debt)
  const cart2 = createCart(getCharacter('politician'));
  cart2.condition.value = 50;
  const run2 = { coins: 0 };
  const fx = {};
  applyItem(fx, cart2, 'ladynight', run2);
  assert.ok(cart2.condition.value > 50, 'a boost to vitality');
  assert.ok(fx.super > 0, 'a quick energy boost');
  assert.equal(run2.coins, -ITEMS.ladynight.cashDrain, 'but it drains his money — into the red');
});

test('the bribe is a $50k–$5M backhander, rounded to a tidy step', () => {
  const it = ITEMS.privatebribe;
  assert.equal(pickBribe(it, () => 0), it.cashMin, 'low roll = the $50k floor');
  assert.equal(pickBribe(it, () => 0.999999), it.cashMax, 'high roll = the $5M ceiling');
  for (let i = 0; i < 200; i++) {
    const v = pickBribe(it, () => i / 200);
    assert.ok(v >= it.cashMin && v <= it.cashMax, `${v} stays in band`);
    assert.equal(v % 50000, 0, 'rounded to a clean $50k step');
  }
});

test('the Politician drinks top-shelf only — Henny, Rosé, White Wine, Champagne', () => {
  const pol = getCharacter('politician');
  assert.deepEqual(eligibleDrinks(pol).map(d => d.id), ['henny', 'rose', 'whitewine', 'champagne']);
  assert.ok(drinkWeightsFor(pol).length === 4, 'all four spawn for him');
  // no sodas / juice for di politician
  for (const cheap of ['ting', 'boom']) assert.ok(!eligibleDrinks(pol).some(d => d.id === cheap), `${cheap} is beneath him`);
  // Henny is a strong spirit — a big boost AND leaves him tipsy
  const cart = createCart(pol); const fx = {};
  const dur = applyDrink(fx, cart, 'henny');
  assert.ok(dur > 0 && fx.super > 0, 'a real boost');
  assert.ok(cart.tipsy > 0 && fx.tipsy > 0, 'but the cognac leaves him tipsy');
  assert.ok(DRINKS.henny.alcohol > DRINKS.whitewine.alcohol, 'Henny is stronger than the wine');
});
