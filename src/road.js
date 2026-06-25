import { VIRTUAL } from './constants.js';

const SEG_LEN = 200;
const RUMBLE = 3;
const DRAW_SEGS = 220;
const CAM_HEIGHT = 1500;
const CAM_DEPTH = 0.84;

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
