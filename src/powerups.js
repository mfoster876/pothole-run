// src/powerups.js
import { repair } from './wreck.js';
import { CART, POWERUP, SUPERCHARGE } from './constants.js';
import { applyDrink } from './drinks.js';

export const POWERUPS = {
  water:  { rarity: 'rare' },
  tools:  { rarity: 'common',    steady: POWERUP.steady, heal: POWERUP.toolsHeal },
  coffee: { rarity: 'ultra-rare' }
};
export function createEffects() { return {}; }
export function effectActive(fx, name) { return (fx[name] || 0) > 0; }
export function tickEffects(fx, dt) {
  for (const k of Object.keys(fx)) { fx[k] -= dt; if (fx[k] <= 0) delete fx[k]; }
}
export function applyPowerup(fx, cart, run, kind, distance, info) {
  if (kind === 'water') {
    const ext = 1 + ((cart.blessing && cart.blessing.invincExtend) || 0);
    fx.super    = SUPERCHARGE.dur * ext;
    fx.superMax = fx.super;       // invincibility + speed burst + money flood
  } else if (kind === 'tools') {
    cart.condition = repair(cart.condition, CART.maxCondition * POWERUP.toolsHeal / 100);
    fx.steady = POWERUP.steady;
  } else if (kind === 'coffee') {
    run.coffeeUntilDist = (run.distance || distance) + POWERUP.coffeeDist;
  } else if (kind === 'drink') {
    applyDrink(fx, cart, info && info.drink);
  }
}
export function toolSpriteFor(vehicle) { return vehicle && vehicle.isCar ? 'socket' : 'spanner'; }
