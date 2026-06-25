import { projectEntity, curveOffsetAt } from './road.js';

// Roadside props that scroll with the road to give depth, speed and a sense of
// place. Each stage picks a `scenery` kind; props are drawn off both edges, beyond
// the marl shoulder, and follow the road's curve.
const GAP = 520;     // world units between prop rows
const COUNT = 26;    // rows drawn ahead
const EDGE = 1.9;    // off the asphalt, out on the grass (asphalt edge = 1.0)

export function renderScenery(ctx, stage, position, W, H) {
  const kind = stage.scenery || 'pole';
  const off = ((position % GAP) + GAP) % GAP;
  for (let n = COUNT; n >= 1; n--) {
    const camZ = n * GAP - off;
    if (camZ <= 1) continue;
    drawProp(ctx, kind, -EDGE, camZ, position, W, H);
    drawProp(ctx, kind, EDGE, camZ, position, W, H);
  }
}

function drawProp(ctx, kind, normX, camZ, position, W, H) {
  const p = projectEntity(normX, camZ, W, H);
  if (!p.visible || p.y < H * 0.5 || p.size < 2) return; // cull above horizon / too tiny
  p.x += curveOffsetAt(position, camZ);
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

// A low, dense clump of ferns — not a tall tree. Dark damp greens, fronds fanning
// up and arching over the road (set `lean`). Leaflet ticks give the pinnate look.
function fernTree(ctx, x, y, s, lean) {
  const greens = ['#12381a', '#1c5226', '#277034'];
  // dark damp base mound
  ctx.fillStyle = '#10311a';
  ctx.beginPath(); ctx.ellipse(x, y, s * 0.95, s * 0.34, 0, 0, Math.PI * 2); ctx.fill();
  const n = 9;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1);                                    // 0..1 across the spray
    const ang = -Math.PI * 0.5 + (f - 0.5) * Math.PI * 1.05 + lean * 0.25; // fan up, arch roadward
    const len = s * (1.0 + (1 - Math.abs(f - 0.5) * 2) * 0.65); // tallest in the middle (~s*1.65)
    const tipx = x + Math.cos(ang) * len, tipy = y + Math.sin(ang) * len;
    const midx = x + Math.cos(ang) * len * 0.5 + lean * s * 0.12, midy = y + Math.sin(ang) * len * 0.5;
    ctx.strokeStyle = greens[i % 3]; ctx.lineWidth = Math.max(1.5, s * 0.085);
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(midx, midy, tipx, tipy); ctx.stroke();
    // leaflets along the frond
    ctx.lineWidth = Math.max(1, s * 0.035);
    const perp = ang + Math.PI / 2;
    for (let t = 0.3; t < 0.98; t += 0.2) {
      const px = x + (tipx - x) * t, py = y + (tipy - y) * t, ll = s * 0.11 * (1 - t * 0.5);
      ctx.beginPath();
      ctx.moveTo(px - Math.cos(perp) * ll, py - Math.sin(perp) * ll);
      ctx.lineTo(px + Math.cos(perp) * ll, py + Math.sin(perp) * ll);
      ctx.stroke();
    }
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
