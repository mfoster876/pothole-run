// src/races.js — bank-gated head-to-head street races ("pay to play, win big").
// Pay a buy-in, race 3 AI rivals to a finish line; placement pays the purse.
// All amounts are strict bills ($100 / $1000 / $5000 — see money.js BILLS).
//
// This module is the pure logic (tiers, gating, rivals, placement, payout). The live
// race reuses the run loop (game.js) for the actual driving + rival rendering.

export const RACE_TIERS = [
  // unlockBank = career bank (lifetimeEarned) needed; buyIn is a strict bill. Odds are
  // juicy — a win pays ~15× the buy-in (these are "pay to play, WIN BIG" street races).
  { id: 'corner',       name: 'Corner Hustle',       unlockBank: 0,      buyIn: 100,  purse: 1500,  distance: 1200, rivalPace: 0.92 },
  { id: 'crosstown',    name: 'Cross-Town Dash',     unlockBank: 5000,   buyIn: 1000, purse: 15000, distance: 1800, rivalPace: 1.00 },
  { id: 'championship', name: 'Island Championship', unlockBank: 100000, buyIn: 5000, purse: 75000, distance: 2600, rivalPace: 1.08 },
];

export function tierById(id) { return RACE_TIERS.find(t => t.id === id) || null; }

// Tiers the player's career bank has unlocked (always at least Corner Hustle).
export function availableTiers(save) {
  const bank = save.lifetimeEarned || 0;
  return RACE_TIERS.filter(t => bank >= t.unlockBank);
}

// Can the player enter? Unlocked by bank AND can afford the buy-in.
export function canEnter(save, tier) {
  if (!tier) return false;
  return (save.lifetimeEarned || 0) >= tier.unlockBank && save.wallet >= tier.buyIn;
}

// Three rivals, each with a slightly different pace around the tier baseline so the
// race is competitive but beatable with a clean line. `rng` varies them deterministically.
export function makeRivals(tier, rng = Math.random) {
  // Each rival rides a distinct lane and vehicle so they're visible on the road ahead.
  const cast = [
    { name: 'Bus Driva', lane: 0, sprite: 'bus' },
    { name: 'Taxi Man',  lane: 1, sprite: 'taxi' },
    { name: 'Coaster',   lane: 2, sprite: 'coaster' },
  ];
  return cast.map(({ name, lane, sprite }) => ({
    name, lane, sprite,
    dist: 0,
    pace: tier.rivalPace * (0.90 + 0.20 * rng()),  // ±~10% around the tier baseline
    stumble: 0,                                     // seconds of pothole slow remaining
    seed: rng(),                                    // stable sprite seed
  }));
}

// Pay the buy-in and build the race. Returns the race state the live loop ticks, or
// null if the player can't enter (caller should show "nuh rich yet").
export function enterRace(save, tier, rng = Math.random) {
  if (!canEnter(save, tier)) return null;
  save.wallet -= tier.buyIn;
  return { tier, finish: tier.distance, rivals: makeRivals(tier, rng), done: false, place: 0 };
}

// Advance one rival over dt at the player's reference speed. Occasional pothole stumble
// slows it briefly — that's the beatable window.
export function tickRival(rival, dt, refSpeed, rng = Math.random) {
  if (rival.stumble > 0) rival.stumble = Math.max(0, rival.stumble - dt);
  else if (rng() < 0.012) rival.stumble = 0.6;
  const speed = refSpeed * rival.pace * (rival.stumble > 0 ? 0.5 : 1);
  rival.dist += speed * dt;
  return rival.dist;
}

// Live/finish placement: 1 = leading. Counts rivals ahead of the player's distance.
export function placement(playerDist, rivals) {
  return rivals.filter(r => r.dist > playerDist).length + 1;
}

// Settle: 1st banks the purse, 2nd gets the buy-in back (push), 3rd/4th lose it.
// Winnings bank to wallet AND lifetimeEarned (so a win lifts your rank too).
export function settleRace(save, tier, place) {
  let winnings = 0, label = '';
  if (place === 1)      { winnings = tier.purse; label = '1ST — YUH WIN BIG!'; }
  else if (place === 2) { winnings = tier.buyIn; label = '2ND — buy-in back, nuh loss'; }
  else                  { winnings = 0;          label = place + 'TH — lose di buy-in'; }
  if (winnings > 0) { save.wallet += winnings; save.lifetimeEarned += winnings; }
  return { place, winnings, label };
}
