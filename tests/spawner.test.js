import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnInterval, pickHazard, laneFor } from '../src/spawner.js';

test('spawnInterval shrinks with distance but never below min', () => {
  assert.equal(spawnInterval(0), 100);         // wide gaps at the start
  assert.ok(spawnInterval(10000) >= 20);       // floored, stays survivable
  assert.ok(spawnInterval(800) < spawnInterval(0)); // tightens as you speed up
});
test('pickHazard is deterministic given rng and respects weights', () => {
  const weights = [{ type: 'pothole', weight: 3 }, { type: 'coin', weight: 1 }];
  assert.equal(pickHazard(weights, () => 0.0), 'pothole');
  assert.equal(pickHazard(weights, () => 0.99), 'coin');
});
test('laneFor maps rng to a lane index in range', () => {
  assert.equal(laneFor(() => 0.0, 3), 0);
  assert.equal(laneFor(() => 0.99, 3), 2);
});
