export const LANES = [-0.6, 0, 0.6];                 // where hazards spawn (3 lanes)
// Where the CART can sit: the 3 lanes PLUS a soft shoulder on each side. Hazards
// never spawn on the shoulders, so they're an escape route — but they're bumpy and
// bleed condition the longer you ride them (see SHOULDER).
export const CART_SLOTS = [-0.95, -0.6, 0, 0.6, 0.95];
export const PLAYER_HALF_WIDTH = 0.16;
export const ENTITY_HALF_WIDTH = 0.16;

export const CART = {
  maxCondition: 100,
  startSpeed: 79,      // ~10% faster start; speed still climbs toward maxSpeed
  maxSpeed: 220,
  accel: 6,
  laneLerp: 7
};

export const DAMAGE = {
  pothole: 10,         // +10% difficulty
  manhole: 100,
  traffic: 20,         // +10% difficulty
  animal: 15,          // +10% difficulty
  bump: 4,
  wiper: 4,
  repairPerCoin: 1
};

// Windscreen youths (car-only) shake you down for a "forced wash". They start cheap
// ($50) early and get greedier the DEEPER you drive AND the flashier your ride — a
// Porsche driver is a far juicier target than a Probox one. See wiperCharge() in run.js.
//   baseCharge   — the early ask in a cheap car
//   distRamp     — every `distRamp` metres roughly doubles the ask
//   greedPerPrice— $ of vehicle price that adds +1.0 to the greed multiplier
//   maxGreed     — cap on the vehicle greed multiplier
//   maxCharge    — hard cap on a single wash
export const WIPER = { baseCharge: 50, distRamp: 1000, greedPerPrice: 4000000, maxGreed: 3.5, maxCharge: 2000 };

// The Bleachaz Conductor starts BLACK and bleaches one stage worse with every bleach
// item (cake soap / curry powder / toothpaste) he grabs — 0=natural … 2=fully bleached
// … 4=peeling flesh + exposed skull. Resets each run; drives his portrait + sprite.
export const BLEACH = { maxLevel: 4 };

// Riding the soft shoulder: hazard-free but bumpy — it bleeds condition per second,
// AND the cart progressively tips onto its side. The lean (`tipReach` off-slot at full
// tilt) widens the gap to road hazards — easier to escape — but reach `toppleAt` and
// the cart goes over (a wreck). `tipRate`/`tipRecover` = tilt gained per second on the
// shoulder / shed per second back on the road.
export const SHOULDER = { drainPerSec: 7, tipRate: 0.34, tipRecover: 1.3, tipReach: 0.22, toppleAt: 1 };

// Hazard spacing: wide gaps at the start (less cluttered, learnable), tightening
// HARD as `distance` climbs and the ride gets faster — the frustration grows the
// longer you survive. Floor keeps it just barely survivable.
// flatter, more forgiving early ramp
export const SPAWN = { baseInterval: 113, minInterval: 20, ramp: 18 };
export const FLOOR_CONDITION = 40;
export const COMBO = { nearBand: 0.18, step: 1, max: 5, bonusPer: 0.25 };
export const HOP = { air: 0.85, height: 64 }; // seconds airborne + visual arc-peak amplitude in px
export const POWERUP = {
  toolsHeal: 35,     // % of max restored by hardware tools
  boost: 3,          // seconds of water speed/steady boost
  steady: 3,         // seconds of tools steadiness
  coffeeDist: 600,   // world-distance length of the smooth-road money window
  toolDrop: 5000     // coffee flood denomination
};
// SUPERCHARGE (water powerup): invincibility + speed burst + money flood window.
// accel/maxSpeed: consumed by game.js to temporarily override CART values.
// moneyMult/coinWeightBonus: consumed by game.js to flood coin value during the window.
export const SUPERCHARGE = { dur: 6, accel: 14, maxSpeed: 260, moneyMult: 1.5, coinWeightBonus: 6 };
export const DRINK = { baseDur: 5, tipsyExtra: 3 };
export const IMPAIR = { handlingDrop: 0.55, wander: 0.9 };

// Spawn-rate tuning: drinks are an occasional treat (spawn 15% less); repair tools
// are the lifeline (spawn 20% more) so a battered cart can claw its way back to 100%.
export const SPAWN_TUNE = { drinkMult: 0.85, toolMult: 1.20 };

// Vehicle wear → performance. A fresh rig (condition 100%) drives at full capability;
// as it takes hits, handling and (less so) top speed degrade — a noticeable malfunction.
// Picking up tools heals condition, so the cart visibly tightens back up toward like-new.
// Floors keep a wrecked-but-rolling cart survivable (the fairness rule).
export const WEAR = { minHandling: 0.55, minSpeed: 0.85 };

export const MAX_DPR = 2;
export const VIRTUAL = { width: 960, height: 540 };

// Passing traffic buffets the cart: when a fast vehicle in a neighbouring lane
// blows past, its wake shoves the cart sideways (away from the vehicle).
export const GUST = { range: 0.95, push: 1.6, fromTaxi: 1.0, fromBus: 1.3, fromCoaster: 1.0 };

export const TITHE = { mite: 2000, perGift: 0.5, maxResist: 0.40, maxExtend: 0.50, maxGrace: 3, decay: 0.15 };

// Police are a spawnable road obstacle (urban-frequent — weighted by stage). Direct
// contact costs condition (traffic-tier damage, via the hazard's category) AND a cash
// fine skimmed off your fare. The Politician is immune (see characters.js).
export const POLICE = { fine: 500 };

// Negatives / detractors: a lifestyle temptation or a politician "responsibility" that
// bites on contact. `impairSecs` = how long an impairing negative (weed, molly…) leaves
// the steering sloppy (reuses the booze `tipsy` machinery).
export const NEGATIVE = { impairSecs: 4 };

// Politician road tuning: his motorcade rolls on freshly-paved roads, so potholes and
// manholes SPAWN far less (×potholeMult). They still hit at full damage when they do.
// `cashBillChance` = odds each of his notes is the coveted $5000 (else a big note).
export const POLITICIAN = { potholeMult: 0.4, cashBillChance: 0.85 };
