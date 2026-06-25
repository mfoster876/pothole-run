// src/charitems.js — character-specific GOOD pickups (beyond the shared drinks).
//
// School Yute wholesome items (books, stationery, bag juice, Lasco shake): steadiness,
// a small heal, and a brief refreshment dash — pure benefit.
//
// (The Conductor's cake soap / curry powder / toothpaste are NOT pickups — they're
// hazards he must AVOID; they live in negatives.js now, burning his skin and cash.)
import { repair } from './wreck.js';
import { CART } from './constants.js';
import { chargeRun } from './economy.js';

export const ITEMS = {
  // ── School Yute — wholesome (no downside) ──
  // steady = seconds of steadier hands; heal = condition restored; boost = brief dash
  books:      { id: 'books',      label: 'Books',      char: 'yute', steady: 3.5, heal: 8,  color: '#c0451f' },
  stationery: { id: 'stationery', label: 'Stationery', char: 'yute', steady: 3.0, heal: 6,  color: '#1f9ad9' },
  bagjuice:   { id: 'bagjuice',   label: 'Bag Juice',  char: 'yute', heal: 12, boost: 1.4, color: '#e23f7a' },
  lasco:      { id: 'lasco',      label: 'Lasco Shake',char: 'yute', heal: 18, boost: 1.8, color: '#f0d8a0' },

  // ── Di Politician — perks of power ──
  // cash      = money GAINED (a private-sector backhander — corruption pays)
  // cashDrain = money LOST (his vices cost him)
  privatebribe: { id: 'privatebribe', label: 'Private-Sector Bribe', char: 'politician', cash: 200000, boost: 1.2, color: '#1f9a4c' },
  ladynight:    { id: 'ladynight',    label: 'Lady of di Night',     char: 'politician', heal: 25, boost: 2.0, cashDrain: 150000, color: '#c0306a' },
};

// Eligibility list per character id.
const ELIGIBLE = {
  yute:       ['books', 'stationery', 'bagjuice', 'lasco'],
  politician: ['privatebribe', 'ladynight'],
  // Rasta keeps his edge in the drinks pool; Conductor's "items" are now avoid-hazards.
  conductor:  [],
  rasta:      [],
};

// Spawn rarity weights. Kept modest so these stay a treat, not a constant crutch.
const WEIGHTS = {
  books: 0.8, stationery: 0.8, bagjuice: 0.7, lasco: 0.5,
  privatebribe: 0.5, ladynight: 0.6,
};

/** True if the character (by id) may pick up the given item id. */
export function canUseItem(character, id) {
  if (!character || !id) return false;
  const list = ELIGIBLE[character.id];
  return !!list && list.includes(id);
}

/**
 * Apply an item's effect to `effects`, `cart`, and (for money items) `run`.
 *  - Yute items: heal condition, raise steadiness, and/or a brief `super` dash.
 *  - Politician items: a `cash` windfall (private-sector bribe) or a `cashDrain` vice
 *    (lady of di night — boosts vitality but costs him).
 * A blessing's invincExtend lengthens any boost, same as drinks/water.
 */
export function applyItem(effects, cart, id, run) {
  const it = ITEMS[id];
  if (!it) return;
  const ext = 1 + ((cart.blessing && cart.blessing.invincExtend) || 0);

  if (typeof it.heal === 'number' && cart.condition) {
    cart.condition = repair(cart.condition, CART.maxCondition * it.heal / 100);
  }
  if (typeof it.steady === 'number') {
    effects.steady = Math.max(effects.steady || 0, it.steady);
  }
  if (typeof it.boost === 'number') {
    const dur = it.boost * ext;
    effects.super = Math.max(effects.super || 0, dur);
    effects.superMax = effects.super;
  }
  if (run) {
    if (typeof it.cash === 'number')      run.coins += it.cash;       // a windfall
    if (typeof it.cashDrain === 'number') chargeRun(run, cart, it.cashDrain);  // costly vice (floored for the debt-proof)
  }
}

/** { id, label } pairs of the items this character can pick up — for the legend. */
export function eligibleItems(character) {
  if (!character) return [];
  const list = ELIGIBLE[character.id] || [];
  return list.map(id => ({ id, label: ITEMS[id].label }));
}

/** Weighted spawn list for the items this character can pick up. */
export function itemWeightsFor(character) {
  if (!character) return [];
  const list = ELIGIBLE[character.id];
  if (!list) return [];
  return list.map(id => ({ type: id, weight: WEIGHTS[id] }));
}
