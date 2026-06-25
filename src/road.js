import { VIRTUAL } from './constants.js';

// Pseudo-3D road (OutRun-style segment projection). The road is straight and
// centred; the cart and entities move across it (camera x is fixed at 0). Horizon
// sits at the vertical middle; nearer segments project lower and wider.
const SEG = 200;            // world length of one segment band
const RUMBLE = 3;           // segments per colour stripe
const ROAD_W = 1600;        // road half-width in world units
const CAM_H = 1100;         // camera height above the road
const CAM_DEPTH = 0.84;     // ~ 1 / tan(fov/2), fov ~100deg
const DRAW = 160;           // segment bands drawn ahead

export function makeRoad() {
  return { segLen: SEG, total: 1e9, length: 1e9 * SEG };
}

function projY(camZ, H) { return H / 2 + (CAM_DEPTH / camZ) * CAM_H * (H / 2); }
function projW(camZ, W) { return (CAM_DEPTH / camZ) * ROAD_W * (W / 2); }

export function renderRoad(ctx, road, palette, position, W, H) {
  ctx.fillStyle = palette.sky;
  ctx.fillRect(0, 0, W, H / 2);
  ctx.fillStyle = palette.hill;
  ctx.fillRect(0, H / 2 - H * 0.06, W, H * 0.06);
  ctx.fillStyle = palette.ground;
  ctx.fillRect(0, H / 2, W, H / 2);

  const baseIndex = Math.floor(position / SEG);
  const offset = position - baseIndex * SEG; // [0, SEG)
  const cx = W / 2;

  for (let n = DRAW; n >= 1; n--) {
    const camZ = n * SEG - offset;       // distance to the NEAR edge of this band
    if (camZ <= 1) continue;
    const camZfar = camZ + SEG;
    const yNear = projY(camZ, H);
    const yFar = projY(camZfar, H);
    const wNear = projW(camZ, W);
    const wFar = projW(camZfar, W);
    const light = Math.floor((baseIndex + n) / RUMBLE) % 2 === 0;

    ctx.fillStyle = light ? palette.ground : shade(palette.ground, -0.05);
    ctx.fillRect(0, yFar, W, yNear - yFar);

    poly(ctx, cx - wNear * 1.18, yNear, cx + wNear * 1.18, yNear,
              cx + wFar * 1.18, yFar, cx - wFar * 1.18, yFar,
              light ? palette.rumble : shade(palette.rumble, -0.08));
    poly(ctx, cx - wNear, yNear, cx + wNear, yNear,
              cx + wFar, yFar, cx - wFar, yFar,
              light ? palette.road : shade(palette.road, -0.06));
    if (light) {
      for (const lane of [-0.33, 0.33]) {
        poly(ctx, cx + lane * wNear - wNear * 0.018, yNear, cx + lane * wNear + wNear * 0.018, yNear,
                  cx + lane * wFar + wFar * 0.018, yFar, cx + lane * wFar - wFar * 0.018, yFar, '#e7d24a');
      }
    }
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

// Project an entity/cart at normalized lane x (-1..1) and camera-space distance
// camZ (world units ahead of the camera). Returns screen x/y, a draw size in px,
// and a visible flag.
export function projectEntity(normX, camZ, W = VIRTUAL.width, H = VIRTUAL.height) {
  if (camZ <= 1) return { x: W / 2, y: H, size: 0, visible: false };
  const s = CAM_DEPTH / camZ;
  return {
    x: W / 2 + s * (normX * ROAD_W) * (W / 2),
    y: H / 2 + s * CAM_H * (H / 2),
    size: s * ROAD_W * (W / 2) * 0.34,
    visible: true
  };
}

// Fixed camera-space distance at which the player's cart is drawn.
export const CART_Z = 1250;
