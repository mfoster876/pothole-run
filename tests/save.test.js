import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave, loadSave, writeSave, recordBest, addCoins } from '../src/save.js';

function fakeStorage(seed = null) {
  const m = new Map();
  if (seed !== null) m.set('pothole-run-save:v1', seed);
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

function memStore(initial) {
  const m = new Map(initial ? Object.entries(initial) : []);
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
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

test('defaultSave has v2 economy fields', () => {
  const s = defaultSave();
  assert.equal(s.lifetimeEarned, 0);
  assert.equal(s.wallet, 0);
  assert.equal(s.condition, 100);
  assert.deepEqual(s.bounties, []);
  assert.deepEqual(s.aspirations, { achieved: [] });
});

test('a v1 save migrates without wiping garage/upgrades/bests', () => {
  const v1 = {
    coins: 12000, garage: ['handcart', 'probox'], vehicle: 'probox',
    upgrades: ['weighted-base'], bests: { 'fern-gully': 880 },
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false, genre: 'ska' }
  };
  const store = memStore({ 'pothole-run-save:v1': JSON.stringify(v1) });
  const s = loadSave(store);
  assert.equal(s.wallet, 12000);        // seeded from v1 coins
  assert.equal(s.lifetimeEarned, 12000);
  assert.equal(s.condition, 100);
  assert.deepEqual(s.garage, ['handcart', 'probox']);
  // legacy flat upgrades migrate onto the handcart bucket (per-vehicle model)
  assert.deepEqual(s.upgrades, { handcart: ['weighted-base'] });
  assert.equal(s.bests['fern-gully'], 880);
  assert.equal(s.settings.genre, 'ska');
});

test('corrupt data falls back to defaultSave', () => {
  const store = memStore({ 'pothole-run-save:v2': '{not json' });
  assert.equal(loadSave(store).wallet, 0);
});
