import { CART_SLOTS, CART, PLAYER_HALF_WIDTH } from './constants.js';
import { createCondition } from './wreck.js';
import { getVehicle } from './vehicles.js';

const CENTRE = 2;                 // CART_SLOTS index that sits dead-centre (x = 0)
const WANDER = 0.5;               // how much a loose, low-stability rig drifts on its own

// A slot is a soft shoulder if it's the outermost on either side.
export function isShoulder(slotIndex) {
  return slotIndex === 0 || slotIndex === CART_SLOTS.length - 1;
}

export function createCart(character, vehicle = getVehicle('handcart'), stabilityBonus = 0) {
  return {
    character,
    vehicle,
    laneIndex: CENTRE,
    x: CART_SLOTS[CENTRE],
    vx: 0,            // lateral velocity from gusts (decays)
    halfWidth: PLAYER_HALF_WIDTH,
    speed: CART.startSpeed,
    lean: 0,
    rattle: 0,        // permanent per-run looseness: every hit ratchets it up
    stability: (vehicle.stability || 1) + stabilityBonus, // higher = steadier
    condition: createCondition(CART.maxCondition)
  };
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(CART_SLOTS.length - 1, cart.laneIndex + dir));
}
export function onShoulder(cart) {
  return isShoulder(cart.laneIndex);
}
// Effective stats combine the ride's capability with the driver's personality.
function effSpeed(cart)    { return cart.character.topSpeed * cart.vehicle.speed; }
function effHandling(cart) { return cart.character.handling * cart.vehicle.handling; }

export function updateCart(cart, dt) {
  const stability = cart.stability || 1;
  // gust push first, then a loose-rig wander, then the driver hauls back to the slot
  cart.x += (cart.vx || 0) * dt;
  cart.vx = (cart.vx || 0) * Math.exp(-6 * dt);
  const looseness = Math.max(0, 1.15 - stability);          // 0 once the rig is steady
  cart.x += (Math.random() - 0.5) * looseness * WANDER * dt;  // drifts; you must correct
  cart.x = Math.max(-1.1, Math.min(1.1, cart.x));
  const targetX = CART_SLOTS[cart.laneIndex];
  // Square the handling spread, then let stability tighten (or loosen) the settle.
  const k = CART.laneLerp * Math.pow(effHandling(cart), 1.6) * (0.7 + 0.3 * stability);
  const t = 1 - Math.exp(-k * dt);
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  const max = CART.maxSpeed * effSpeed(cart);
  cart.speed = Math.min(max, cart.speed + CART.accel * dt * effSpeed(cart));
}
