import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCondition, applyDamage, repair, isWrecked, conditionTier } from '../src/wreck.js';

test('createCondition starts full', () => {
  const c = createCondition(100);
  assert.equal(c.value, 100);
  assert.equal(c.max, 100);
});
test('applyDamage reduces value and floors at 0', () => {
  assert.equal(applyDamage(createCondition(100), 12).value, 88);
  assert.equal(applyDamage(createCondition(100), 250).value, 0);
});
test('repair restores value capped at max', () => {
  const hurt = applyDamage(createCondition(100), 50);
  assert.equal(repair(hurt, 30).value, 80);
  assert.equal(repair(hurt, 999).value, 100);
});
test('isWrecked true only at zero', () => {
  assert.equal(isWrecked(createCondition(100)), false);
  assert.equal(isWrecked(applyDamage(createCondition(100), 100)), true);
});
test('conditionTier maps ratio to good/warn/critical', () => {
  assert.equal(conditionTier(createCondition(100)), 'good');
  assert.equal(conditionTier({ value: 45, max: 100 }), 'warn');
  assert.equal(conditionTier({ value: 20, max: 100 }), 'critical');
});
