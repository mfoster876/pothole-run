// src/solvability.js
import { CART } from './constants.js';
// The cart needs time to slide one slot (~0.6 in normalised x) over. Convert that
// lateral time into a minimum world-Z spacing between consecutive hazard rows at the
// given speed, so there is ALWAYS time to reach an open slot. Shoulders are always
// hazard-free, so a survivable slot always exists; this guarantees it's *reachable*.
const SLOT_GAP = 0.6;                 // normalised x between adjacent lanes
export function reachabilityFloorZ(speed) {
  const lateralTime = SLOT_GAP / CART.laneLerp + 0.12; // ease time + reaction margin
  return speed * lateralTime;
}
