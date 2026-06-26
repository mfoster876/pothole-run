// tests/coords.test.js — client→virtual hit-mapping must be correct regardless of the
// device-pixel-ratio the canvas was rendered at (the Fast-graphics DPR cap was the bug).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientToVirtual } from '../src/coords.js';

const W = 960, H = 540;

// Reproduce main.js's resize() math for a given CSS size + render DPR, returning the
// viewport (scale/offset) and physical canvas dimensions a real render would produce.
function layout(cssW, cssH, dpr) {
  const canvasW = Math.round(cssW * dpr), canvasH = Math.round(cssH * dpr);
  const scale = Math.min(canvasW / W, canvasH / H);
  const offsetX = Math.floor((canvasW - W * scale) / 2);
  const offsetY = Math.floor((canvasH - H * scale) / 2);
  return { canvasW, canvasH, viewport: { scale, offsetX, offsetY } };
}

// The canvas fills the viewport at 0,0; getBoundingClientRect is the CSS size.
const rect = (cssW, cssH) => ({ left: 0, top: 0, width: cssW, height: cssH });

function mapCentre(cssW, cssH, dpr) {
  const { canvasW, canvasH, viewport } = layout(cssW, cssH, dpr);
  return clientToVirtual(cssW / 2, cssH / 2, rect(cssW, cssH), canvasW, canvasH, viewport);
}

test('a centre click maps to the stage centre at DPR 1 (Fast) AND DPR 2 (Smooth)', () => {
  for (const dpr of [1, 2]) {
    const p = mapCentre(1200, 600, dpr);
    assert.ok(Math.abs(p.x - W / 2) < 1.5, `centre x at dpr ${dpr}: ${p.x}`);
    assert.ok(Math.abs(p.y - H / 2) < 1.5, `centre y at dpr ${dpr}: ${p.y}`);
  }
});

test('the Fast-mode (DPR 1) and Smooth-mode (DPR 2) mappings AGREE for the same click', () => {
  // The historical bug: identical clicks mapped to different stage coords across DPRs.
  const a = mapCentre(1366, 700, 1);
  const b = mapCentre(1366, 700, 2);
  assert.ok(Math.abs(a.x - b.x) < 1.5 && Math.abs(a.y - b.y) < 1.5, `${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
});

test('corner clicks land inside the stage, not flung off-screen', () => {
  const { canvasW, canvasH, viewport } = layout(1200, 600, 1);
  const tl = clientToVirtual(0, 0, rect(1200, 600), canvasW, canvasH, viewport);
  assert.ok(tl.x <= 1 && tl.y <= 1 && tl.x > -200 && tl.y > -200, `top-left: ${JSON.stringify(tl)}`);
});
