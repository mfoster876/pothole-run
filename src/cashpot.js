// src/cashpot.js
// Cash Pot lottery mini-game. Real-ish Jamaican "drop pan / Cash Pot" feel:
// mostly lose, sometimes small, rarely big.
// EV per stake is 0.74 (< 1) so the house wins long-run. Winnings go to wallet
// only — NOT lifetimeEarned, because gambling isn't "earning" (keeps ranks honest).
import { spend } from './economy.js';

export const STAKE = 100;

// Tuned table: p-sum = 1.0, EV = 0.74 < 1.
export const OUTCOMES = [
  { mult: 0,  p: 0.74  },  // lose — di house eat
  { mult: 1,  p: 0.15  },  // money back
  { mult: 3,  p: 0.08  },  // small win
  { mult: 8,  p: 0.025 },  // decent hit
  { mult: 30, p: 0.005 }   // "drop pan" jackpot
];

export function expectedValue() {
  return OUTCOMES.reduce((s, o) => s + o.p * o.mult, 0);
}

// drawCashPot(rng): picks an outcome by walking the CDF.
// rng() in [0,1); 0 → first outcome (mult:0), near-1 → last outcome (mult:30).
export function drawCashPot(rng) {
  let r = rng();
  for (const o of OUTCOMES) {
    r -= o.p;
    if (r < 0) return o;
  }
  return OUTCOMES[OUTCOMES.length - 1];
}

export function playCashPot(save, rng) {
  if (!spend(save, STAKE)) return { ok: false, won: 0 };
  const o = drawCashPot(rng);
  const won = STAKE * o.mult;
  save.wallet += won;
  return { ok: true, won, mult: o.mult };
}
