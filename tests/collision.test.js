import { test } from 'node:test';
import assert from 'node:assert/strict';
import { laneOverlap, inHitZone, isHit } from '../src/collision.js';

test('laneOverlap true when x distance under combined half-widths', () => {
  assert.equal(laneOverlap(0, 0.16, 0.1, 0.16), true);
  assert.equal(laneOverlap(0, 0.16, 0.6, 0.16), false);
});
test('inHitZone true only while entity straddles the player plane', () => {
  assert.equal(inHitZone(5, 3), false);
  assert.equal(inHitZone(0, 3), true);
  assert.equal(inHitZone(-2, 3), true);
  assert.equal(inHitZone(-4, 3), false);
});
test('isHit requires both lane overlap and hit zone', () => {
  const player = { x: 0, halfWidth: 0.16 };
  assert.equal(isHit(player, { x: 0, z: 0, depth: 3, halfWidth: 0.16 }), true);
  assert.equal(isHit(player, { x: 0.6, z: 0, depth: 3, halfWidth: 0.16 }), false);
  assert.equal(isHit(player, { x: 0, z: 9, depth: 3, halfWidth: 0.16 }), false);
});
