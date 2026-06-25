import { LANES, CART, PLAYER_HALF_WIDTH } from './constants.js';
import { createCondition } from './wreck.js';

export function createCart(character) {
  return {
    character,
    laneIndex: 1,
    x: LANES[1],
    halfWidth: PLAYER_HALF_WIDTH,
    speed: CART.startSpeed,
    lean: 0,
    condition: createCondition(CART.maxCondition)
  };
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(LANES.length - 1, cart.laneIndex + dir));
}
export function updateCart(cart, dt) {
  const targetX = LANES[cart.laneIndex];
  const k = CART.laneLerp * cart.character.handling;
  const t = 1 - Math.exp(-k * dt);
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  const max = CART.maxSpeed * cart.character.topSpeed;
  cart.speed = Math.min(max, cart.speed + CART.accel * dt * cart.character.topSpeed);
}
