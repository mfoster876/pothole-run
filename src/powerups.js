// src/powerups.js
import { repair } from './wreck.js';
import { CART, POWERUP } from './constants.js';

export const POWERUPS = {
  water:  { rarity: 'rare',      boost: POWERUP.boost },
  tools:  { rarity: 'common',    steady: POWERUP.steady, heal: POWERUP.toolsHeal },
  coffee: { rarity: 'ultra-rare' }
};
export function createEffects() { return {}; }
export function effectActive(fx, name) { return (fx[name] || 0) > 0; }
export function tickEffects(fx, dt) {
  for (const k of Object.keys(fx)) { fx[k] -= dt; if (fx[k] <= 0) delete fx[k]; }
}
export function applyPowerup(fx, cart, run, kind, distance) {
  if (kind === 'water') {
    cart.condition = repair(cart.condition, CART.maxCondition);   // full heal
    fx.boost = POWERUP.boost;
  } else if (kind === 'tools') {
    cart.condition = repair(cart.condition, CART.maxCondition * POWERUP.toolsHeal / 100);
    fx.steady = POWERUP.steady;
  } else if (kind === 'coffee') {
    run.coffeeUntilDist = (run.distance || distance) + POWERUP.coffeeDist;
  }
}
export function toolSpriteFor(vehicle) { return vehicle && vehicle.isCar ? 'socket' : 'spanner'; }
