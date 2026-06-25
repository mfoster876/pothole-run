// tests/economy.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { bankRun, canAfford, spend, MIN_EARN } from '../src/economy.js';

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
