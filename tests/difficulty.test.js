// tests/difficulty.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPAWN, DAMAGE } from '../src/constants.js';
import { spawnInterval } from '../src/spawner.js';

test('the early game is less cluttered than before (wider gaps at 0m)', () => {
  assert.ok(SPAWN.baseInterval >= 120, 'base interval widened from 100');
  assert.ok(spawnInterval(0) >= 120);
});
test('each hit is ~20% softer', () => {
  assert.ok(DAMAGE.pothole <= 9);   // was 11
  assert.ok(DAMAGE.traffic <= 19);  // was 23
  assert.ok(DAMAGE.animal <= 15);   // was 18
});
