import { laneOverlap, inHitZone } from './collision.js';
import { applyDamage, repair } from './wreck.js';
import { hazardInfo } from './hazardTypes.js';
import { DAMAGE } from './constants.js';

export function createRun() {
  return { distance: 0, score: 0, coins: 0, wrecked: false };
}
export function resolveHits(run, cart, field) {
  for (const e of field.pool) {
    if (!e.active || e.collected) continue;
    const info = hazardInfo(e.type);
    const magnet = info.collectible ? cart.character.coinDraw : 1;
    const overlap = laneOverlap(cart.x, cart.halfWidth * magnet, e.x, e.halfWidth)
      && inHitZone(e.z, e.depth);
    if (!overlap) continue;
    e.collected = true;
    e.active = false;
    if (info.collectible) {
      run.coins += 1;
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
    } else {
      cart.condition = applyDamage(cart.condition, info.damage / cart.character.toughness);
    }
  }
}
