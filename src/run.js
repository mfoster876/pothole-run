import { laneOverlap } from './collision.js';
import { applyDamage, repair } from './wreck.js';
import { hazardInfo } from './hazardTypes.js';
import { DAMAGE, GUST, WIPER, HOP, COMBO } from './constants.js';
import { applyPowerup, effectActive } from './powerups.js';

export function createRun() {
  return { distance: 0, coins: 0, combo: 0 };
}

// Crossing-based resolution: an entity's z is its distance ahead of the cart and
// shrinks each frame. The moment it reaches/passes the cart plane (z <= 0) it gets
// exactly ONE chance to connect, then is consumed (`collected`) so it can never hit
// twice or hit late after a dodge. This is immune to step-size tunnelling.
export function resolveHits(run, cart, field, effects = cart._effects || {}) {
  for (const e of field.pool) {
    if (!e.active || e.collected) continue;
    if (e.z > 0) continue;                 // not yet at the cart plane
    e.collected = true;                    // consume this entity's single chance
    const info = hazardInfo(e.type);
    const magnet = info.collectible ? cart.character.coinDraw : 1;
    if (!laneOverlap(cart.x, cart.halfWidth * magnet, e.x, e.halfWidth)) {
      if (!info.collectible) {
        const gap = Math.abs(cart.x - e.x) - (cart.halfWidth + e.halfWidth);
        if (gap >= 0 && gap <= COMBO.nearBand) {
          run.combo = Math.min(COMBO.max, run.combo + COMBO.step);
          cart.nearMiss = true;
        }
      }
      // dodged — but a passing vehicle's wake still shoves the cart sideways
      if (e.gust && Math.abs(cart.x - e.x) < GUST.range) {
        const dir = cart.x >= e.x ? 1 : -1; // pushed away from the vehicle
        cart.vx = (cart.vx || 0) + dir * GUST.push * (GUST[e.gust] || 1);
        cart.gusted = true;
      }
      continue;
    }
    e.active = false;
    if (info.collectible) {
      const mult = 1 + run.combo * COMBO.bonusPer;
      const value = Math.round((e.value || 1) * mult);
      run.coins += value;
      cart.pickupValue = value;     // game.js picks the coin vs cash sound
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
      if (info.powerup) { applyPowerup(effects, cart, run, info.powerup, run.distance, info); }
    } else if (e.type === 'bump') {
      cart.jumpT = HOP.air;          // launch — the bump itself never damages
      cart.bumped = true;
    } else if ((cart.jumpT || 0) > 0) {
      // airborne over a hazard — sail clear (a passing-traffic gust still applies)
      if (e.gust && Math.abs(cart.x - e.x) < GUST.range) {
        const dir = cart.x >= e.x ? 1 : -1;
        cart.vx = (cart.vx || 0) + dir * GUST.push * (GUST[e.gust] || 1);
      }
    } else if (effectActive(effects, 'super')) {
      // SUPERCHARGE: cart is invincible — skip all damage and wiper coin-loss
      // (gusts may still apply at the airborne-parity check above)
    } else {
      const tough = cart.character.toughness * (cart.vehicle ? cart.vehicle.toughness : 1);
      cart.condition = applyDamage(cart.condition, info.damage / tough);
      run.combo = 0;
      // windscreen youth: forced "wash" skims coins off your fare
      if (info.coinLoss) { run.coins = Math.max(0, run.coins - WIPER.coinLoss); cart.washed = true; }
    }
  }
}
