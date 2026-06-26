const KEY = 'pothole-run-save:v2';
const KEY_V1 = 'pothole-run-save:v1';

export const GENRES = ['reggae', 'ska', 'dancehall', 'hiphop', 'mymusic', 'radio'];

// Upgrades are now a per-vehicle map. Migrate a legacy flat array (the old global rig
// upgrades) onto the handcart, and sanitise any object form to arrays.
function migrateUpgrades(u) {
  if (Array.isArray(u)) return { handcart: u.slice() };
  if (u && typeof u === 'object') {
    const out = {};
    for (const k of Object.keys(u)) if (Array.isArray(u[k])) out[k] = u[k].slice();
    return out;
  }
  return {};
}

/** The upgrade ids owned for a given vehicle (always an array). */
export function ownedUpgrades(state, vehicleId) {
  return (state.upgrades && state.upgrades[vehicleId]) || [];
}

export function defaultSave() {
  return {
    coins: 0,
    bests: {},
    // vehicle: which rides you own and which is selected; handcart is the free icon.
    garage: ['handcart'],
    vehicle: 'handcart',
    upgrades: {},                 // per-vehicle owned upgrades: { [vehicleId]: [ids] } (see upgrades.js)
    busted: {},                   // per-vehicle BUSTED upgrades awaiting a paid re-fit: { [vehicleId]: [ids] }
    seenCarTip: false,            // has the windscreen-youth pop-up been shown?
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false, genre: 'reggae', radioStation: 0, graphics: 'smooth' },
    lifetimeEarned: 0,
    wallet: 0,
    condition: 100,
    bounties: [],
    aspirations: { achieved: [] },
    goldHandcart: false,
    blessing: 0,
    prayedSinceRun: false,
    readBibleSinceRun: false,
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
      upgrades: migrateUpgrades(parsed.upgrades),
      busted: migrateUpgrades(parsed.busted),
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) },
      blessing: Number.isFinite(parsed.blessing) ? Math.max(0, Math.min(1, parsed.blessing)) : 0,
      prayedSinceRun:   parsed.prayedSinceRun   === true ? true : false,
      readBibleSinceRun: parsed.readBibleSinceRun === true ? true : false,
    };
    if (!save.garage.includes(save.vehicle)) save.vehicle = save.garage[0];
    if (!GENRES.includes(save.settings.genre)) save.settings.genre = 'reggae';
    if (save.settings.graphics !== 'fast') save.settings.graphics = 'smooth';
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
  // A new ride rolls off the lot in perfect shape — it performs like new until the
  // first pothole. (Condition is shared across the garage, so the buy resets it.)
  state.condition = 100;
  return true;
}
export function selectVehicle(state, id) {
  if (state.garage.includes(id)) state.vehicle = id;
  return state;
}
// Buy an upgrade for a specific vehicle if affordable and not already owned (each
// vehicle keeps its OWN upgrade list).
export function buyUpgrade(state, upgrade, vehicleId) {
  if (!state.upgrades || Array.isArray(state.upgrades)) state.upgrades = migrateUpgrades(state.upgrades);
  const owned = state.upgrades[vehicleId] || (state.upgrades[vehicleId] = []);
  if (owned.includes(upgrade.id)) return false;
  if (state.wallet < upgrade.price) return false;
  state.wallet -= upgrade.price;
  owned.push(upgrade.id);
  return true;
}

// --- Bustable tune-ups: the mech shop's recurring shakedown ----------------------------
// A hard crash can shake a fitted part loose; it drops off the OWNED list (so its grip +
// handling are lost) and onto the BUSTED list, where the shop charges a discounted RE-FIT
// to bolt it back on. Chances scale with how badly the run ended.
export const BUST_CHANCE_WRECK    = 0.5;   // ended in a full wreck
export const BUST_CHANCE_BATTERED = 0.22;  // limped home badly damaged (condition < 40)

/** The upgrade ids currently busted (awaiting re-fit) for a given vehicle. */
export function bustedParts(state, vehicleId) {
  return (state.busted && state.busted[vehicleId]) || [];
}

// Decide whether a part busts this run and, if so, bust a RANDOM owned one. Mutates state
// (owned → busted) and returns the busted id, or null. rng is injectable for tests.
export function maybeBustPart(state, vehicleId, wrecked, conditionValue, rng = Math.random) {
  const owned = (state.upgrades && state.upgrades[vehicleId]) || [];
  if (!owned.length) return null;
  const chance = wrecked ? BUST_CHANCE_WRECK : (conditionValue < 40 ? BUST_CHANCE_BATTERED : 0);
  if (chance <= 0 || rng() >= chance) return null;
  const idx = Math.min(owned.length - 1, Math.floor(rng() * owned.length));
  const id = owned[idx];
  owned.splice(idx, 1);
  if (!state.busted) state.busted = {};
  const b = state.busted[vehicleId] || (state.busted[vehicleId] = []);
  if (!b.includes(id)) b.push(id);
  return id;
}

// Pay to re-fit a busted part: moves it busted → owned if affordable. Returns true on success.
export function refitPart(state, upgrade, vehicleId, price) {
  const b = (state.busted && state.busted[vehicleId]) || [];
  const i = b.indexOf(upgrade.id);
  if (i < 0) return false;                 // not busted — nothing to re-fit
  if (state.wallet < price) return false;
  state.wallet -= price;
  b.splice(i, 1);
  const owned = state.upgrades[vehicleId] || (state.upgrades[vehicleId] = []);
  if (!owned.includes(upgrade.id)) owned.push(upgrade.id);
  return true;
}
