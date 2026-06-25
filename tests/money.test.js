import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MONEY, pickMoney, formatMoney } from '../src/money.js';
import { DAMAGE } from '../src/constants.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

test('money heals only a sliver now', () => {
  assert.equal(DAMAGE.repairPerCoin, 1);
});

test('coins and cash interleave through mid-distance (coins not gone by 1500m)', () => {
  const rng = mulberry32(7);
  let coinHits = 0, cashHits = 0;
  for (let i = 0; i < 400; i++) {
    const v = pickMoney(1500, rng);
    if (v <= 20) coinHits++; else cashHits++;
  }
  assert.ok(coinHits > 0, 'coins still drop at 1500m');
  assert.ok(cashHits > 0, 'cash also drops at 1500m');
});
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { createField, spawn } from '../src/entities.js';
import { createRun, resolveHits } from '../src/run.js';

test('early on you only find small change; big notes are gated behind depth', () => {
  // sweep the rng across [0,1) at distance 0 — nothing above $10 should appear
  for (let i = 0; i < 50; i++) {
    const v = pickMoney(0, () => i / 50);
    assert.ok(v <= 10, `got ${v} at the start`);
  }
});

test('deep runs surface paper money including the rare $5000', () => {
  const seen = new Set();
  for (let i = 0; i < 200; i++) seen.add(pickMoney(3000, () => i / 200));
  assert.ok([...seen].some(v => v >= 100), 'paper money deep in');
  assert.ok(seen.has(5000), '$5000 is reachable deep in');
  assert.ok(![...seen].some(v => v === 1), 'the $1 coin has dried up by then');
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
