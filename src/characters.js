// `sway` = how much the ride wanders/wobbles on its own (visual + felt). The
// conductor is reckless: fast, loose, twitchy. The rasta is smooth and steady.
//
// The chosen driver is a difficulty/REWARD dial (see the rebalance spec):
//   cashFind — multiplier on how OFTEN money spawns.
//   billBias — integer ladder-shift on each note (reckless → bigger notes, rarer).
//   coinDraw — collection magnet (reckless → smaller, so even visible cash is hard).
//   scoreMult — reward/score ceiling (reckless → higher).
// Reckless drivers reach a higher ceiling but find/collect cash frustratingly rarely;
// smooth drivers get frequent, easy, smaller money.
//
// `immune` / `damageScale` make hazard categories harmless or softer for a driver
// (used by the privileged Politician). Categories live on the hazard types.
export const CHARACTERS = [
  { id: 'yute', name: 'School Yute', topSpeed: 1.0, handling: 1.05, toughness: 1.0, coinDraw: 1.05, scoreMult: 1.0, sway: 1.0, cashFind: 1.0, billBias: 0, locked: false },
  // `policeMult` — Babylon troubles the Rasta most: police spawn twice as often for him.
  { id: 'rasta', name: 'Rasta Musician', topSpeed: 0.86, handling: 1.22, toughness: 1.3, coinDraw: 1.4, scoreMult: 1.0, sway: 0.6, cashFind: 1.35, billBias: 0, policeMult: 2, locked: false },
  { id: 'conductor', name: 'Bleachaz Conductor', topSpeed: 1.3, handling: 0.7, toughness: 0.66, coinDraw: 0.8, scoreMult: 1.35, sway: 1.7, cashFind: 0.5, billBias: 1, locked: true },
  // Unlocked only with loads of money. Privileged & 'untouchable': a money magnet
  // (corruption) who's hard to rough up, with a smooth motorcade ride. Immune to
  // police, pedestrians and roadkill; takes half damage from other cars; potholes and
  // manholes still wreck him. Money is almost all $5000 (handled in game.js).
  // `fullDamageCats` — hazard classes that ignore his toughness/privilege entirely:
  // potholes & manholes stay "equally devastating" for him (his one real weakness).
  { id: 'politician', name: 'Di Politician', topSpeed: 1.15, handling: 1.1, toughness: 1.4, coinDraw: 1.6, scoreMult: 1.2, sway: 0.8, cashFind: 1.0, billBias: 0,
    immune: ['police', 'pedestrian', 'animal'], damageScale: { traffic: 0.5 }, fullDamageCats: ['road'], locked: true }
];
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
