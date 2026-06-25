# Pothole Run — Wave 1 (Playability) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Pothole Run genuinely playable — fairer difficulty, real healing via power-ups, persistent stakes with a safety floor, a decluttered hub of focused screens, and a landscape/portrait-correct viewport — without wiping any existing save.

**Architecture:** Pure-logic modules (`economy`, `powerups`, `bounties`, `solvability`) are added beside the existing ones and unit-tested with `node:test`; they are wired into the existing fixed-timestep loop (`game.js`) and crossing-based collision (`run.js`). The single canvas menu in `game.js` is split into a small screen router plus one module per screen. Rendering/responsive changes are verified in the preview, not unit-tested. Conductor and environment art are built against the owner's reference photos and iterated in the preview.

**Tech Stack:** Vanilla ES modules, HTML5 Canvas 2D, `node:test` (run with `node --test`), Web Audio, localStorage, PWA service worker. No build, no deps.

**Spec:** `docs/superpowers/specs/2026-06-25-pothole-run-social-mobility-redesign.md` (Wave 1 = §14).

---

## Interfaces locked up front (keep names consistent across tasks)

**`src/save.js`** (extended): `KEY = 'pothole-run-save:v2'`; `defaultSave()` adds `lifetimeEarned:0, wallet:0, condition:100, bounties:[], aspirations:{achieved:[]}`; `loadSave()` migrates v1→v2; existing `coins` kept readable for one version.

**`src/economy.js`** (new):
- `MIN_EARN = 250` — guaranteed minimum banked per completed run.
- `bankRun(save, runCoins)` → number `earned` (= `max(runCoins, MIN_EARN)`); mutates `save.lifetimeEarned += earned` and `save.wallet += earned`.
- `canAfford(save, price)` → boolean.
- `spend(save, price)` → boolean (false if unaffordable; else `save.wallet -= price`, true).

**`src/constants.js`** (extended): `FLOOR_CONDITION = 40`; `POWERUP` (durations + heal amounts); `HOP` (sleeping-policeman jump timing). Difficulty dials retuned in place.

**`src/powerups.js`** (new):
- `POWERUPS = { water:{...}, tools:{...}, coffee:{...} }`.
- `createEffects()` → `{}` (map of effectName → secondsRemaining).
- `applyPowerup(effects, cart, run, kind, distance)` — heals/sets timers; for `coffee` sets `run.coffeeUntilZ`.
- `tickEffects(effects, dt)` — decrements timers, deletes expired.
- `effectActive(effects, name)` → boolean.
- `toolSpriteFor(vehicle)` → `'spanner' | 'socket'` (by `vehicle.isCar`).

**`src/bounties.js`** (new): `BOUNTY_DEFS`; `rollBounties(rng, n=3)`; `progressBounties(bounties, event)` where `event = {kind, amount}`; returns list of just-completed bounty ids; `refresh(bounties, rng)` replaces completed ones.

**`src/solvability.js`** (new): `reachabilityFloorZ(speed)` → minimum world-Z spacing between consecutive hazard rows so the cart can change one slot in time; used to floor the spawn interval.

**Screens** (new): `src/screens/router.js`, `hub.js`, `mechshop.js`, `cardealer.js`, `aspirations.js`. Each screen exports `render(ctx, ctxState)` and `hit(x, y) → action|null`.

**Test command:** `node --test tests/<file>.test.js` (tests live in `tests/`, import from `../src/`).

---

## Task 1: Save v2 schema + v1→v2 migration

**Files:**
- Modify: `src/save.js`
- Test: `tests/save.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/save.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave, loadSave } from '../src/save.js';

function memStore(initial) {
  const m = new Map(initial ? Object.entries(initial) : []);
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('defaultSave has v2 economy fields', () => {
  const s = defaultSave();
  assert.equal(s.lifetimeEarned, 0);
  assert.equal(s.wallet, 0);
  assert.equal(s.condition, 100);
  assert.deepEqual(s.bounties, []);
  assert.deepEqual(s.aspirations, { achieved: [] });
});

test('a v1 save migrates without wiping garage/upgrades/bests', () => {
  const v1 = {
    coins: 12000, garage: ['handcart', 'probox'], vehicle: 'probox',
    upgrades: ['weighted-base'], bests: { 'fern-gully': 880 },
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false, genre: 'ska' }
  };
  const store = memStore({ 'pothole-run-save:v1': JSON.stringify(v1) });
  const s = loadSave(store);
  assert.equal(s.wallet, 12000);        // seeded from v1 coins
  assert.equal(s.lifetimeEarned, 12000);
  assert.equal(s.condition, 100);
  assert.deepEqual(s.garage, ['handcart', 'probox']);
  assert.deepEqual(s.upgrades, ['weighted-base']);
  assert.equal(s.bests['fern-gully'], 880);
  assert.equal(s.settings.genre, 'ska');
});

test('corrupt data falls back to defaultSave', () => {
  const store = memStore({ 'pothole-run-save:v2': '{not json' });
  assert.equal(loadSave(store).wallet, 0);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/save.test.js`
Expected: FAIL (`lifetimeEarned` undefined / migration absent).

- [ ] **Step 3: Implement the migration**

In `src/save.js`: change `const KEY = 'pothole-run-save:v1';` to `const KEY = 'pothole-run-save:v2'; const KEY_V1 = 'pothole-run-save:v1';`.

Extend `defaultSave()`'s returned object with:
```js
    lifetimeEarned: 0,
    wallet: 0,
    condition: 100,
    bounties: [],
    aspirations: { achieved: [] },
```

Rewrite `loadSave` to read v2, else migrate v1:
```js
export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY) ?? storage.getItem(KEY_V1);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const base = defaultSave();
    const seedCoins = Number.isFinite(parsed.coins) ? parsed.coins : 0;
    const save = {
      ...base, ...parsed,
      wallet: Number.isFinite(parsed.wallet) ? parsed.wallet : seedCoins,
      lifetimeEarned: Number.isFinite(parsed.lifetimeEarned) ? parsed.lifetimeEarned : seedCoins,
      condition: Number.isFinite(parsed.condition) ? parsed.condition : 100,
      bounties: Array.isArray(parsed.bounties) ? parsed.bounties : [],
      aspirations: { achieved: Array.isArray(parsed.aspirations?.achieved) ? parsed.aspirations.achieved : [] },
      garage: Array.isArray(parsed.garage) && parsed.garage.length ? parsed.garage : base.garage,
      upgrades: Array.isArray(parsed.upgrades) ? parsed.upgrades : base.upgrades,
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) }
    };
    if (!save.garage.includes(save.vehicle)) save.vehicle = save.garage[0];
    if (!GENRES.includes(save.settings.genre)) save.settings.genre = 'reggae';
    return save;
  } catch {
    return defaultSave();
  }
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/save.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/save.js tests/save.test.js
git commit -m "feat(save): v2 economy schema + v1 migration (no wipe)"
```

---

## Task 2: economy.js — lifetime-earned, wallet, min earnings

**Files:**
- Create: `src/economy.js`
- Test: `tests/economy.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/economy.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { bankRun, canAfford, spend, MIN_EARN } from '../src/economy.js';

test('bankRun credits both counters by the run take', () => {
  const s = defaultSave();
  const earned = bankRun(s, 4000);
  assert.equal(earned, 4000);
  assert.equal(s.wallet, 4000);
  assert.equal(s.lifetimeEarned, 4000);
});

test('a wrecked run still banks at least MIN_EARN', () => {
  const s = defaultSave();
  bankRun(s, 0);
  assert.equal(s.wallet, MIN_EARN);
  assert.equal(s.lifetimeEarned, MIN_EARN);
});

test('spend draws only the wallet; lifetimeEarned never drops', () => {
  const s = defaultSave();
  bankRun(s, 10000);
  assert.equal(spend(s, 3000), true);
  assert.equal(s.wallet, 7000);
  assert.equal(s.lifetimeEarned, 10000);
  assert.equal(canAfford(s, 8000), false);
  assert.equal(spend(s, 8000), false);
  assert.equal(s.wallet, 7000);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/economy.test.js`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement economy.js**

```js
// src/economy.js
// Two counters: lifetimeEarned is a monotonic odometer (drives ranks); wallet is
// spendable. A completed run always banks at least MIN_EARN so a wreck still inches
// you forward — no hard soft-lock.
export const MIN_EARN = 250;

export function bankRun(save, runCoins) {
  const earned = Math.max(runCoins, MIN_EARN);
  save.lifetimeEarned += earned;
  save.wallet += earned;
  return earned;
}
export function canAfford(save, price) {
  return save.wallet >= price;
}
export function spend(save, price) {
  if (save.wallet < price) return false;
  save.wallet -= price;
  return true;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/economy.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/economy.js tests/economy.test.js
git commit -m "feat(economy): lifetime-earned vs wallet + guaranteed min earnings"
```

---

## Task 3: Money rebalance — sliver heal + cash/coin alternation

**Files:**
- Modify: `src/constants.js` (`DAMAGE.repairPerCoin`)
- Modify: `src/money.js` (denomination bands)
- Test: `tests/money.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/money.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickMoney } from '../src/money.js';
import { DAMAGE } from '../src/constants.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

test('money heals only a sliver now', () => {
  assert.equal(DAMAGE.repairPerCoin, 1);
});

test('coins and cash interleave through mid-distance (coins not gone by 1500m)', () => {
  const rng = mulberry32(7);
  let coinHits = 0, cashHits = 0;
  for (let i = 0; i < 400; i++) {
    const v = pickMoney(1500, rng);
    if (v <= 20) coinHits++; else cashHits++;
  }
  assert.ok(coinHits > 0, 'coins still drop at 1500m');
  assert.ok(cashHits > 0, 'cash also drops at 1500m');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/money.test.js`
Expected: FAIL (`repairPerCoin` is 4; coins dry up before 1500m).

- [ ] **Step 3: Implement the rebalance**

In `src/constants.js`, set `repairPerCoin: 1` (was 4).

In `src/money.js`, extend the small-coin `until` windows so coins interleave with cash deeper (push the coin bands out, keep notes arriving):
```js
export const MONEY = [
  { value: 1,    weight: 5, from: 0,    until: 1200 },
  { value: 5,    weight: 5, from: 0,    until: 1800 },
  { value: 10,   weight: 5, from: 0,    until: 2400 },
  { value: 20,   weight: 5, from: 150,  until: 3200 },
  { value: 100,  weight: 4, from: 550,  until: null },
  { value: 500,  weight: 3, from: 1000, until: null },
  { value: 1000, weight: 2, from: 1600, until: null },
  { value: 5000, weight: 1, from: 2400, until: null }
];
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/money.test.js`
Expected: PASS (2 tests). Also re-run existing suites: `node --test` (all green).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js src/money.js tests/money.test.js
git commit -m "feat(economy): money heals a sliver; coins/cash interleave deeper"
```

---

## Task 4: Difficulty −20% (flatten start, soften hits)

**Files:**
- Modify: `src/constants.js` (`SPAWN`, `DAMAGE`)
- Test: `tests/difficulty.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/difficulty.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPAWN, DAMAGE } from '../src/constants.js';
import { spawnInterval } from '../src/spawner.js';

test('the early game is less cluttered than before (wider gaps at 0m)', () => {
  assert.ok(SPAWN.baseInterval >= 120, 'base interval widened from 100');
  assert.ok(spawnInterval(0) >= 120);
});
test('each hit is ~20% softer', () => {
  assert.ok(DAMAGE.pothole <= 9);   // was 11
  assert.ok(DAMAGE.traffic <= 19);  // was 23
  assert.ok(DAMAGE.animal <= 15);   // was 18
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/difficulty.test.js`
Expected: FAIL (current values 100 / 11 / 23 / 18).

- [ ] **Step 3: Implement the retune**

In `src/constants.js`:
```js
export const DAMAGE = {
  pothole: 9,          // ~20% gentler
  manhole: 100,
  traffic: 18,
  animal: 14,
  bump: 4,
  wiper: 4,
  repairPerCoin: 1
};
// flatter, more forgiving early ramp
export const SPAWN = { baseInterval: 125, minInterval: 20, ramp: 20 };
```
(`minInterval` is replaced by the reachability floor in Task 9; leave 20 here for now.)

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/difficulty.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js tests/difficulty.test.js
git commit -m "feat(balance): difficulty -20% (flatter start, softer hits)"
```

---

## Task 5: Persistent damage + 40% free floor

**Files:**
- Modify: `src/constants.js` (`FLOOR_CONDITION`)
- Modify: `src/cart.js` (`createCart` start condition)
- Test: `tests/persistent-condition.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/persistent-condition.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, startCondition } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { FLOOR_CONDITION } from '../src/constants.js';

test('a healthy saved cart starts at its saved condition', () => {
  const c = createCart(getCharacter('yute'), getVehicle('handcart'), 0, 73);
  assert.equal(c.condition.value, 73);
});
test('a battered saved cart is floored up to 40% for free', () => {
  assert.equal(startCondition(12), FLOOR_CONDITION);
  const c = createCart(getCharacter('yute'), getVehicle('handcart'), 0, 12);
  assert.equal(c.condition.value, FLOOR_CONDITION);
});
test('missing saved condition defaults to full', () => {
  const c = createCart(getCharacter('yute'));
  assert.equal(c.condition.value, 100);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/persistent-condition.test.js`
Expected: FAIL (`startCondition` missing; `createCart` ignores saved condition).

- [ ] **Step 3: Implement persistence + floor**

In `src/constants.js` add: `export const FLOOR_CONDITION = 40;`

In `src/cart.js`, add the import and helper, and accept a `savedCondition` param:
```js
import { CART_SLOTS, CART, PLAYER_HALF_WIDTH, FLOOR_CONDITION } from './constants.js';
// ...
export function startCondition(saved) {
  if (saved == null) return CART.maxCondition;
  return Math.max(FLOOR_CONDITION, Math.min(CART.maxCondition, saved));
}
export function createCart(character, vehicle = getVehicle('handcart'), stabilityBonus = 0, savedCondition = null) {
  return {
    // ...unchanged fields...
    condition: createCondition(CART.maxCondition)
  };
}
```
Then replace the `condition:` line with:
```js
    condition: { value: startCondition(savedCondition), max: CART.maxCondition }
```
(Keep `createCondition` import; the inline object lets us seed `value` while keeping `max`.)

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/persistent-condition.test.js`
Expected: PASS (3 tests). Re-run `node --test tests/cart.test.js` — still green (default call → 100).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js src/cart.js tests/persistent-condition.test.js
git commit -m "feat(stakes): persistent cart condition with a free 40% floor"
```

---

## Task 6: powerups.js — water, tools, coffee (pure logic)

**Files:**
- Modify: `src/constants.js` (`POWERUP`)
- Create: `src/powerups.js`
- Test: `tests/powerups.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/powerups.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createEffects, applyPowerup, tickEffects, effectActive, toolSpriteFor, POWERUPS } from '../src/powerups.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { getVehicle } from '../src/vehicles.js';
import { applyDamage } from '../src/wreck.js';

function damagedCart(value) {
  const c = createCart(getCharacter('yute'));
  c.condition = applyDamage(c.condition, 100 - value);
  return c;
}

test('water fully heals and sets a boost timer', () => {
  const c = damagedCart(30); const fx = createEffects(); const run = {};
  applyPowerup(fx, c, run, 'water', 500);
  assert.equal(c.condition.value, 100);
  assert.ok(effectActive(fx, 'boost'));
});
test('tools repair a chunk (not full) and steady briefly', () => {
  const c = damagedCart(30); const fx = createEffects(); const run = {};
  applyPowerup(fx, c, run, 'tools', 500);
  assert.ok(c.condition.value > 30 && c.condition.value < 100);
  assert.ok(effectActive(fx, 'steady'));
});
test('coffee opens a smooth-road money window ahead', () => {
  const c = damagedCart(80); const fx = createEffects(); const run = { distance: 1000 };
  applyPowerup(fx, c, run, 'coffee', 1000);
  assert.ok(run.coffeeUntilDist > 1000);
});
test('timers expire', () => {
  const fx = createEffects(); const c = damagedCart(50); const run = {};
  applyPowerup(fx, c, run, 'tools', 0);
  tickEffects(fx, POWERUPS.tools.steady + 0.1);
  assert.equal(effectActive(fx, 'steady'), false);
});
test('tool art swaps by ride', () => {
  assert.equal(toolSpriteFor(getVehicle('handcart')), 'spanner');
  assert.equal(toolSpriteFor(getVehicle('probox')), 'socket');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/powerups.test.js`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement constants + powerups.js**

In `src/constants.js` add:
```js
export const POWERUP = {
  toolsHeal: 35,     // % of max restored by hardware tools
  boost: 3,          // seconds of water speed/steady boost
  steady: 3,         // seconds of tools steadiness
  coffeeDist: 600,   // world-distance length of the smooth-road money window
  toolDrop: 5000     // coffee flood denomination
};
```

```js
// src/powerups.js
import { repair } from './wreck.js';
import { CART, POWERUP } from './constants.js';

export const POWERUPS = {
  water:  { rarity: 'rare',      boost: POWERUP.boost },
  tools:  { rarity: 'common',    steady: POWERUP.steady, heal: POWERUP.toolsHeal },
  coffee: { rarity: 'ultra-rare' }
};
export function createEffects() { return {}; }
export function effectActive(fx, name) { return (fx[name] || 0) > 0; }
export function tickEffects(fx, dt) {
  for (const k of Object.keys(fx)) { fx[k] -= dt; if (fx[k] <= 0) delete fx[k]; }
}
export function applyPowerup(fx, cart, run, kind, distance) {
  if (kind === 'water') {
    cart.condition = repair(cart.condition, CART.maxCondition);   // full heal
    fx.boost = POWERUP.boost;
  } else if (kind === 'tools') {
    cart.condition = repair(cart.condition, CART.maxCondition * POWERUP.toolsHeal / 100);
    fx.steady = POWERUP.steady;
  } else if (kind === 'coffee') {
    run.coffeeUntilDist = (run.distance || distance) + POWERUP.coffeeDist;
  }
}
export function toolSpriteFor(vehicle) { return vehicle && vehicle.isCar ? 'socket' : 'spanner'; }
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/powerups.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js src/powerups.js tests/powerups.test.js
git commit -m "feat(powerups): water/tools/coffee effects + timers (logic)"
```

---

## Task 7: Sleeping-policeman hop + landing damage (run.js)

**Files:**
- Modify: `src/constants.js` (`HOP`)
- Modify: `src/cart.js` (`jumpT` field + tick)
- Modify: `src/run.js` (`resolveHits`: bump → hop; airborne skips non-collectible; landing damages)
- Test: `tests/hop.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/hop.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

function fieldWith(entities) { return { pool: entities }; }
function ent(type, x, z, extra = {}) {
  return { active: true, collected: false, type, x, z, halfWidth: 0.16, value: 0, ...extra };
}

test('hitting a sleeping policeman launches a hop, no damage', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('bump', 0, 0)]));
  assert.equal(cart.condition.value, 100);   // no damage from the bump itself
  assert.ok(cart.jumpT > 0);                  // airborne now
});
test('airborne, the cart sails over a pothole', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0.5; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.equal(cart.condition.value, 100);   // cleared it
});
test('landing on an obstacle while grounded still damages', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.ok(cart.condition.value < 100);
});
test('coins are collectible mid-hop', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; cart.jumpT = 0.5; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('coin', 0, 0, { value: 10 })]));
  assert.equal(run.coins, 10);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/hop.test.js`
Expected: FAIL (bump damages; no `jumpT`).

- [ ] **Step 3: Implement the hop**

In `src/constants.js` add: `export const HOP = { air: 0.55 };` // seconds airborne

In `src/cart.js` `createCart` add field `jumpT: 0,` and in `updateCart` decay it: at the top of `updateCart`, add `if (cart.jumpT > 0) cart.jumpT = Math.max(0, cart.jumpT - dt);`

In `src/run.js`, import `HOP` and rework the non-collectible branch:
```js
import { DAMAGE, GUST, WIPER, HOP } from './constants.js';
```
Inside `resolveHits`, after `const info = hazardInfo(e.type);` and the magnet line, when a non-collectible overlaps:
```js
    e.active = false;
    if (info.collectible) {
      const value = e.value || 1;
      run.coins += value;
      cart.pickupValue = value;
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
    } else if (e.type === 'bump') {
      cart.jumpT = HOP.air;          // launch — the bump itself never damages
      cart.bumped = true;
    } else if ((cart.jumpT || 0) > 0) {
      // airborne over a hazard — sail clear (a passing-traffic gust still applies)
      if (e.gust && Math.abs(cart.x - e.x) < GUST.range) {
        const dir = cart.x >= e.x ? 1 : -1;
        cart.vx = (cart.vx || 0) + dir * GUST.push * (GUST[e.gust] || 1);
      }
    } else {
      const tough = cart.character.toughness * (cart.vehicle ? cart.vehicle.toughness : 1);
      cart.condition = applyDamage(cart.condition, info.damage / tough);
      if (info.coinLoss) { run.coins = Math.max(0, run.coins - WIPER.coinLoss); cart.washed = true; }
    }
```
Note: collectibles must still be collected even mid-hop, so the `info.collectible` branch stays first and unguarded by `jumpT`.

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/hop.test.js`
Expected: PASS (4 tests). Re-run `node --test` (all green).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js src/cart.js src/run.js tests/hop.test.js
git commit -m "feat(traversal): sleeping policemen launch a hop over obstacles"
```

---

## Task 8: Solvability floor in the spawner

**Files:**
- Create: `src/solvability.js`
- Modify: `src/spawner.js` (`spawnInterval` honours the reachability floor)
- Test: `tests/solvability.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/solvability.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reachabilityFloorZ } from '../src/solvability.js';
import { spawnInterval } from '../src/spawner.js';
import { CART } from '../src/constants.js';

test('reachability floor grows with speed (need more spacing when faster)', () => {
  assert.ok(reachabilityFloorZ(CART.maxSpeed) > reachabilityFloorZ(CART.startSpeed));
});
test('spawn interval never drops below the reachability floor at max speed', () => {
  const floor = reachabilityFloorZ(CART.maxSpeed);
  for (let d = 0; d <= 100000; d += 500) {
    assert.ok(spawnInterval(d, undefined, undefined, CART.maxSpeed) >= floor,
      `interval at ${d}m fell below reachability`);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/solvability.test.js`
Expected: FAIL (module missing; `spawnInterval` ignores speed).

- [ ] **Step 3: Implement the floor**

```js
// src/solvability.js
import { CART } from './constants.js';
// The cart needs time to slide one slot (~0.6 in normalised x) over. Convert that
// lateral time into a minimum world-Z spacing between consecutive hazard rows at the
// given speed, so there is ALWAYS time to reach an open slot. Shoulders are always
// hazard-free, so a survivable slot always exists; this guarantees it's *reachable*.
const SLOT_GAP = 0.6;                 // normalised x between adjacent lanes
export function reachabilityFloorZ(speed) {
  const lateralTime = SLOT_GAP / CART.laneLerp + 0.12; // ease time + reaction margin
  return speed * lateralTime;
}
```

In `src/spawner.js`, make `spawnInterval` accept the current speed and clamp to the floor:
```js
import { SPAWN, CART } from './constants.js';
import { reachabilityFloorZ } from './solvability.js';

export function spawnInterval(distance, base = SPAWN.baseInterval, min = SPAWN.minInterval, speed = CART.maxSpeed) {
  const floor = Math.max(min, reachabilityFloorZ(speed));
  return Math.max(floor, base - distance / SPAWN.ramp);
}
```
(Callers in `game.js` pass `cart.speed` — wired in Task 11/15 when the loop is touched; until then the default keeps it safe.)

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/solvability.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/solvability.js src/spawner.js tests/solvability.test.js
git commit -m "feat(fairness): spawn spacing floored so a path is always reachable"
```

---

## Task 9: Near-miss combo multiplier (run.js)

**Files:**
- Modify: `src/constants.js` (`COMBO`)
- Modify: `src/run.js` (`createRun` combo fields; near-miss detection; multiplier on pickups)
- Test: `tests/combo.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/combo.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

function fieldWith(entities) { return { pool: entities }; }
function ent(type, x, z, extra = {}) {
  return { active: true, collected: false, type, x, z, halfWidth: 0.16, value: 0, ...extra };
}

test('a near-miss raises the combo; a clean pass does not', () => {
  // half-widths sum to 0.32 (overlap threshold); near-miss band is gap in [0, 0.18],
  // i.e. |dx| in [0.32, 0.50]. x=0.42 → gap 0.10 (a near-miss); x=0.95 → no combo.
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  resolveHits(run, cart, fieldWith([ent('pothole', 0.42, 0)]));  // just outside overlap
  assert.ok(run.combo >= 1);
  const cart2 = createCart(getCharacter('yute')); cart2.x = 0; const run2 = createRun();
  resolveHits(run2, cart2, fieldWith([ent('pothole', 0.95, 0)])); // far away
  assert.equal(run2.combo, 0);
});
test('combo multiplies the next pickup; a hit resets it', () => {
  const cart = createCart(getCharacter('yute')); cart.x = 0; const run = createRun();
  run.combo = 3;
  resolveHits(run, cart, fieldWith([ent('coin', 0, 0, { value: 10 })]));
  assert.ok(run.coins > 10);                 // multiplied
  resolveHits(run, cart, fieldWith([ent('pothole', 0, 0)]));
  assert.equal(run.combo, 0);                // hit wipes it
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/combo.test.js`
Expected: FAIL (no combo on the run).

- [ ] **Step 3: Implement the combo**

In `src/constants.js` add: `export const COMBO = { nearBand: 0.18, step: 1, max: 5, bonusPer: 0.25 };`

In `src/run.js`: `createRun()` returns `{ distance: 0, coins: 0, combo: 0 }`. Import `COMBO`. In the dodged branch (where `!laneOverlap`), detect a near-miss for non-collectibles:
```js
    if (!laneOverlap(cart.x, cart.halfWidth * magnet, e.x, e.halfWidth)) {
      if (!info.collectible) {
        const gap = Math.abs(cart.x - e.x) - (cart.halfWidth + e.halfWidth);
        if (gap >= 0 && gap <= COMBO.nearBand) {
          run.combo = Math.min(COMBO.max, run.combo + COMBO.step);
          cart.nearMiss = true;
        }
      }
      // ...existing gust block stays...
      continue;
    }
```
In the collectible branch, multiply by the combo. Replace the **entire** collectible
block (keep `pickupValue` and the sliver-heal — only the value calc changes):
```js
    if (info.collectible) {
      const mult = 1 + run.combo * COMBO.bonusPer;
      const value = Math.round((e.value || 1) * mult);
      run.coins += value;
      cart.pickupValue = value;
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
    } else if (e.type === 'bump') {
```
(Task 16 later inserts a power-up routing line inside this same collectible block — do
NOT add it now; `applyPowerup`/`effects` don't exist yet at Task 9.)
In the damage branch, reset the combo: add `run.combo = 0;` after the `applyDamage` line.

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/combo.test.js`
Expected: PASS (2 tests). Re-run `node --test` (all green — earlier hop/run tests still hold; note combo defaults to 0 so prior pickup tests still match exact values).

- [ ] **Step 5: Commit**

```bash
git add src/constants.js src/run.js tests/combo.test.js
git commit -m "feat(hooks): near-miss combo multiplier"
```

---

## Task 10: bounties.js — 3 rotating missions

**Files:**
- Create: `src/bounties.js`
- Test: `tests/bounties.test.js` (new)

- [ ] **Step 1: Write the failing test**

```js
// tests/bounties.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rollBounties, progressBounties, refresh, BOUNTY_DEFS } from '../src/bounties.js';

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

test('rollBounties yields 3 distinct active missions', () => {
  const b = rollBounties(mulberry32(1), 3);
  assert.equal(b.length, 3);
  assert.equal(new Set(b.map(x => x.defId)).size, 3);
  assert.ok(b.every(x => x.progress === 0 && !x.done));
});
test('progress accrues and completes; refresh swaps the finished one out', () => {
  const rng = mulberry32(2);
  const b = rollBounties(rng, 3);
  const target = b[0];
  const def = BOUNTY_DEFS.find(d => d.id === target.defId);
  const completed = progressBounties(b, { kind: def.kind, amount: def.goal });
  assert.deepEqual(completed, [target.defId]);
  assert.equal(b[0].done, true);
  refresh(b, rng);
  assert.equal(b.filter(x => x.done).length, 0);
  assert.equal(b.length, 3);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/bounties.test.js`
Expected: FAIL (module missing).

- [ ] **Step 3: Implement bounties.js**

```js
// src/bounties.js
// Three active missions at a time. Each tracks progress toward a goal; completing one
// banks a reward and gets replaced by a fresh draw. Events: {kind, amount}.
export const BOUNTY_DEFS = [
  { id: 'bank',   kind: 'bank',  goal: 3000, reward: 1500, label: 'Bank $3,000 this run' },
  { id: 'dodge',  kind: 'dodge', goal: 12,   reward: 1200, label: 'Dodge 12 hazards' },
  { id: 'far',    kind: 'dist',  goal: 1500, reward: 1800, label: 'Reach 1,500m' },
  { id: 'taxis',  kind: 'taxi',  goal: 8,    reward: 1400, label: 'Slip past 8 taxis' },
  { id: 'combo',  kind: 'combo', goal: 5,    reward: 2000, label: 'Hit a x5 near-miss combo' },
  { id: 'coffee', kind: 'coffee',goal: 1,    reward: 5000, label: 'Catch a bag of Blue Mountain' }
];
function makeActive(def) { return { defId: def.id, kind: def.kind, goal: def.goal, progress: 0, done: false }; }
export function rollBounties(rng, n = 3, exclude = []) {
  const pool = BOUNTY_DEFS.filter(d => !exclude.includes(d.id));
  const picks = [];
  const avail = pool.slice();
  while (picks.length < n && avail.length) {
    const i = Math.floor(rng() * avail.length);
    picks.push(makeActive(avail.splice(i, 1)[0]));
  }
  return picks;
}
export function progressBounties(active, event) {
  const completed = [];
  for (const a of active) {
    if (a.done || a.kind !== event.kind) continue;
    a.progress += event.amount;
    if (a.progress >= a.goal) { a.done = true; completed.push(a.defId); }
  }
  return completed;
}
export function refresh(active, rng) {
  const keep = active.filter(a => !a.done).map(a => a.defId);
  for (let i = 0; i < active.length; i++) {
    if (active[i].done) {
      const repl = rollBounties(rng, 1, [...keep, ...active.map(a => a.defId)]);
      if (repl.length) active[i] = repl[0];
    }
  }
  return active;
}
```

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/bounties.test.js`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/bounties.js tests/bounties.test.js
git commit -m "feat(hooks): rotating bounty missions"
```

---

## Task 11: Screen router + hub screen

**Files:**
- Create: `src/screens/router.js`, `src/screens/hub.js`
- Modify: `src/game.js` (delegate menu rendering/hit-testing to the router; pass `save`, rank/lifetime banner)
- Verify: preview (no unit test — canvas rendering)

> **Reference-driven / preview-verified.** This task restructures the menu UI. Build it,
> then verify in the preview per the workflow at the end of this plan. Iterate layout
> with the owner.

- [ ] **Step 1: Define the router**

`src/screens/router.js` exports a tiny state machine:
```js
// src/screens/router.js
export function createRouter(initial = 'hub') {
  let current = initial;
  return {
    get current() { return current; },
    go(name) { current = name; },
    isHub() { return current === 'hub'; }
  };
}
```

- [ ] **Step 2: Build hub.js**

`src/screens/hub.js` exports `render(ctx, { save, W, H })` drawing four big buttons —
**PLAY**, **MECH SHOP**, **CAR DEALER**, **ASPIRATIONS** — plus a top banner showing
current **rank label** (placeholder `'Cart Bwoy'` until Wave 2 ranks land) and
`formatMoney(save.lifetimeEarned)` lifetime + `formatMoney(save.wallet)` wallet. Export
`hit(x, y, { W, H })` returning `'play' | 'mechshop' | 'cardealer' | 'aspirations' | null`
using the same rect-hit pattern as the existing `BTN` regions in `game.js`.

- [ ] **Step 3: Wire game.js to the router**

In `game.js`, replace the monolithic `renderMenu` dispatch: when `router.isHub()`, call
`hub.render`; route taps through `hub.hit` to `router.go(...)`. Keep the existing run
loop untouched. Pass `cart.speed` into `spawnInterval(...)` at its call site (completes
Task 8 wiring).

- [ ] **Step 4: Preview-verify**

Start the preview, clear SW+caches+localStorage, confirm the hub shows four buttons + the
rank/lifetime/wallet banner, and that PLAY still starts a run. Screenshot for the owner.

- [ ] **Step 5: Commit**

```bash
git add src/screens/router.js src/screens/hub.js src/game.js
git commit -m "feat(ui): hub screen + screen router; wire spawn speed"
```

---

## Task 12: Mech Shop screen (repair + RIG upgrades relocated)

**Files:**
- Create: `src/screens/mechshop.js`
- Modify: `src/game.js` (route to mechshop; on repair/upgrade, write save)
- Modify: `src/save.js` — add `repairTo(state, pct, pricePerPoint)` helper (wallet-spend based)
- Test: `tests/repair.test.js` (new, for the pure helper)

- [ ] **Step 1: Write the failing test (repair pricing helper)**

```js
// tests/repair.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave } from '../src/save.js';
import { repairCost, applyRepair } from '../src/screens/mechshop.js';

test('repair cost is per missing point above the current condition', () => {
  assert.equal(repairCost(40, 100, 50), (100 - 40) * 50);
});
test('applyRepair spends the wallet and raises saved condition', () => {
  const s = defaultSave(); s.wallet = 100000; s.condition = 40;
  const ok = applyRepair(s, 100, 50);
  assert.equal(ok, true);
  assert.equal(s.condition, 100);
  assert.equal(s.wallet, 100000 - (60 * 50));
});
test('applyRepair refuses when the wallet is short', () => {
  const s = defaultSave(); s.wallet = 100; s.condition = 40;
  assert.equal(applyRepair(s, 100, 50), false);
  assert.equal(s.condition, 40);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test tests/repair.test.js`
Expected: FAIL (module/exports missing).

- [ ] **Step 3: Implement the mechshop logic + screen**

`src/screens/mechshop.js`:
```js
import { spend } from '../economy.js';
export const REPAIR_PRICE = 50;          // $ per condition point above current
export function repairCost(from, to, price = REPAIR_PRICE) {
  return Math.max(0, Math.round((to - from) * price));
}
export function applyRepair(save, to, price = REPAIR_PRICE) {
  const cost = repairCost(save.condition, to, price);
  if (!spend(save, cost)) return false;
  save.condition = to;
  return true;
}
// render(ctx, {save, W, H}) + hit(x, y, {W,H}) → action draw the repair slider
// (e.g. repair to 100%) and the RIG stability upgrades list (moved off the start menu;
// reuse STABILITY_UPGRADES from ../upgrades.js and buyUpgrade from ../save.js, but
// spend from the wallet). Preview-verified.
export function render(ctx, state) { /* canvas UI — build to layout, preview-verify */ }
export function hit(x, y, state) { /* return 'repair100' | 'buy:<upgradeId>' | 'back' */ }
```
Update `buyUpgrade` in `save.js` to spend `wallet` instead of `coins` (change the two
`state.coins` references to `state.wallet`). Likewise `buyVehicle` (Task 13).

In `game.js`, when `router.current === 'mechshop'`, render the shop; route taps to
`applyRepair`/upgrade purchase, then `writeSave`.

- [ ] **Step 4: Run it to verify it passes**

Run: `node --test tests/repair.test.js`
Expected: PASS (3 tests). Then preview-verify the shop screen.

- [ ] **Step 5: Commit**

```bash
git add src/screens/mechshop.js src/save.js src/game.js tests/repair.test.js
git commit -m "feat(ui): Mech Shop — wallet repair + relocated RIG upgrades"
```

---

## Task 13: Car Dealer screen (rotating showroom)

**Files:**
- Create: `src/screens/cardealer.js`
- Modify: `src/save.js` (`buyVehicle` spends `wallet` — done in Task 12; verify)
- Modify: `src/game.js` (route to cardealer)
- Verify: preview

> **Reference-driven / preview-verified.**

- [ ] **Step 1: Build the showroom**

`src/screens/cardealer.js` exports `render(ctx, { save, W, H, t })` that draws one ride
at a time on a **rotating turntable** (use `t` = elapsed seconds for the spin; reuse the
rear/side sprites from `cartSprite.js`), with name, price (`formatMoney`), owned/locked
state, and **BUY** / **SELECT** / **‹ ›** cyclers. Export `hit(x, y, state)` returning
`'next' | 'prev' | 'buy' | 'select' | 'back'`.

- [ ] **Step 2: Wire into game.js**

When `router.current === 'cardealer'`, render it; route BUY → `buyVehicle` (wallet),
SELECT → `selectVehicle`, then `writeSave`. The old in-menu vehicle cycler is removed
from the start menu (it now lives here).

- [ ] **Step 3: Preview-verify**

Confirm the turntable spins, prices show, buying debits the wallet, selecting changes the
active ride. Screenshot for the owner.

- [ ] **Step 4: Commit**

```bash
git add src/screens/cardealer.js src/game.js
git commit -m "feat(ui): Car Dealer rotating showroom (off the start menu)"
```

---

## Task 14: Aspirations stub screen

**Files:**
- Create: `src/screens/aspirations.js`
- Modify: `src/game.js` (route to aspirations)
- Verify: preview

- [ ] **Step 1: Build the stub**

`src/screens/aspirations.js` lists the nine "outs" with name + `formatMoney(price)` +
a one-line narrative, each shown **locked / coming soon** (Wave 2 wires purchase). Prices
from the spec §7 table. Export `render` + `hit` (only `'back'` is live in Wave 1).

```js
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
```

- [ ] **Step 2: Preview-verify**

Reachable from the hub; shows the ladder + prices; **Back** returns. Screenshot.

- [ ] **Step 3: Commit**

```bash
git add src/screens/aspirations.js src/game.js
git commit -m "feat(ui): Aspirations board stub (the outs, priced)"
```

---

## Task 15: Banking + bounty/effects wiring into the run loop

**Files:**
- Modify: `src/game.js` (startRun seeds saved condition; game-over banks; tick effects + bounty events; persist condition)
- Verify: preview + `node --test` (regression)

- [ ] **Step 1: Seed the run from save**

In `startRun()`, pass `save.condition` into `createCart(...)` (4th arg) and create
`effects = createEffects()` and ensure `save.bounties` is non-empty (`rollBounties` if
empty). Pass `cart.speed` to `spawnInterval`.

- [ ] **Step 2: Tick power-up effects + apply boost/steady**

In `update()`, call `tickEffects(effects, dt)`. While `effectActive(effects,'boost')`,
nudge `cart.speed` up slightly; while `effectActive(effects,'steady')`, raise effective
`cart.stability`. While `run.distance < (run.coffeeUntilDist||0)`, suppress pothole/bump
spawns and bias money to `$5000` (read in the spawn path).

- [ ] **Step 3: Feed bounty events + bank on game over**

Emit `progressBounties(save.bounties, {kind:'dist', amount:dDist})`, `'dodge'`, `'taxi'`,
`'combo'`, `'coffee'`, `'bank'` at the right moments; on completion `refresh(...)`, credit
reward via `bankRun`, and `writeSave`. On game over: `save.condition = 0`-floored next run
handles the 40% floor; call `bankRun(save, run.coins)`; `writeSave`.

- [ ] **Step 4: Verify**

Run `node --test` (all green). Preview: play a run, wreck, confirm wallet + lifetime rose
by at least `MIN_EARN`, condition persisted, a bounty can complete. Screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/game.js
git commit -m "feat(loop): persist condition, bank earnings, tick effects + bounties"
```

---

## Task 16: Power-up + tool + coffee spawning & sprites

**Files:**
- Modify: `src/hazardTypes.js` (add `water`, `tools`, `coffee` collectible types)
- Modify: `src/stages.js` (add the new types to `hazardWeights`, rarities per spec)
- Modify: `src/sprites.js` / `src/cartSprite.js` (draw water bottle, tools by ride, coffee bag)
- Modify: `src/run.js` (collectible branch routes power-up types to `applyPowerup`)
- Verify: preview

> **Reference-driven / preview-verified for the sprites.** Logic (routing in run.js) is
> covered by Task 6's effects tests + a small addition here.

- [ ] **Step 1: Add hazard types**

In `hazardTypes.js`:
```js
  water:  { damage: 0, collectible: true, powerup: 'water',  depth: 3, color: '#8fd3ff', label: 'water' },
  tools:  { damage: 0, collectible: true, powerup: 'tools',  depth: 3, color: '#c9c9c9', label: 'hardware tools' },
  coffee: { damage: 0, collectible: true, powerup: 'coffee', depth: 3, color: '#5b3a1a', label: 'Blue Mountain coffee' },
```

- [ ] **Step 2: Route power-ups in run.js**

In the collectible branch of `resolveHits`, after collecting:
```js
      if (info.powerup) { applyPowerup(cart._effects, cart, run, info.powerup, run.distance); }
```
Set `cart._effects = effects` in `startRun` so `resolveHits` can reach it (or pass
`effects` through `resolveHits(run, cart, field, effects)` — preferred; update the
signature and the call site, default `effects = cart._effects || {}`).

- [ ] **Step 3: Weights + rarity**

In `stages.js`, add to each stage's `hazardWeights`: `tools` weight ~3 (common), `water`
weight ~1 (rare), `coffee` weight ~0.2 via a rare roll (or gate `coffee` behind a
low-probability check in the spawn path rather than the weight table, to keep it
ultra-rare). Coffee should not appear before ~600m.

- [ ] **Step 4: Sprites + preview-verify**

Draw the three pickups (water bottle; tools that switch spanner/socket via
`toolSpriteFor(cart.vehicle)`; coffee bag). Preview: confirm each spawns, is collectible,
heals/boosts correctly, coffee triggers the smooth-road $5000 flood. Screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/hazardTypes.js src/stages.js src/sprites.js src/cartSprite.js src/run.js
git commit -m "feat(powerups): spawn + draw water/tools/coffee; wire into collection"
```

---

## Task 17: Conductor "Bleachaz" face redesign

**Files:**
- Modify: `src/cartSprite.js` and/or `src/sprites.js` (the conductor head/arm)
- Verify: preview + the owner's reference photos

> **Reference-driven, authenticity-critical.** Render the real skin-bleaching phenomenon
> with dignity, not caricature (per the project authenticity bar). Build to the owner's
> reference photos; do not invent from web research.

- [ ] **Step 1: Locate the conductor draw code**

Find where the `conductor` persona's head/face/arm is drawn (search `cartSprite.js` /
`sprites.js` for the character branch).

- [ ] **Step 2: Apply the four traits**

White/bleached **face**; **black lips with a pink centre**; **tattoos on the lighter
neck**; one **black (un-bleached) arm** — the contrast that makes the bleaching legible.
Keep the same proportion/animation as the other personas.

- [ ] **Step 3: Preview-verify with the owner**

Show the conductor at the wheel in the preview; iterate on the owner's notes/reference until
he signs off. Screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/cartSprite.js src/sprites.js
git commit -m "feat(art): Bleachaz Conductor face — bleached face, black arm, neck tattoos"
```

---

## Task 18: Responsive — landscape fit + portrait patois prompt

**Files:**
- Modify: `src/main.js` (canvas sizing → contain-fit/letterbox; portrait detection)
- Modify: `index.html` (viewport meta if needed)
- Create: `src/screens/rotatePrompt.js` (the portrait overlay) — or inline in `main.js`
- Verify: preview at multiple sizes (`preview_resize`)

> **Preview-verified.**

- [ ] **Step 1: Fix the landscape letterbox**

In `main.js` canvas sizing, scale the 960×540 virtual stage to **contain** within the
viewport (uniform scale, centred, letterboxed) instead of pinning to the left and
clipping the right. Confirm the offset is applied to both rendering and input mapping.

- [ ] **Step 2: Portrait rotate prompt**

When `innerHeight > innerWidth`, draw a full-screen overlay: a rotate icon + one of three
patois lines, cycling every ~2.5s: *"Tun yuh phone sideway"* · *"Set yuh phone good, like
so"* · *"A nuh suh yuh fi hol yuh phone"*. Pause gameplay behind it; resume on landscape.

- [ ] **Step 3: Preview-verify**

`preview_resize` to a wide landscape (e.g. 740×360) — GUI fills, nothing clipped right.
Resize to portrait (e.g. 380×740) — the rotate prompt shows and cycles. Screenshot both.

- [ ] **Step 4: Commit**

```bash
git add src/main.js index.html src/screens/rotatePrompt.js
git commit -m "feat(responsive): landscape contain-fit + portrait patois rotate prompt"
```

---

## Task 19: Ship Wave 1

**Files:**
- Modify: `sw.js` (bump `CACHE` string)
- Verify: full test run + cleared-cache preview

- [ ] **Step 1: Full regression**

Run: `node --test`
Expected: ALL suites PASS (cart, save, economy, money, difficulty, persistent-condition,
powerups, hop, solvability, combo, bounties, repair, plus pre-existing).

- [ ] **Step 2: Bump the service worker cache**

In `sw.js`, increment the `CACHE` constant (e.g. `pothole-run-vNN`) so clients fetch the
new build.

- [ ] **Step 3: Cleared-cache preview pass**

Start the preview; clear SW + caches + localStorage; play through: hub → play → wreck →
bank → mech shop repair → car dealer buy → aspirations view; verify landscape + portrait.
Screenshots for the owner.

- [ ] **Step 4: Push (pre-approved)**

```bash
git push
```
Confirm GitHub Pages updates; do a final cleared-cache load of the live URL.

---

## Self-review (plan vs spec)

- **§1 economy** → Tasks 1, 2, 3, 12/13 (wallet spend). ✓
- **§2 power-ups + hop** → Tasks 6, 7, 16. ✓
- **§3 solvability** → Task 8. ✓
- **§4 difficulty −20%** → Task 4. ✓
- **§5 persistent damage + floor + min earnings** → Tasks 5, 2 (MIN_EARN), 15 (banking). ✓
- **§6 hub + Mech Shop + Car Dealer + Aspirations stub** → Tasks 11–14. ✓
- **§9 save migration** → Task 1. ✓
- **§10 combo + bounties** → Tasks 9, 10, 15 (wiring). ✓
- **§11 conductor face** → Task 17. ✓
- **§12 responsive** → Task 18. ✓
- **Ship** → Task 19. ✓

Waves 2–3 (ranks, full aspirations purchase, Cash Pot, endings, environment/figure
lift) are intentionally deferred and not in this plan.
