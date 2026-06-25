const KEY = 'pothole-run-save:v2';
const KEY_V1 = 'pothole-run-save:v1';

export const GENRES = ['reggae', 'ska', 'dancehall', 'hiphop'];

export function defaultSave() {
  return {
    coins: 0,
    bests: {},
    // vehicle: which rides you own and which is selected; handcart is the free icon.
    garage: ['handcart'],
    vehicle: 'handcart',
    upgrades: [],                 // owned rig stability upgrades (see upgrades.js)
    seenCarTip: false,            // has the windscreen-youth pop-up been shown?
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false, genre: 'reggae' },
    lifetimeEarned: 0,
    wallet: 0,
    condition: 100,
    bounties: [],
    aspirations: { achieved: [] },
    goldHandcart: false,
    blessing: 0,
  };
}
export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY) ?? storage.getItem(KEY_V1);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const base = defaultSave();
    const seedCoins = Number.isFinite(parsed.coins) ? parsed.coins : 0;
    const save = {
      ...base, ...parsed,
      wallet: Number.isFinite(parsed.wallet) ? parsed.wallet : seedCoins,
      lifetimeEarned: Number.isFinite(parsed.lifetimeEarned) ? parsed.lifetimeEarned : seedCoins,
      condition: Number.isFinite(parsed.condition) ? parsed.condition : 100,
      bounties: Array.isArray(parsed.bounties) ? parsed.bounties : [],
      aspirations: { achieved: Array.isArray(parsed.aspirations?.achieved) ? parsed.aspirations.achieved : [] },
      garage: Array.isArray(parsed.garage) && parsed.garage.length ? parsed.garage : base.garage,
      upgrades: Array.isArray(parsed.upgrades) ? parsed.upgrades : base.upgrades,
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
      blessing: Number.isFinite(parsed.blessing) ? Math.max(0, Math.min(1, parsed.blessing)) : 0,
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
  if (state.wallet < vehicle.price) return false;
  state.wallet -= vehicle.price;
  state.garage.push(vehicle.id);
  return true;
}
export function selectVehicle(state, id) {
  if (state.garage.includes(id)) state.vehicle = id;
  return state;
}
// Buy a rig stability upgrade if affordable and not already owned.
export function buyUpgrade(state, upgrade) {
  if (state.upgrades.includes(upgrade.id)) return false;
  if (state.wallet < upgrade.price) return false;
  state.wallet -= upgrade.price;
  state.upgrades.push(upgrade.id);
  return true;
}
