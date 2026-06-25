import { CART_SLOTS, CART, PLAYER_HALF_WIDTH, FLOOR_CONDITION, IMPAIR, WEAR } from './constants.js';
import { createCondition } from './wreck.js';
import { getVehicle } from './vehicles.js';

const CENTRE = 2;                 // CART_SLOTS index that sits dead-centre (x = 0)

// A slot is a soft shoulder if it's the outermost on either side.
export function isShoulder(slotIndex) {
  return slotIndex === 0 || slotIndex === CART_SLOTS.length - 1;
}

export function startCondition(saved) {
  if (saved == null) return CART.maxCondition;
  return Math.max(FLOOR_CONDITION, Math.min(CART.maxCondition, saved));
}

export function createCart(character, vehicle = getVehicle('handcart'), stabilityBonus = 0, savedCondition = null) {
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
    drift: 0,         // slow off-line wander (game.update evolves it; low stability = more)
    stability: (vehicle.stability || 1) + stabilityBonus, // higher = steadier
    condition: { value: startCondition(savedCondition), max: CART.maxCondition },
    jumpT: 0,         // seconds remaining airborne (set by sleeping-policeman hop)
    tipsy: 0,         // alcohol impairment magnitude 0..1 (set by applyDrink)
    blessing: null    // { resist, invincExtend, startGrace } — set by game.js at run start
  };
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(CART_SLOTS.length - 1, cart.laneIndex + dir));
}
export function onShoulder(cart) {
  return isShoulder(cart.laneIndex);
}
// Vehicle wear: a fresh rig (condition 100%) drives at full capability; damage drags
// it down toward `min`, and healing (tools / repairs) lifts it back toward like-new.
// Exported so the simulation and tests can reason about felt performance directly.
export function wearFactor(cart, min) {
  const cond = cart.condition;
  const frac = cond ? Math.max(0, Math.min(1, cond.value / cond.max)) : 1;
  return min + (1 - min) * frac;
}

// Effective stats combine the ride's capability with the driver's personality AND
// the current state of repair — a battered cart noticeably malfunctions.
function effSpeed(cart) {
  return cart.character.topSpeed * cart.vehicle.speed * wearFactor(cart, WEAR.minSpeed);
}
function effHandling(cart) {
  let h = cart.character.handling * cart.vehicle.handling * wearFactor(cart, WEAR.minHandling);
  if (cart.tipsy > 0) {
    // Alcohol makes steering sluggish: reduce handling proportional to impairment.
    h *= (1 - IMPAIR.handlingDrop * cart.tipsy);
  }
  // Floored so the cart is sloppy near a wreck but never completely frozen.
  return Math.max(0.25, h);
}

export function updateCart(cart, dt) {
  if (cart.jumpT > 0) cart.jumpT = Math.max(0, cart.jumpT - dt);
  const stability = cart.stability || 1;
  // gust push first, then the driver hauls back toward the slot (offset by any drift)
  cart.x += (cart.vx || 0) * dt;
  cart.vx = (cart.vx || 0) * Math.exp(-6 * dt);
  cart.x = Math.max(-1.1, Math.min(1.1, cart.x));
  // A loose rig won't hold a clean line: drift pulls the settle point off-slot, so a
  // wobbly handcart wanders and you must keep correcting. Steady rigs zero it out.
  const targetX = CART_SLOTS[cart.laneIndex] + (cart.drift || 0);
  // Square the handling spread, then let stability tighten (or loosen) the settle.
  const k = CART.laneLerp * Math.pow(effHandling(cart), 1.6) * (0.7 + 0.3 * stability);
  const t = 1 - Math.exp(-k * dt);
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  const max = CART.maxSpeed * effSpeed(cart);
  cart.speed = Math.min(max, cart.speed + CART.accel * dt * effSpeed(cart));
}
