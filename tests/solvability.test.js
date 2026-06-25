// tests/solvability.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachabilityFloorZ } from '../src/solvability.js';
import { spawnInterval } from '../src/spawner.js';
import { CART } from '../src/constants.js';

test('reachability floor grows with speed (need more spacing when faster)', () => {
  assert.ok(reachabilityFloorZ(CART.maxSpeed) > reachabilityFloorZ(CART.startSpeed));
});
test('spawn interval never drops below the reachability floor at max speed', () => {
  const floor = reachabilityFloorZ(CART.maxSpeed);
  for (let d = 0; d <= 100000; d += 500) {
    assert.ok(spawnInterval(d, undefined, undefined, CART.maxSpeed) >= floor,
      `interval at ${d}m fell below reachability`);
  }
});
