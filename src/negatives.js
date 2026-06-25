// src/negatives.js — the shared "negatives / detractors" framework.
//
// One mechanism powers three things that all read as: a NON-collectible,
// character-gated road object that bites on contact —
//   • School Yute lifestyle temptations (bleaching, tight pants, weed, molly, sex),
//   • Rasta things to steer clear of (Obeah, pork, Jehovah's Witness),
//   • the Politician's money-pit "responsibilities" (road repairs, constituents,
//     a fallen light pole, buying lunches, bribing voters, paying contractors).
//
// A negative may do any combination of:
//   damage       — flat condition damage (% of max), independent of toughness.
//   drainPct     — fraction of CURRENT coins lost (so the loss scales with earnings).
//   impair       — magnitude of sloppy steering (reuses the booze `tipsy` machinery).
//   blessingLoss — wipes the run's tithe-blessing resilience.
import { applyDamage } from './wreck.js';
import { NEGATIVE } from './constants.js';

export const NEGATIVES = {
  // ── School Yute — temptations to AVOID ──
  bleaching:  { id: 'bleaching',  label: 'Bleaching',   char: 'yute', damage: 14, drainPct: 0.10, color: '#cfe0ff' },
  tightpants: { id: 'tightpants', label: 'Tight Pants', char: 'yute', damage: 10, impair: 0.5,    color: '#3a3a5a' },
  weed:       { id: 'weed',       label: 'Weed',        char: 'yute', impair: 0.7, drainPct: 0.05, color: '#3f7a3a' },
  molly:      { id: 'molly',      label: 'Molly',       char: 'yute', impair: 1.0, damage: 12,     color: '#e060c0' },
  // A money-draining sweetheart (child-appropriate label) — blows almost all your cash.
  teensex:    { id: 'teensex',    label: 'Sweetheart',  char: 'yute', drainPct: 0.92, damage: 8,   color: '#c0285a' },

  // ── Rasta — things to steer clear of ──
  obeah:      { id: 'obeah',      label: 'Obeah',           char: 'rasta', damage: 16, drainPct: 0.15, color: '#5a2a6a' },
  pork:       { id: 'pork',       label: 'Pork',            char: 'rasta', damage: 12, blessingLoss: true, color: '#e0a0a0' },
  jw:         { id: 'jw',         label: "Jehovah Witness", char: 'rasta', impair: 0.4, drainPct: 0.08, color: '#cfc8b0' },

  // ── Politician — "responsibilities" that cost him money (drain only) ──
  roadfix:      { id: 'roadfix',      label: 'Road Repairs',   char: 'politician', drainPct: 0.25, color: '#e8821e' },
  constituent:  { id: 'constituent',  label: 'Constituent',    char: 'politician', drainPct: 0.15, color: '#b04a3c' },
  lightpole:    { id: 'lightpole',    label: 'Fallen Pole',    char: 'politician', drainPct: 0.20, color: '#8a8f96' },
  hustlerlunch: { id: 'hustlerlunch', label: 'Buy a Lunch',    char: 'politician', drainPct: 0.08, color: '#d06a30' },
  voter:        { id: 'voter',        label: 'Bribe a Voter',  char: 'politician', drainPct: 0.10, color: '#2a7f7f' },
  contractor:   { id: 'contractor',   label: 'Contractor',     char: 'politician', drainPct: 0.30, color: '#e8c84a' },
};

// Which negatives spawn for which driver (in display/spawn order).
const ELIGIBLE = {
  yute:       ['bleaching', 'tightpants', 'weed', 'molly', 'teensex'],
  rasta:      ['obeah', 'pork', 'jw'],
  politician: ['roadfix', 'constituent', 'lightpole', 'hustlerlunch', 'voter', 'contractor'],
  conductor:  [],   // the Conductor's "risk" is his bleach-vanity boost-then-backfire items
};

// Spawn rarity weights. Yute/Rasta temptations stay an occasional risk; the
// Politician's responsibilities come thick and fast — dodging them IS his game.
const WEIGHTS = {
  bleaching: 0.5, tightpants: 0.4, weed: 0.5, molly: 0.35, teensex: 0.3,
  obeah: 0.4, pork: 0.5, jw: 0.4,
  roadfix: 1.2, constituent: 1.4, lightpole: 0.9, hustlerlunch: 1.0, voter: 1.2, contractor: 0.8,
};

/** True if `id` names a negative in this framework. */
export function isNegative(id) {
  return !!NEGATIVES[id];
}

/** Weighted spawn list ({ type, weight }) of the negatives this driver attracts. */
export function negativesFor(character) {
  if (!character) return [];
  const list = ELIGIBLE[character.id];
  if (!list) return [];
  return list.map(id => ({ type: id, weight: WEIGHTS[id] }));
}

/** { id, label } pairs of this driver's negatives — for the legend screen. */
export function eligibleNegatives(character) {
  if (!character) return [];
  const list = ELIGIBLE[character.id] || [];
  return list.map(id => ({ id, label: NEGATIVES[id].label }));
}

/**
 * Apply a negative's bite to effects/cart/run. Returns the human label (for the
 * notification toast), or null for an unknown id.
 */
export function applyNegative(effects, cart, run, id) {
  const n = NEGATIVES[id];
  if (!n) return null;
  if (typeof n.damage === 'number' && cart.condition) {
    cart.condition = applyDamage(cart.condition, n.damage);
  }
  if (typeof n.drainPct === 'number') {
    run.coins = Math.max(0, Math.round(run.coins * (1 - n.drainPct)));
  }
  if (typeof n.impair === 'number') {
    cart.tipsy   = Math.max(cart.tipsy || 0, n.impair);
    effects.tipsy = Math.max(effects.tipsy || 0, NEGATIVE.impairSecs);
  }
  if (n.blessingLoss && cart.blessing) {
    cart.blessing.resist = 0;
  }
  return n.label;
}
