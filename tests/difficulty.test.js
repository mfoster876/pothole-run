// tests/difficulty.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPAWN, DAMAGE } from '../src/constants.js';
import { spawnInterval } from '../src/spawner.js';

test('spawn interval is tighter than original (difficulty +10%)', () => {
  assert.ok(SPAWN.baseInterval < 125, 'baseInterval tightened from 125');
  assert.ok(spawnInterval(0) < 125);
  // direction-pinning: damage values are harder than the pre-existing eased values
  assert.ok(DAMAGE.pothole > 9,  'pothole harder than the eased 9');
  assert.ok(DAMAGE.traffic > 18, 'traffic harder than the eased 18');
  assert.ok(DAMAGE.animal > 14,  'animal harder than the eased 14');
});
