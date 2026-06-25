import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MONEY, BILLS, pickMoney, nextBill, formatMoney } from '../src/money.js';
import { DAMAGE } from '../src/constants.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

test('money heals only a sliver now', () => {
  assert.equal(DAMAGE.repairPerCoin, 1);
});

test('multiple bill denominations drop through mid-distance', () => {
  const rng = mulberry32(7);
  const seen = new Set();
  for (let i = 0; i < 400; i++) seen.add(pickMoney(1500, rng));
  assert.ok(seen.size >= 2, 'more than one bill appears at 1500m');
  for (const v of seen) assert.ok(BILLS.includes(v), `${v} is a valid bill`);
});

test('nextBill bumps exactly one tier and tops out at $5000', () => {
  assert.equal(nextBill(100), 500);
  assert.equal(nextBill(500), 1000);
  assert.equal(nextBill(2000), 5000);
  assert.equal(nextBill(5000), 5000);   // already the top note
});
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { createField, spawn } from '../src/entities.js';
import { createRun, resolveHits } from '../src/run.js';

test('at the start only the $100 bill drops (no smaller money exists)', () => {
  for (let i = 0; i < 50; i++) {
    const v = pickMoney(0, () => i / 50);
    assert.equal(v, 100, `got ${v} at the start`);
  }
});

test('deep runs surface the bigger bills including the rare $5000', () => {
  const seen = new Set();
  for (let i = 0; i < 200; i++) seen.add(pickMoney(3000, () => i / 200));
  assert.ok(seen.has(5000), '$5000 is reachable deep in');
  assert.ok([...seen].every(v => v >= 100), 'no sub-$100 money anywhere');
  assert.ok([...seen].every(v => BILLS.includes(v)), 'all on the strict ladder');
});

test('pickMoney never returns a denomination not yet unlocked at that distance', () => {
  for (const d of [0, 200, 600, 1200, 2000, 3000]) {
    for (let i = 0; i < 40; i++) {
      const v = pickMoney(d, () => i / 40);
      const m = MONEY.find(x => x.value === v);
      assert.ok(d >= m.from && (m.until == null || d < m.until), `${v} invalid at ${d}`);
    }
  }
});

test('collecting money adds its denomination, not a flat 1', () => {
  const cart = createCart(getCharacter('yute'), getVehicle('handcart'));
  cart.x = 0;
  const field = createField();
  const run = createRun();
  const e = spawn(field, 'coin', 1, 0); e.value = 500; e.z = 0;
  resolveHits(run, cart, field);
  assert.equal(run.coins, 500);
  assert.equal(cart.pickupValue, 500);
});

test('formatMoney groups thousands', () => {
  assert.equal(formatMoney(0), '$0');
  assert.equal(formatMoney(5000), '$5,000');
  assert.equal(formatMoney(22000000), '$22,000,000');
});
