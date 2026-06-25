import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankFor, nextRank, RANKS } from '../src/ranks.js';

test('rankFor maps lifetime earnings to the right tier', () => {
  assert.equal(rankFor(0).id, 'cart-bwoy');
  assert.equal(rankFor(250000).id, 'road-hustler');
  assert.equal(rankFor(999999).id, 'road-hustler');
  assert.equal(rankFor(1000000).id, 'corner-smalls');
  assert.equal(rankFor(5000000).id, 'big-tings');
  assert.equal(rankFor(25000000).id, 'uptown');
  assert.equal(rankFor(100000000).id, 'don-dadda');
});
test('nextRank returns the following tier, null at the top', () => {
  assert.equal(nextRank(0).id, 'road-hustler');
  assert.equal(nextRank(100000000), null);
});
