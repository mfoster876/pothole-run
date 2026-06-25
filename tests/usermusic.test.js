// Smoke test for usermusic.js — Node has no IndexedDB, so we only verify
// that the module exports the expected functions. Real DB behaviour is browser-only.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addTracks, listTracks, getPlayableTracks, revoke, clearTracks, count } from '../src/usermusic.js';

test('addTracks is exported as a function', () => {
  assert.equal(typeof addTracks, 'function');
});
test('listTracks is exported as a function', () => {
  assert.equal(typeof listTracks, 'function');
});
test('getPlayableTracks is exported as a function', () => {
  assert.equal(typeof getPlayableTracks, 'function');
});
test('revoke is exported as a function', () => {
  assert.equal(typeof revoke, 'function');
});
test('clearTracks is exported as a function', () => {
  assert.equal(typeof clearTracks, 'function');
});
test('count is exported as a function', () => {
  assert.equal(typeof count, 'function');
});

// Graceful degradation: calling these in Node (no IDB) should resolve, not throw.
test('listTracks resolves to empty array in a no-IDB environment', async () => {
  const result = await listTracks();
  assert.ok(Array.isArray(result));
});
test('getPlayableTracks resolves to empty array in a no-IDB environment', async () => {
  const result = await getPlayableTracks();
  assert.ok(Array.isArray(result));
});
test('count resolves to a number in a no-IDB environment', async () => {
  const result = await count();
  assert.equal(typeof result, 'number');
});
test('clearTracks resolves without throwing in a no-IDB environment', async () => {
  const result = await clearTracks();
  // false (degraded) or true (cleared) — either is valid; must not throw
  assert.ok(result === false || result === true);
});
test('addTracks resolves to an array in a no-IDB environment', async () => {
  const result = await addTracks([]);
  assert.ok(Array.isArray(result));
});
test('revoke does not throw when called with no URLs', () => {
  assert.doesNotThrow(() => revoke([]));
  assert.doesNotThrow(() => revoke(null));
});
