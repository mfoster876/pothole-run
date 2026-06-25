import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HAZARD_TYPES, hazardInfo } from '../src/hazardTypes.js';
import { DAMAGE } from '../src/constants.js';

test('each hazard type declares damage, collectible flag, depth, color', () => {
  for (const key of Object.keys(HAZARD_TYPES)) {
    const h = HAZARD_TYPES[key];
    for (const k of ['damage', 'collectible', 'depth', 'color', 'label']) {
      assert.ok(k in h, `${key} missing ${k}`);
    }
  }
});
test('coin is collectible with zero damage; manhole is an instant wreck', () => {
  assert.equal(hazardInfo('coin').collectible, true);
  assert.equal(hazardInfo('coin').damage, 0);
  assert.equal(hazardInfo('manhole').damage, DAMAGE.manhole);
});
test('unknown type falls back to pothole', () => {
  assert.equal(hazardInfo('nope').label, hazardInfo('pothole').label);
});
