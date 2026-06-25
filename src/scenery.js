import { projectEntity } from './road.js';

// Roadside props that scroll with the road to give depth, speed and a sense of
// place. Each stage picks a `scenery` kind; props are drawn just off both edges.
const GAP = 520;     // world units between prop rows
const COUNT = 26;    // rows drawn ahead
const EDGE = 1.34;   // normalized x just outside the road (road edge = 1.0)

export function renderScenery(ctx, stage, position, W, H) {
  const kind = stage.scenery || 'pole';
  const off = ((position % GAP) + GAP) % GAP;
  for (let n = COUNT; n >= 1; n--) {
    const camZ = n * GAP - off;
    if (camZ <= 1) continue;
    drawProp(ctx, kind, -EDGE, camZ, W, H);
    drawProp(ctx, kind, EDGE, camZ, W, H);
  }
}

function drawProp(ctx, kind, normX, camZ, W, H) {
  const p = projectEntity(normX, camZ, W, H);
  if (!p.visible || p.y < H * 0.5 || p.size < 2) return; // cull above horizon / too tiny
  const lean = normX < 0 ? 1 : -1; // lean toward the road centre
  switch (kind) {
    case 'fern': fernTree(ctx, p.x, p.y, p.size, lean); break;
    case 'bamboo': bamboo(ctx, p.x, p.y, p.size, lean); break;
    case 'palm': palm(ctx, p.x, p.y, p.size, lean); break;
    case 'zinc': zinc(ctx, p.x, p.y, p.size); break;
    case 'neon': neonPost(ctx, p.x, p.y, p.size); break;
    default: pole(ctx, p.x, p.y, p.size);
  }
}

function fernTree(ctx, x, y, s, lean) {
  const h = s * 3.0;
  ctx.strokeStyle = '#4a3a22'; ctx.lineWidth = Math.max(2, s * 0.16);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * s * 0.5, y - h * 0.6, x + lean * s * 1.1, y - h); ctx.stroke();
  const cx = x + lean * s * 1.1, cy = y - h;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI; // upper fan
    ctx.strokeStyle = i % 2 ? '#1e5e2a' : '#267a33';
    ctx.lineWidth = Math.max(1.5, s * 0.1);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + Math.cos(a) * s * 0.9, cy + Math.sin(a) * s * 0.5,
      cx + Math.cos(a) * s * 1.7, cy + Math.sin(a) * s * 1.1);
    ctx.stroke();
  }
}

function bamboo(ctx, x, y, s, lean) {
  const h = s * 3.2;
  for (let k = -1; k <= 1; k++) {
    const bx = x + k * s * 0.5;
    ctx.strokeStyle = '#bca94a'; ctx.lineWidth = Math.max(2, s * 0.13);
    ctx.beginPath(); ctx.moveTo(bx, y);
    ctx.quadraticCurveTo(bx + lean * s * 0.4, y - h * 0.6, bx + lean * s * 0.8, y - h * (0.85 + k * 0.05));
    ctx.stroke();
    // node ticks
    ctx.strokeStyle = '#8a7a30'; ctx.lineWidth = 1;
    for (let t = 0.3; t < 1; t += 0.25) {
      const nx = bx + lean * s * 0.4 * t, ny = y - h * t;
      ctx.beginPath(); ctx.moveTo(nx - s * 0.06, ny); ctx.lineTo(nx + s * 0.06, ny); ctx.stroke();
    }
  }
  // feathery green crown
  ctx.fillStyle = 'rgba(60,120,40,0.85)';
  ctx.beginPath(); ctx.ellipse(x + lean * s * 0.7, y - h, s * 1.1, s * 0.7, 0, 0, Math.PI * 2); ctx.fill();
}

function palm(ctx, x, y, s, lean) {
  const h = s * 2.8;
  ctx.strokeStyle = '#7a5a32'; ctx.lineWidth = Math.max(2, s * 0.14);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + lean * s * 0.7, y - h * 0.6, x + lean * s * 1.0, y - h); ctx.stroke();
  const cx = x + lean * s * 1.0, cy = y - h;
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * 0.9 + (i / 5) * Math.PI * 1.2;
    ctx.strokeStyle = '#2f8f3a'; ctx.lineWidth = Math.max(1.5, s * 0.1);
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s * 0.7,
      cx + Math.cos(a) * s * 1.9, cy + Math.sin(a) * s * 1.3 + s * 0.4);
    ctx.stroke();
  }
}

function pole(ctx, x, y, s) {
  const h = s * 2.6;
  ctx.fillStyle = '#6b6b6e'; ctx.fillRect(x - s * 0.08, y - h, s * 0.16, h);
  ctx.fillRect(x - s * 0.6, y - h, s * 1.2, s * 0.12);     // crossbar
  ctx.fillStyle = '#d8d2b0'; ctx.fillRect(x - s * 0.18, y - h - s * 0.18, s * 0.36, s * 0.2); // lamp
}

function zinc(ctx, x, y, s) {
  const h = s * 1.5, w = s * 1.3;
  ctx.fillStyle = '#8a8580'; ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = '#6a655f'; ctx.lineWidth = 1;
  for (let i = 0; i <= 6; i++) {
    const lx = x - w / 2 + (w / 6) * i;
    ctx.beginPath(); ctx.moveTo(lx, y - h); ctx.lineTo(lx, y); ctx.stroke();
  }
}

function neonPost(ctx, x, y, s) {
  const h = s * 2.4;
  ctx.fillStyle = '#14141c'; ctx.fillRect(x - s * 0.07, y - h, s * 0.14, h);
  const c = (x + y | 0) % 2 ? '#22e0c0' : '#ff3da0';
  ctx.fillStyle = c; ctx.fillRect(x - s * 0.32, y - h - s * 0.5, s * 0.64, s * 0.55);
  ctx.strokeStyle = c; ctx.lineWidth = Math.max(1, s * 0.06);
  ctx.strokeRect(x - s * 0.32, y - h - s * 0.5, s * 0.64, s * 0.55);
}
