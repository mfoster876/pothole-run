export const CHARACTERS = [
  { id: 'yute', name: 'School Yute', topSpeed: 1.0, handling: 1.0, toughness: 1.0, coinDraw: 1.0, scoreMult: 1.0, locked: false },
  { id: 'rasta', name: 'Rasta Musician', topSpeed: 0.9, handling: 1.05, toughness: 1.25, coinDraw: 1.4, scoreMult: 1.0, locked: false },
  { id: 'conductor', name: 'Bleachaz Conductor', topSpeed: 1.25, handling: 0.78, toughness: 0.7, coinDraw: 1.0, scoreMult: 1.3, locked: true }
];
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
