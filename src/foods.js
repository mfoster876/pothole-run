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
  // Ripe plantain — sweet quick energy anywhere on the island: a modest heal + a short dash.
  plantain:    { id: 'plantain',    label: 'Ripe Plantain', heal: 8, boost: 1.6, color: '#e8c020' },
  // Roast breadfruit — the filling COUNTRY staple: the biggest food heal + steady hands.
  // Rural roads only (Fern Gully / Holland Bamboo / Bog Walk — stages flagged `rural`).
  breadfruit:  { id: 'breadfruit',  label: 'Roast Breadfruit', heal: 22, steady: 2.5, color: '#8a9a3a', rural: true },
};

const WEIGHTS = { ackee: 0.7, patty: 0.8, veggiepatty: 0.8, plantain: 0.7, breadfruit: 0.5 };

/**
 * Resolve the food a given character actually receives. The Rasta's beef patty becomes an
 * ital VEGGIE patty; everything else is unchanged. Safe to call with an already-resolved id.
 */
export function foodFor(character, id) {
  if (id === 'patty' && character && character.id === 'rasta') return 'veggiepatty';
  return id;
}

/**
 * Weighted spawn list of foods for this driver (patty → veggiepatty for the Rasta).
 * `stage` is optional: roast breadfruit joins the pool only on rural stages.
 */
export function foodWeightsFor(character, stage) {
  const pattyId = foodFor(character, 'patty');
  const list = [
    { type: 'ackee', weight: WEIGHTS.ackee },
    { type: pattyId, weight: WEIGHTS[pattyId] },
    { type: 'plantain', weight: WEIGHTS.plantain },
  ];
  if (stage && stage.rural) list.push({ type: 'breadfruit', weight: WEIGHTS.breadfruit });
  return list;
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

/** { id, label } list for the legend — Ackee + the driver's patty variant + the fruits. */
export function eligibleFoods(character) {
  const pattyId = foodFor(character, 'patty');
  return [
    { id: 'ackee', label: FOODS.ackee.label },
    { id: pattyId, label: FOODS[pattyId].label },
    { id: 'plantain', label: FOODS.plantain.label },
    { id: 'breadfruit', label: FOODS.breadfruit.label + ' (country roads)' },
  ];
}
