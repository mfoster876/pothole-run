export const LANES = [-0.6, 0, 0.6];                 // where hazards spawn (3 lanes)
// Where the CART can sit: the 3 lanes PLUS a soft shoulder on each side. Hazards
// never spawn on the shoulders, so they're an escape route — but they're bumpy and
// bleed condition the longer you ride them (see SHOULDER).
export const CART_SLOTS = [-0.95, -0.6, 0, 0.6, 0.95];
export const PLAYER_HALF_WIDTH = 0.16;
export const ENTITY_HALF_WIDTH = 0.16;

export const CART = {
  maxCondition: 100,
  startSpeed: 72,      // calmer start (eased ~10%); speed still climbs toward maxSpeed
  maxSpeed: 220,
  accel: 6,
  laneLerp: 7
};

export const DAMAGE = {
  pothole: 11,         // overall ~10% gentler than before, for a less punishing early game
  manhole: 100,
  traffic: 23,
  animal: 18,
  bump: 5,
  wiper: 5,            // soapy-can windscreen youth: a nuisance scrape, not a wreck
  repairPerCoin: 1
};

// Windscreen youths cost you coins (a "forced wash") more than condition.
export const WIPER = { coinLoss: 6 };

// Riding the soft shoulder: hazard-free but bumpy — it bleeds this much condition
// per second you stay out there.
export const SHOULDER = { drainPerSec: 7 };

// Hazard spacing: wide gaps at the start (less cluttered, learnable), tightening
// HARD as `distance` climbs and the ride gets faster — the frustration grows the
// longer you survive. Floor keeps it just barely survivable.
export const SPAWN = { baseInterval: 100, minInterval: 20, ramp: 16 };
export const MAX_DPR = 2;
export const VIRTUAL = { width: 960, height: 540 };

// Passing traffic buffets the cart: when a fast vehicle in a neighbouring lane
// blows past, its wake shoves the cart sideways (away from the vehicle).
export const GUST = { range: 0.95, push: 1.6, fromTaxi: 1.0, fromBus: 1.3, fromCoaster: 1.0 };
