const KEY = 'pothole-run-save:v1';

export function defaultSave() {
  return {
    coins: 0,
    bests: {},
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false }
  };
}
export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const base = defaultSave();
    return {
      ...base, ...parsed,
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) }
    };
  } catch {
    return defaultSave();
  }
}
export function writeSave(state, storage = globalThis.localStorage) {
  storage.setItem(KEY, JSON.stringify(state));
  return state;
}
export function recordBest(state, stageId, score) {
  if (score > (state.bests[stageId] ?? 0)) state.bests[stageId] = score;
  return state;
}
export function addCoins(state, n) {
  state.coins += n;
  return state;
}
