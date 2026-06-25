// Draw an entity centred at (sx, sy) with base pixel size `size` (from the road
// projection) and a stable per-entity `seed` (so irregular shapes don't shimmer).
export function drawEntity(ctx, type, sx, sy, size, seed = 0.137) {
  const s = Math.max(6, size);
  switch (type) {
    case 'coin': disc(ctx, sx, sy, s * 0.5, '#f0c020', '#9a7a10'); break;
    case 'pothole': crater(ctx, sx, sy, s, seed); break;
    case 'manhole': manhole(ctx, sx, sy, s); break;
    case 'slick': slick(ctx, sx, sy, s, seed); break;
    case 'flood': slick(ctx, sx, sy, s * 1.3, seed, 'rgba(90,110,90,0.55)'); break;
    case 'bump': roundedBar(ctx, sx, sy, s * 1.4, s * 0.3, '#8a8a8a'); break;
    case 'goat': blob(ctx, sx, sy, s * 0.6, '#d8c7b0', '#6b5a3a'); break;
    case 'dog': blob(ctx, sx, sy, s * 0.5, '#9a7a4a', '#5a4326'); break;
    case 'cat': blob(ctx, sx, sy, s * 0.34, '#5a5a5a', '#333333'); break;
    case 'cattle': blob(ctx, sx, sy, s * 0.85, '#5a4636', '#2f261d'); break;
    case 'taxi': vehicle(ctx, sx, sy, s, '#c0382c'); break;
    case 'bus': vehicle(ctx, sx, sy, s * 1.35, '#e7c84a'); break;
    case 'coaster': vehicle(ctx, sx, sy, s * 1.15, '#eef0f2'); break;
    case 'hustler': person(ctx, sx, sy, s, '#d06a30'); break;
    case 'jaywalker': person(ctx, sx, sy, s, '#3a6ea5'); break;
    case 'stall': roundedBar(ctx, sx, sy, s * 1.2, s * 0.8, '#7a4a22'); break;
    default: crater(ctx, sx, sy, s, seed);
  }
}

// ---- crater: a flat moon-crater in the road. Torn-asphalt rim, exposed pale
// limestone-marl floor (what sits under Jamaican asphalt), damp shadowed depression.
function crater(ctx, x, y, size, seed) {
  const base = Math.floor((seed || 0.137) * 2147483647);
  const rx = size * 0.95, ry = size * 0.36;
  // dark torn edge of the blacktop around the hole
  jaggedPath(ctx, x, y, rx * 1.14, ry * 1.16, 15, mulberry32(base ^ 0x9e37), 0.2);
  ctx.fillStyle = '#23201b'; ctx.fill();
  // exposed pale marl / limestone floor
  jaggedPath(ctx, x, y, rx, ry, 15, mulberry32(base ^ 0x2545), 0.15);
  ctx.fillStyle = '#cdbf9f'; ctx.fill();
  // loose stones / aggregate scattered in the marl
  const sp = mulberry32(base ^ 0x51ed);
  ctx.fillStyle = '#857758';
  for (let i = 0; i < 5; i++) {
    const a = sp() * Math.PI * 2, rr = sp() * 0.6;
    ctx.fillRect(x + Math.cos(a) * rx * rr, y + Math.sin(a) * ry * rr, Math.max(1, size * 0.05), Math.max(1, size * 0.04));
  }
  // damp, shadowed depression toward the far lip (depth without floating)
  jaggedPath(ctx, x, y + ry * 0.2, rx * 0.62, ry * 0.58, 13, mulberry32(base ^ 0x7777), 0.18);
  ctx.fillStyle = '#9b8c6b'; ctx.fill();
  // lit asphalt rim on the near edge (catches the light)
  ctx.strokeStyle = 'rgba(150,150,150,0.4)';
  ctx.lineWidth = Math.max(1, size * 0.045);
  ctx.beginPath(); ctx.ellipse(x, y - ry * 0.02, rx * 1.06, ry * 1.06, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  // cracks radiating into the surrounding asphalt
  ctx.strokeStyle = 'rgba(10,10,10,0.45)'; ctx.lineWidth = Math.max(1, size * 0.022);
  const cr = mulberry32(base ^ 0x13af);
  for (let i = 0; i < 4; i++) {
    const a = cr() * Math.PI * 2;
    const ox = Math.cos(a) * rx * 1.1, oy = Math.sin(a) * ry;
    const len = 0.3 + cr() * 0.45;
    ctx.beginPath();
    ctx.moveTo(x + ox, y + oy);
    ctx.lineTo(x + ox * (1 + len) + (cr() - 0.5) * size * 0.25, y + oy * (1 + len));
    ctx.stroke();
  }
}

// ---- open manhole: stolen cover, rusted cast-iron frame around a black drop
function manhole(ctx, x, y, size) {
  const rx = size * 0.72, ry = size * 0.34;
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ellipsePath(ctx, x, y + ry * 0.1, rx * 1.28, ry * 1.32); ctx.fill();
  ctx.fillStyle = '#4f4842'; ellipsePath(ctx, x, y, rx * 1.2, ry * 1.2); ctx.fill();
  ctx.fillStyle = '#39332e'; ellipsePath(ctx, x, y, rx * 1.06, ry * 1.06); ctx.fill();
  ctx.fillStyle = '#050505'; ellipsePath(ctx, x, y, rx, ry); ctx.fill();
  ctx.fillStyle = '#000000'; ellipsePath(ctx, x, y + ry * 0.16, rx * 0.78, ry * 0.74); ctx.fill();
  ctx.strokeStyle = 'rgba(150,150,150,0.4)'; ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.beginPath(); ctx.ellipse(x, y, rx * 1.13, ry * 1.13, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
}

function slick(ctx, x, y, size, seed, color = 'rgba(60,80,120,0.5)') {
  const rnd = mulberry32(Math.floor((seed || 0.2) * 2147483647) ^ 0x44a1);
  jaggedPath(ctx, x, y, size * 0.95, size * 0.34, 12, rnd, 0.26);
  ctx.fillStyle = color; ctx.fill();
  // a couple of brighter sheen streaks
  ctx.strokeStyle = 'rgba(220,230,255,0.25)'; ctx.lineWidth = Math.max(1, size * 0.05);
  ctx.beginPath(); ctx.moveTo(x - size * 0.5, y); ctx.lineTo(x + size * 0.2, y - size * 0.06); ctx.stroke();
}

// ---- shared shape helpers
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function ellipsePath(ctx, x, y, rx, ry) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}
function jaggedPath(ctx, x, y, rx, ry, pts, rnd, irr) {
  ctx.beginPath();
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const j = 1 + (rnd() - 0.5) * 2 * irr;
    const px = x + Math.cos(a) * rx * j, py = y + Math.sin(a) * ry * j;
    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath();
}
function disc(ctx, x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y - r, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = Math.max(2, r * 0.2);
  ctx.strokeStyle = stroke; ctx.stroke();
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
