const KEY = 'pothole-run-save:v1';

export const GENRES = ['reggae', 'ska', 'dancehall', 'hiphop'];

export function defaultSave() {
  return {
    coins: 0,
    bests: {},
    // vehicle: which rides you own and which is selected; handcart is the free icon.
    garage: ['handcart'],
    vehicle: 'handcart',
    seenCarTip: false,            // has the windscreen-youth pop-up been shown?
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false, genre: 'reggae' }
  };
}
export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const base = defaultSave();
    const save = {
      ...base, ...parsed,
      garage: Array.isArray(parsed.garage) && parsed.garage.length ? parsed.garage : base.garage,
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) }
    };
    if (!save.garage.includes(save.vehicle)) save.vehicle = save.garage[0];
    if (!GENRES.includes(save.settings.genre)) save.settings.genre = 'reggae';
    return save;
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
// Buy a vehicle if affordable and not already owned. Returns true on a purchase.
export function buyVehicle(state, vehicle) {
  if (state.garage.includes(vehicle.id)) return false;
  if (state.coins < vehicle.price) return false;
  state.coins -= vehicle.price;
  state.garage.push(vehicle.id);
  return true;
}
export function selectVehicle(state, id) {
  if (state.garage.includes(id)) state.vehicle = id;
  return state;
}
