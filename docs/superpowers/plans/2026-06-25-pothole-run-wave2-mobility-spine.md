# Pothole Run — Wave 2 (Social-Mobility Spine) Implementation Plan

> **For agentic workers:** TDD per task; `node --test` gates every logic task; `node --check` every screen file; commit per task on `main`.

**Goal:** Turn the meta-loop on: career ranks from lifetime earnings, a working Aspirations board you can actually buy an "out" from (with a bittersweet ending + persistent badge), and a Cash Pot gamble with real house-edge odds.

**Builds on:** Wave 1 (shipped). Spec §7 (aspirations + Cash Pot), §8 (ranks). Current state: `economy.js` (bankRun/spend/canAfford), `save.js` v2 (`lifetimeEarned`, `wallet`, `aspirations:{achieved:[]}`), `screens/aspirations.js` (ASPIRATIONS array + stub render/hit), hub banner shows a hard-coded `'Cart Bwoy'`.

**Tech:** vanilla ES modules, `node:test`, canvas. No build/deps.

---

## Interfaces locked up front

**`src/ranks.js`** (new): `RANKS` (ascending, each `{id, label, min}`); `rankFor(lifetimeEarned)` → the highest rank whose `min` ≤ value; `nextRank(lifetimeEarned)` → next rank or null.

**`src/aspirations.js`** (new — move the ladder here): export `ASPIRATIONS` (the 9 outs, from `screens/aspirations.js`), `isAchieved(save, id)`, `canBuy(save, id)` (affordable + not achieved), `purchaseAspiration(save, id)` → boolean (spends wallet via `economy.spend`, pushes id into `save.aspirations.achieved`). `screens/aspirations.js` imports `ASPIRATIONS` from here (no duplication).

**`src/cashpot.js`** (new): `STAKE = 100`; `OUTCOMES` (array of `{mult, p}` summing p≈1, expected value < 1 so the house wins long-run); `drawCashPot(rng)` → an outcome; `playCashPot(save, rng)` → `{ok, won}` (spends STAKE via economy.spend, credits `save.wallet += STAKE*mult`). NOTE: Cash Pot winnings go to `wallet` only, NOT `lifetimeEarned` (gambling isn't "earning" — keeps ranks honest).

**`src/screens/ending.js`** (new): `render(ctx, {aspirationId, W, H})` draws a short bittersweet ending card for that out; `hit(x,y)` → `'continue'` (back to hub).

**`src/screens/cashpot.js`** (new): `render(ctx, {save, lastResult, W, H})`, `hit(x,y)` → `'play' | 'back'`.

Router gains `'ending'` and `'cashpot'` states. `game.js` wires the rank banner + game-over rank + the new routes + ending trigger.

---

## Task 1: ranks.js

**Files:** Create `src/ranks.js`; Test `tests/ranks.test.js`.

- [ ] **Step 1 — failing test:**
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankFor, nextRank, RANKS } from '../src/ranks.js';

test('rankFor maps lifetime earnings to the right tier', () => {
  assert.equal(rankFor(0).id, 'cart-bwoy');
  assert.equal(rankFor(250000).id, 'road-hustler');
  assert.equal(rankFor(999999).id, 'road-hustler');
  assert.equal(rankFor(1000000).id, 'corner-smalls');
  assert.equal(rankFor(5000000).id, 'big-tings');
  assert.equal(rankFor(25000000).id, 'uptown');
  assert.equal(rankFor(100000000).id, 'don-dadda');
});
test('nextRank returns the following tier, null at the top', () => {
  assert.equal(nextRank(0).id, 'road-hustler');
  assert.equal(nextRank(100000000), null);
});
```
- [ ] **Step 2 — run, expect FAIL** (`node --test tests/ranks.test.js`).
- [ ] **Step 3 — implement:**
```js
// src/ranks.js
export const RANKS = [
  { id: 'cart-bwoy',     label: 'Cart Bwoy',     min: 0 },
  { id: 'road-hustler',  label: 'Road Hustler',  min: 250000 },
  { id: 'corner-smalls', label: 'Corner Smalls', min: 1000000 },
  { id: 'big-tings',     label: 'Big Tings',     min: 5000000 },
  { id: 'uptown',        label: 'Uptown',        min: 25000000 },
  { id: 'don-dadda',     label: 'Don Dadda',     min: 100000000 }
];
export function rankFor(lifetimeEarned) {
  let r = RANKS[0];
  for (const tier of RANKS) if (lifetimeEarned >= tier.min) r = tier;
  return r;
}
export function nextRank(lifetimeEarned) {
  const i = RANKS.indexOf(rankFor(lifetimeEarned));
  return i >= 0 && i < RANKS.length - 1 ? RANKS[i + 1] : null;
}
```
- [ ] **Step 4 — run, expect PASS.**
- [ ] **Step 5 — commit:** `git commit -m "feat(ranks): career rank ladder from lifetime earnings"`

---

## Task 2: aspirations.js (ladder + purchase logic)

**Files:** Create `src/aspirations.js`; Modify `src/screens/aspirations.js` (import the array from the new module); Test `tests/aspirations.test.js`.

- [ ] **Step 1 — failing test:**
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { ASPIRATIONS, canBuy, isAchieved, purchaseAspiration } from '../src/aspirations.js';

test('ladder has the 9 priced outs incl. tithes & hotel', () => {
  assert.equal(ASPIRATIONS.length, 9);
  assert.equal(ASPIRATIONS[0].id, 'tithes');
  assert.equal(ASPIRATIONS.find(a => a.id === 'hotel').price, 250000000);
});
test('cannot buy what you cannot afford; can when funded', () => {
  const s = defaultSave(); s.wallet = 1000000;
  assert.equal(canBuy(s, 'tithes'), false);      // 1.5M needed
  s.wallet = 2000000;
  assert.equal(canBuy(s, 'tithes'), true);
});
test('purchase spends wallet, marks achieved, is idempotent', () => {
  const s = defaultSave(); s.wallet = 2000000; s.lifetimeEarned = 9999999;
  assert.equal(purchaseAspiration(s, 'tithes'), true);
  assert.equal(s.wallet, 500000);
  assert.equal(isAchieved(s, 'tithes'), true);
  assert.equal(s.lifetimeEarned, 9999999);        // spending never touches the rank odometer
  assert.equal(purchaseAspiration(s, 'tithes'), false); // already owned
});
```
- [ ] **Step 2 — run, expect FAIL.**
- [ ] **Step 3 — implement** `src/aspirations.js` (move the array out of `screens/aspirations.js`):
```js
// src/aspirations.js
import { spend, canAfford } from './economy.js';
export const ASPIRATIONS = [
  { id: 'tithes',   name: 'Tithes & Offerings', price: 1500000,   blurb: 'Give faithful, build community.' },
  { id: 'school',   name: 'Education',          price: 3000000,   blurb: 'A degree — the long road up.' },
  { id: 'artist',   name: 'Visual Artist',      price: 4000000,   blurb: 'Studio, materials, first show.' },
  { id: 'business', name: 'Open a Business',     price: 5000000,   blurb: 'Yuh own likkle shop.' },
  { id: 'music',    name: 'Musician / Studio',   price: 6000000,   blurb: 'Book the studio, cut the riddim.' },
  { id: 'migrate',  name: 'Migrate / Fly Weh',   price: 7000000,   blurb: 'Visa, ticket, a new start farin.' },
  { id: 'farm',     name: 'Agriculture',         price: 10000000,  blurb: 'Land, seed, and sweat.' },
  { id: 'hills',    name: 'House inna di Hills',  price: 50000000,  blurb: 'Uptown, gate and all.' },
  { id: 'hotel',    name: 'Hotel / Beachfront',  price: 250000000, blurb: 'Sea in front, yours.' }
];
export function getAspiration(id) { return ASPIRATIONS.find(a => a.id === id); }
export function isAchieved(save, id) { return save.aspirations.achieved.includes(id); }
export function canBuy(save, id) {
  const a = getAspiration(id);
  return !!a && !isAchieved(save, id) && canAfford(save, a.price);
}
export function purchaseAspiration(save, id) {
  if (!canBuy(save, id)) return false;
  spend(save, getAspiration(id).price);
  save.aspirations.achieved.push(id);
  return true;
}
```
Then in `src/screens/aspirations.js`: delete the local `ASPIRATIONS` const and `import { ASPIRATIONS, isAchieved, canBuy } from '../aspirations.js';`. Update `render` to show **BUY** when `canBuy`, an **✓ achieved** badge when `isAchieved`, else greyed price. Update `hit` to return `'buy:<id>'` for an affordable, unachieved row, plus `'back'`.
- [ ] **Step 4 — run, expect PASS;** then `node --check src/screens/aspirations.js`.
- [ ] **Step 5 — commit:** `git commit -m "feat(aspirations): purchasable outs (wallet-spend, persistent badge)"`

---

## Task 3: cashpot.js (real-odds gamble)

**Files:** Create `src/cashpot.js`; Test `tests/cashpot.test.js`.

- [ ] **Step 1 — failing test:**
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { OUTCOMES, STAKE, expectedValue, playCashPot } from '../src/cashpot.js';

test('outcome probabilities sum to ~1', () => {
  const p = OUTCOMES.reduce((s, o) => s + o.p, 0);
  assert.ok(Math.abs(p - 1) < 1e-6);
});
test('the house keeps an edge (EV per stake < 1)', () => {
  assert.ok(expectedValue() < 1, 'EV must favour the house');
});
test('playing spends the stake; a win credits the wallet', () => {
  const s = defaultSave(); s.wallet = 1000;
  const r = playCashPot(s, () => 0); // rng=0 -> first outcome
  assert.equal(r.ok, true);
  // wallet = 1000 - STAKE + STAKE*firstMult
  assert.equal(s.wallet, 1000 - STAKE + STAKE * OUTCOMES[0].mult);
});
test('cannot play when broke', () => {
  const s = defaultSave(); s.wallet = 50;
  assert.equal(playCashPot(s, () => 0).ok, false);
  assert.equal(s.wallet, 50);
});
```
- [ ] **Step 2 — run, expect FAIL.**
- [ ] **Step 3 — implement:**
```js
// src/cashpot.js
import { spend } from './economy.js';
export const STAKE = 100;
// Real-ish "drop pan / Cash Pot" feel: mostly lose, sometimes small, rarely big.
// EV per stake is < 1 (house edge) so it's a temptation, not income.
export const OUTCOMES = [
  { mult: 0,   p: 0.62 },   // lose
  { mult: 1,   p: 0.18 },   // money back
  { mult: 3,   p: 0.12 },
  { mult: 8,   p: 0.06 },
  { mult: 30,  p: 0.02 }    // the "drop pan" hit
];
export function expectedValue() { return OUTCOMES.reduce((s, o) => s + o.p * o.mult, 0); }
export function drawCashPot(rng) {
  let r = rng();
  for (const o of OUTCOMES) { r -= o.p; if (r < 0) return o; }
  return OUTCOMES[OUTCOMES.length - 1];
}
export function playCashPot(save, rng) {
  if (!spend(save, STAKE)) return { ok: false, won: 0 };
  const o = drawCashPot(rng);
  const won = STAKE * o.mult;
  save.wallet += won;
  return { ok: true, won, mult: o.mult };
}
```
(Verify `expectedValue()` = 0+0.18+0.36+0.48+0.60 = 1.62? — recompute and TUNE `p` so EV<1. With these: 0.18·1+0.12·3+0.06·8+0.02·30 = 0.18+0.36+0.48+0.60 = 1.62 → TOO GENEROUS. Adjust to e.g. `{0,p:.70},{1,p:.15},{3,p:.10},{8,p:.04},{30,p:.01}` → EV=0.15+0.30+0.32+0.30=1.07, still >1. Use `{0,p:.74},{1,p:.15},{3,p:.08},{8,p:.025},{30,p:.005}` → EV=0.15+0.24+0.20+0.15=0.74<1 ✓ and p sums to 1.0. **Use these tuned values in the implementation.**)
- [ ] **Step 4 — run, expect PASS** (EV<1 with the tuned table; if it still fails, lower the high-mult probabilities until EV<1).
- [ ] **Step 5 — commit:** `git commit -m "feat(cashpot): pay-to-play draw with a real house edge"`

---

## Task 4: Ending screen + Cash Pot screen + router/hub/game wiring

**Files:** Create `src/screens/ending.js`, `src/screens/cashpot.js`; Modify `src/screens/router.js`, `src/screens/hub.js`, `src/screens/aspirations.js`, `src/game.js`. Preview-verified.

- [ ] **Step 1 — rank banner (real):** In `hub.js` (or wherever the banner draws), replace the hard-coded `'Cart Bwoy'` with `rankFor(save.lifetimeEarned).label` (import from `../ranks.js`). Show next-rank progress if easy.
- [ ] **Step 2 — ending screen:** `screens/ending.js` `render(ctx,{aspirationId,W,H})` shows a short, bittersweet card (e.g. for `migrate`: "Yuh gone a farin. Di airport cold. Yuh madda wave till yuh cyaa see her.") for each of the 9 ids — write one 1–2 line bittersweet vignette per out. A **CONTINUE** button → hub. Keep tone earned and a little melancholy, not triumphant.
- [ ] **Step 3 — aspirations purchase flow:** In `game.js`, when the aspirations screen returns `'buy:<id>'`, call `purchaseAspiration(save,id)`; on success `writeSave` and route to `'ending'` with that id; CONTINUE returns to hub. Achieved outs show the ✓ badge thereafter.
- [ ] **Step 4 — Cash Pot:** `screens/cashpot.js` shows wallet, the payout table, a **PLAY ($100)** button and the last result ("LOSS" / "WIN $300!"). Reachable via a small **CASH POT** affordance on the Aspirations board (or hub). Wire `'play'` → `playCashPot(save,rng)` + `writeSave`; `'back'` → previous screen. Add `'ending'`/`'cashpot'` to `router.js`.
- [ ] **Step 5 — game-over rank:** On the game-over card in `game.js`, show `rankFor(save.lifetimeEarned).label`.
- [ ] **Step 6 — verify:** `node --test` green; `node --check` each new/modified screen file + game.js. Controller preview-verifies: rank shows on hub, buying an affordable aspiration (inject a big wallet) triggers its ending + badge, Cash Pot plays and debits/credits.
- [ ] **Step 7 — commit:** `git commit -m "feat(ui): bittersweet endings, Cash Pot screen, live rank banner"`

---

## Task 5: Ship Wave 2

- [ ] `node --test` — ALL green.
- [ ] Bump `sw.js` CACHE (v8 → v9) and add `src/ranks.js`, `src/aspirations.js`, `src/cashpot.js`, `src/screens/ending.js`, `src/screens/cashpot.js` to ASSETS.
- [ ] Controller preview pass (cleared cache).
- [ ] `git push`.

---

## Self-review (plan vs spec)
- §7 aspirations purchase + bittersweet loop → Tasks 2, 4. ✓
- §7 Cash Pot real odds → Task 3, 4. ✓
- §8 ranks → Task 1, 4. ✓
- Spending never touches lifetimeEarned (ranks stay honest) → asserted in Tasks 2 & enforced in 3. ✓
