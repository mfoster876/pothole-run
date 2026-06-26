import { CART_SLOTS, CART, PLAYER_HALF_WIDTH, FLOOR_CONDITION, IMPAIR, WEAR, SHOULDER, THROTTLE, PACE } from './constants.js';
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
    tilt: 0,          // soft-shoulder lean 0..1 (grows while on the shoulder; topples at 1)
    toppled: false,   // set true the frame the cart tips over (a shoulder wreck)
    bleachLevel: 0,   // Conductor bleach disfigurement 0..BLEACH.maxLevel (per-run; grows on bleach items)
    speedScale: 1,    // top-speed multiplier (street races crank this up); 1 = normal
    throttle: 0,      // player throttle −1 (brake) … 0 (coast) … +1 (accelerate)
    toppleT: 0,       // soft-shoulder topple death animation progress 0..1 (0 = upright)
    blessing: null    // { resist, invincExtend, startGrace } — set by game.js at run start
  };
}

// Pace multiplier for the current run distance: the deeper you get, the faster the whole
// game runs (a gentle climb from PACE.start up to PACE.max), so it never just plateaus.
export function paceFor(distance) {
  return Math.min(PACE.max, PACE.start + Math.max(0, distance || 0) * PACE.perMetre);
}

// Riding the soft shoulder tips the cart progressively onto its side. The longer you
// stay, the more it leans (the lean widens the gap to road hazards — easier to dodge);
// pull back onto the road and it rights itself. Reach `toppleAt` and it goes over.
// Returns true the moment the cart topples (the caller should end the run).
export function tipShoulder(cart, onShoulderNow, dt) {
  if (onShoulderNow) cart.tilt = Math.min(1, (cart.tilt || 0) + SHOULDER.tipRate * dt);
  else               cart.tilt = Math.max(0, (cart.tilt || 0) - SHOULDER.tipRecover * dt);
  return onShoulderNow && cart.tilt >= SHOULDER.toppleAt;
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(CART_SLOTS.length - 1, cart.laneIndex + dir));
}
// A passing vehicle's wake shoves the cart sideways. A steadier ride — a heavier base
// PLUS the mech-shop stability parts — soaks up the shove. The curve pivots at the stock
// handcart (stability 0.70 → ×1.0) so the un-upgraded base game is unchanged, while a
// fully-kitted ride barely rocks (down to ×0.4). This is the most-felt upgrade payoff:
// every bus/coaster that screams past hits a planted, upgraded ride far less.
export function gustFactor(stability) {
  return Math.max(0.4, Math.min(1.2, 1 - 0.55 * ((stability || 1) - 0.70)));
}
export function applyGust(cart, dir, magnitude) {
  cart.vx = (cart.vx || 0) + dir * magnitude * gustFactor(cart.stability);
  cart.gusted = true;
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

export function updateCart(cart, dt, distance = 0, overrideTarget = null) {
  if (cart.jumpT > 0) cart.jumpT = Math.max(0, cart.jumpT - dt);
  const stability = cart.stability || 1;
  // gust push first, then the driver hauls back toward the slot (offset by any drift)
  cart.x += (cart.vx || 0) * dt;
  // A steadier ride also sheds gust velocity faster — it settles back onto its line
  // instead of wallowing after a knock (stability tightens the recovery). Centred so the
  // stock handcart (stability 0.70) keeps its original −6/s decay; upgrades only speed it.
  cart.vx = (cart.vx || 0) * Math.exp(-(4.6 + 2 * stability) * dt);
  cart.x = Math.max(-1.1, Math.min(1.1, cart.x));
  // A loose rig won't hold a clean line: drift pulls the settle point off-slot, so a
  // wobbly handcart wanders and you must keep correcting. Steady rigs zero it out.
  let targetX = CART_SLOTS[cart.laneIndex] + (cart.drift || 0);
  // On the soft shoulder the cart tips outward — the lean leans it off the road,
  // settling further out so road hazards in the next lane have a wider gap to clear.
  if (isShoulder(cart.laneIndex) && cart.tilt) {
    targetX += (cart.laneIndex === 0 ? -1 : 1) * cart.tilt * SHOULDER.tipReach;
  }
  // Square the handling spread, then let stability tighten (or loosen) the settle — a
  // wider weight so mech-shop parts make the steering noticeably snappier and more planted.
  // Centred so the stock handcart (0.70) keeps its original responsiveness; parts add snap.
  const k = CART.laneLerp * Math.pow(effHandling(cart), 1.6) * (0.6 + 0.45 * stability);
  const t = 1 - Math.exp(-k * dt);
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  // --- speed: ALWAYS eases toward a target, so the cart never fully stops. Normally the
  // target is progression-pace × player-throttle (braking only down to brakeFloor); a power-up
  // (water supercharge) can hand in an `overrideTarget` to surge the cart toward a higher cap
  // regardless of throttle. speedScale lets street races run MUCH faster (default 1).
  const scale = cart.speedScale || 1;
  const capability = CART.maxSpeed * effSpeed(cart) * scale;  // top capability of the ride
  const pace = paceFor(distance);                             // deeper run → faster game
  const th = Math.max(-1, Math.min(1, cart.throttle || 0));
  // throttle maps coast(cruise) → SPRINT accelerating, coast → brakeFloor braking.
  const frac = th >= 0
    ? THROTTLE.cruise + (THROTTLE.sprint - THROTTLE.cruise) * th
    : THROTTLE.cruise - (THROTTLE.cruise - THROTTLE.brakeFloor) * (-th);
  let target = capability * pace * Math.max(THROTTLE.brakeFloor, Math.min(THROTTLE.sprint, frac));
  // A speed power-up (water / boozy drink / fruit) can surge the cart toward a higher cap —
  // but it must ONLY ever speed you up, never throttle you DOWN below your current pace
  // (grabbing water mid-sprint should never feel like a brake).
  if (overrideTarget != null) target = Math.max(target, overrideTarget * scale);
  cart.speed += (target - cart.speed) * (1 - Math.exp(-THROTTLE.respond * dt));
}
