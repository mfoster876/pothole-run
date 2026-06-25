// tests/economy.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { bankRun, canAfford, spend, chargeRun, MIN_EARN } from '../src/economy.js';

test('bankRun credits both counters by the run take', () => {
  const s = defaultSave();
  const earned = bankRun(s, 4000);
  assert.equal(earned, 4000);
  assert.equal(s.wallet, 4000);
  assert.equal(s.lifetimeEarned, 4000);
});

test('a wrecked run still banks at least MIN_EARN', () => {
  const s = defaultSave();
  bankRun(s, 0);
  assert.equal(s.wallet, MIN_EARN);
  assert.equal(s.lifetimeEarned, MIN_EARN);
});

test('chargeRun lets an ordinary driver go into the red (debt)', () => {
  const run = { coins: 100 };
  const cart = { character: { id: 'conductor' } };   // not debt-proof
  assert.equal(chargeRun(run, cart, 5000), -4900);
  assert.equal(run.coins, -4900, 'genuine mid-run debt');
});

test('chargeRun floors a debt-proof driver at zero (never red)', () => {
  for (const id of ['politician', 'yute']) {
    const run = { coins: 100 };
    const cart = { character: { id, debtProof: true } };
    assert.equal(chargeRun(run, cart, 500000), 0, `${id} floors at zero`);
    assert.equal(run.coins, 0);
  }
});

test('chargeRun still subtracts normally when the charge fits', () => {
  const run = { coins: 10000 };
  const cart = { character: { debtProof: true } };
  chargeRun(run, cart, 3000);
  assert.equal(run.coins, 7000, 'a charge within reach is just subtracted');
});

test('spend draws only the wallet; lifetimeEarned never drops', () => {
  const s = defaultSave();
  bankRun(s, 10000);
  assert.equal(spend(s, 3000), true);
  assert.equal(s.wallet, 7000);
  assert.equal(s.lifetimeEarned, 10000);
  assert.equal(canAfford(s, 8000), false);
  assert.equal(spend(s, 8000), false);
  assert.equal(s.wallet, 7000);
});
