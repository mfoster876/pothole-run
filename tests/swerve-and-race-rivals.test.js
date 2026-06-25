// tests/swerve-and-race-rivals.test.js — reckless coaster swerve + race rival shape.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createField, spawn, advance } from '../src/entities.js';
import { SWERVE } from '../src/constants.js';
import { makeRivals, tierById } from '../src/races.js';

const mul = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

test('a coaster weaves across the lanes as it approaches; a taxi holds its lane', () => {
  const field = createField();
  const coaster = spawn(field, 'coaster', 1, 200);
  const taxi = spawn(field, 'taxi', 1, 200);
  const taxiX0 = taxi.x;
  const xs = [];
  for (let i = 0; i < 120; i++) { advance(field, 5, 1 / 60); xs.push(coaster.x); }
  const min = Math.min(...xs), max = Math.max(...xs);
  assert.ok(max - min > 0.4, `coaster sweeps across the road (range ${(max - min).toFixed(2)})`);
  assert.ok(max <= SWERVE.amp + 1e-9 && min >= -SWERVE.amp - 1e-9, 'stays within the sweep amplitude');
  assert.equal(taxi.x, taxiX0, 'a normal taxi does not swerve');
});

test('race rivals each carry a distinct lane + visible vehicle sprite', () => {
  const rivals = makeRivals(tierById('corner'), mul(3));
  assert.equal(rivals.length, 3);
  assert.deepEqual(rivals.map(r => r.lane), [0, 1, 2], 'one per lane');
  for (const r of rivals) {
    assert.ok(['bus', 'taxi', 'coaster'].includes(r.sprite), 'a drawable vehicle sprite');
    assert.equal(typeof r.seed, 'number');
  }
});
