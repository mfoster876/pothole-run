// src/tithes.js
// Tithes & Offerings — blessing system.
// The player gives a portion of their wallet in exchange for a resilience BLESSING
// that fades each run, encouraging faithful, recurring giving.
import { TITHE } from './constants.js';

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

// Ordered offering options shown on the tithes screen.
export const OFFERINGS = [
  { id: 'mite', label: "Widow's Mite" },
  { id: 'p1',   label: '1%'            },
  { id: 'p5',   label: '5%'            },
  { id: 'p10',  label: '10% (full tithe)' },
];

/**
 * Returns the JMD amount for a given offering id, capped to the wallet.
 * A zero-wallet always returns 0, never negative.
 */
export function offeringAmount(save, id) {
  const w = save.wallet;
  switch (id) {
    case 'mite': return Math.min(TITHE.mite, w);
    case 'p1':   return Math.min(Math.round(w * 0.01), w);
    case 'p5':   return Math.min(Math.round(w * 0.05), w);
    case 'p10':  return Math.min(Math.round(w * 0.10), w);
    default:     return 0;
  }
}

/**
 * Deducts amount from wallet and tops up blessing.
 * Fraction relative to CURRENT wallet before spending determines the bonus:
 *   full 10% → +TITHE.perGift; proportionally less for smaller gifts.
 * Returns false (unchanged) if amount <= 0 or exceeds wallet.
 */
export function giveTithe(save, amount) {
  if (amount <= 0 || amount > save.wallet) return false;
  const frac = save.wallet > 0 ? amount / save.wallet : 0;
  save.wallet -= amount;
  const gain = clamp(frac / 0.10, 0, 1) * TITHE.perGift;
  save.blessing = Math.min(1, (save.blessing || 0) + gain);
  return true;
}

/**
 * Maps blessing (0..1) to active gameplay modifiers.
 *   resist       — fraction of incoming damage that is absorbed
 *   invincExtend — extra seconds added to invincibility windows
 *   startGrace   — seconds of protection when rolling out
 */
export function blessingEffects(blessing) {
  const b = clamp(blessing, 0, 1);
  return {
    resist:       b * TITHE.maxResist,
    invincExtend: b * TITHE.maxExtend,
    startGrace:   b * TITHE.maxGrace,
  };
}

/**
 * Decays the blessing by TITHE.decay each run, floored at 0.
 * Call once at the start (or end) of every run.
 */
export function decayBlessing(save) {
  save.blessing = Math.max(0, (save.blessing || 0) - TITHE.decay);
}
