export const LANES = [-0.6, 0, 0.6];
export const PLAYER_HALF_WIDTH = 0.16;
export const ENTITY_HALF_WIDTH = 0.16;

export const CART = {
  maxCondition: 100,
  startSpeed: 80,
  maxSpeed: 220,
  accel: 6,
  laneLerp: 7
};

export const DAMAGE = {
  pothole: 12,
  manhole: 100,
  traffic: 26,
  animal: 20,
  bump: 6,
  wiper: 5,            // soapy-can windscreen youth: a nuisance scrape, not a wreck
  repairPerCoin: 4
};

// Windscreen youths cost you coins (a "forced wash") more than condition.
export const WIPER = { coinLoss: 6 };

// Hazard spacing: wide gaps at the start (less cluttered, learnable), tightening
// as `distance` climbs and the ride gets faster. Floor keeps it survivable.
export const SPAWN = { baseInterval: 90, minInterval: 20, ramp: 22 };
export const MAX_DPR = 2;
export const VIRTUAL = { width: 960, height: 540 };

// Passing traffic buffets the cart: when a fast vehicle in a neighbouring lane
// blows past, its wake shoves the cart sideways (away from the vehicle).
export const GUST = { range: 0.95, push: 1.6, fromTaxi: 1.0, fromBus: 1.3, fromCoaster: 1.0 };
