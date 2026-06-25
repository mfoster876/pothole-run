import { laneOverlap } from './collision.js';
import { applyGust } from './cart.js';
import { applyDamage, repair } from './wreck.js';
import { hazardInfo } from './hazardTypes.js';
import { DAMAGE, GUST, WIPER, HOP, COMBO, POLICE, POLITICIAN } from './constants.js';
import { applyPowerup, effectActive } from './powerups.js';
import { applyNegative } from './negatives.js';
import { chargeRun } from './economy.js';

export function createRun() {
  return { distance: 0, coins: 0, combo: 0 };
}

// What a windscreen youth shakes you down for on contact. Starts at WIPER.baseCharge
// early, grows with distance (every WIPER.distRamp metres ~doubles it), and scales by
// how flashy your ride is (greed rises with the vehicle's price). Capped at maxCharge.
export function wiperCharge(distance, vehicle) {
  const price = (vehicle && vehicle.price) || 0;
  const greed = Math.min(WIPER.maxGreed, 1 + price / WIPER.greedPerPrice);
  const deep  = 1 + Math.max(0, distance) / WIPER.distRamp;
  return Math.min(WIPER.maxCharge, Math.round(WIPER.baseCharge * greed * deep));
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
      // dodged — but a passing vehicle's wake still shoves the cart sideways (a steadier,
      // upgraded ride soaks up the shove — see applyGust)
      if (e.gust && Math.abs(cart.x - e.x) < GUST.range) {
        const dir = cart.x >= e.x ? 1 : -1; // pushed away from the vehicle
        applyGust(cart, dir, GUST.push * (GUST[e.gust] || 1));
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
      if (info.powerup) {
        applyPowerup(effects, cart, run, info.powerup, run.distance, info);
        cart.pickupLabel = info.label;   // name the exact pick-up for the HUD toast
      }
    } else if (e.type === 'bump') {
      cart.jumpT = HOP.air;          // launch — the bump itself never damages
      cart.bumped = true;
    } else if ((cart.jumpT || 0) > 0) {
      // airborne over a hazard — sail clear (a passing-traffic gust still applies)
      if (e.gust && Math.abs(cart.x - e.x) < GUST.range) {
        const dir = cart.x >= e.x ? 1 : -1;
        applyGust(cart, dir, GUST.push * (GUST[e.gust] || 1));
      }
    } else if (effectActive(effects, 'super')) {
      // SUPERCHARGE: cart is invincible — skip all damage, fines, negatives and
      // wiper coin-loss (gusts may still apply at the airborne-parity check above)
    } else if (info.negative) {
      // Lifestyle temptation / politician "responsibility": its own bite (money
      // drain, condition, and/or sloppy steering) — see negatives.js.
      cart.hitNegative = applyNegative(effects, cart, run, info.negative);
      run.combo = 0;
    } else {
      const ch = cart.character;
      const cat = info.category;
      // Privileged drivers (the Politician) shrug off whole hazard classes:
      // immune categories plow straight through (no damage, no fine, combo kept).
      if (ch.immune && cat && ch.immune.includes(cat)) {
        // untouchable — nothing happens (pedestrians / roadkill for the Politician)
      } else if (info.fine && ch.id === 'politician') {
        // The Politician is never STOPPED by police — he greases the palm (a bribe /
        // buys a lunch), and the bribed cop then CLEARS the road ahead of traffic for
        // him for a while. The bribe bites his take — but he's debt-proof, so it floors
        // at zero rather than driving his bottomless reserves into the red.
        chargeRun(run, cart, POLITICIAN.bribe);
        cart.bribed = true;
        effects.clearRoads = POLITICIAN.clearRoadsDur;
        run.combo = 0;
      } else {
        const tough = ch.toughness * (cart.vehicle ? cart.vehicle.toughness : 1);
        const resist = (cart.blessing && cart.blessing.resist) || 0;
        // Some classes ignore a driver's toughness break entirely — potholes & manholes
        // stay "equally devastating" for the Politician (his ride takes a real beating).
        const fullForce = ch.fullDamageCats && cat && ch.fullDamageCats.includes(cat);
        let dmg = fullForce ? info.damage : info.damage / tough;
        if (!fullForce && ch.damageScale && cat && ch.damageScale[cat] != null) dmg *= ch.damageScale[cat];
        dmg *= (1 - Math.min(0.9, resist));      // blessing makes the cart more resilient
        cart.condition = applyDamage(cart.condition, dmg);
        run.combo = 0;
        // windscreen youth: forced "wash" skims coins off your fare — a greedier ask the
        // deeper you are and the flashier the ride. Debt-capable (floored only for the
        // debt-proof drivers — Politician / School Yute).
        if (info.coinLoss) {
          const charge = wiperCharge(run.distance, cart.vehicle);
          chargeRun(run, cart, charge);
          cart.washed = true; cart.washCharge = charge;
        }
        // police shakedown: a hefty fine on contact (debt-capable, save for the debt-proof)
        if (info.fine) { chargeRun(run, cart, POLICE.fine); cart.fined = true; }
      }
    }
  }
}
