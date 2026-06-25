// src/powerups.js
import { repair } from './wreck.js';
import { CART, POWERUP, SUPERCHARGE, FRUIT } from './constants.js';
import { applyDrink } from './drinks.js';
import { applyItem } from './charitems.js';
import { chargeRun } from './economy.js';

export const POWERUPS = {
  water:  { rarity: 'rare' },
  tools:  { rarity: 'common',    steady: POWERUP.steady, heal: POWERUP.toolsHeal },
  coffee: { rarity: 'ultra-rare' }
};
export function createEffects() { return {}; }
export function effectActive(fx, name) { return (fx[name] || 0) > 0; }
export function tickEffects(fx, dt) {
  for (const k of Object.keys(fx)) {
    // `*Max` keys are reference maxima for HUD bars, not countdowns — never tick them.
    if (k.endsWith('Max')) continue;
    fx[k] -= dt;
    if (fx[k] <= 0) { delete fx[k]; delete fx[k + 'Max']; }  // drop its companion max too
  }
}
export function applyPowerup(fx, cart, run, kind, distance, info, save) {
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
  } else if (kind === 'charitem') {
    applyItem(fx, cart, info && info.item, run, save);
  } else if (kind === 'fruit') {
    // Street fruit: pay a little, get a quick STRENGTH top-up + a short dash. The cash
    // cost floors at zero for the debt-proof (Politician / School Yute) via chargeRun.
    if (run) chargeRun(run, cart, FRUIT.cost);
    cart.condition = repair(cart.condition, CART.maxCondition * FRUIT.heal / 100);
    const ext = 1 + ((cart.blessing && cart.blessing.invincExtend) || 0);
    fx.super = Math.max(fx.super || 0, FRUIT.boost * ext);
    fx.superMax = fx.super;
  }
}
export function toolSpriteFor(vehicle) { return vehicle && vehicle.isCar ? 'socket' : 'spanner'; }
