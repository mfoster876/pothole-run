// The accessible grind path: parts that steady whatever you drive. A fresh ride
// starts wobbly; each upgrade adds to `stability`, damping the wobble and wander.
//
// Upgrades are now tailored to the RIDE: a handcart takes rig parts, a car takes car
// tuning, an EV its own kit. Each vehicle owns its upgrades SEPARATELY (buying a brake
// kit for the Probox doesn't carry to the handcart) — see save.js `upgrades` map.
//
// Each set is a 4-rung ladder of +0.2 stability, priced to suit the class (cheap rig
// parts for the free cart; pricier tuning for the cars you paid millions for).
const SETS = {
  rig: [   // handcart, bicycle, yeng-yeng — the improvised rides
    { id: 'weighted-base', name: 'Weighted Base',   price: 2500,  stability: 0.2 },
    { id: 'shock-pads',    name: 'Shock Pads',      price: 9000,  stability: 0.2 },
    { id: 'true-wheels',   name: 'True-Rim Wheels', price: 28000, stability: 0.2 },
    { id: 'wide-axle',     name: 'Wide Axle',       price: 70000, stability: 0.2 },
  ],
  car: [   // Probox, Swift, X6, Audi, Porsche, pickup
    { id: 'sport-tyres',      name: 'Sport Tyres',      price: 40000,  stability: 0.2 },
    { id: 'brake-kit',        name: 'Brake Kit',        price: 120000, stability: 0.2 },
    { id: 'stiff-suspension', name: 'Stiff Suspension', price: 300000, stability: 0.2 },
    { id: 'roll-cage',        name: 'Roll Cage',        price: 600000, stability: 0.2 },
  ],
  ev: [    // Jetour, Cybertruck — heavy, low-slung, high-tech
    { id: 'low-cg-battery',   name: 'Low-CG Battery',   price: 80000,  stability: 0.2 },
    { id: 'regen-brakes',     name: 'Regen Brakes',     price: 200000, stability: 0.2 },
    { id: 'air-suspension',   name: 'Air Suspension',   price: 450000, stability: 0.2 },
    { id: 'ballistic-panels', name: 'Ballistic Panels', price: 900000, stability: 0.2 },
  ],
};

// Which upgrade class each vehicle draws from.
const VEHICLE_CLASS = {
  handcart: 'rig', bicycle: 'rig', yengyeng: 'rig',
  probox: 'car', swift: 'car', x6: 'car', audi: 'car', porsche: 'car', pickup: 'car',
  jetour: 'ev', cybertruck: 'ev',
};

/** The upgrade ladder appropriate to the given ride (defaults to rig). */
export function upgradesForVehicle(vehicleId) {
  return SETS[VEHICLE_CLASS[vehicleId] || 'rig'];
}

// Back-compat default export name: the rig ladder (a few callers/tests reference it).
export const STABILITY_UPGRADES = SETS.rig;

/** Total stability from the upgrades OWNED for that vehicle. */
export function stabilityBonus(ownedIds = [], vehicleId = 'handcart') {
  const set = upgradesForVehicle(vehicleId);
  return set.filter(u => ownedIds.includes(u.id)).reduce((s, u) => s + u.stability, 0);
}

/** The next unowned upgrade for that vehicle, or null when fully kitted. */
export function nextUpgrade(ownedIds = [], vehicleId = 'handcart') {
  return upgradesForVehicle(vehicleId).find(u => !ownedIds.includes(u.id)) || null;
}
