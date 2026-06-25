// src/drinks.js — drink power-up definitions + eligibility + effect application
import { DRINK } from './constants.js';

export const DRINKS = {
  ting:       { id: 'ting',       label: 'Ting',          potency: 0.40, alcohol: 0,    color: '#7ec850' },
  boom:       { id: 'boom',       label: 'Boom',          potency: 0.70, alcohol: 0,    color: '#1f78d1' },
  redstripe:  { id: 'redstripe',  label: 'Red Stripe',    potency: 0.80, alcohol: 0.40, color: '#d12b1f' },
  whiterum:   { id: 'whiterum',   label: 'White Rum',     potency: 1.0,  alcohol: 0.85, color: '#eef2f5' },
  spirulina:  { id: 'spirulina',  label: 'Spirulina',     potency: 0.80, alcohol: 0,    color: '#1f8a4c' },
  rootstonic: { id: 'rootstonic', label: 'Roots Tonic',   potency: 0.50, alcohol: 0.10, color: '#7a4a22' },
};

// Which drinks each character is eligible for
const ELIGIBLE = {
  yute:      ['ting', 'boom'],
  conductor: ['ting', 'boom', 'redstripe', 'whiterum'],
  rasta:     ['ting', 'boom', 'redstripe', 'whiterum', 'spirulina', 'rootstonic'],
};

// Spawn rarity weights per drink id. Kept deliberately low so a drink boost is an
// occasional treat, not constant invincibility — the road still demands skill.
const WEIGHTS = {
  ting:       1,
  boom:       0.8,
  spirulina:  0.6,
  rootstonic: 0.6,
  redstripe:  0.6,
  whiterum:   0.3,
};

/**
 * Returns true if the character (by id) can consume the given drink id.
 * Unknown character or unknown drink → false.
 */
export function canDrink(character, id) {
  if (!character || !id) return false;
  const list = ELIGIBLE[character.id];
  if (!list) return false;
  return list.includes(id);
}

/**
 * Apply a drink's effect to effects and cart.
 * Sets effects.super = boostDur, effects.superMax = boostDur.
 * For alcoholic drinks: sets effects.tipsy = boostDur + DRINK.tipsyExtra
 *   and cart.tipsy = alcohol magnitude.
 * For non-alcoholic drinks: cart.tipsy = 0, no effects.tipsy.
 * Returns boostDur.
 */
export function applyDrink(effects, cart, id) {
  const drink = DRINKS[id];
  if (!drink) return 0;
  let boostDur = DRINK.baseDur * (0.5 + drink.potency);
  boostDur *= 1 + ((cart.blessing && cart.blessing.invincExtend) || 0);
  effects.super    = boostDur;
  effects.superMax = boostDur;
  if (drink.alcohol > 0) {
    effects.tipsy = boostDur + DRINK.tipsyExtra;
    cart.tipsy    = drink.alcohol;
  } else {
    cart.tipsy = 0;
  }
  return boostDur;
}

/**
 * Returns an array of { type, weight } for the drinks this character can pick up.
 * Used by the spawner to build a weighted drink list.
 */
export function drinkWeightsFor(character) {
  if (!character) return [];
  const list = ELIGIBLE[character.id];
  if (!list) return [];
  return list.map(id => ({ type: id, weight: WEIGHTS[id] }));
}
