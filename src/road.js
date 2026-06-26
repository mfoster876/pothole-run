import { VIRTUAL } from './constants.js';

// Pseudo-3D road (OutRun-style segment projection) that bends. A narrow two-lane
// Jamaican road: asphalt ribbon with marl/stony soft shoulders, a single broken
// centre line, scattered half-done patches, and winding curves. The lane/entity
// coordinate space spans -1..1 across ROAD_W; the drawn asphalt is narrower.
const SEG = 200;            // world length of one segment band
const RUMBLE = 4;           // segments per colour stripe
const ROAD_W = 1600;        // coordinate half-width (lanes/entities live in -1..1)
const ROAD_DRAW = 0.66;     // fraction of ROAD_W that is actual asphalt
const SHOULDER = 0.92;      // marl shoulder reaches this fraction of ROAD_W
const CAM_H = 1100;
const CAM_DEPTH = 0.84;
const DRAW = 120;
const CURVE_SCALE = 0.42;   // bend strength (tuned visually)

export function makeRoad() {
  return { segLen: SEG, total: 1e9, length: 1e9 * SEG };
}

// Per-stage windiness multiplier on the road's turn rate. Fern Gully — a real, steep,
// hair-pinned gorge on the A3 — cranks this up to be the twistiest, hardest drive; the
// Holland Bamboo avenue (famously dead straight) sets it low. Set by game.js at run start.
let curveScale = 1;
export function setCurveScale(m) { curveScale = (m && m > 0) ? m : 1; }

// Smooth, varied per-segment turn rate → winding road (scaled by the current stage).
function curveAt(i) {
  return (Math.sin(i * 0.013) * 0.7 + Math.sin(i * 0.0047 + 1.7) * 0.5 + Math.sin(i * 0.027 + 4) * 0.25) * curveScale;
}

// The road's local turn rate at the camera's current position — how hard it's bending
// right HERE. game.js uses this to shove the cart toward the outside of the corner
// (winding-road difficulty that scales with speed). Sign = bend direction.
export function curvatureAt(position) {
  return curveAt(Math.floor(position / SEG));
}

// Accumulated horizontal screen offset (px) of the road centreline at distance
// camZ ahead of the camera. Double-integral of curvature → near≈0, far bends away.
// Shared by renderRoad, entities and the cart so everything tracks the bend.
export function curveOffsetAt(position, camZ) {
  const baseIndex = Math.floor(position / SEG);
  const offset = position - baseIndex * SEG;
  const target = (camZ + offset) / SEG;
  let dx = 0, x = 0;
  const whole = Math.floor(target);
  for (let n = 1; n <= whole; n++) { dx += curveAt(baseIndex + n) * CURVE_SCALE; x += dx; }
  const frac = target - whole;
  if (frac > 0) { dx += curveAt(baseIndex + whole + 1) * CURVE_SCALE * frac; x += dx * frac; }
  return x;
}

function projY(camZ, H) { return H / 2 + (CAM_DEPTH / camZ) * CAM_H * (H / 2); }
function projW(camZ, W) { return (CAM_DEPTH / camZ) * ROAD_W * (W / 2); }

export function renderRoad(ctx, road, palette, position, W, H) {
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, W, H / 2);
  ctx.fillStyle = palette.hill;
  ctx.fillRect(0, H / 2 - H * 0.05, W, H * 0.05);
  ctx.fillStyle = palette.ground;
  ctx.fillRect(0, H / 2, W, H / 2);

  const baseIndex = Math.floor(position / SEG);
  const offset = position - baseIndex * SEG;
  const marl = palette.shoulder || '#b3a07f';
  const asph = palette.road;

  // accumulate curvature near→far, collect band geometry, draw far→near (painter's)
  const bands = [];
  let dx = 0, xc = 0;
  for (let n = 1; n <= DRAW; n++) {
    dx += curveAt(baseIndex + n) * CURVE_SCALE;
    xc += dx;
    const camZ = n * SEG - offset;
    if (camZ <= 1) continue;
    bands.push({ n, camZ, xc });
  }
  for (let i = bands.length - 1; i >= 0; i--) {
    const b = bands[i];
    const camZ = b.camZ, camZfar = camZ + SEG;
    const yNear = projY(camZ, H), yFar = projY(camZfar, H);
    if (yNear - yFar < 0.7) continue;
    const wNear = projW(camZ, W), wFar = projW(camZfar, W);
    const cxN = W / 2 + b.xc;
    const cxF = W / 2 + (bands[i + 1] ? bands[i + 1].xc : b.xc);
    const idx = baseIndex + b.n;
    const light = Math.floor(idx / RUMBLE) % 2 === 0;

    // grass verge (full width band)
    ctx.fillStyle = light ? palette.ground : shade(palette.ground, -0.05);
    ctx.fillRect(0, yFar, W, yNear - yFar);
    // marl / stony soft shoulder
    band(ctx, cxN, wNear * SHOULDER, yNear, cxF, wFar * SHOULDER, yFar,
      light ? marl : shade(marl, -0.05));
    // asphalt
    band(ctx, cxN, wNear * ROAD_DRAW, yNear, cxF, wFar * ROAD_DRAW, yFar,
      light ? asph : shade(asph, -0.05));
    // half-done patch (deterministic, occasional, mismatched tone)
    if ((idx * 2654435761 >>> 0) % 5 === 0) {
      const lane = (((idx * 40503) >>> 0) % 100) / 100 - 0.5; // -0.5..0.5
      const pwN = wNear * ROAD_DRAW * 0.34, pwF = wFar * ROAD_DRAW * 0.34;
      band(ctx, cxN + lane * wNear * ROAD_DRAW, pwN, yNear, cxF + lane * wFar * ROAD_DRAW, pwF, yFar,
        shade(asph, idx % 2 ? -0.12 : 0.08));
    }
    // single broken centre line
    if (light) {
      band(ctx, cxN, wNear * 0.02, yNear, cxF, wFar * 0.02, yFar, '#d8c24a');
    }
  }
}

function band(ctx, cxNear, wNear, yNear, cxFar, wFar, yFar, color) {
  poly(ctx, cxNear - wNear, yNear, cxNear + wNear, yNear, cxFar + wFar, yFar, cxFar - wFar, yFar, color);
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

// Project an entity/cart at normalized lane x (-1..1) and camera-space distance
// camZ. Returns screen x/y (curve NOT applied — callers add curveOffsetAt), a draw
// size in px, and a visible flag.
export function projectEntity(normX, camZ, W = VIRTUAL.width, H = VIRTUAL.height) {
  if (camZ <= 1) return { x: W / 2, y: H, size: 0, visible: false };
  const s = CAM_DEPTH / camZ;
  return {
    x: W / 2 + s * (normX * ROAD_W * ROAD_DRAW) * (W / 2),
    y: H / 2 + s * CAM_H * (H / 2),
    size: s * ROAD_W * (W / 2) * 0.34,
    visible: true
  };
}

// Fixed camera-space distance at which the player's cart is drawn.
export const CART_Z = 1250;
