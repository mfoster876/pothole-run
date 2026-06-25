// src/charitems.js — character-specific pickups (beyond the shared drinks).
//
// Two flavours, both gated to one driver:
//   • Conductor "bleach vanity" items (cake soap, curry powder, toothpaste):
//     a short flashy boost that then BACKFIRES into sloppy "burn" steering — the
//     mechanic itself says vanity has consequences (it isn't a free reward).
//   • School Yute wholesome items (books, stationery, bag juice, Lasco shake):
//     steadiness, a small heal, and a brief refreshment dash — pure benefit.
import { repair } from './wreck.js';
import { CART, BLEACH } from './constants.js';

export const ITEMS = {
  // ── Conductor — bleach vanity (boost → backfire) ──
  // boost  = seconds of invincible speed surge (reuses the `super` effect)
  // burn   = magnitude of the after-effect sloppy steering (0..1, reuses cart.tipsy)
  // tail   = extra seconds the burn lingers after the boost ends
  cakesoap:    { id: 'cakesoap',    label: 'Cake Soap',    char: 'conductor', boost: 2.6, burn: 1.0, tail: 3.5, color: '#3a6ad0' },
  currypowder: { id: 'currypowder', label: 'Curry Powder', char: 'conductor', boost: 2.2, burn: 0.8, tail: 3.0, color: '#d9a01f' },
  toothpaste:  { id: 'toothpaste',  label: 'Toothpaste',   char: 'conductor', boost: 1.8, burn: 0.6, tail: 2.5, color: '#e8f2f5' },

  // ── School Yute — wholesome (no downside) ──
  // steady = seconds of steadier hands; heal = condition restored; boost = brief dash
  books:      { id: 'books',      label: 'Books',      char: 'yute', steady: 3.5, heal: 8,  color: '#c0451f' },
  stationery: { id: 'stationery', label: 'Stationery', char: 'yute', steady: 3.0, heal: 6,  color: '#1f9ad9' },
  bagjuice:   { id: 'bagjuice',   label: 'Bag Juice',  char: 'yute', heal: 12, boost: 1.4, color: '#e23f7a' },
  lasco:      { id: 'lasco',      label: 'Lasco Shake',char: 'yute', heal: 18, boost: 1.8, color: '#f0d8a0' },
};

// Eligibility list per character id.
const ELIGIBLE = {
  conductor: ['cakesoap', 'currypowder', 'toothpaste'],
  yute:      ['books', 'stationery', 'bagjuice', 'lasco'],
  // The Rasta keeps his unique edge in the drinks pool (spirulina / roots tonic).
  rasta:     [],
};

// Spawn rarity weights. Kept modest so these stay a treat, not a constant crutch.
const WEIGHTS = {
  cakesoap: 0.5, currypowder: 0.6, toothpaste: 0.7,
  books: 0.8, stationery: 0.8, bagjuice: 0.7, lasco: 0.5,
};

/** True if the character (by id) may pick up the given item id. */
export function canUseItem(character, id) {
  if (!character || !id) return false;
  const list = ELIGIBLE[character.id];
  return !!list && list.includes(id);
}

/**
 * Apply an item's effect to `effects` and `cart`.
 *  - Bleach items: set `effects.super` (boost) + `effects.burn` (sloppy tail) and
 *    `cart.tipsy` (the steering-impair magnitude the sim already understands).
 *  - Yute items: heal condition, raise steadiness, and/or a brief `super` dash.
 * A blessing's invincExtend lengthens any boost, same as drinks/water.
 */
export function applyItem(effects, cart, id) {
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
  if (typeof it.burn === 'number') {
    // The boost first (invincible + fast), then the bleach "burn": sloppy steering.
    cart.tipsy   = it.burn;
    effects.burn = it.boost * ext + it.tail;
    // Each bleach item disfigures him one stage worse — black → … → peeling → skull.
    cart.bleachLevel = Math.min(BLEACH.maxLevel, (cart.bleachLevel || 0) + 1);
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
