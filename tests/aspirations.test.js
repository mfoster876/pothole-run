import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { ASPIRATIONS, canBuy, isAchieved, purchaseAspiration } from '../src/aspirations.js';

test('ladder has the 9 priced outs incl. tithes & hotel', () => {
  assert.equal(ASPIRATIONS.length, 9);
  assert.equal(ASPIRATIONS[0].id, 'tithes');
  assert.equal(ASPIRATIONS.find(a => a.id === 'hotel').price, 250000000);
});
test('cannot buy what you cannot afford; can when funded', () => {
  const s = defaultSave(); s.wallet = 1000000;
  assert.equal(canBuy(s, 'tithes'), false);      // 1.5M needed
  s.wallet = 2000000;
  assert.equal(canBuy(s, 'tithes'), true);
});
test('purchase spends wallet, marks achieved, is idempotent', () => {
  const s = defaultSave(); s.wallet = 2000000; s.lifetimeEarned = 9999999;
  assert.equal(purchaseAspiration(s, 'tithes'), true);
  assert.equal(s.wallet, 500000);
  assert.equal(isAchieved(s, 'tithes'), true);
  assert.equal(s.lifetimeEarned, 9999999);        // spending never touches the rank odometer
  assert.equal(purchaseAspiration(s, 'tithes'), false); // already owned
});
