import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { ASPIRATIONS, canBuy, isAchieved, purchaseAspiration } from '../src/aspirations.js';

test('ladder has the 9 priced outs incl. tithes & hotel', () => {
  assert.equal(ASPIRATIONS.length, 9);
  assert.equal(ASPIRATIONS[0].id, 'tithes');
  assert.equal(ASPIRATIONS.find(a => a.id === 'hotel').price, 250000000);
});
test('cannot buy what you cannot afford; can when funded (non-tithes)', () => {
  const s = defaultSave(); s.wallet = 2000000;
  assert.equal(canBuy(s, 'school'), false);       // 3M needed for school
  s.wallet = 4000000;
  assert.equal(canBuy(s, 'school'), true);
});
test('tithes canBuy always false — it is a recurring offering, not a one-time purchase', () => {
  const s = defaultSave();
  s.wallet = 0;
  assert.equal(canBuy(s, 'tithes'), false);       // broke — always false
  s.wallet = 999999999;
  assert.equal(canBuy(s, 'tithes'), false);       // funded — still always false
});
test('purchase spends wallet, marks achieved, is idempotent (non-tithes)', () => {
  const s = defaultSave(); s.wallet = 4000000; s.lifetimeEarned = 9999999;
  assert.equal(purchaseAspiration(s, 'school'), true);
  assert.equal(s.wallet, 1000000);
  assert.equal(isAchieved(s, 'school'), true);
  assert.equal(s.lifetimeEarned, 9999999);        // spending never touches the rank odometer
  assert.equal(purchaseAspiration(s, 'school'), false); // already owned
});
