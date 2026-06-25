import { test } from 'node:test';
import assert from 'node:assert/strict';
import { laneOverlap } from '../src/collision.js';

test('laneOverlap true when x distance under combined half-widths', () => {
  assert.equal(laneOverlap(0, 0.16, 0.1, 0.16), true);
  assert.equal(laneOverlap(0, 0.16, 0.6, 0.16), false);
});
test('laneOverlap widens with a coin magnet but never reaches a full lane away', () => {
  assert.equal(laneOverlap(0, 0.16, 0.34, 0.16), false);        // base miss at 0.34
  assert.equal(laneOverlap(0, 0.16 * 1.4, 0.34, 0.16), true);   // magnet catches 0.34
  assert.equal(laneOverlap(0, 0.16 * 1.4, 0.6, 0.16), false);   // full lane away still missed
});
