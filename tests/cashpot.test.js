import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { OUTCOMES, STAKE, expectedValue, playCashPot } from '../src/cashpot.js';

test('outcome probabilities sum to ~1', () => {
  const p = OUTCOMES.reduce((s, o) => s + o.p, 0);
  assert.ok(Math.abs(p - 1) < 1e-6);
});
test('the house keeps an edge (EV per stake < 1)', () => {
  assert.ok(expectedValue() < 1, 'EV must favour the house');
});
test('playing spends the stake; a win credits the wallet', () => {
  const s = defaultSave(); s.wallet = 1000;
  const r = playCashPot(s, () => 0); // rng=0 -> first outcome
  assert.equal(r.ok, true);
  // wallet = 1000 - STAKE + STAKE*firstMult
  assert.equal(s.wallet, 1000 - STAKE + STAKE * OUTCOMES[0].mult);
});
test('cannot play when broke', () => {
  const s = defaultSave(); s.wallet = 50;
  assert.equal(playCashPot(s, () => 0).ok, false);
  assert.equal(s.wallet, 50);
});
