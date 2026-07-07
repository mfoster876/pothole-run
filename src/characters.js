// `sway` = how much the ride wanders/wobbles on its own (visual + felt). The
// conductor is reckless: fast, loose, twitchy. The rasta is smooth and steady.
//
// The chosen driver is a difficulty/REWARD dial (see the rebalance spec):
//   cashFind — multiplier on how OFTEN money spawns.
//   billBias — integer ladder-shift on each note (reckless → bigger notes, rarer).
//   coinDraw — collection magnet (reckless → smaller, so even visible cash is hard).
//   scoreMult — reward/score ceiling (reckless → higher).
// Reckless drivers reach a higher ceiling but find/collect cash frustratingly rarely;
// smooth drivers get frequent, easy, smaller money.
//
// `immune` / `damageScale` make hazard categories harmless or softer for a driver
// (used by the privileged Politician). Categories live on the hazard types.
// `debtProof` — this driver's spendable cash never drops below zero: a fine/vice/
// responsibility still bites their TAKE down toward nothing, but can't plunge THEM into
// the red. The Politician sits on bottomless reserves; the School Yute is protected.
// Everyone else can genuinely go into debt (a run in the red drags the wallet negative).
export const CHARACTERS = [
  { id: 'yute', name: 'School Yute', topSpeed: 1.0, handling: 1.05, toughness: 1.0, coinDraw: 1.05, scoreMult: 1.0, sway: 1.0, cashFind: 1.0, billBias: 0, debtProof: true, locked: false },
  // `policeMult` — Babylon troubles the Rasta most: police spawn twice as often for him.
  { id: 'rasta', name: 'Rasta Musician', topSpeed: 0.86, handling: 1.22, toughness: 1.3, coinDraw: 1.4, scoreMult: 1.0, sway: 0.6, cashFind: 1.35, billBias: 0, policeMult: 2, locked: false },
  { id: 'conductor', name: 'Bleachaz Conductor', topSpeed: 1.3, handling: 0.7, toughness: 0.66, coinDraw: 0.8, scoreMult: 1.35, sway: 1.7, cashFind: 0.5, billBias: 1, locked: true },
  // Unlocked only with loads of money. A money magnet (corruption) who's waved through
  // by police (he just bribes them — never stopped) and shrugs off pedestrians/roadkill,
  // but his RIDE now takes the SAME battering as anyone's: full traffic damage, and
  // potholes/manholes stay "equally devastating" (fullDamageCats ignores his toughness).
  // Money is almost all $5000 (handled in game.js).
  { id: 'politician', name: 'Di Politician', topSpeed: 1.15, handling: 1.1, toughness: 1.4, coinDraw: 1.6, scoreMult: 1.2, sway: 0.8, cashFind: 1.0, billBias: 0,
    immune: ['pedestrian', 'animal'], fullDamageCats: ['road'], locked: true },
  // The Taxi Man: the MOST reckless driver but the MOST dexterous swerver — twitchy and
  // fragile, yet whips through gaps like no one else (top handling). High reward ceiling,
  // hard-to-collect cash. Police trouble him more than most.
  { id: 'taximan', name: 'Taxi Man', topSpeed: 1.28, handling: 1.45, toughness: 0.6, coinDraw: 0.85, scoreMult: 1.3, sway: 1.8, cashFind: 0.6, billBias: 1, policeMult: 1.4, locked: true },

  // ── Women of Jamaica — playable from the start (student + principal), so women and
  // girls see themselves on the roster. Diverse, respectful archetypes. ──
  // The Uni Girl: a young woman working her way through university — nimble, level-headed,
  // and (like the School Yute) DEBT-PROOF: a student is protected from going in the red.
  { id: 'student', name: 'Uni Girl', topSpeed: 1.0, handling: 1.18, toughness: 0.98, coinDraw: 1.1, scoreMult: 1.05, sway: 0.9, cashFind: 1.05, billBias: 0, debtProof: true, locked: false },
  // Di Principal: a commanding school head — steadiest hands on the roster, hard to
  // rattle, not the fastest. Her school bell scatters pickney (clears the road), extra-
  // lessons fees pay steady side money, and the placement-bribe envelope is her
  // temptation: quick cash, but the scandal follows (social commentary, deliberate).
  { id: 'principal', name: 'Di Principal', topSpeed: 0.96, handling: 1.2, toughness: 1.35, coinDraw: 1.15, scoreMult: 1.0, sway: 0.65, cashFind: 1.1, billBias: 0, locked: false },
  // Di Higgler: an iconic Jamaican market woman — a shrewd entrepreneur with the best
  // nose for money on the road (huge coin draw + frequent finds), tough and unhurried.
  // Unlocked with a little banked cash (she respects a hustler). A proud, dignified figure.
  { id: 'higgler', name: 'Di Higgler', topSpeed: 0.9, handling: 1.05, toughness: 1.2, coinDraw: 1.55, scoreMult: 1.12, sway: 0.8, cashFind: 1.45, billBias: 0, locked: true }
];
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
