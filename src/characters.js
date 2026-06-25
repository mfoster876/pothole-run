// `sway` = how much the ride wanders/wobbles on its own (visual + felt). The
// conductor is reckless: fast, loose, twitchy. The rasta is smooth and steady.
export const CHARACTERS = [
  { id: 'yute', name: 'School Yute', topSpeed: 1.0, handling: 1.05, toughness: 1.0, coinDraw: 1.0, scoreMult: 1.0, sway: 1.0, locked: false },
  { id: 'rasta', name: 'Rasta Musician', topSpeed: 0.86, handling: 1.22, toughness: 1.3, coinDraw: 1.4, scoreMult: 1.0, sway: 0.6, locked: false },
  { id: 'conductor', name: 'Bleachaz Conductor', topSpeed: 1.3, handling: 0.7, toughness: 0.66, coinDraw: 1.0, scoreMult: 1.35, sway: 1.7, locked: true }
];
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
