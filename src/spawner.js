import { SPAWN } from './constants.js';

export function spawnInterval(distance, base = SPAWN.baseInterval, min = SPAWN.minInterval) {
  return Math.max(min, base - distance / SPAWN.ramp);
}
export function pickHazard(weights, rng) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let r = rng() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r < 0) return w.type;
  }
  return weights[weights.length - 1].type;
}
export function laneFor(rng, laneCount) {
  return Math.min(laneCount - 1, Math.floor(rng() * laneCount));
}
