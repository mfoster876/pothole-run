import { LANES, CART, PLAYER_HALF_WIDTH } from './constants.js';
import { createCondition } from './wreck.js';
import { getVehicle } from './vehicles.js';

export function createCart(character, vehicle = getVehicle('handcart')) {
  return {
    character,
    vehicle,
    laneIndex: 1,
    x: LANES[1],
    vx: 0,            // lateral velocity from gusts (decays)
    halfWidth: PLAYER_HALF_WIDTH,
    speed: CART.startSpeed,
    lean: 0,
    condition: createCondition(CART.maxCondition)
  };
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(LANES.length - 1, cart.laneIndex + dir));
}
// Effective stats combine the ride's capability with the driver's personality.
function effSpeed(cart)    { return cart.character.topSpeed * cart.vehicle.speed; }
function effHandling(cart) { return cart.character.handling * cart.vehicle.handling; }

export function updateCart(cart, dt) {
  // gust push first, then the driver hauls the cart back toward its lane
  cart.x += (cart.vx || 0) * dt;
  cart.vx = (cart.vx || 0) * Math.exp(-6 * dt);
  cart.x = Math.max(-1.1, Math.min(1.1, cart.x));
  const targetX = LANES[cart.laneIndex];
  // Square the handling spread so reckless/twitchy rides feel clearly different
  // from a heavy truck: a 0.78-handling pairing crawls into lane, a 1.7 snaps over.
  const k = CART.laneLerp * Math.pow(effHandling(cart), 1.6);
  const t = 1 - Math.exp(-k * dt);
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  const max = CART.maxSpeed * effSpeed(cart);
  cart.speed = Math.min(max, cart.speed + CART.accel * dt * effSpeed(cart));
}
