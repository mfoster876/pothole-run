// src/foods.js — Jamaican street-food power-ups: Ackee + the Beef Patty.
//
// Both are open to EVERY driver, but the Rasta is served the ITAL veggie patty, never beef
// (Livity / vegetarian respect). The swap happens at spawn AND at effect time, so the Rasta
// literally sees a Veggie Patty on the road, not a beef one.
//
//  - Ackee (national fruit, ripe arils): DEFENSIVE nourishment — heals the ride and steadies
//    the hands. No meat, ital-friendly for all.
//  - Beef Patty (hustle fuel): OFFENSIVE — a quick dash + a heal + a little pocket change.
//  - Veggie Patty (Rasta ital): identical nourishment, callaloo not beef.
import { repair } from './wreck.js';
import { CART } from './constants.js';

export const FOODS = {
  ackee:       { id: 'ackee',       label: 'Ackee',        heal: 12, steady: 3.0, color: '#f2a33a' },
  patty:       { id: 'patty',       label: 'Beef Patty',   heal: 10, boost: 2.4, cash: 200, color: '#e8b23a' },
  veggiepatty: { id: 'veggiepatty', label: 'Veggie Patty', heal: 10, boost: 2.4, cash: 200, color: '#7bbf4a', ital: true },
};

const WEIGHTS = { ackee: 0.7, patty: 0.8, veggiepatty: 0.8 };

/**
 * Resolve the food a given character actually receives. The Rasta's beef patty becomes an
 * ital VEGGIE patty; everything else is unchanged. Safe to call with an already-resolved id.
 */
export function foodFor(character, id) {
  if (id === 'patty' && character && character.id === 'rasta') return 'veggiepatty';
  return id;
}

/** Weighted spawn list of foods for this driver (patty → veggiepatty for the Rasta). */
export function foodWeightsFor(character) {
  const pattyId = foodFor(character, 'patty');
  return [
    { type: 'ackee', weight: WEIGHTS.ackee },
    { type: pattyId, weight: WEIGHTS[pattyId] },
  ];
}

/**
 * Apply a food's effect to `effects`, `cart`, and (for the patty's pocket change) `run`.
 * `character` is optional and only used to resolve the ital variant defensively — by the
 * time a food is collected its type is usually already the right one.
 *  - heal   → restores condition (capped at max)
 *  - steady → seconds of steadier hands (Ackee)
 *  - boost  → seconds of `super` dash, lengthened by any spiritual blessing (Patty)
 *  - cash   → a few dollars in the wallet (Patty)
 */
export function applyFood(effects, cart, id, run, character) {
  const food = FOODS[foodFor(character, id)] || FOODS[id];
  if (!food) return;
  const ext = 1 + ((cart.blessing && cart.blessing.invincExtend) || 0);
  if (typeof food.heal === 'number' && cart.condition != null) {
    cart.condition = repair(cart.condition, CART.maxCondition * food.heal / 100);
  }
  if (typeof food.steady === 'number') {
    effects.steady = Math.max(effects.steady || 0, food.steady);
  }
  if (typeof food.boost === 'number') {
    const dur = food.boost * ext;
    effects.super = Math.max(effects.super || 0, dur);
    effects.superMax = effects.super;
  }
  if (run && typeof food.cash === 'number') run.coins += food.cash;
}

/** { id, label } list for the legend — Ackee + the driver's patty variant. */
export function eligibleFoods(character) {
  const pattyId = foodFor(character, 'patty');
  return [
    { id: 'ackee', label: FOODS.ackee.label },
    { id: pattyId, label: FOODS[pattyId].label },
  ];
}
