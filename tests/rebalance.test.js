// tests/rebalance.test.js — the driver-as-difficulty/reward dial.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS, getCharacter } from '../src/characters.js';
import { biasBill, BILLS } from '../src/money.js';

test('biasBill bumps a note up the strict ladder, staying on it', () => {
  assert.equal(biasBill(100, 0), 100, 'no bias = unchanged');
  assert.equal(biasBill(100, 1), 500, 'one rung up');
  assert.equal(biasBill(100, 2), 1000, 'two rungs up the ladder');
  assert.equal(biasBill(500, 2), 2000, '500 → 1000 → 2000');
  assert.equal(biasBill(2000, 5), 5000, 'tops out at $5000');
  for (const b of BILLS) assert.ok(BILLS.includes(biasBill(b, 3)), 'always a strict bill');
});

test('reckless drivers reach a higher reward ceiling but find cash far less often', () => {
  const yute = getCharacter('yute'), rasta = getCharacter('rasta'), cond = getCharacter('conductor');
  // smooth Rasta: cash flows easily, lower ceiling
  assert.ok(rasta.cashFind > yute.cashFind, 'rasta finds money more often');
  assert.equal(rasta.scoreMult, 1.0, 'but a modest reward ceiling');
  // reckless Conductor: rare, fat, hard-to-grab notes, high ceiling
  assert.ok(cond.cashFind < yute.cashFind, 'conductor finds money rarely');
  assert.ok(cond.billBias >= 1, 'when it appears it is a fatter note');
  assert.ok(cond.coinDraw < yute.coinDraw, 'and harder to physically scoop');
  assert.ok(cond.scoreMult > yute.scoreMult, 'rewarded with a higher ceiling');
});

test('every driver carries the full dial (no undefined knobs)', () => {
  for (const c of CHARACTERS) {
    assert.equal(typeof c.cashFind, 'number', `${c.id} cashFind`);
    assert.equal(typeof c.billBias, 'number', `${c.id} billBias`);
    assert.equal(typeof c.coinDraw, 'number', `${c.id} coinDraw`);
    assert.equal(typeof c.scoreMult, 'number', `${c.id} scoreMult`);
  }
});

test('the Politician shrugs off people/roadkill but his ride takes full damage', () => {
  const pol = getCharacter('politician');
  assert.deepEqual(pol.immune, ['pedestrian', 'animal'], 'immune to people & roadkill, NOT police');
  assert.equal(pol.damageScale, undefined, 'no more half-damage break — his ride gets battered');
  assert.deepEqual(pol.fullDamageCats, ['road'], 'potholes/manholes still devastating');
  for (const id of ['yute', 'rasta', 'conductor', 'taximan']) {
    assert.equal(getCharacter(id).immune, undefined, `${id} has no immunities`);
  }
});
