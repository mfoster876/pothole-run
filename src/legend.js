// src/legend.js — what helps and what hurts the CURRENTLY-SELECTED driver.
// Powers the start-menu legend so the player knows, at a glance, which pick-ups to
// chase and which temptations to dodge based on who's driving.
import { eligibleDrinks } from './drinks.js';
import { eligibleItems } from './charitems.js';
import { eligibleNegatives } from './negatives.js';

// Pick-ups every driver benefits from (shared across the roster).
const SHARED_GOOD = [
  { id: 'water',  label: 'Water — supercharge' },
  { id: 'tools',  label: 'Hardware Tools — repair' },
  { id: 'coffee', label: 'Blue Mountain Coffee — cash window' },
];

// One-line flavour on how this driver earns (the risk/reward dial).
const NOTE = {
  yute:       'Steady driver. Frequent small money, gentle road.',
  rasta:      'Smooth & calm. Easy money flows — but a lower ceiling.',
  conductor:  'Reckless! Cash is rare, big & hard to grab — huge upside.',
  politician: 'Untouchable. Notes are mostly $5000 — but dodge di bills.',
};

/**
 * { good: [{label}], bad: [{label}], note } for the given driver. `good` lists the
 * shared pick-ups plus this driver's own drinks and special items; `bad` lists the
 * negatives they must avoid.
 */
export function legendFor(character) {
  const good = SHARED_GOOD
    .concat(eligibleDrinks(character))
    .concat(eligibleItems(character));
  const bad = eligibleNegatives(character);
  return { good, bad, note: (character && NOTE[character.id]) || '' };
}
