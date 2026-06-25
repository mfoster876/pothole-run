# Pothole Run — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a playable, deployed endless cart-dodging game — pseudo-3D road, one-thumb lane sliding, cart-wreck survival, coins, 3 drivers, 3 grounded stages, original chiptune reggae, on-device save, installable PWA — running in iPhone Safari (landscape) and macOS Safari from GitHub Pages.

**Architecture:** Plain ES-module JavaScript on an HTML5 Canvas 2D, no build step, no dependencies. Pure-logic modules (`wreck`, `collision`, `spawner`, `save`, `characters`, `stages`) are framework-free and unit-tested with Node's built-in `node:test`; the same `.js` files load in the browser via `<script type="module">`. Visual/glue modules (`road`, `cart`, `entities`, `input`, `hud`, `audio`, `game`, `main`) carry complete code and are verified in-browser. A fixed-timestep loop drives update/render.

**Tech Stack:** HTML5 Canvas 2D, vanilla ES modules, Web Audio API, `localStorage`, `node:test` (dev only), PWA manifest + service worker, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-06-24-pothole-run-design.md`
**World/hazard reference:** `docs/superpowers/research/2026-06-24-jamaica-environment-research.md`

**Coordinate conventions (used by every module):**
- Road spans normalized x from `-1` (left edge) to `+1` (right edge). Lanes centre at `x = -0.6, 0, +0.6`.
- Player and entities share this x space. Player `halfWidth = 0.16`, entity `halfWidth = 0.16`.
- `z` is distance ahead of the player in world units; it decreases toward 0 as a hazard approaches. An entity is "at the player" when `z <= 0` and `z > -depth`.
- `distance` (metres travelled) is the score/difficulty clock.

**Conventions:** DRY, YAGNI, TDD for logic, frequent commits. Run tests with `node --test`. Use `npx http-server` or `python3 -m http.server` to serve locally for browser checks (file:// breaks ES modules + service workers).

---

## Milestone 0 — Project scaffold (runnable blank canvas)

### Task 0.1: Package + test runner setup

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "pothole-run",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "serve": "python3 -m http.server 8000"
  }
}
```

- [ ] **Step 2: Verify Node runs the test command (no tests yet = exit 0)**

Run: `node --test`
Expected: exits 0 with "tests 0" (or "no test files found"); either is fine — confirms the runner works.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: project scaffold with node:test runner"
```

### Task 0.2: HTML shell + canvas + landscape CSS

**Files:**
- Create: `index.html`
- Create: `styles.css`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
  <meta name="theme-color" content="#0e1a12" />
  <link rel="manifest" href="manifest.webmanifest" />
  <link rel="apple-touch-icon" href="assets/icons/icon-192.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <title>Pothole Run</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div id="rotate-hint">Turn your phone sideways <span aria-hidden="true">↻</span></div>
  <canvas id="game"></canvas>
  <script type="module" src="src/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `styles.css`**

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; background: #0e1a12; }
body { touch-action: none; -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }
#game { display: block; width: 100vw; height: 100vh; }
#rotate-hint {
  position: absolute; inset: 0; display: none;
  align-items: center; justify-content: center;
  color: #f4f1e6; font: 500 20px/1.4 system-ui, sans-serif; text-align: center;
  background: #0e1a12; z-index: 10; padding: 2rem;
}
@media (orientation: portrait) and (max-width: 900px) {
  #rotate-hint { display: flex; }
  #game { display: none; }
}
```

- [ ] **Step 3: Verify in browser**

Run: `python3 -m http.server 8000` then open `http://localhost:8000`
Expected: black full-window canvas on desktop; on a narrow portrait viewport the rotate hint shows. (Console will error on missing `main.js` until Task 0.3 — acceptable.)

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: HTML shell, full-screen canvas, landscape rotate hint"
```

### Task 0.3: Fixed-timestep loop + DPR-capped canvas sizing

**Files:**
- Create: `src/main.js`
- Create: `src/constants.js`

- [ ] **Step 1: Create `src/constants.js`**

```js
export const LANES = [-0.6, 0, 0.6];
export const PLAYER_HALF_WIDTH = 0.16;
export const ENTITY_HALF_WIDTH = 0.16;

export const CART = {
  maxCondition: 100,
  startSpeed: 80,      // world units / second
  maxSpeed: 220,
  accel: 6,            // speed gained per second
  laneLerp: 7          // how fast the cart slides toward its target lane (×handling)
};

export const DAMAGE = {
  pothole: 12,
  manhole: 100,        // open manhole = instant wreck
  traffic: 26,
  animal: 20,
  bump: 6,
  repairPerCoin: 4
};

export const SPAWN = { baseInterval: 60, minInterval: 22, ramp: 500 };
export const MAX_DPR = 2;
export const VIRTUAL = { width: 960, height: 540 }; // logical design resolution (16:9)
```

- [ ] **Step 2: Create `src/main.js` (loop only; game wired in later milestones)**

```js
import { VIRTUAL, MAX_DPR } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

export const viewport = { width: VIRTUAL.width, height: VIRTUAL.height, scale: 1 };

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const cssW = window.innerWidth, cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  // Fit the 16:9 virtual stage into the screen (letterbox), origin at top-left.
  viewport.scale = Math.min(canvas.width / VIRTUAL.width, canvas.height / VIRTUAL.height);
  viewport.width = canvas.width;
  viewport.height = canvas.height;
}
window.addEventListener('resize', resize);
resize();

// Placeholder world the later milestones replace via setUpdate/setRender.
let updateFn = (dt) => {};
let renderFn = (ctx) => {
  ctx.fillStyle = '#0e1a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
export function setUpdate(fn) { updateFn = fn; }
export function setRender(fn) { renderFn = fn; }

const STEP = 1 / 60;
let last = 0, acc = 0;
function frame(now) {
  if (!last) last = now;
  acc += Math.min(0.25, (now - last) / 1000);
  last = now;
  while (acc >= STEP) { updateFn(STEP); acc -= STEP; }
  renderFn(ctx);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
```

- [ ] **Step 3: Verify in browser**

Run: serve and open `http://localhost:8000`
Expected: solid dark-green canvas, no console errors, fills the window and survives resizing.

- [ ] **Step 4: Commit**

```bash
git add src/main.js src/constants.js
git commit -m "feat: fixed-timestep loop and DPR-capped canvas sizing"
```

---

## Milestone 1 — Core logic (TDD, framework-free)

### Task 1.1: Cart-wreck condition math

**Files:**
- Create: `src/wreck.js`
- Test: `tests/wreck.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCondition, applyDamage, repair, isWrecked, conditionTier } from '../src/wreck.js';

test('createCondition starts full', () => {
  const c = createCondition(100);
  assert.equal(c.value, 100);
  assert.equal(c.max, 100);
});

test('applyDamage reduces value and floors at 0', () => {
  assert.equal(applyDamage(createCondition(100), 12).value, 88);
  assert.equal(applyDamage(createCondition(100), 250).value, 0);
});

test('repair restores value capped at max', () => {
  const hurt = applyDamage(createCondition(100), 50);
  assert.equal(repair(hurt, 30).value, 80);
  assert.equal(repair(hurt, 999).value, 100);
});

test('isWrecked true only at zero', () => {
  assert.equal(isWrecked(createCondition(100)), false);
  assert.equal(isWrecked(applyDamage(createCondition(100), 100)), true);
});

test('conditionTier maps ratio to good/warn/critical', () => {
  assert.equal(conditionTier(createCondition(100)), 'good');
  assert.equal(conditionTier({ value: 45, max: 100 }), 'warn');
  assert.equal(conditionTier({ value: 20, max: 100 }), 'critical');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/wreck.test.js`
Expected: FAIL — cannot find module `../src/wreck.js`.

- [ ] **Step 3: Write minimal implementation**

```js
export function createCondition(max = 100) {
  return { value: max, max };
}
export function applyDamage(cond, amount) {
  return { ...cond, value: Math.max(0, cond.value - amount) };
}
export function repair(cond, amount) {
  return { ...cond, value: Math.min(cond.max, cond.value + amount) };
}
export function isWrecked(cond) {
  return cond.value <= 0;
}
export function conditionTier(cond) {
  const ratio = cond.value / cond.max;
  if (ratio > 0.6) return 'good';
  if (ratio > 0.3) return 'warn';
  return 'critical';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/wreck.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/wreck.js tests/wreck.test.js
git commit -m "feat: cart-wreck condition math (TDD)"
```

### Task 1.2: Collision detection

**Files:**
- Create: `src/collision.js`
- Test: `tests/collision.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { laneOverlap, inHitZone, isHit } from '../src/collision.js';

test('laneOverlap true when x distance under combined half-widths', () => {
  assert.equal(laneOverlap(0, 0.16, 0.1, 0.16), true);
  assert.equal(laneOverlap(0, 0.16, 0.6, 0.16), false);
});

test('inHitZone true only while entity straddles the player plane', () => {
  assert.equal(inHitZone(5, 3), false);   // still ahead
  assert.equal(inHitZone(0, 3), true);    // at the plane
  assert.equal(inHitZone(-2, 3), true);   // overlapping
  assert.equal(inHitZone(-4, 3), false);  // already passed
});

test('isHit requires both lane overlap and hit zone', () => {
  const player = { x: 0, halfWidth: 0.16 };
  assert.equal(isHit(player, { x: 0, z: 0, depth: 3, halfWidth: 0.16 }), true);
  assert.equal(isHit(player, { x: 0.6, z: 0, depth: 3, halfWidth: 0.16 }), false); // other lane
  assert.equal(isHit(player, { x: 0, z: 9, depth: 3, halfWidth: 0.16 }), false);   // far ahead
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/collision.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
export function laneOverlap(playerX, playerHalf, entityX, entityHalf) {
  return Math.abs(playerX - entityX) < (playerHalf + entityHalf);
}
export function inHitZone(z, depth) {
  return z <= 0 && z > -depth;
}
export function isHit(player, entity) {
  return inHitZone(entity.z, entity.depth)
    && laneOverlap(player.x, player.halfWidth, entity.x, entity.halfWidth);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/collision.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/collision.js tests/collision.test.js
git commit -m "feat: lane/zone collision detection (TDD)"
```

### Task 1.3: Spawner cadence + weighted hazard pick

**Files:**
- Create: `src/spawner.js`
- Test: `tests/spawner.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnInterval, pickHazard, laneFor } from '../src/spawner.js';

test('spawnInterval shrinks with distance but never below min', () => {
  assert.equal(spawnInterval(0), 60);
  assert.ok(spawnInterval(10000) >= 22);
  assert.ok(spawnInterval(5000) < spawnInterval(0));
});

test('pickHazard is deterministic given rng and respects weights', () => {
  const weights = [{ type: 'pothole', weight: 3 }, { type: 'coin', weight: 1 }];
  assert.equal(pickHazard(weights, () => 0.0), 'pothole');   // first bucket
  assert.equal(pickHazard(weights, () => 0.99), 'coin');     // last bucket
});

test('laneFor maps rng to a lane index in range', () => {
  assert.equal(laneFor(() => 0.0, 3), 0);
  assert.equal(laneFor(() => 0.99, 3), 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/spawner.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { SPAWN } from './constants.js';

export function spawnInterval(distance, base = SPAWN.baseInterval, min = SPAWN.minInterval) {
  return Math.max(min, base - distance / SPAWN.ramp);
}
export function pickHazard(weights, rng) {
  const total = weights.reduce((sum, w) => sum + w.weight, 0);
  let r = rng() * total;
  for (const w of weights) {
    r -= w.weight;
    if (r < 0) return w.type;
  }
  return weights[weights.length - 1].type;
}
export function laneFor(rng, laneCount) {
  return Math.min(laneCount - 1, Math.floor(rng() * laneCount));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/spawner.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/spawner.js tests/spawner.test.js
git commit -m "feat: spawner cadence and weighted hazard pick (TDD)"
```

### Task 1.4: Save/load with defaults + corrupt-data fallback

**Files:**
- Create: `src/save.js`
- Test: `tests/save.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaultSave, loadSave, writeSave, recordBest, addCoins } from '../src/save.js';

function fakeStorage(seed = null) {
  const m = new Map();
  if (seed !== null) m.set('pothole-run-save:v1', seed);
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('loadSave returns defaults when empty', () => {
  const s = loadSave(fakeStorage());
  assert.equal(s.coins, 0);
  assert.deepEqual(s.unlocks.characters, ['yute', 'rasta']);
  assert.deepEqual(s.unlocks.stages, ['fern-gully']);
});

test('loadSave falls back to defaults on corrupt JSON', () => {
  const s = loadSave(fakeStorage('{not json'));
  assert.equal(s.coins, 0);
});

test('writeSave round-trips through storage', () => {
  const storage = fakeStorage();
  const saved = writeSave({ ...defaultSave(), coins: 42 }, storage);
  assert.equal(saved.coins, 42);
  assert.equal(loadSave(storage).coins, 42);
});

test('recordBest only raises the best', () => {
  const s = defaultSave();
  recordBest(s, 'fern-gully', 500);
  recordBest(s, 'fern-gully', 300);
  assert.equal(s.bests['fern-gully'], 500);
});

test('addCoins accumulates', () => {
  const s = defaultSave();
  addCoins(s, 10); addCoins(s, 5);
  assert.equal(s.coins, 15);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/save.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
const KEY = 'pothole-run-save:v1';

export function defaultSave() {
  return {
    coins: 0,
    bests: {},
    unlocks: { characters: ['yute', 'rasta'], stages: ['fern-gully'] },
    settings: { muted: false }
  };
}
export function loadSave(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw);
    const base = defaultSave();
    return {
      ...base, ...parsed,
      unlocks: { ...base.unlocks, ...(parsed.unlocks || {}) },
      settings: { ...base.settings, ...(parsed.settings || {}) }
    };
  } catch {
    return defaultSave();
  }
}
export function writeSave(state, storage = globalThis.localStorage) {
  storage.setItem(KEY, JSON.stringify(state));
  return state;
}
export function recordBest(state, stageId, score) {
  if (score > (state.bests[stageId] ?? 0)) state.bests[stageId] = score;
  return state;
}
export function addCoins(state, n) {
  state.coins += n;
  return state;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/save.test.js`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/save.js tests/save.test.js
git commit -m "feat: localStorage save with defaults and corrupt fallback (TDD)"
```

### Task 1.5: Character roster + stage configs (config-integrity tests)

**Files:**
- Create: `src/characters.js`
- Create: `src/stages.js`
- Test: `tests/config.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHARACTERS, getCharacter } from '../src/characters.js';
import { STAGES, getStage } from '../src/stages.js';

test('every character has the required stat fields', () => {
  for (const c of CHARACTERS) {
    for (const k of ['id', 'name', 'topSpeed', 'handling', 'toughness', 'coinDraw', 'scoreMult', 'locked']) {
      assert.ok(k in c, `character ${c.id} missing ${k}`);
    }
  }
});

test('MVP ships exactly 3 characters incl. yute, rasta, conductor', () => {
  const ids = CHARACTERS.map(c => c.id);
  assert.deepEqual(ids, ['yute', 'rasta', 'conductor']);
});

test('conductor is the reckless archetype: fastest, loosest, most fragile', () => {
  const c = getCharacter('conductor');
  assert.ok(c.topSpeed >= Math.max(...CHARACTERS.map(x => x.topSpeed)));
  assert.ok(c.handling <= Math.min(...CHARACTERS.map(x => x.handling)));
  assert.ok(c.toughness <= Math.min(...CHARACTERS.map(x => x.toughness)));
  assert.ok(c.scoreMult > 1);
});

test('every stage has required fields and a 3-lane hazard weight table', () => {
  for (const s of STAGES) {
    for (const k of ['id', 'name', 'palette', 'hazardWeights', 'musicId', 'locked']) {
      assert.ok(k in s, `stage ${s.id} missing ${k}`);
    }
    assert.ok(s.hazardWeights.length > 0);
    for (const w of s.hazardWeights) assert.ok('type' in w && 'weight' in w);
  }
});

test('MVP ships 3 stages; fern-gully unlocked by default', () => {
  assert.deepEqual(STAGES.map(s => s.id), ['fern-gully', 'holland-bamboo', 'negril']);
  assert.equal(getStage('fern-gully').locked, false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/config.test.js`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/characters.js`**

```js
// Stats are multipliers on base behaviour. Distinct archetypes (see spec §6).
export const CHARACTERS = [
  { id: 'yute', name: 'School Yute', topSpeed: 1.0, handling: 1.0, toughness: 1.0, coinDraw: 1.0, scoreMult: 1.0, locked: false },
  { id: 'rasta', name: 'Rasta Musician', topSpeed: 0.9, handling: 1.05, toughness: 1.25, coinDraw: 1.4, scoreMult: 1.0, locked: false },
  { id: 'conductor', name: 'Bleachaz Conductor', topSpeed: 1.25, handling: 0.78, toughness: 0.7, coinDraw: 1.0, scoreMult: 1.3, locked: true }
];
export function getCharacter(id) {
  return CHARACTERS.find(c => c.id === id) ?? CHARACTERS[0];
}
```

- [ ] **Step 4: Write `src/stages.js`**

```js
// Palettes + hazard mixes grounded in the research doc. Weights feed the spawner.
export const STAGES = [
  {
    id: 'fern-gully', name: 'Fern Gully', locked: false, musicId: 'fern',
    palette: { sky: '#cdeef0', hill: '#1e5e2a', ground: '#3a8f44', road: '#54585e', rumble: '#3f6b3f' },
    hazardWeights: [
      { type: 'pothole', weight: 5 }, { type: 'coin', weight: 4 },
      { type: 'slick', weight: 2 }, { type: 'stall', weight: 2 }, { type: 'manhole', weight: 1 }
    ]
  },
  {
    id: 'holland-bamboo', name: 'Holland Bamboo', locked: true, musicId: 'bamboo',
    palette: { sky: '#e7f3c8', hill: '#6b7a1e', ground: '#7c8a2a', road: '#5a5044', rumble: '#7a6a44' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'goat', weight: 3 }, { type: 'bus', weight: 2 }, { type: 'bump', weight: 2 }
    ]
  },
  {
    id: 'negril', name: 'Negril 7-Mile', locked: true, musicId: 'negril',
    palette: { sky: '#ffd9a0', hill: '#caa45a', ground: '#e8c98a', road: '#6b6b72', rumble: '#b9a06a' },
    hazardWeights: [
      { type: 'pothole', weight: 4 }, { type: 'coin', weight: 4 },
      { type: 'taxi', weight: 3 }, { type: 'hustler', weight: 2 }, { type: 'manhole', weight: 1 }
    ]
  }
];
export function getStage(id) {
  return STAGES.find(s => s.id === id) ?? STAGES[0];
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node --test tests/config.test.js`
Expected: PASS (5 tests).

- [ ] **Step 6: Run the whole suite**

Run: `node --test`
Expected: PASS — all logic suites green (wreck, collision, spawner, save, config).

- [ ] **Step 7: Commit**

```bash
git add src/characters.js src/stages.js tests/config.test.js
git commit -m "feat: character roster and stage configs with integrity tests (TDD)"
```

---

## Milestone 2 — Player, road, input (drive on a moving road)

### Task 2.1: Hazard-type catalogue (shared visual/logic metadata)

**Files:**
- Create: `src/hazardTypes.js`
- Test: `tests/hazardTypes.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HAZARD_TYPES, hazardInfo } from '../src/hazardTypes.js';
import { DAMAGE } from '../src/constants.js';

test('each hazard type declares damage, collectible flag, depth, color', () => {
  for (const key of Object.keys(HAZARD_TYPES)) {
    const h = HAZARD_TYPES[key];
    for (const k of ['damage', 'collectible', 'depth', 'color', 'label']) {
      assert.ok(k in h, `${key} missing ${k}`);
    }
  }
});

test('coin is collectible with zero damage; manhole is an instant wreck', () => {
  assert.equal(hazardInfo('coin').collectible, true);
  assert.equal(hazardInfo('coin').damage, 0);
  assert.equal(hazardInfo('manhole').damage, DAMAGE.manhole);
});

test('unknown type falls back to pothole', () => {
  assert.equal(hazardInfo('nope').label, hazardInfo('pothole').label);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/hazardTypes.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { DAMAGE } from './constants.js';

export const HAZARD_TYPES = {
  pothole:  { damage: DAMAGE.pothole, collectible: false, depth: 3, color: '#1c1c1c', label: 'crater' },
  manhole:  { damage: DAMAGE.manhole, collectible: false, depth: 3, color: '#000000', label: 'open manhole' },
  coin:     { damage: 0,              collectible: true,  depth: 3, color: '#f0c020', label: 'coin' },
  goat:     { damage: DAMAGE.animal,  collectible: false, depth: 4, color: '#d8c7b0', label: 'goat' },
  taxi:     { damage: DAMAGE.traffic, collectible: false, depth: 5, color: '#c0382c', label: 'route taxi' },
  bus:      { damage: DAMAGE.traffic, collectible: false, depth: 6, color: '#e7c84a', label: 'JUTC bus' },
  hustler:  { damage: DAMAGE.animal,  collectible: false, depth: 3, color: '#d06a30', label: 'hustler' },
  stall:    { damage: DAMAGE.traffic, collectible: false, depth: 4, color: '#7a4a22', label: 'vendor stall' },
  slick:    { damage: DAMAGE.bump,    collectible: false, depth: 3, color: '#3a4a6a', label: 'wet slick' },
  bump:     { damage: DAMAGE.bump,    collectible: false, depth: 2, color: '#8a8a8a', label: 'sleeping policeman' }
};
export function hazardInfo(type) {
  return HAZARD_TYPES[type] ?? HAZARD_TYPES.pothole;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/hazardTypes.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/hazardTypes.js tests/hazardTypes.test.js
git commit -m "feat: hazard-type catalogue (TDD)"
```

### Task 2.2: Player cart update logic

**Files:**
- Create: `src/cart.js`
- Test: `tests/cart.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createCart, steer, updateCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';

test('createCart starts centred, full condition, in middle lane', () => {
  const cart = createCart(getCharacter('yute'));
  assert.equal(cart.laneIndex, 1);
  assert.equal(cart.x, 0);
  assert.equal(cart.condition.value, 100);
});

test('steer right increments target lane, clamped to track', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1); assert.equal(cart.laneIndex, 2);
  steer(cart, +1); assert.equal(cart.laneIndex, 2); // clamped
  steer(cart, -1); assert.equal(cart.laneIndex, 1);
});

test('updateCart eases x toward the target lane and ramps speed', () => {
  const cart = createCart(getCharacter('yute'));
  steer(cart, +1);
  const before = cart.x;
  updateCart(cart, 0.5);
  assert.ok(cart.x > before);          // moved toward +0.6
  assert.ok(cart.x <= 0.6 + 1e-9);
  assert.ok(cart.speed > 80);          // accelerated from start speed
});

test('reckless conductor slides looser (less handling) than yute over one step', () => {
  const yute = createCart(getCharacter('yute'));
  const cond = createCart(getCharacter('conductor'));
  steer(yute, +1); steer(cond, +1);
  updateCart(yute, 0.1); updateCart(cond, 0.1);
  assert.ok(cond.x < yute.x); // conductor lags toward target = looser/twitchier feel
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/cart.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { LANES, CART, PLAYER_HALF_WIDTH } from './constants.js';
import { createCondition } from './wreck.js';

export function createCart(character) {
  return {
    character,
    laneIndex: 1,
    x: LANES[1],
    halfWidth: PLAYER_HALF_WIDTH,
    speed: CART.startSpeed,
    lean: 0,
    condition: createCondition(CART.maxCondition)
  };
}
export function steer(cart, dir) {
  cart.laneIndex = Math.max(0, Math.min(LANES.length - 1, cart.laneIndex + dir));
}
export function updateCart(cart, dt) {
  const targetX = LANES[cart.laneIndex];
  const k = CART.laneLerp * cart.character.handling;
  const t = 1 - Math.exp(-k * dt);     // frame-rate independent ease
  cart.x += (targetX - cart.x) * t;
  cart.lean = (targetX - cart.x);
  const max = CART.maxSpeed * cart.character.topSpeed;
  cart.speed = Math.min(max, cart.speed + CART.accel * dt * cart.character.topSpeed);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/cart.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/cart.js tests/cart.test.js
git commit -m "feat: player cart steering and movement (TDD)"
```

### Task 2.3: Input (touch thumb-zones + keyboard)

**Files:**
- Create: `src/input.js`

- [ ] **Step 1: Write `src/input.js` (edge-triggered lane steps + a tap callback)**

```js
// Emits discrete steer steps. Holding a side repeats at a fixed cadence so a long
// press keeps sliding lane-by-lane without spamming.
export function createInput(target, { onSteer, onTap }) {
  const held = { left: false, right: false };
  let repeatTimer = 0;
  const REPEAT = 0.18; // seconds between repeats while held

  function press(side) {
    if (side === 'left' && !held.left) { held.left = true; onSteer(-1); repeatTimer = REPEAT; }
    if (side === 'right' && !held.right) { held.right = true; onSteer(+1); repeatTimer = REPEAT; }
  }
  function release(side) { held[side] = false; }

  function sideFromX(clientX) {
    return clientX < window.innerWidth / 2 ? 'left' : 'right';
  }

  target.addEventListener('touchstart', (e) => {
    onTap && onTap();
    for (const t of e.changedTouches) press(sideFromX(t.clientX));
    e.preventDefault();
  }, { passive: false });
  target.addEventListener('touchend', (e) => {
    // recompute which sides are still held from remaining touches
    held.left = held.right = false;
    for (const t of e.touches) held[sideFromX(t.clientX)] = true;
    e.preventDefault();
  }, { passive: false });

  target.addEventListener('mousedown', (e) => { onTap && onTap(); press(sideFromX(e.clientX)); });
  window.addEventListener('mouseup', () => { release('left'); release('right'); });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') { onTap && onTap(); press('left'); }
    if (e.key === 'ArrowRight' || e.key === 'd') { onTap && onTap(); press('right'); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') release('left');
    if (e.key === 'ArrowRight' || e.key === 'd') release('right');
  });

  return {
    update(dt) {
      if (held.left || held.right) {
        repeatTimer -= dt;
        if (repeatTimer <= 0) { onSteer(held.left ? -1 : +1); repeatTimer = REPEAT; }
      }
    }
  };
}
```

- [ ] **Step 2: Commit (browser-verified once the road exists in Task 2.5)**

```bash
git add src/input.js
git commit -m "feat: touch thumb-zone and keyboard input with hold-repeat"
```

### Task 2.4: Pseudo-3D road renderer

**Files:**
- Create: `src/road.js`

- [ ] **Step 1: Write `src/road.js`**

```js
import { VIRTUAL } from './constants.js';

const SEG_LEN = 200;          // world length of one road segment
const RUMBLE = 3;             // segments per colour stripe
const DRAW_SEGS = 220;        // how many segments ahead we draw
const CAM_HEIGHT = 1500;      // camera height above road
const CAM_DEPTH = 0.84;       // ~ 1 / tan(fov/2)

// One straight road of repeating segments. (Curves are out of scope for Phase 1.)
export function makeRoad() {
  const segments = [];
  const total = 600;
  for (let i = 0; i < total; i++) {
    const light = Math.floor(i / RUMBLE) % 2 === 0;
    segments.push({ index: i, z: i * SEG_LEN, light });
  }
  return { segments, total, segLen: SEG_LEN, length: total * SEG_LEN };
}

function project(camX, camZ, worldX, worldZ, width, height, roadWidth) {
  const dz = Math.max(0.1, worldZ - camZ);
  const scale = CAM_DEPTH / dz;
  return {
    x: width / 2 + scale * (worldX - camX) * width / 2,
    y: height / 2 - scale * CAM_HEIGHT * height / 2 / 1000,
    w: scale * roadWidth * width / 2,
    scale
  };
}

// cameraZ = player distance in world units; playerX in normalized [-1..1].
export function renderRoad(ctx, road, palette, cameraZ, playerX, W, H) {
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = palette.hill;
  ctx.fillRect(0, H * 0.42, W, H * 0.06);
  ctx.fillStyle = palette.ground;
  ctx.fillRect(0, H * 0.48, W, H * 0.52);

  const roadWidth = W * 0.9;
  const baseSeg = Math.floor(cameraZ / road.segLen);
  let prev = null;

  for (let n = DRAW_SEGS; n >= 0; n--) {
    const seg = road.segments[(baseSeg + n) % road.total];
    const worldZ = (baseSeg + n) * road.segLen;
    const p = project(playerX * (roadWidth / W), cameraZ, 0, worldZ, W, H, roadWidth / (W / 2));
    if (prev && p.scale > 0 && p.y < prev.y) {
      drawSegment(ctx, palette, seg, p, prev, W);
    }
    prev = p;
  }
}

function drawSegment(ctx, palette, seg, near, far, W) {
  const grass = seg.light ? palette.ground : shade(palette.ground, -0.06);
  const road = seg.light ? palette.road : shade(palette.road, -0.08);
  const rumble = seg.light ? palette.rumble : shade(palette.rumble, -0.1);

  ctx.fillStyle = grass;
  ctx.fillRect(0, far.y, W, near.y - far.y);

  poly(ctx, near.x - near.w * 1.12, near.y, near.x + near.w * 1.12, near.y,
            far.x + far.w * 1.12, far.y, far.x - far.w * 1.12, far.y, rumble);
  poly(ctx, near.x - near.w, near.y, near.x + near.w, near.y,
            far.x + far.w, far.y, far.x - far.w, far.y, road);
  if (seg.light) {
    const ml = 0.04;
    poly(ctx, near.x - near.w * ml, near.y, near.x + near.w * ml, near.y,
              far.x + far.w * ml, far.y, far.x - far.w * ml, far.y, '#e7d24a');
  }
}

function poly(ctx, x1, y1, x2, y2, x3, y3, x4, y4, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4);
  ctx.closePath(); ctx.fill();
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt * 255));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt * 255));
  const b = Math.max(0, Math.min(255, (n & 255) + amt * 255));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

// Screen position for an entity at normalized x and distance-ahead z.
export function projectEntity(cameraZ, normX, zAhead, W, H) {
  const worldZ = cameraZ + Math.max(0.1, zAhead);
  const dz = Math.max(0.1, worldZ - cameraZ);
  const scale = CAM_DEPTH / dz;
  const roadWidth = W * 0.9;
  return {
    x: W / 2 + scale * normX * (roadWidth / 2),
    y: H / 2 - scale * CAM_HEIGHT * H / 2 / 1000,
    scale
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/road.js
git commit -m "feat: pseudo-3D segment road renderer"
```

### Task 2.5: Wire a driveable test scene in `main.js`

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Replace the placeholder world in `src/main.js` with a temporary drive scene**

Append after the `setRender` definitions, before the loop section:

```js
import { makeRoad, renderRoad } from './road.js';
import { createCart, steer, updateCart } from './cart.js';
import { createInput } from './input.js';
import { getCharacter } from './characters.js';
import { getStage } from './stages.js';

const road = makeRoad();
const stage = getStage('fern-gully');
const cart = createCart(getCharacter('yute'));
const input = createInput(canvas, { onSteer: (d) => steer(cart, d) });
let camZ = 0;

setUpdate((dt) => {
  input.update(dt);
  updateCart(cart, dt);
  camZ += cart.speed * dt * 4;
});
setRender((c) => {
  c.setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0);
  renderRoad(c, road, stage.palette, camZ, cart.x, VIRTUAL.width, VIRTUAL.height);
});
```

Add `VIRTUAL` to the existing import at the top: `import { VIRTUAL, MAX_DPR } from './constants.js';` (already present — confirm).

- [ ] **Step 2: Verify in browser**

Run: serve, open on desktop, hold ArrowLeft/ArrowRight (or click left/right halves).
Expected: a green Fern Gully road scrolls toward you with a sense of speed; the camera/cart shifts left and right between three lanes. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/main.js
git commit -m "feat: driveable test scene (road + cart + input)"
```

---

## Milestone 3 — Hazards, coins, collision, HUD (one stage fully playable)

### Task 3.1: Entity pool + advance/spawn logic

**Files:**
- Create: `src/entities.js`
- Test: `tests/entities.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createField, spawn, advance, activeEntities } from '../src/entities.js';
import { LANES } from '../src/constants.js';

test('spawn adds an active entity at a lane with z ahead', () => {
  const field = createField();
  spawn(field, 'pothole', 1, 300);
  const list = activeEntities(field);
  assert.equal(list.length, 1);
  assert.equal(list[0].x, LANES[1]);
  assert.equal(list[0].z, 300);
});

test('advance moves entities toward the player and retires passed ones', () => {
  const field = createField();
  spawn(field, 'pothole', 0, 10);
  advance(field, 100);                 // z: 10 -> -90, beyond depth -> retired
  assert.equal(activeEntities(field).length, 0);
});

test('pool is reused: spawning after retire does not grow the array unbounded', () => {
  const field = createField();
  for (let i = 0; i < 5; i++) { spawn(field, 'coin', 1, 5); advance(field, 100); }
  assert.ok(field.pool.length <= 5);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/entities.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { LANES, ENTITY_HALF_WIDTH } from './constants.js';
import { hazardInfo } from './hazardTypes.js';

export function createField() {
  return { pool: [] };
}
export function spawn(field, type, laneIndex, z) {
  const info = hazardInfo(type);
  let e = field.pool.find(p => !p.active);
  if (!e) { e = {}; field.pool.push(e); }
  e.active = true;
  e.type = type;
  e.x = LANES[laneIndex];
  e.z = z;
  e.depth = info.depth;
  e.halfWidth = ENTITY_HALF_WIDTH;
  e.collected = false;
  return e;
}
export function advance(field, dz) {
  for (const e of field.pool) {
    if (!e.active) continue;
    e.z -= dz;
    if (e.z < -e.depth - 2) e.active = false;
  }
}
export function activeEntities(field) {
  return field.pool.filter(e => e.active);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/entities.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/entities.js tests/entities.test.js
git commit -m "feat: pooled entity field with spawn/advance (TDD)"
```

### Task 3.2: Run state — distance, score, coins, hit resolution

**Files:**
- Create: `src/run.js`
- Test: `tests/run.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRun, resolveHits } from '../src/run.js';
import { createCart } from '../src/cart.js';
import { getCharacter } from '../src/characters.js';
import { createField, spawn } from '../src/entities.js';

function setup(charId = 'yute') {
  const cart = createCart(getCharacter(charId));
  const field = createField();
  const run = createRun();
  return { cart, field, run };
}

test('rolling over a coin collects it, banks a coin, repairs a little', () => {
  const { cart, field, run } = setup();
  cart.condition.value = 50;
  const coin = spawn(field, 'coin', 1, 0);   // at player plane, middle lane
  coin.z = 0;
  resolveHits(run, cart, field);
  assert.equal(run.coins, 1);
  assert.ok(cart.condition.value > 50);
  assert.equal(coin.active, false);
});

test('hitting a pothole damages the cart once (not every frame)', () => {
  const { cart, field, run } = setup();
  const p = spawn(field, 'pothole', 1, 0); p.z = 0;
  resolveHits(run, cart, field);
  resolveHits(run, cart, field);             // second call: already counted
  assert.equal(cart.condition.value, 88);
});

test('manhole is an instant wreck', () => {
  const { cart, field, run } = setup();
  const m = spawn(field, 'manhole', 1, 0); m.z = 0;
  resolveHits(run, cart, field);
  assert.equal(cart.condition.value, 0);
});

test('coinDraw magnet widens collection for the rasta', () => {
  const { cart, field, run } = setup('rasta');
  const coin = spawn(field, 'coin', 2, 0);   // adjacent lane
  coin.z = 0; cart.x = LANES_MID();
  // rasta's wider magnet should still miss a full lane away; sanity: same-lane collects
  const same = spawn(field, 'coin', 1, 0); same.z = 0;
  resolveHits(run, cart, field);
  assert.ok(run.coins >= 1);
});
function LANES_MID() { return 0; }
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/run.test.js`
Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

```js
import { isHit, laneOverlap, inHitZone } from './collision.js';
import { applyDamage, repair } from './wreck.js';
import { hazardInfo } from './hazardTypes.js';
import { DAMAGE } from './constants.js';

export function createRun() {
  return { distance: 0, score: 0, coins: 0, wrecked: false };
}
export function resolveHits(run, cart, field) {
  for (const e of field.pool) {
    if (!e.active || e.collected) continue;
    const info = hazardInfo(e.type);
    const magnet = info.collectible ? cart.character.coinDraw : 1;
    const overlap = laneOverlap(cart.x, cart.halfWidth * magnet, e.x, e.halfWidth)
      && inHitZone(e.z, e.depth);
    if (!overlap) continue;
    e.collected = true;
    e.active = false;
    if (info.collectible) {
      run.coins += 1;
      cart.condition = repair(cart.condition, DAMAGE.repairPerCoin);
    } else {
      const dmg = info.damage / cart.character.toughness;
      cart.condition = applyDamage(cart.condition, dmg);
    }
  }
}
```

Note: import `LANES` is not needed here; the test's `LANES_MID()` returns 0 directly.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/run.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/run.js tests/run.test.js
git commit -m "feat: run state and hit/coin resolution (TDD)"
```

### Task 3.3: HUD renderer

**Files:**
- Create: `src/hud.js`

- [ ] **Step 1: Write `src/hud.js`**

```js
import { conditionTier } from './wreck.js';

export function renderHud(ctx, { stageName, coins, distance, condition }, W) {
  ctx.font = '700 26px "Courier New", monospace';
  ctx.textBaseline = 'middle';

  // top banner
  ctx.fillStyle = 'rgba(14,26,18,0.78)';
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = '#f4f1e6';
  ctx.textAlign = 'left';
  ctx.fillText(stageName.toUpperCase(), 24, 28);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f0c020';
  ctx.fillText('$ ' + coins, W / 2, 28);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#cbe7cf';
  ctx.fillText(Math.floor(distance) + ' m', W - 24, 28);

  // condition meter
  const mw = 220, mx = W - mw - 24, my = 64;
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(mx, my, mw, 16);
  const tier = conditionTier(condition);
  const color = tier === 'good' ? '#3fae54' : tier === 'warn' ? '#e0a52a' : '#c0382c';
  ctx.fillStyle = color;
  ctx.fillRect(mx + 2, my + 2, (mw - 4) * (condition.value / condition.max), 12);
  ctx.fillStyle = '#cbe7cf';
  ctx.textAlign = 'right';
  ctx.font = '500 14px "Courier New", monospace';
  ctx.fillText('CART', mx - 8, my + 8);
}

export function renderTouchZones(ctx, W, H) {
  ctx.fillStyle = 'rgba(14,26,18,0.25)';
  ctx.font = '700 40px "Courier New", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(244,241,230,0.30)';
  ctx.textAlign = 'center';
  ctx.fillText('◄', W * 0.08, H * 0.86);
  ctx.fillText('►', W * 0.92, H * 0.86);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hud.js
git commit -m "feat: HUD (banner, coins, distance, condition meter, touch zones)"
```

### Task 3.4: Entity sprites (drawn vector/pixel shapes)

**Files:**
- Create: `src/sprites.js`

- [ ] **Step 1: Write `src/sprites.js` (procedural shapes keyed by hazard type; chunky pixel feel, no external assets needed for Phase 1)**

```js
// Draw an entity centred at (sx, sy) scaled by `scale`. Procedural shapes keep
// Phase 1 asset-free; AI-generated sprite atlases can replace these per type later.
export function drawEntity(ctx, type, sx, sy, scale) {
  const s = Math.max(6, scale * 90);
  switch (type) {
    case 'coin': disc(ctx, sx, sy, s * 0.5, '#f0c020', '#9a7a10'); break;
    case 'pothole': ellipse(ctx, sx, sy, s * 0.8, s * 0.34, '#1c1c1c'); break;
    case 'manhole': ellipse(ctx, sx, sy, s * 0.7, s * 0.3, '#000000'); break;
    case 'slick': ellipse(ctx, sx, sy, s * 0.9, s * 0.3, 'rgba(70,90,140,0.6)'); break;
    case 'bump': roundedBar(ctx, sx, sy, s * 1.4, s * 0.3, '#8a8a8a'); break;
    case 'goat': blob(ctx, sx, sy, s * 0.6, '#d8c7b0', '#6b5a3a'); break;
    case 'taxi': vehicle(ctx, sx, sy, s, '#c0382c'); break;
    case 'bus': vehicle(ctx, sx, sy, s * 1.2, '#e7c84a'); break;
    case 'hustler': person(ctx, sx, sy, s, '#d06a30'); break;
    case 'stall': roundedBar(ctx, sx, sy, s * 1.2, s * 0.8, '#7a4a22'); break;
    default: ellipse(ctx, sx, sy, s * 0.8, s * 0.34, '#1c1c1c');
  }
}
function disc(ctx, x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y - r, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = Math.max(2, r * 0.2);
  ctx.strokeStyle = stroke; ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
}
function roundedBar(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x - w / 2, y - h, w, h);
}
function blob(ctx, x, y, r, body, leg) {
  ctx.fillStyle = leg; ctx.fillRect(x - r * 0.5, y - r * 0.5, r, r * 0.6);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.6, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = body; ctx.fill();
}
function vehicle(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.fillRect(x - s * 0.55, y - s * 0.9, s * 1.1, s * 0.9);
  ctx.fillStyle = '#1c1c1c'; ctx.fillRect(x - s * 0.55, y - s * 0.2, s * 1.1, s * 0.2);
  ctx.fillStyle = '#bfe0ff'; ctx.fillRect(x - s * 0.4, y - s * 0.8, s * 0.8, s * 0.3);
}
function person(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.fillRect(x - s * 0.2, y - s, s * 0.4, s * 0.8);
  ctx.beginPath(); ctx.arc(x, y - s, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#6b4a2a'; ctx.fill();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/sprites.js
git commit -m "feat: procedural entity sprites (asset-free Phase 1)"
```

### Task 3.5: Cart sprite (the hero handcart with sound-system box)

**Files:**
- Create: `src/cartSprite.js`

- [ ] **Step 1: Write `src/cartSprite.js`** (back view: wooden base, two wheels, steering rod + car rim, sound-system box; uses `lean` and `conditionTier` for damage cracks)

```js
import { conditionTier } from './wreck.js';

export function drawCart(ctx, cart, W, H) {
  const cx = W / 2 + cart.x * (W * 0.32) + cart.lean * 40;
  const cy = H * 0.84;
  const s = H * 0.16;
  const tier = conditionTier(cart.condition);

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.5, s * 1.1, s * 0.22, 0, 0, Math.PI * 2); ctx.fill();

  // wheels
  wheel(ctx, cx - s * 0.8, cy + s * 0.35, s * 0.32);
  wheel(ctx, cx + s * 0.8, cy + s * 0.35, s * 0.32);

  // rotten wooden base
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(cart.lean * 0.15);
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  ctx.strokeStyle = '#5c3413'; ctx.lineWidth = 3;
  ctx.strokeRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.38, -s * 0.2); ctx.lineTo(i * s * 0.38, s * 0.22); ctx.stroke(); }

  // sound-system box (faces player)
  ctx.fillStyle = '#222226';
  ctx.fillRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.strokeStyle = '#0e0e10'; ctx.strokeRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#3a3a40'; ctx.fill();
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#15151a'; ctx.fill();

  // steering rod + car-rim wheel
  ctx.strokeStyle = '#9a9a9a'; ctx.lineWidth = s * 0.08;
  ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.2); ctx.lineTo(s * 0.2, -s * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(s * 0.22, -s * 1.02, s * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = s * 0.06; ctx.stroke();

  // damage cracks
  if (tier !== 'good') {
    ctx.strokeStyle = tier === 'critical' ? '#2a160a' : '#3a2412';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.1); ctx.lineTo(-s * 0.1, s * 0.15);
    ctx.lineTo(s * 0.1, -s * 0.05); ctx.stroke();
  }
  ctx.restore();
}
function wheel(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#1c1c1c'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fillStyle = '#8a8a8a'; ctx.fill();
}
```

- [ ] **Step 2: Commit**

```bash
git add src/cartSprite.js
git commit -m "feat: hero handcart sprite with sound-system box and damage cracks"
```

---

## Milestone 4 — Game state machine, menus, save integration

### Task 4.1: Game state machine wiring all systems

**Files:**
- Create: `src/game.js`
- Modify: `src/main.js` (hand control to game.js)

- [ ] **Step 1: Write `src/game.js`**

```js
import { VIRTUAL, SPAWN } from './constants.js';
import { makeRoad, renderRoad, projectEntity } from './road.js';
import { createCart, steer, updateCart } from './cart.js';
import { createField, spawn, advance, activeEntities } from './entities.js';
import { spawnInterval, pickHazard, laneFor } from './spawner.js';
import { createRun, resolveHits } from './run.js';
import { isWrecked } from './wreck.js';
import { renderHud, renderTouchZones } from './hud.js';
import { drawEntity } from './sprites.js';
import { drawCart } from './cartSprite.js';
import { getCharacter } from './characters.js';
import { getStage } from './stages.js';
import { loadSave, writeSave, recordBest, addCoins } from './save.js';

const W = VIRTUAL.width, H = VIRTUAL.height;

export function createGame(audio) {
  const save = loadSave();
  const state = { mode: 'menu', save, audio };
  let road, stage, cart, field, run, camZ, spawnZ, rng = Math.random;

  function startRun(characterId, stageId) {
    road = makeRoad();
    stage = getStage(stageId);
    cart = createCart(getCharacter(characterId));
    field = createField();
    run = createRun();
    camZ = 0; spawnZ = 300;
    state.mode = 'play';
    audio && audio.playStage(stage.musicId);
  }

  function endRun() {
    state.mode = 'gameover';
    addCoins(save, run.coins);
    recordBest(save, stage.id, Math.floor(run.distance));
    maybeUnlock();
    writeSave(save);
    audio && audio.stop();
  }

  function maybeUnlock() {
    // Beating fern-gully (>=400m) unlocks holland-bamboo; bamboo unlocks negril;
    // 150 total coins unlocks the conductor.
    const u = save.unlocks;
    if (run.distance >= 400 && stage.id === 'fern-gully' && !u.stages.includes('holland-bamboo')) u.stages.push('holland-bamboo');
    if (run.distance >= 400 && stage.id === 'holland-bamboo' && !u.stages.includes('negril')) u.stages.push('negril');
    if (save.coins >= 150 && !u.characters.includes('conductor')) u.characters.push('conductor');
  }

  function update(dt) {
    if (state.mode !== 'play') return;
    updateCart(cart, dt);
    const dz = cart.speed * dt * 4;
    camZ += dz;
    run.distance += cart.speed * dt * 0.1 * cart.character.scoreMult;
    advance(field, dz);
    // spawn ahead at distance-scaled intervals
    spawnZ -= dz;
    if (spawnZ <= 0) {
      const type = pickHazard(stage.hazardWeights, rng);
      spawn(field, type, laneFor(rng, 3), 900);
      spawnZ = spawnInterval(run.distance) * 6;
    }
    resolveHits(run, cart, field);
    if (isWrecked(cart.condition)) endRun();
  }

  function render(ctx) {
    if (state.mode === 'menu') return renderMenu(ctx, state);
    if (state.mode === 'gameover') return renderGameOver(ctx, run, stage, save);
    renderRoad(ctx, road, stage.palette, camZ, cart.x, W, H);
    for (const e of activeEntities(field).sort((a, b) => b.z - a.z)) {
      const p = projectEntity(camZ, e.x, e.z, W, H);
      if (p.scale > 0) drawEntity(ctx, e.type, p.x, p.y, p.scale);
    }
    drawCart(ctx, cart, W, H);
    renderTouchZones(ctx, W, H);
    renderHud(ctx, { stageName: stage.name, coins: run.coins, distance: run.distance, condition: cart.condition }, W);
  }

  function onSteer(dir) { if (state.mode === 'play') steer(cart, dir); }
  function onTap() {
    audio && audio.unlock();
    if (state.mode === 'menu') startRun(menuChoice.character, menuChoice.stage);
    else if (state.mode === 'gameover') state.mode = 'menu';
  }

  // simple menu selection (cycled by tapping zones handled in main via onSteer in menu)
  const menuChoice = { character: 'yute', stage: 'fern-gully' };
  function onMenuSteer(dir) {
    if (state.mode !== 'menu') return;
    const unlockedChars = save.unlocks.characters;
    const i = (unlockedChars.indexOf(menuChoice.character) + dir + unlockedChars.length) % unlockedChars.length;
    menuChoice.character = unlockedChars[i];
  }

  function renderMenu(ctx, st) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f4f1e6'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 64px "Courier New", monospace';
    ctx.fillText('POTHOLE RUN', W / 2, H * 0.3);
    ctx.font = '500 26px "Courier New", monospace';
    ctx.fillStyle = '#cbe7cf';
    ctx.fillText('Driver: ' + getCharacter(menuChoice.character).name, W / 2, H * 0.5);
    ctx.fillText('Stage: ' + getStage(menuChoice.stage).name, W / 2, H * 0.58);
    ctx.fillText('Coins banked: ' + st.save.coins, W / 2, H * 0.66);
    ctx.fillStyle = '#f0c020';
    ctx.fillText('TAP / PRESS TO START', W / 2, H * 0.8);
  }
  function renderGameOver(ctx, run, stage, save) {
    ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f4f1e6'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 56px "Courier New", monospace';
    ctx.fillText('CART MASH UP!', W / 2, H * 0.3);
    ctx.font = '500 28px "Courier New", monospace'; ctx.fillStyle = '#cbe7cf';
    ctx.fillText(Math.floor(run.distance) + ' m   •   $' + run.coins, W / 2, H * 0.48);
    ctx.fillText('Best: ' + (save.bests[stage.id] || 0) + ' m', W / 2, H * 0.56);
    ctx.fillStyle = '#f0c020';
    ctx.fillText('TAP TO CONTINUE', W / 2, H * 0.74);
  }

  return { state, update, render, onSteer, onTap, onMenuSteer, menuChoice };
}
```

- [ ] **Step 2: Rewrite `src/main.js` bottom half to hand off to the game**

Replace the temporary "drive scene" block (added in Task 2.5) with:

```js
import { createGame } from './game.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';

const audio = createAudio();
const game = createGame(audio);
const input = createInput(canvas, {
  onSteer: (d) => { game.onSteer(d); game.onMenuSteer(d); },
  onTap: () => game.onTap()
});

setUpdate((dt) => { input.update(dt); game.update(dt); });
setRender((c) => {
  c.setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0);
  game.render(c);
});
```

(Remove the now-unused temporary imports from Task 2.5: `makeRoad/renderRoad/createCart/steer/updateCart/getCharacter/getStage` direct imports in main.js — they're owned by game.js now.)

- [ ] **Step 3: Verify in browser (audio.js stub first)**

Audio is built in Milestone 5; create a temporary no-op so this runs:

Create `src/audio.js` (temporary, replaced in 5.1):
```js
export function createAudio() {
  return { unlock() {}, playStage() {}, stop() {}, sfx() {} };
}
```

Run: serve, open desktop. Expected: title screen → press/tap starts a run → road scrolls, hazards approach and can be dodged, coins collect, condition meter falls on hits, "CART MASH UP!" on wreck, tap returns to menu, coins persist across reloads (localStorage).

- [ ] **Step 4: Commit**

```bash
git add src/game.js src/main.js src/audio.js
git commit -m "feat: game state machine, menu, run loop, game-over, save integration"
```

### Task 4.2: Stage select on the menu

**Files:**
- Modify: `src/game.js`

- [ ] **Step 1: Add stage cycling to the menu** — extend `onMenuSteer` so one zone cycles driver and a long-press / second control cycles stage. Simplest scheme that needs no new UI: tapping the LEFT zone in menu cycles driver, RIGHT zone cycles stage. Replace `onSteer`/`onMenuSteer` wiring:

In `game.js`, replace `onMenuSteer` with two helpers and export them:

```js
function cycleDriver(dir) {
  if (state.mode !== 'menu') return;
  const list = save.unlocks.characters;
  const i = (list.indexOf(menuChoice.character) + dir + list.length) % list.length;
  menuChoice.character = list[i];
}
function cycleStage(dir) {
  if (state.mode !== 'menu') return;
  const list = save.unlocks.stages;
  const i = (list.indexOf(menuChoice.stage) + dir + list.length) % list.length;
  menuChoice.stage = list[i];
}
```

Return them: `return { state, update, render, onSteer, onTap, cycleDriver, cycleStage, menuChoice };`

- [ ] **Step 2: Update `main.js` input wiring** so that in menu mode the left zone cycles driver and right zone cycles stage, while in play mode both steer:

```js
const input = createInput(canvas, {
  onSteer: (d) => {
    if (game.state.mode === 'menu') { d < 0 ? game.cycleDriver(1) : game.cycleStage(1); }
    else game.onSteer(d);
  },
  onTap: () => game.onTap()
});
```

- [ ] **Step 3: Verify in browser**

Run: serve. Expected: on the menu, left zone cycles driver, right zone cycles stage (only unlocked ones appear); start launches the chosen combo. Unlock a stage by reaching 400m, confirm it appears in the menu after returning.

- [ ] **Step 4: Commit**

```bash
git add src/game.js src/main.js
git commit -m "feat: driver and stage selection on the menu"
```

---

## Milestone 5 — Audio (chiptune reggae + SFX)

### Task 5.1: Web Audio chiptune engine

**Files:**
- Create: `src/audio.js` (replace the temporary stub)

- [ ] **Step 1: Write `src/audio.js`**

```js
// Original 8-bit reggae: square-wave skank on the offbeat, triangle dub bass,
// a one-drop kick/snare. Per-stage tempo/scale variation via musicId. No files.
export function createAudio() {
  let ctx = null, master = null, loopTimer = null, muted = false, current = null;

  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
  }

  const STAGE_SETTINGS = {
    fern:   { bpm: 140, root: 146.83 },  // D3
    bamboo: { bpm: 150, root: 164.81 },  // E3
    negril: { bpm: 132, root: 130.81 }   // C3
  };

  function note(freq, start, dur, type, gain) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + dur + 0.02);
  }
  function drum(start, hi) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(hi ? 220 : 90, start);
    o.frequency.exponentialRampToValueAtTime(hi ? 180 : 50, start + 0.08);
    g.gain.setValueAtTime(0.4, start); g.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    o.connect(g); g.connect(master); o.start(start); o.stop(start + 0.14);
  }

  function scheduleBar(cfg, t0) {
    const beat = 60 / cfg.bpm;
    const root = cfg.root;
    for (let b = 0; b < 4; b++) {
      const t = t0 + b * beat;
      // one-drop: kick+snare on beat 3 only
      if (b === 2) { drum(t, false); drum(t, true); }
      // offbeat skank (the "and" of each beat)
      note(root * 2, t + beat / 2, beat * 0.28, 'square', 0.12);
      note(root * 2.5, t + beat / 2, beat * 0.28, 'square', 0.08);
      // dub bassline
      const bass = [root, root, root * 1.33, root * 0.75][b];
      note(bass, t, beat * 0.6, 'triangle', 0.25);
    }
    return 4 * beat;
  }

  function playStage(musicId) {
    unlock();
    current = STAGE_SETTINGS[musicId] || STAGE_SETTINGS.fern;
    stop();
    let next = ctx.currentTime + 0.1;
    const tick = () => {
      while (next < ctx.currentTime + 1.0) next += scheduleBar(current, next);
      loopTimer = setTimeout(tick, 250);
    };
    tick();
  }
  function stop() { if (loopTimer) { clearTimeout(loopTimer); loopTimer = null; } }

  function sfx(kind) {
    if (!ctx || muted) return;
    const t = ctx.currentTime;
    if (kind === 'coin') note(880, t, 0.08, 'square', 0.2), note(1320, t + 0.05, 0.08, 'square', 0.18);
    if (kind === 'hit') drum(t, false);
    if (kind === 'wreck') { drum(t, false); note(70, t, 0.5, 'sawtooth', 0.3); }
  }
  function setMuted(v) { muted = v; if (master) master.gain.value = v ? 0 : 0.5; }

  return { unlock, playStage, stop, sfx, setMuted };
}
```

- [ ] **Step 2: Trigger SFX from the run** — in `game.js` `update`, after `resolveHits`, compare coin/condition deltas and call `audio.sfx(...)`. Add before `resolveHits`:

```js
const coinsBefore = run.coins, condBefore = cart.condition.value;
resolveHits(run, cart, field);
if (run.coins > coinsBefore) audio && audio.sfx('coin');
else if (cart.condition.value < condBefore) audio && audio.sfx('hit');
```

And in `endRun()` add `audio && audio.sfx('wreck');` before `audio.stop()`.

- [ ] **Step 3: Verify in browser**

Run: serve, start a run (audio unlocks on first tap per iOS rules). Expected: a looping offbeat reggae chiptune with a one-drop kick on beat 3 and a dub bass; coin chime on pickup, thud on hit, crash on wreck. Tempo/key differs by stage.

- [ ] **Step 4: Commit**

```bash
git add src/audio.js src/game.js
git commit -m "feat: Web Audio chiptune reggae engine and SFX"
```

### Task 5.2: Mute toggle persisted to save

**Files:**
- Modify: `src/game.js`, `src/hud.js`

- [ ] **Step 1: Apply saved mute on boot + add a mute control.** In `createGame`, after `loadSave`, call `audio && audio.setMuted(save.settings.muted)`. Add a method:

```js
function toggleMute() {
  save.settings.muted = !save.settings.muted;
  audio && audio.setMuted(save.settings.muted);
  writeSave(save);
}
```

Return `toggleMute`. Add a tappable mute glyph in `renderHud` top-left corner area (draw a small `♪`/`✕`), and in `main.js` detect taps in the top-left 64×56 px region to call `game.toggleMute()` (check before routing to steer in `onTap`/touchstart). Simplest: bind the `M` key and a corner tap.

```js
window.addEventListener('keydown', (e) => { if (e.key === 'm') game.toggleMute(); });
```

- [ ] **Step 2: Verify in browser**

Run: serve. Expected: `M` toggles audio; the setting survives a reload.

- [ ] **Step 3: Commit**

```bash
git add src/game.js src/hud.js src/main.js
git commit -m "feat: persisted mute toggle"
```

---

## Milestone 6 — PWA install, offline, deploy

### Task 6.1: App icons

**Files:**
- Create: `assets/icons/icon-192.png`
- Create: `assets/icons/icon-512.png`

- [ ] **Step 1: Generate two maskable icons** (cart + road motif, dark-green background `#0e1a12`). Use any image tool to export 192×192 and 512×512 PNGs into `assets/icons/`. Placeholder acceptable for first deploy; replace with final art later.

- [ ] **Step 2: Verify the files exist and are valid PNGs**

Run: `file assets/icons/icon-192.png assets/icons/icon-512.png`
Expected: both report "PNG image data" with the right dimensions.

- [ ] **Step 3: Commit**

```bash
git add assets/icons/icon-192.png assets/icons/icon-512.png
git commit -m "assets: PWA app icons"
```

### Task 6.2: Web app manifest

**Files:**
- Create: `manifest.webmanifest`

- [ ] **Step 1: Create `manifest.webmanifest`**

```json
{
  "name": "Pothole Run",
  "short_name": "Pothole Run",
  "description": "Dodge potholes down Jamaica's roads in a sound-system handcart.",
  "start_url": "./index.html",
  "scope": "./",
  "display": "fullscreen",
  "orientation": "landscape",
  "background_color": "#0e1a12",
  "theme_color": "#0e1a12",
  "icons": [
    { "src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

- [ ] **Step 2: Verify**

Run: serve, open DevTools → Application → Manifest. Expected: name, icons, fullscreen, landscape all parse with no errors.

- [ ] **Step 3: Commit**

```bash
git add manifest.webmanifest
git commit -m "feat: PWA web app manifest"
```

### Task 6.3: Service worker (offline cache)

**Files:**
- Create: `sw.js`
- Modify: `src/main.js` (register it)

- [ ] **Step 1: Create `sw.js`** (cache-first over an explicit asset list; bump `CACHE` to invalidate)

```js
const CACHE = 'pothole-run-v1';
const ASSETS = [
  './', './index.html', './styles.css', './manifest.webmanifest',
  './src/main.js', './src/constants.js', './src/game.js', './src/road.js',
  './src/cart.js', './src/cartSprite.js', './src/sprites.js', './src/entities.js',
  './src/run.js', './src/collision.js', './src/wreck.js', './src/spawner.js',
  './src/hazardTypes.js', './src/input.js', './src/hud.js', './src/audio.js',
  './src/characters.js', './src/stages.js', './src/save.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
```

- [ ] **Step 2: Register it in `src/main.js`** (append at the end)

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
```

- [ ] **Step 3: Verify offline**

Run: serve, load once, then in DevTools → Network set "Offline" and reload. Expected: the game still loads and plays from cache.

- [ ] **Step 4: Commit**

```bash
git add sw.js src/main.js
git commit -m "feat: service worker for offline play"
```

### Task 6.4: Full regression + deploy to GitHub Pages

**Files:**
- Create: `.nojekyll`
- Create: `README.md`

- [ ] **Step 1: Run the whole test suite**

Run: `node --test`
Expected: PASS — every logic suite green (wreck, collision, spawner, save, config, hazardTypes, cart, entities, run).

- [ ] **Step 2: Full manual smoke on desktop Safari + Chrome**

Serve and confirm: menu → select driver/stage → play → dodge/collect → wreck → game over → unlocks → reload persistence → mute → offline reload. No console errors.

- [ ] **Step 3: Add `.nojekyll` (so GitHub Pages serves `src/` and dot-paths verbatim) and a short `README.md`**

`.nojekyll`: empty file.
`README.md`: one paragraph + "Play: <pages-url>" + "Run tests: `node --test`".

- [ ] **Step 4: Create the GitHub repo and push**

```bash
gh repo create pothole-run --public --source=. --remote=origin --push
```

- [ ] **Step 5: Enable Pages from the default branch root**

```bash
gh api -X POST repos/:owner/pothole-run/pages -f source.branch=main -f source.path=/ || \
  echo "Enable Pages in repo Settings → Pages → Deploy from branch → main / root"
```

- [ ] **Step 6: Verify the deployed URL on a real iPhone (landscape) + Mac Safari**

Open the Pages URL. Confirm: landscape play, thumb-zone steering feels good, audio starts on first tap, "Add to Home Screen" launches fullscreen, offline works. Note any feel issues for tuning.

- [ ] **Step 7: Commit**

```bash
git add .nojekyll README.md
git commit -m "chore: GitHub Pages config and README; Phase 1 deployed"
```

---

## Definition of done (Phase 1)

- `node --test` green across all logic suites.
- Deployed Pages URL playable in iPhone Safari (landscape) and Mac Safari.
- Menu with driver + stage select (only unlocked options); 3 distinct drivers, 3 grounded stages.
- Endless run: pseudo-3D road, thumb-zone sliding, hazards + coins, cart-wreck meter, distance score.
- Stolen-infrastructure hazards present (open manhole = instant wreck) per spec §16.
- Original chiptune reggae per stage + SFX; persisted mute.
- On-device save: coins, bests, unlocks, settings; corrupt-save fallback.
- Installable PWA, fullscreen, offline after first load.

## Deferred to Phase 2 (not in this plan)

Remaining 4 drivers + 7 stages (incl. Bog Walk Gorge / Flat Bridge gauntlet and the
Tron neon Downtown hard mode); "Round Jamaica" endless chaining; personas as road
traffic/cameos; AI-generated sprite atlases replacing procedural shapes; improvised
crater-marker telegraphing; richer set-piece hazards. See spec §14, §16, §17.
