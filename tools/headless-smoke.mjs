// Headless render smoke test — exercises the pure canvas-drawing modules against a
// recording ctx stub so we catch runtime errors without a browser. Not a unit test.
import { STAGES } from '../src/stages.js';
import { renderScenery } from '../src/scenery.js';
import { drawEntity } from '../src/sprites.js';
import { renderPortrait, PORTRAITS } from '../src/portrait.js';
import { HAZARD_TYPES } from '../src/hazardTypes.js';

function makeCtx() {
  const grad = { addColorStop() {} };
  const noop = () => {};
  const ctx = new Proxy({
    canvas: { width: 960, height: 540 },
    createLinearGradient: () => grad,
    createRadialGradient: () => grad,
    createPattern: () => null,
    measureText: () => ({ width: 10 }),
    getImageData: () => ({ data: [] }),
    setLineDash: noop, save: noop, restore: noop, beginPath: noop, closePath: noop,
    moveTo: noop, lineTo: noop, quadraticCurveTo: noop, bezierCurveTo: noop, arc: noop,
    arcTo: noop, ellipse: noop, rect: noop, fill: noop, stroke: noop, clip: noop,
    fillRect: noop, strokeRect: noop, clearRect: noop, fillText: noop, strokeText: noop,
    roundRect: noop, createConicGradient: () => grad,
    translate: noop, rotate: noop, scale: noop, transform: noop, setTransform: noop,
    drawImage: noop,
  }, {
    get(t, k) { return k in t ? t[k] : (typeof k === 'string' ? (t[k] = undefined, t[k]) : undefined); },
    set(t, k, v) { t[k] = v; return true; },
  });
  return ctx;
}

let ok = 0, fail = 0;
function run(label, fn) { try { fn(); ok++; } catch (e) { fail++; console.error('FAIL', label, '->', e && e.message); } }

const ctx = makeCtx();
const W = 960, H = 540;

// 1) scenery for every stage at several scroll positions — LANDSCAPE and PORTRAIT stages
for (const s of STAGES) {
  for (const pos of [0, 137, 613, 1997, 5000]) run(`scenery ${s.id} @${pos} landscape`, () => renderScenery(ctx, s, pos, W, H));
  // phone-first: a tall/narrow portrait virtual stage must render without error too
  for (const pos of [0, 613, 5000]) run(`scenery ${s.id} @${pos} portrait`, () => renderScenery(ctx, s, pos, 540, 1174));
}
// 2) every hazard/pickup sprite, several seeds/sizes (incl. new foods + varied craters)
for (const type of Object.keys(HAZARD_TYPES)) {
  for (const seed of [0.05, 0.37, 0.62, 0.91]) run(`sprite ${type} s=${seed}`, () => drawEntity(ctx, type, 480, 300, 40, seed, 5000));
}
for (const type of ['ackee', 'patty', 'veggiepatty', 'pothole', 'manhole', 'slick', 'flood']) {
  for (let sz = 8; sz <= 80; sz += 12) run(`sprite ${type} sz=${sz}`, () => drawEntity(ctx, type, 480, 300, sz, 0.42, 3));
}
// 3) every portrait (incl. the three new women), at select + gameover sizes
for (const id of PORTRAITS) {
  for (const size of [140, 100]) run(`portrait ${id} @${size}`, () => renderPortrait(ctx, id, 200, 200, size, { bleachLevel: 2 }));
}

console.log(`\nHEADLESS SMOKE: ${ok} ok, ${fail} fail`);
process.exit(fail ? 1 : 0);
