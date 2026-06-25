import { laneOverlap } from './collision.js';
import { applyDamage, repair } from './wreck.js';
import { hazardInfo } from './hazardTypes.js';
import { DAMAGE, GUST, WIPER } from './constants.js';

export function createRun() {
  return { distance: 0, coins: 0 };
}

// Crossing-based resolution: an entity's z is its distance ahead of the cart and
// shrinks each frame. The moment it reaches/passes the cart plane (z <= 0) it gets
// exactly ONE chance to connect, then is consumed (`collected`) so it can never hit
// twice or hit late after a dodge. This is immune to step-size tunnelling.
export function resolveHits(run, cart, field) {
  for (const e of field.pool) {
    if (!e.active || e.collected) continue;
    if (e.z > 0) continue;                 // not yet at the cart plane
    e.collected = true;                    // consume this entity's single chance
    const info = hazardInfo(e.type);
    const magnet = info.collectible ? cart.character.coinDraw : 1;
    if (!laneOverlap(cart.x, cart.halfWidth * magnet, e.x, e.halfWidth)) {
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
      const value = e.value || 1;
      run.coins += value;
      cart.pickupValue = value;     // game.js picks the coin vs cash sound
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
    } else {
      const tough = cart.character.toughness * (cart.vehicle ? cart.vehicle.toughness : 1);
      cart.condition = applyDamage(cart.condition, info.damage / tough);
      // windscreen youth: forced "wash" skims coins off your fare
      if (info.coinLoss) { run.coins = Math.max(0, run.coins - WIPER.coinLoss); cart.washed = true; }
    }
  }
}
