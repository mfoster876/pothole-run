import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave, loadSave, writeSave, recordBest, addCoins } from '../src/save.js';

function fakeStorage(seed = null) {
  const m = new Map();
  if (seed !== null) m.set('pothole-run-save:v1', seed);
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
test('loadSave returns defaults when empty', () => {
  const s = loadSave(fakeStorage());
  assert.equal(s.coins, 0);
  assert.deepEqual(s.unlocks.characters, ['yute', 'rasta']);
  assert.deepEqual(s.unlocks.stages, ['fern-gully']);
});
test('loadSave falls back to defaults on corrupt JSON', () => {
  const s = loadSave(fakeStorage('{not json'));
  assert.equal(s.coins, 0);
});
test('writeSave round-trips through storage', () => {
  const storage = fakeStorage();
  const saved = writeSave({ ...defaultSave(), coins: 42 }, storage);
  assert.equal(saved.coins, 42);
  assert.equal(loadSave(storage).coins, 42);
});
test('recordBest only raises the best', () => {
  const s = defaultSave();
  recordBest(s, 'fern-gully', 500);
  recordBest(s, 'fern-gully', 300);
  assert.equal(s.bests['fern-gully'], 500);
});
test('addCoins accumulates', () => {
  const s = defaultSave();
  addCoins(s, 10); addCoins(s, 5);
  assert.equal(s.coins, 15);
});
