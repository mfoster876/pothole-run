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
  { id: 'fruit',  label: 'Vendor Fruit — strength (costs a lil)' },
];

// One-line flavour on how this driver earns (the risk/reward dial).
const NOTE = {
  yute:       'Steady driver. Frequent small money, gentle road.',
  rasta:      'Smooth & calm. Easy money flows — but a lower ceiling.',
  conductor:  'Reckless! Cash is rare, big & hard to grab — huge upside.',
  politician: 'Untouchable & filthy rich — but dodge yuh responsibilities.',
  taximan:    'Most reckless, most dexterous. Whip through gaps — but fragile.',
};

// People / road characters this driver should watch for (beyond the negatives above).
const PEOPLE = {
  yute:       ['Police — big fines', 'Reckless coaster bus'],
  rasta:      ['Police / Babylon — dem trouble Rasta most', 'Reckless coaster bus'],
  conductor:  ['Police — big fines', 'Reckless coaster bus'],
  politician: ['Police — but dem wave yuh through (immune)', 'Reckless coaster bus'],
  taximan:    ['Police — dem trouble yuh more (1.4×)', 'Reckless coaster bus'],
};

// The heart of each driver: their UNFAIR EDGE (perks the others don't get) and their
// UNIQUE WEAKNESS (the price they pay). Pulled straight from their real stats/mechanics
// in characters.js + the special rules in run.js/game.js, phrased for the player.
const TRAITS = {
  yute: {
    perks: ['Never go inna debt — protected', 'Steady hands, gentle road', 'Frequent small money'],
    cons:  ['Low reward ceiling — small notes', 'No immunities — face every hazard', 'Lifestyle temptations tempt yuh'],
  },
  rasta: {
    perks: ['Tough cart — soaks up hits', 'Calm & steady, barely sway', 'Easy money — strong draw'],
    cons:  ['Slowest top speed', 'Babylon trouble yuh most (2× police)', 'Pork wipes out yuh blessing', 'Lady of di Night drains cash & blessing'],
  },
  conductor: {
    perks: ['Very fast', 'Huge score ceiling — big notes'],
    cons:  ['Fragile cart, poor handling', 'Twitchy — wanders pon di road', 'Cash rare & hard to grab', 'Bleaching disfigures + burns yuh'],
  },
  politician: {
    perks: ['Police wave yuh through (bribe)', 'Immune to people & roadkill', 'Paved roads — few potholes', 'Mega-bills $20k–$500k', 'Best money draw — rakes it in'],
    cons:  ['Potholes/manholes wreck yuh full force', 'Responsibilities drain yuh millions', 'Big bribes & bills CAN debt yuh', 'Dodge di bills (voters, contractors)'],
  },
  taximan: {
    perks: ['Most dexterous — top handling', 'Fast, high score ceiling', 'Bigger notes'],
    cons:  ['Most fragile cart', 'Wildest sway — reckless', 'Police trouble yuh (1.4×)', 'Cash rare & hard to grab', 'Lady of di Night drains cash & blessing'],
  },
};

/**
 * { good: [{label}], bad: [{label}], perks: [str], cons: [str], people, note } for the
 * given driver. `good` lists the shared pick-ups plus this driver's own drinks and
 * special items; `bad` lists the negatives they must avoid; `perks`/`cons` are the
 * driver's unfair advantages and unique drawbacks (the EDGE / WEAKNESS columns).
 */
export function legendFor(character) {
  const good = SHARED_GOOD
    .concat(eligibleDrinks(character))
    .concat(eligibleItems(character));
  const bad = eligibleNegatives(character);
  const id = character && character.id;
  const traits = (id && TRAITS[id]) || { perks: [], cons: [] };
  return {
    good, bad,
    perks: traits.perks,
    cons: traits.cons,
    people: (id && PEOPLE[id]) || [],
    note: (id && NOTE[id]) || '',
  };
}
