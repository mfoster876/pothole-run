// The accessible grind path: rig improvements that steady the handcart (and any
// ride). A new cart starts wobbly and hard to control; each upgrade adds to your
// `stability`, which damps the wobble and the loose wander. Prices climb but stay
// reachable — unlike buying a car, this is meant to be earned gradually.
export const STABILITY_UPGRADES = [
  { id: 'weighted-base', name: 'Weighted Base',  price: 2500,  stability: 0.2 },
  { id: 'shock-pads',    name: 'Shock Pads',     price: 9000,  stability: 0.2 },
  { id: 'true-wheels',   name: 'True-Rim Wheels', price: 28000, stability: 0.2 },
  { id: 'wide-axle',     name: 'Wide Axle',      price: 70000, stability: 0.2 }
];

export function stabilityBonus(ownedIds = []) {
  return STABILITY_UPGRADES.filter(u => ownedIds.includes(u.id)).reduce((s, u) => s + u.stability, 0);
}
// The next upgrade you can buy, or null if the rig is fully upgraded.
export function nextUpgrade(ownedIds = []) {
  return STABILITY_UPGRADES.find(u => !ownedIds.includes(u.id)) || null;
}
