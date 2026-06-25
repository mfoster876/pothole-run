import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { repairCost, applyRepair } from '../src/screens/mechshop.js';

test('repair cost is per missing point above the current condition', () => {
  assert.equal(repairCost(40, 100, 50), (100 - 40) * 50);
});
test('applyRepair spends the wallet and raises saved condition', () => {
  const s = defaultSave(); s.wallet = 100000; s.condition = 40;
  const ok = applyRepair(s, 100, 50);
  assert.equal(ok, true);
  assert.equal(s.condition, 100);
  assert.equal(s.wallet, 100000 - (60 * 50));
});
test('applyRepair refuses when the wallet is short', () => {
  const s = defaultSave(); s.wallet = 100; s.condition = 40;
  assert.equal(applyRepair(s, 100, 50), false);
  assert.equal(s.condition, 40);
});
