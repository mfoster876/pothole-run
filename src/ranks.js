// src/ranks.js
// Career rank ladder driven by lifetimeEarned (the monotonic odometer in economy.js).
// Spending wallet never affects the rank — the odometer never goes down.
export const RANKS = [
  { id: 'cart-bwoy',     label: 'Cart Bwoy',     min: 0 },
  { id: 'road-hustler',  label: 'Road Hustler',  min: 250000 },
  { id: 'corner-smalls', label: 'Corner Smalls', min: 1000000 },
  { id: 'big-tings',     label: 'Big Tings',     min: 5000000 },
  { id: 'uptown',        label: 'Uptown',        min: 25000000 },
  { id: 'don-dadda',     label: 'Don Dadda',     min: 100000000 }
];

export function rankFor(lifetimeEarned) {
  let r = RANKS[0];
  for (const tier of RANKS) if (lifetimeEarned >= tier.min) r = tier;
  return r;
}

export function nextRank(lifetimeEarned) {
  const i = RANKS.indexOf(rankFor(lifetimeEarned));
  return i >= 0 && i < RANKS.length - 1 ? RANKS[i + 1] : null;
}
