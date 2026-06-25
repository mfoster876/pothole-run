// Draw an entity centred at (sx, sy) with base pixel size `size` (from the road
// projection) and a stable per-entity `seed` (so irregular shapes don't shimmer).
export function drawEntity(ctx, type, sx, sy, size, seed = 0.137, value = 1) {
  const s = Math.max(6, size);
  switch (type) {
    case 'coin': money(ctx, sx, sy, s, value); break;
    case 'pothole': crater(ctx, sx, sy, s, seed); break;
    case 'manhole': manhole(ctx, sx, sy, s); break;
    case 'slick': slick(ctx, sx, sy, s, seed); break;
    case 'flood': slick(ctx, sx, sy, s * 1.3, seed, 'rgba(90,110,90,0.55)'); break;
    case 'bump': roundedBar(ctx, sx, sy, s * 1.4, s * 0.3, '#8a8a8a'); break;
    case 'goat': drawGoat(ctx, sx, sy, s * 0.6); break;
    case 'dog': drawDog(ctx, sx, sy, s * 0.5); break;
    case 'cat': drawCat(ctx, sx, sy, s * 0.34); break;
    case 'cattle': drawCattle(ctx, sx, sy, s * 0.85); break;
    // route taxi: a white Probox-shape car with the tell-tale RED PP plate
    case 'taxi': carRear(ctx, sx, sy, s, '#eef0f2', '#c0392b'); break;
    case 'bus': vehicle(ctx, sx, sy, s * 1.35, '#e7c84a'); break;
    case 'coaster': vehicle(ctx, sx, sy, s * 1.15, '#eef0f2'); break;
    case 'hustler': person(ctx, sx, sy, s, '#d06a30'); break;
    case 'jaywalker': person(ctx, sx, sy, s, '#3a6ea5'); break;
    case 'police': drawPolice(ctx, sx, sy, s); break;
    case 'wiper': wiperYouth(ctx, sx, sy, s, seed); break;
    case 'stall': roundedBar(ctx, sx, sy, s * 1.2, s * 0.8, '#7a4a22'); break;
    case 'water':  waterBottle(ctx, sx, sy, s); break;
    case 'tools':  hardwareTools(ctx, sx, sy, s, seed); break;
    case 'coffee': coffeeBag(ctx, sx, sy, s); break;
    // Drink pickups — soda cans vs spirit bottles by alcohol content
    case 'ting':       drinkCan(ctx, sx, sy, s, '#7ec850', '#5a9e30', 'T'); break;
    case 'boom':       drinkCan(ctx, sx, sy, s, '#1f78d1', '#0a4e9a', 'B'); break;
    case 'redstripe':  drinkBottle(ctx, sx, sy, s, '#d12b1f', '#8a0f08', 'RS'); break;
    case 'whiterum':   drinkBottle(ctx, sx, sy, s, '#eef2f5', '#b0bcc8', 'WR'); break;
    case 'spirulina':  drinkBottle(ctx, sx, sy, s, '#1f8a4c', '#0f5a2e', 'SP'); break;
    case 'rootstonic': drinkBottle(ctx, sx, sy, s, '#7a4a22', '#4a2a10', 'RT'); break;
    // Conductor bleach vanity items — dedicated, recognizable icons
    case 'cakesoap':    cakeSoap(ctx, sx, sy, s); break;
    case 'currypowder': curryPowderBag(ctx, sx, sy, s); break;
    case 'toothpaste':  toothpasteTube(ctx, sx, sy, s); break;
    // School Yute wholesome items
    case 'books':      drinkBottle(ctx, sx, sy, s, '#c0451f', '#7a2810', 'BK'); break;
    case 'stationery': drinkCan(ctx, sx, sy, s, '#1f9ad9', '#0f5e8a', 'ST'); break;
    case 'bagjuice':   drinkCan(ctx, sx, sy, s, '#e23f7a', '#9a1f4a', 'BJ'); break;
    case 'lasco':      drinkBottle(ctx, sx, sy, s, '#f0d8a0', '#bca060', 'LA'); break;
    // School Yute "negative temptation" pickups (avoid)
    case 'bleaching':  bleachingCream(ctx, sx, sy, s); break;
    case 'tightpants': tightPants(ctx, sx, sy, s); break;
    case 'weed':       weedBud(ctx, sx, sy, s); break;
    case 'molly':      mollyPills(ctx, sx, sy, s); break;
    case 'teensex':    warningHeart(ctx, sx, sy, s); break;
    // Rasta "avoid" pickups
    case 'obeah':      obeahCharm(ctx, sx, sy, s); break;
    case 'pork':       porkCut(ctx, sx, sy, s); break;
    case 'jw':         jwTract(ctx, sx, sy, s); break;
    // Politician "responsibility" obstacles (money pits to dodge)
    case 'roadfix':      roadworkSign(ctx, sx, sy, s); break;
    case 'constituent':  angryCitizen(ctx, sx, sy, s); break;
    case 'lightpole':    fallenPole(ctx, sx, sy, s); break;
    case 'hustlerlunch': boxLunchHustler(ctx, sx, sy, s); break;
    case 'voter':        ballotVoter(ctx, sx, sy, s); break;
    case 'contractor':   hardHatContractor(ctx, sx, sy, s); break;
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

// Lighten (+) or darken (-) a hex colour by fraction (0..1)
function shadeColor(hex, frac) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, Math.round(((n >> 16) & 0xff) + 255 * frac)));
  const g = Math.min(255, Math.max(0, Math.round(((n >> 8) & 0xff) + 255 * frac)));
  const b = Math.min(255, Math.max(0, Math.round((n & 0xff) + 255 * frac)));
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ctx.roundRect polyfill for environments that lack it (falls back to rrect)
function roundRectPath(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  } else {
    rrect(ctx, x, y, w, h, r);
  }
}

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
// Money pickup: a coin for loose change ($1–$20), a banknote for paper money,
// with the rare $5000 note gilded to feel coveted.
const COIN_COLOR = { 1: ['#b87333', '#7a4a1e'], 5: ['#c9cbce', '#8a8c8f'], 10: ['#f0c020', '#9a7a10'], 20: ['#f7d44a', '#a07e12'] };
const BILL = { 100: '#c0392b', 500: '#2a7fa0', 1000: '#6f3aa0', 5000: '#1f9a5a' };
const BILL_LABEL = { 100: '100', 500: '500', 1000: '1K', 5000: '5K' };
function money(ctx, x, y, s, value) {
  if (value <= 20) {
    const [fill, stroke] = COIN_COLOR[value] || COIN_COLOR[10];
    disc(ctx, x, y, s * 0.5, fill, stroke);
    return;
  }
  // banknote, lying on the road
  const w = s * 1.15, h = s * 0.62, cy = y - h * 0.7;
  const body = BILL[value] || '#2a7a4a', gilt = value >= 5000;
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(x - w / 2 + s * 0.06, cy - h / 2 + s * 0.06, w, h);
  ctx.fillStyle = body; ctx.fillRect(x - w / 2, cy - h / 2, w, h);
  ctx.strokeStyle = gilt ? '#f7d44a' : 'rgba(255,255,255,0.5)';
  ctx.lineWidth = Math.max(1.5, s * (gilt ? 0.07 : 0.04));
  ctx.strokeRect(x - w / 2, cy - h / 2, w, h);
  // centre medallion + denomination
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.ellipse(x, cy, w * 0.18, h * 0.32, 0, 0, Math.PI * 2); ctx.fill();
  if (s >= 14) {
    ctx.fillStyle = gilt ? '#f7d44a' : '#ffffff';
    ctx.font = '700 ' + Math.round(s * 0.34) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(BILL_LABEL[value] || String(value), x, cy);
  }
}
function roundedBar(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x - w / 2, y - h, w, h);
}
// ---- animal figures — 12-bit lift ----

// Goat: pale tan, two thin legs, oval body, stubby neck+head, two horn nubs, chin tuft
function drawGoat(ctx, x, y, r) {
  const mid = '#d8c7b0', shadow = '#b09878', hi = '#f0e8d8', dark = '#6b5a3a';
  const by = y - r * 0.18; // body centre y

  // thin legs (two pairs, slightly splayed)
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.5, r * 0.18); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.45, by + r * 0.28); ctx.lineTo(x - r * 0.42, y + r * 0.08);
  ctx.moveTo(x - r * 0.15, by + r * 0.28); ctx.lineTo(x - r * 0.12, y + r * 0.08);
  ctx.moveTo(x + r * 0.15, by + r * 0.28); ctx.lineTo(x + r * 0.18, y + r * 0.08);
  ctx.moveTo(x + r * 0.45, by + r * 0.28); ctx.lineTo(x + r * 0.48, y + r * 0.08);
  ctx.stroke();

  // body — base fill
  ctx.beginPath(); ctx.ellipse(x, by, r * 0.72, r * 0.38, 0, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // shadow underside
  ctx.beginPath(); ctx.ellipse(x, by + r * 0.12, r * 0.65, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // highlight top
  ctx.beginPath(); ctx.ellipse(x - r * 0.1, by - r * 0.1, r * 0.38, r * 0.14, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();

  // tail (short flick to the right)
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.13);
  ctx.beginPath(); ctx.moveTo(x + r * 0.68, by - r * 0.08);
  ctx.quadraticCurveTo(x + r * 0.92, by - r * 0.32, x + r * 0.82, by - r * 0.46); ctx.stroke();

  // neck + head
  const hx = x - r * 0.55, hy = by - r * 0.55;
  ctx.beginPath(); ctx.ellipse(hx, hy + r * 0.12, r * 0.18, r * 0.26, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  ctx.beginPath(); ctx.arc(hx - r * 0.08, hy - r * 0.1, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // head shadow
  ctx.beginPath(); ctx.arc(hx, hy - r * 0.02, r * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // eye
  ctx.beginPath(); ctx.arc(hx - r * 0.14, hy - r * 0.14, Math.max(1, r * 0.06), 0, Math.PI * 2);
  ctx.fillStyle = '#1a1008'; ctx.fill();
  // nostril
  ctx.beginPath(); ctx.arc(hx - r * 0.24, hy - r * 0.06, Math.max(1, r * 0.04), 0, Math.PI * 2);
  ctx.fillStyle = dark; ctx.fill();
  // horns (two small nubs pointing back-up)
  ctx.strokeStyle = '#9a8a60'; ctx.lineWidth = Math.max(1.5, r * 0.1);
  ctx.beginPath();
  ctx.moveTo(hx - r * 0.04, hy - r * 0.28); ctx.lineTo(hx + r * 0.06, hy - r * 0.48);
  ctx.moveTo(hx + r * 0.1, hy - r * 0.26); ctx.lineTo(hx + r * 0.22, hy - r * 0.44);
  ctx.stroke();
  // chin tuft
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.beginPath(); ctx.moveTo(hx - r * 0.2, hy - r * 0.04); ctx.lineTo(hx - r * 0.24, hy + r * 0.1); ctx.stroke();
}

// Cattle: dark brown, wide body, broad head, short swept horns, large muzzle
function drawCattle(ctx, x, y, r) {
  const mid = '#6b4a30', shadow = '#3d2618', hi = '#9a6a48', muzzle = '#8a6050';
  const by = y - r * 0.22;

  // legs (stockier than goat)
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(2, r * 0.22); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.5, by + r * 0.32); ctx.lineTo(x - r * 0.48, y + r * 0.06);
  ctx.moveTo(x - r * 0.18, by + r * 0.32); ctx.lineTo(x - r * 0.16, y + r * 0.06);
  ctx.moveTo(x + r * 0.18, by + r * 0.32); ctx.lineTo(x + r * 0.2, y + r * 0.06);
  ctx.moveTo(x + r * 0.5, by + r * 0.32); ctx.lineTo(x + r * 0.52, y + r * 0.06);
  ctx.stroke();

  // large body
  ctx.beginPath(); ctx.ellipse(x, by, r * 0.82, r * 0.44, 0, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // shadow belly
  ctx.beginPath(); ctx.ellipse(x, by + r * 0.18, r * 0.72, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // highlight ridge top
  ctx.beginPath(); ctx.ellipse(x - r * 0.05, by - r * 0.14, r * 0.45, r * 0.14, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();

  // tail (long flick right)
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.12);
  ctx.beginPath(); ctx.moveTo(x + r * 0.78, by);
  ctx.quadraticCurveTo(x + r * 1.08, by + r * 0.14, x + r * 1.0, by + r * 0.44); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + r * 1.0, by + r * 0.52, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();

  // neck + broad head
  const hx = x - r * 0.72, hy = by - r * 0.46;
  ctx.beginPath(); ctx.ellipse(hx + r * 0.12, hy + r * 0.24, r * 0.22, r * 0.3, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // head (wider oval)
  ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.3, r * 0.26, 0, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // head shadow
  ctx.beginPath(); ctx.ellipse(hx + r * 0.06, hy + r * 0.06, r * 0.2, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // muzzle block
  ctx.beginPath(); ctx.ellipse(hx - r * 0.18, hy + r * 0.06, r * 0.16, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = muzzle; ctx.fill();
  // nostrils
  ctx.fillStyle = shadow;
  ctx.beginPath(); ctx.arc(hx - r * 0.24, hy + r * 0.04, Math.max(1, r * 0.05), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx - r * 0.14, hy + r * 0.06, Math.max(1, r * 0.05), 0, Math.PI * 2); ctx.fill();
  // eye
  ctx.beginPath(); ctx.arc(hx - r * 0.08, hy - r * 0.12, Math.max(1.5, r * 0.08), 0, Math.PI * 2);
  ctx.fillStyle = '#120a04'; ctx.fill();
  ctx.beginPath(); ctx.arc(hx - r * 0.1, hy - r * 0.14, Math.max(0.5, r * 0.03), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
  // horns (swept outward)
  ctx.strokeStyle = '#c8a870'; ctx.lineWidth = Math.max(1.5, r * 0.12); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.06, hy - r * 0.22);
  ctx.quadraticCurveTo(hx - r * 0.08, hy - r * 0.52, hx - r * 0.28, hy - r * 0.44);
  ctx.moveTo(hx + r * 0.22, hy - r * 0.2);
  ctx.quadraticCurveTo(hx + r * 0.36, hy - r * 0.5, hx + r * 0.54, hy - r * 0.42);
  ctx.stroke();
}

// Dog: medium brown, floppy ear, wagging tail, four legs, alert head
function drawDog(ctx, x, y, r) {
  const mid = '#9a7a4a', shadow = '#5a3c20', hi = '#c8a870', nose = '#2a1a0a';
  const by = y - r * 0.16;

  // legs
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1.5, r * 0.19); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.4, by + r * 0.26); ctx.lineTo(x - r * 0.38, y + r * 0.06);
  ctx.moveTo(x - r * 0.12, by + r * 0.28); ctx.lineTo(x - r * 0.1, y + r * 0.06);
  ctx.moveTo(x + r * 0.12, by + r * 0.26); ctx.lineTo(x + r * 0.14, y + r * 0.06);
  ctx.moveTo(x + r * 0.38, by + r * 0.26); ctx.lineTo(x + r * 0.4, y + r * 0.06);
  ctx.stroke();

  // body
  ctx.beginPath(); ctx.ellipse(x, by, r * 0.58, r * 0.34, 0, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // belly shadow
  ctx.beginPath(); ctx.ellipse(x, by + r * 0.12, r * 0.5, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // back highlight
  ctx.beginPath(); ctx.ellipse(x - r * 0.08, by - r * 0.1, r * 0.3, r * 0.1, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();

  // tail (curled upward to the right)
  ctx.strokeStyle = mid; ctx.lineWidth = Math.max(1.5, r * 0.14); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + r * 0.56, by - r * 0.06);
  ctx.quadraticCurveTo(x + r * 0.84, by - r * 0.3, x + r * 0.72, by - r * 0.56); ctx.stroke();

  // head
  const hx = x - r * 0.5, hy = by - r * 0.48;
  ctx.beginPath(); ctx.arc(hx, hy, r * 0.26, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // head shadow side
  ctx.beginPath(); ctx.arc(hx + r * 0.06, hy + r * 0.06, r * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // head highlight
  ctx.beginPath(); ctx.arc(hx - r * 0.1, hy - r * 0.1, r * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();
  // floppy ear
  ctx.beginPath();
  ctx.ellipse(hx + r * 0.14, hy + r * 0.14, r * 0.13, r * 0.22, 0.5, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // muzzle / snout
  ctx.beginPath(); ctx.ellipse(hx - r * 0.18, hy + r * 0.06, r * 0.15, r * 0.1, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#7a5a30'; ctx.fill();
  // nose
  ctx.beginPath(); ctx.arc(hx - r * 0.24, hy + r * 0.02, Math.max(1.5, r * 0.07), 0, Math.PI * 2);
  ctx.fillStyle = nose; ctx.fill();
  // eye
  ctx.beginPath(); ctx.arc(hx - r * 0.1, hy - r * 0.1, Math.max(1.5, r * 0.07), 0, Math.PI * 2);
  ctx.fillStyle = nose; ctx.fill();
  ctx.beginPath(); ctx.arc(hx - r * 0.12, hy - r * 0.12, Math.max(0.5, r * 0.03), 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
}

// Cat: small grey, pointy ears, long tail, delicate limbs, slit eyes
function drawCat(ctx, x, y, r) {
  const mid = '#7a7a7a', shadow = '#3a3a3a', hi = '#b4b4b4', nose = '#c87080';
  const by = y - r * 0.12;

  // delicate legs
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.15); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.35, by + r * 0.22); ctx.lineTo(x - r * 0.34, y + r * 0.06);
  ctx.moveTo(x - r * 0.1, by + r * 0.24); ctx.lineTo(x - r * 0.09, y + r * 0.06);
  ctx.moveTo(x + r * 0.1, by + r * 0.22); ctx.lineTo(x + r * 0.11, y + r * 0.06);
  ctx.moveTo(x + r * 0.35, by + r * 0.22); ctx.lineTo(x + r * 0.36, y + r * 0.06);
  ctx.stroke();

  // body
  ctx.beginPath(); ctx.ellipse(x, by, r * 0.44, r * 0.28, 0, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // belly shadow
  ctx.beginPath(); ctx.ellipse(x, by + r * 0.1, r * 0.36, r * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // back highlight
  ctx.beginPath(); ctx.ellipse(x - r * 0.06, by - r * 0.08, r * 0.22, r * 0.08, -0.2, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();

  // long curving tail
  ctx.strokeStyle = mid; ctx.lineWidth = Math.max(1, r * 0.12); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + r * 0.42, by + r * 0.04);
  ctx.bezierCurveTo(x + r * 0.72, by + r * 0.12, x + r * 0.84, by - r * 0.56, x + r * 0.58, by - r * 0.68);
  ctx.stroke();

  // head
  const hx = x - r * 0.44, hy = by - r * 0.42;
  ctx.beginPath(); ctx.arc(hx, hy, r * 0.24, 0, Math.PI * 2);
  ctx.fillStyle = mid; ctx.fill();
  // head shadow
  ctx.beginPath(); ctx.arc(hx + r * 0.06, hy + r * 0.06, r * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = shadow; ctx.fill();
  // head highlight
  ctx.beginPath(); ctx.arc(hx - r * 0.08, hy - r * 0.1, r * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();
  // pointy ears
  ctx.fillStyle = mid;
  ctx.beginPath(); ctx.moveTo(hx - r * 0.14, hy - r * 0.2); ctx.lineTo(hx - r * 0.22, hy - r * 0.44); ctx.lineTo(hx - r * 0.02, hy - r * 0.3); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + r * 0.08, hy - r * 0.2); ctx.lineTo(hx + r * 0.12, hy - r * 0.42); ctx.lineTo(hx + r * 0.24, hy - r * 0.26); ctx.closePath(); ctx.fill();
  // inner ear pink
  ctx.fillStyle = '#c87090';
  ctx.beginPath(); ctx.moveTo(hx - r * 0.13, hy - r * 0.23); ctx.lineTo(hx - r * 0.18, hy - r * 0.36); ctx.lineTo(hx - r * 0.05, hy - r * 0.28); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx + r * 0.1, hy - r * 0.22); ctx.lineTo(hx + r * 0.13, hy - r * 0.34); ctx.lineTo(hx + r * 0.2, hy - r * 0.28); ctx.closePath(); ctx.fill();
  // nose (small pink triangle)
  ctx.fillStyle = nose;
  ctx.beginPath(); ctx.moveTo(hx - r * 0.18, hy + r * 0.05); ctx.lineTo(hx - r * 0.22, hy + r * 0.12); ctx.lineTo(hx - r * 0.14, hy + r * 0.12); ctx.closePath(); ctx.fill();
  // slit eyes
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath(); ctx.ellipse(hx - r * 0.08, hy - r * 0.08, r * 0.07, r * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + r * 0.08, hy - r * 0.06, r * 0.07, r * 0.04, 0, 0, Math.PI * 2); ctx.fill();
  // eye shine
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath(); ctx.arc(hx - r * 0.06, hy - r * 0.1, Math.max(0.5, r * 0.03), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx + r * 0.1, hy - r * 0.08, Math.max(0.5, r * 0.03), 0, Math.PI * 2); ctx.fill();
}

function blob(ctx, x, y, r, body, leg) {
  // legacy fallback — no longer used for named types
  ctx.fillStyle = leg; ctx.fillRect(x - r * 0.5, y - r * 0.5, r, r * 0.6);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.6, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = body; ctx.fill();
}
function vehicle(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.fillRect(x - s * 0.55, y - s * 0.9, s * 1.1, s * 0.9);
  ctx.fillStyle = '#1c1c1c'; ctx.fillRect(x - s * 0.55, y - s * 0.2, s * 1.1, s * 0.2);
  ctx.fillStyle = '#bfe0ff'; ctx.fillRect(x - s * 0.4, y - s * 0.8, s * 0.8, s * 0.3);
}
// A rounded rear-view car for road traffic. `plate` tints the licence plate —
// red marks a route taxi (PP plate). Drawn driving away from the player.
function carRear(ctx, x, y, s, body, plate) {
  const w = s * 0.62, top = y - s * 1.02, h = s * 1.0;
  ctx.fillStyle = '#141414';
  ctx.fillRect(x - w, y - s * 0.14, w * 0.32, s * 0.2);
  ctx.fillRect(x + w * 0.68, y - s * 0.14, w * 0.32, s * 0.2);
  rrect(ctx, x - w, top, w * 2, h, s * 0.16); ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // rear window
  ctx.fillStyle = '#16242e'; rrect(ctx, x - w * 0.74, top + s * 0.12, w * 1.48, s * 0.34, s * 0.05); ctx.fill();
  // body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x - w * 0.94, y - s * 0.5, w * 1.88, s * 0.05);
  // tail-lights
  ctx.fillStyle = '#d23a2a';
  rrect(ctx, x - w * 0.92, y - s * 0.36, w * 0.34, s * 0.14, s * 0.03); ctx.fill();
  rrect(ctx, x + w * 0.58, y - s * 0.36, w * 0.34, s * 0.14, s * 0.03); ctx.fill();
  // licence plate
  ctx.fillStyle = plate || '#e8e8e0'; ctx.fillRect(x - s * 0.18, y - s * 0.2, s * 0.36, s * 0.12);
}
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// Person (jaywalker / hustler) — 12-bit lift: rounded head, visible torso/legs/arms
function person(ctx, x, y, s, color) {
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';
  const shade = shadeColor(color, -0.35), hi = shadeColor(color, 0.3);

  // legs (two distinct columns, slightly apart)
  ctx.fillStyle = shade;
  ctx.fillRect(x - s * 0.16, y - s * 0.38, s * 0.12, s * 0.38);
  ctx.fillRect(x + s * 0.04, y - s * 0.38, s * 0.12, s * 0.38);
  // trouser highlight
  ctx.fillStyle = color;
  ctx.fillRect(x - s * 0.14, y - s * 0.37, s * 0.04, s * 0.3);
  ctx.fillRect(x + s * 0.06, y - s * 0.37, s * 0.04, s * 0.3);

  // torso — base
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x - s * 0.2, y - s * 0.88, s * 0.4, s * 0.52, s * 0.06); ctx.fill();
  // torso shadow (right side)
  ctx.fillStyle = shade;
  ctx.beginPath(); ctx.roundRect(x + s * 0.04, y - s * 0.86, s * 0.14, s * 0.48, s * 0.04); ctx.fill();
  // torso highlight (left edge)
  ctx.fillStyle = hi;
  ctx.beginPath(); ctx.roundRect(x - s * 0.18, y - s * 0.86, s * 0.08, s * 0.44, s * 0.04); ctx.fill();

  // arms (dangling to each side, slightly bent)
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  // left arm
  ctx.beginPath();
  ctx.moveTo(x - s * 0.18, y - s * 0.82);
  ctx.quadraticCurveTo(x - s * 0.36, y - s * 0.6, x - s * 0.28, y - s * 0.42);
  ctx.stroke();
  // right arm
  ctx.beginPath();
  ctx.moveTo(x + s * 0.18, y - s * 0.82);
  ctx.quadraticCurveTo(x + s * 0.36, y - s * 0.6, x + s * 0.28, y - s * 0.42);
  ctx.stroke();

  // neck
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.07, y - s * 1.02, s * 0.14, s * 0.18);

  // head (round)
  ctx.beginPath(); ctx.arc(x, y - s * 1.08, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  // head highlight
  ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 1.14, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinHi; ctx.fill();
  // head shadow
  ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 1.04, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinShadow; ctx.fill();
  // eyes (two small dots)
  ctx.fillStyle = '#1a0a04';
  ctx.beginPath(); ctx.arc(x - s * 0.08, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.04, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
}
// Windscreen youth: stands in the road, raised arm, soapy can throwing a misty
// spray of droplets overhead — the "forced wash" hustle at the stop-light.
// 12-bit lift: shaded torso, visible legs, shorts, arm anatomy kept, spray preserved.
function wiperYouth(ctx, x, y, s, seed) {
  const rnd = mulberry32(Math.floor((seed || 0.3) * 2147483647) ^ 0x71c5);
  const shirt = '#3f8aa8', shirtShadow = '#1f5a70', shirtHi = '#7ac0d8';
  const shorts = '#2a2a2a', shortsShadow = '#161616';
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';

  // legs (bare — short shorts)
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.14, y - s * 0.32, s * 0.1, s * 0.32);
  ctx.fillRect(x + s * 0.04, y - s * 0.32, s * 0.1, s * 0.32);
  // leg shadow inward
  ctx.fillStyle = skinShadow;
  ctx.fillRect(x - s * 0.04, y - s * 0.3, s * 0.04, s * 0.28);
  ctx.fillRect(x + s * 0.1, y - s * 0.3, s * 0.04, s * 0.28);

  // shorts
  ctx.fillStyle = shorts;
  ctx.beginPath(); ctx.roundRect(x - s * 0.18, y - s * 0.36, s * 0.36, s * 0.14, s * 0.04); ctx.fill();
  ctx.fillStyle = shortsShadow;
  ctx.fillRect(x + s * 0.04, y - s * 0.35, s * 0.12, s * 0.1);

  // torso / shirt — base
  ctx.fillStyle = shirt;
  ctx.beginPath(); ctx.roundRect(x - s * 0.2, y - s * 0.88, s * 0.4, s * 0.54, s * 0.06); ctx.fill();
  // shirt shadow right
  ctx.fillStyle = shirtShadow;
  ctx.beginPath(); ctx.roundRect(x + s * 0.04, y - s * 0.86, s * 0.14, s * 0.5, s * 0.04); ctx.fill();
  // shirt highlight left
  ctx.fillStyle = shirtHi;
  ctx.beginPath(); ctx.roundRect(x - s * 0.17, y - s * 0.86, s * 0.08, s * 0.46, s * 0.04); ctx.fill();

  // lowered left arm (loose, at side)
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.17, y - s * 0.8);
  ctx.quadraticCurveTo(x - s * 0.3, y - s * 0.56, x - s * 0.22, y - s * 0.4);
  ctx.stroke();

  // raised right arm holding can
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.11);
  ctx.beginPath();
  ctx.moveTo(x + s * 0.14, y - s * 0.82);
  ctx.quadraticCurveTo(x + s * 0.34, y - s * 1.0, x + s * 0.42, y - s * 1.28);
  ctx.stroke();

  // soapy can (grey cylinder)
  ctx.fillStyle = '#c0c8d0';
  ctx.beginPath(); ctx.roundRect(x + s * 0.34, y - s * 1.44, s * 0.17, s * 0.24, s * 0.04); ctx.fill();
  ctx.fillStyle = '#8a9aa8'; ctx.fillRect(x + s * 0.34, y - s * 1.34, s * 0.17, s * 0.1);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x + s * 0.36, y - s * 1.42, s * 0.04, s * 0.18);

  // neck
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.07, y - s * 1.02, s * 0.14, s * 0.18);

  // head (round)
  ctx.beginPath(); ctx.arc(x, y - s * 1.08, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 1.14, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinHi; ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 1.04, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinShadow; ctx.fill();
  // eyes
  ctx.fillStyle = '#1a0a04';
  ctx.beginPath(); ctx.arc(x - s * 0.08, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.04, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();

  // misty soapy spray fanning above the can
  ctx.fillStyle = 'rgba(220,235,245,0.8)';
  for (let i = 0; i < 9; i++) {
    const dx = (rnd() - 0.5) * s * 0.9, dy = -s * (1.3 + rnd() * 0.7);
    ctx.beginPath(); ctx.arc(x + s * 0.4 + dx, y + dy, Math.max(1, s * 0.05 * rnd() + s * 0.02), 0, Math.PI * 2); ctx.fill();
  }
}

// ---- water bottle: clear plastic bottle with blue label, a healing pick-up ----
function waterBottle(ctx, x, y, s) {
  const h = s * 1.1, w = s * 0.44, cy = y - h * 0.5;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x + s * 0.04, cy + h * 0.5 + s * 0.06, w * 0.5, s * 0.1); ctx.fill();
  // bottle body (translucent plastic)
  ctx.fillStyle = 'rgba(200,230,255,0.75)';
  rrectSprite(ctx, x - w * 0.5, cy - h * 0.5, w, h, w * 0.22); ctx.fill();
  ctx.strokeStyle = 'rgba(130,190,230,0.9)'; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
  // blue label band in the middle
  ctx.fillStyle = '#1a6fc4';
  ctx.fillRect(x - w * 0.5, cy - s * 0.12, w, s * 0.28);
  // white "W" on label (when big enough)
  if (s >= 14) {
    ctx.fillStyle = '#ffffff'; ctx.font = '700 ' + Math.round(s * 0.22) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('W', x, cy + s * 0.02);
  }
  // bottle cap (white)
  ctx.fillStyle = '#ffffff';
  rrectSprite(ctx, x - w * 0.28, cy - h * 0.5 - s * 0.1, w * 0.56, s * 0.14, w * 0.1); ctx.fill();
  // light sheen on bottle
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(x - w * 0.3, cy - h * 0.5 + s * 0.04, w * 0.12, h * 0.42);
}

// ---- hardware tools: spanner (handcart) or socket set (cars) ----
function hardwareTools(ctx, x, y, s, seed) {
  // The seed is used here just for context; we always draw based on entity seed
  // Since we don't have vehicle context in sprites.js, draw a generic spanner shape
  // (toolSpriteFor is used in the HUD/cartSprite for per-ride switching)
  const hy = y - s * 0.5;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.06, s * 0.55, s * 0.1); ctx.fill();
  // spanner body (chrome silver)
  ctx.strokeStyle = '#b0b8c0'; ctx.lineWidth = Math.max(2, s * 0.22); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.38, hy + s * 0.32); ctx.lineTo(x + s * 0.32, hy - s * 0.32); ctx.stroke();
  // jaw ends (open-end spanner loops)
  ctx.strokeStyle = '#c9cdd2'; ctx.lineWidth = Math.max(2, s * 0.13); ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.arc(x - s * 0.38, hy + s * 0.32, s * 0.18, 0.2, Math.PI * 1.8); ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + s * 0.32, hy - s * 0.32, s * 0.18, Math.PI + 0.2, Math.PI * 2.8); ctx.stroke();
  // golden highlight on shaft
  ctx.strokeStyle = 'rgba(255,230,120,0.5)'; ctx.lineWidth = Math.max(1, s * 0.07);
  ctx.beginPath(); ctx.moveTo(x - s * 0.2, hy + s * 0.18); ctx.lineTo(x + s * 0.14, hy - s * 0.16); ctx.stroke();
}

// ---- Blue Mountain coffee bag: dark brown sack with "BM" label ----
function coffeeBag(ctx, x, y, s) {
  const bw = s * 0.82, bh = s * 1.05, bx = x - bw * 0.5, by = y - bh;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ellipsePath(ctx, x + s * 0.05, y + s * 0.06, bw * 0.5, s * 0.1); ctx.fill();
  // bag body (coffee-brown burlap)
  rrectSprite(ctx, bx, by, bw, bh, bw * 0.15);
  ctx.fillStyle = '#5b3a1a'; ctx.fill();
  ctx.strokeStyle = '#3d2510'; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.stroke();
  // darker burlap texture lines
  ctx.strokeStyle = 'rgba(40,20,5,0.4)'; ctx.lineWidth = Math.max(1, s * 0.04);
  for (let i = 1; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(bx + bw * 0.12, by + bh * (i / 4));
    ctx.lineTo(bx + bw * 0.88, by + bh * (i / 4)); ctx.stroke();
  }
  // cream label panel
  ctx.fillStyle = '#f7f0d8';
  rrectSprite(ctx, bx + bw * 0.14, by + bh * 0.24, bw * 0.72, bh * 0.38, bw * 0.06); ctx.fill();
  // "BM" text on label
  if (s >= 12) {
    ctx.fillStyle = '#5b3a1a'; ctx.font = '700 ' + Math.round(s * 0.24) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('BM', x, by + bh * 0.43);
  }
  // tie at the top
  ctx.strokeStyle = '#8b6030'; ctx.lineWidth = Math.max(1.5, s * 0.08); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - bw * 0.22, by + bh * 0.06); ctx.lineTo(x + bw * 0.22, by + bh * 0.06); ctx.stroke();
  // golden shimmer — signals rarity
  ctx.strokeStyle = 'rgba(240,192,32,0.7)'; ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath(); ctx.moveTo(bx + bw * 0.08, by + bh * 0.08); ctx.lineTo(bx + bw * 0.2, by + bh * 0.08);
  ctx.moveTo(bx + bw * 0.08, by + bh * 0.14); ctx.lineTo(bx + bw * 0.18, by + bh * 0.14); ctx.stroke();
}

// ---- shared rounded-rect helper for sprite functions ----
function rrectSprite(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---- drink can (sodas: Ting, Boom) — cylindrical can shape ----
function drinkCan(ctx, x, y, s, bodyColor, shadowColor, label) {
  const w = s * 0.46, h = s * 0.88, cx = x - w * 0.5, cy = y - h;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, w * 0.52, s * 0.09); ctx.fill();
  // can body
  rrectSprite(ctx, cx, cy, w, h, w * 0.22);
  ctx.fillStyle = bodyColor; ctx.fill();
  ctx.strokeStyle = shadowColor; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
  // label band (lighter centre strip)
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(cx, cy + h * 0.25, w, h * 0.45);
  // top rim (silver lid)
  ctx.fillStyle = '#d0d4d8';
  rrectSprite(ctx, cx + w * 0.06, cy, w * 0.88, h * 0.1, w * 0.2); ctx.fill();
  // bottom rim
  ctx.fillStyle = '#b0b4b8';
  rrectSprite(ctx, cx + w * 0.06, cy + h * 0.9, w * 0.88, h * 0.1, w * 0.2); ctx.fill();
  // label text when big enough
  if (s >= 14) {
    ctx.fillStyle = '#ffffff'; ctx.font = '700 ' + Math.round(s * 0.2) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, cy + h * 0.48);
  }
  // light sheen
  ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(cx + w * 0.1, cy + h * 0.12, w * 0.14, h * 0.65);
}

// ---- drink bottle (spirits/health: Red Stripe, White Rum, Spirulina, Roots Tonic) ----
function drinkBottle(ctx, x, y, s, bodyColor, shadowColor, label) {
  const w = s * 0.40, h = s * 1.05, neck = w * 0.48, neckH = h * 0.22;
  const bx = x - w * 0.5, by = y - h;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, w * 0.52, s * 0.09); ctx.fill();
  // bottle body
  rrectSprite(ctx, bx, by + neckH, w, h - neckH, w * 0.18);
  ctx.fillStyle = bodyColor; ctx.fill();
  ctx.strokeStyle = shadowColor; ctx.lineWidth = Math.max(1, s * 0.05); ctx.stroke();
  // bottle neck (narrower)
  ctx.fillStyle = bodyColor;
  rrectSprite(ctx, x - neck * 0.5, by, neck, neckH + w * 0.1, neck * 0.2); ctx.fill();
  ctx.strokeStyle = shadowColor; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // cap (dark, distinctive)
  ctx.fillStyle = shadowColor;
  rrectSprite(ctx, x - neck * 0.55, by - s * 0.07, neck * 1.1, s * 0.1, neck * 0.15); ctx.fill();
  // label band across body
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(bx, by + neckH + (h - neckH) * 0.22, w, (h - neckH) * 0.44);
  // label text
  if (s >= 14) {
    ctx.fillStyle = '#ffffff'; ctx.font = '700 ' + Math.round(s * 0.17) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x, by + neckH + (h - neckH) * 0.44);
  }
  // light sheen on shoulder of bottle
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(bx + w * 0.1, by + neckH + s * 0.05, w * 0.12, (h - neckH) * 0.55);
}

// ============================================================================
// Conductor bleach vanity items — dedicated, road-recognizable icons (Task 1)
// ============================================================================

// ---- cake soap: a chunky square bar of blue laundry soap (NOT a can) ----
function cakeSoap(ctx, x, y, s) {
  const w = s * 0.92, h = s * 0.70, bx = x - w * 0.5, by = y - h * 0.7;
  const r = Math.min(w, h) * 0.18;
  const base = '#3a6ad0', edge = '#1f3f8a';
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, by + h + s * 0.04, w * 0.5, s * 0.08); ctx.fill();
  // darker blue base/shadow block, offset down-right so the bar reads as 3D
  rrectSprite(ctx, bx + s * 0.05, by + s * 0.05, w, h, r); ctx.fillStyle = edge; ctx.fill();
  // blue body on top
  rrectSprite(ctx, bx, by, w, h, r); ctx.fillStyle = base; ctx.fill();
  ctx.strokeStyle = edge; ctx.lineWidth = Math.max(1, s * 0.045); ctx.stroke();
  // soft top highlight band
  ctx.fillStyle = 'rgba(255,255,255,0.30)';
  rrectSprite(ctx, bx + w * 0.10, by + h * 0.10, w * 0.80, h * 0.22, r * 0.6); ctx.fill();
  // faint embossed lettering (only when big enough)
  if (s >= 16) {
    ctx.fillStyle = 'rgba(255,255,255,0.32)';
    ctx.font = '700 ' + Math.round(s * 0.20) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('SOAP', x, by + h * 0.62);
  }
}

// ---- curry powder: a clear sandwich bag of yellow-gold powder with a knot tie ----
function curryPowderBag(ctx, x, y, s) {
  const w = s * 0.74, h = s * 0.90, bx = x - w * 0.5, by = y - h * 0.92;
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.04, w * 0.5, s * 0.08); ctx.fill();
  // yellow powder mass — a rounded heap that settles toward the bottom of the bag
  const py = by + h * 0.42, ph = h * 0.52;
  // lower shadow of the heap
  rrectSprite(ctx, bx + w * 0.10, py + ph * 0.30, w * 0.80, ph * 0.70, w * 0.22);
  ctx.fillStyle = '#a06e08'; ctx.fill();
  // main gold body
  rrectSprite(ctx, bx + w * 0.10, py, w * 0.80, ph, w * 0.24);
  ctx.fillStyle = '#d9a01f'; ctx.fill();
  // lighter top of the powder
  ctx.fillStyle = '#ecc566';
  rrectSprite(ctx, bx + w * 0.16, py + ph * 0.06, w * 0.68, ph * 0.30, w * 0.18); ctx.fill();
  // translucent plastic bag over the powder (low alpha so the gold shows through)
  ctx.fillStyle = 'rgba(240,244,248,0.30)';
  rrectSprite(ctx, bx, by + h * 0.14, w, h * 0.84, w * 0.14); ctx.fill();
  ctx.strokeStyle = 'rgba(220,228,236,0.85)'; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
  // sheen streak down the bag
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillRect(bx + w * 0.20, by + h * 0.22, w * 0.08, h * 0.62);
  // knotted / twisted top — two little ear-loops of gathered plastic
  ctx.fillStyle = 'rgba(225,232,240,0.9)';
  ctx.beginPath(); ctx.ellipse(x - w * 0.18, by + h * 0.10, w * 0.16, h * 0.10, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + w * 0.18, by + h * 0.10, w * 0.16, h * 0.10, 0.5, 0, Math.PI * 2); ctx.fill();
  // pinch where the knot ties off
  ctx.fillStyle = 'rgba(190,200,210,0.95)';
  rrectSprite(ctx, x - w * 0.10, by + h * 0.08, w * 0.20, h * 0.10, w * 0.05); ctx.fill();
}

// ---- toothpaste: a tube lying down, crimped tail + screw cap at the nozzle ----
function toothpasteTube(ctx, x, y, s) {
  const w = s * 1.05, h = s * 0.40, bx = x - w * 0.5, cy = y - h * 0.6;
  const body = '#e8f2f5', bodyShade = '#b9ccd4', cap = '#1f9ad9';
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x + s * 0.04, cy + h * 0.5 + s * 0.05, w * 0.46, s * 0.07); ctx.fill();
  // crimped/folded flat tail at the LEFT end (triangular zig-zag fold)
  ctx.fillStyle = bodyShade;
  ctx.beginPath();
  ctx.moveTo(bx, cy - h * 0.5); ctx.lineTo(bx + w * 0.14, cy - h * 0.34);
  ctx.lineTo(bx + w * 0.14, cy + h * 0.34); ctx.lineTo(bx, cy + h * 0.5); ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#9fb4c0'; ctx.lineWidth = Math.max(1, s * 0.03);
  // crimp ridges
  for (const t of [0.30, 0.55, 0.80]) {
    ctx.beginPath(); ctx.moveTo(bx + w * 0.02, cy - h * (0.5 - 0.5 * t)); ctx.lineTo(bx + w * 0.02, cy + h * (0.5 - 0.5 * t)); ctx.stroke();
  }
  // main tube body — rounded, fattening toward the nozzle end
  rrectSprite(ctx, bx + w * 0.12, cy - h * 0.5, w * 0.72, h, h * 0.45);
  ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = bodyShade; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // lower shadow along the tube belly
  ctx.fillStyle = 'rgba(150,175,190,0.5)';
  rrectSprite(ctx, bx + w * 0.14, cy + h * 0.18, w * 0.68, h * 0.26, h * 0.2); ctx.fill();
  // thin coloured stripe along the tube
  ctx.fillStyle = cap;
  ctx.fillRect(bx + w * 0.16, cy - h * 0.06, w * 0.64, h * 0.10);
  // top sheen
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  rrectSprite(ctx, bx + w * 0.16, cy - h * 0.40, w * 0.6, h * 0.16, h * 0.1); ctx.fill();
  // shoulder where the tube necks down to the nozzle
  ctx.fillStyle = bodyShade;
  ctx.beginPath();
  ctx.moveTo(bx + w * 0.84, cy - h * 0.34); ctx.lineTo(bx + w * 0.90, cy - h * 0.22);
  ctx.lineTo(bx + w * 0.90, cy + h * 0.22); ctx.lineTo(bx + w * 0.84, cy + h * 0.34); ctx.closePath();
  ctx.fill();
  // small screw cap at the nozzle (right) end
  rrectSprite(ctx, bx + w * 0.88, cy - h * 0.30, w * 0.12, h * 0.60, h * 0.12);
  ctx.fillStyle = cap; ctx.fill();
  ctx.strokeStyle = shadeColor(cap, -0.25); ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // cap ridges
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = Math.max(1, s * 0.02);
  for (const t of [0.35, 0.65]) {
    ctx.beginPath(); ctx.moveTo(bx + w * (0.88 + 0.12 * t), cy - h * 0.26); ctx.lineTo(bx + w * (0.88 + 0.12 * t), cy + h * 0.26); ctx.stroke();
  }
}

// ============================================================================
// Police officer in the road (Task 3)
// ============================================================================
// Jamaican police: navy uniform shirt, peaked cap with a gold badge band,
// epaulettes — built on the same proportions as `person` but clearly "police".
function drawPolice(ctx, x, y, s) {
  const shirt = '#27407a', shirtShade = '#16284f', shirtHi = '#3a5aa0';
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';
  const cap = '#16223e', capHi = '#26365a', badge = '#d8c24a';

  // legs (dark navy trousers)
  ctx.fillStyle = shirtShade;
  ctx.fillRect(x - s * 0.16, y - s * 0.38, s * 0.12, s * 0.38);
  ctx.fillRect(x + s * 0.04, y - s * 0.38, s * 0.12, s * 0.38);
  ctx.fillStyle = shirt;
  ctx.fillRect(x - s * 0.14, y - s * 0.37, s * 0.04, s * 0.3);
  ctx.fillRect(x + s * 0.06, y - s * 0.37, s * 0.04, s * 0.3);

  // torso / uniform shirt — base
  ctx.fillStyle = shirt;
  ctx.beginPath(); ctx.roundRect(x - s * 0.2, y - s * 0.88, s * 0.4, s * 0.52, s * 0.06); ctx.fill();
  // shadow (right) + highlight (left)
  ctx.fillStyle = shirtShade;
  ctx.beginPath(); ctx.roundRect(x + s * 0.04, y - s * 0.86, s * 0.14, s * 0.48, s * 0.04); ctx.fill();
  ctx.fillStyle = shirtHi;
  ctx.beginPath(); ctx.roundRect(x - s * 0.18, y - s * 0.86, s * 0.08, s * 0.44, s * 0.04); ctx.fill();
  // epaulettes (shoulder bars) + a gold button row down the front
  ctx.fillStyle = badge;
  ctx.fillRect(x - s * 0.2, y - s * 0.86, s * 0.1, s * 0.04);
  ctx.fillRect(x + s * 0.1, y - s * 0.86, s * 0.1, s * 0.04);
  if (s >= 14) {
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x, y - s * (0.78 - i * 0.14), Math.max(1, s * 0.025), 0, Math.PI * 2); ctx.fill(); }
  }

  // arms (navy sleeves)
  ctx.strokeStyle = shirt; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.18, y - s * 0.82);
  ctx.quadraticCurveTo(x - s * 0.36, y - s * 0.6, x - s * 0.28, y - s * 0.42); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + s * 0.18, y - s * 0.82);
  ctx.quadraticCurveTo(x + s * 0.36, y - s * 0.6, x + s * 0.28, y - s * 0.42); ctx.stroke();
  // skin hands
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(x - s * 0.28, y - s * 0.42, s * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.28, y - s * 0.42, s * 0.05, 0, Math.PI * 2); ctx.fill();

  // neck
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.07, y - s * 1.02, s * 0.14, s * 0.18);

  // head
  ctx.beginPath(); ctx.arc(x, y - s * 1.08, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 1.14, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinHi; ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 1.04, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinShadow; ctx.fill();
  // eyes
  ctx.fillStyle = '#1a0a04';
  ctx.beginPath(); ctx.arc(x - s * 0.08, y - s * 1.08, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.04, y - s * 1.08, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();

  // peaked cap sitting on the crown
  // dark peak/brim across the brow
  ctx.fillStyle = '#0e1626';
  ctx.beginPath(); ctx.ellipse(x, y - s * 1.18, s * 0.26, s * 0.07, 0, 0, Math.PI * 2); ctx.fill();
  // cap dome
  ctx.fillStyle = cap;
  ctx.beginPath(); ctx.arc(x, y - s * 1.22, s * 0.24, Math.PI, 0); ctx.fill();
  ctx.fillStyle = capHi;
  ctx.beginPath(); ctx.arc(x - s * 0.06, y - s * 1.28, s * 0.1, Math.PI, 0); ctx.fill();
  // gold badge band across the cap front + small badge
  ctx.fillStyle = badge;
  ctx.fillRect(x - s * 0.24, y - s * 1.24, s * 0.48, s * 0.05);
  ctx.beginPath(); ctx.arc(x, y - s * 1.30, Math.max(1.5, s * 0.05), 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = shadeColor(badge, -0.3);
  ctx.beginPath(); ctx.arc(x, y - s * 1.30, Math.max(0.8, s * 0.025), 0, Math.PI * 2); ctx.fill();
}

// ============================================================================
// Gated obstacle / negative pickups — recognizable, compact (Task 4)
// ============================================================================

// ---- bleaching cream: a small pale blue-white jar/tube with a lid ----
function bleachingCream(ctx, x, y, s) {
  const w = s * 0.62, h = s * 0.58, bx = x - w * 0.5, by = y - h * 0.7;
  const body = '#cfe0ff', shade = '#9bb4dd';
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x + s * 0.03, by + h + s * 0.04, w * 0.5, s * 0.07); ctx.fill();
  // squat jar body
  rrectSprite(ctx, bx, by + h * 0.22, w, h * 0.78, w * 0.16);
  ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // lid
  rrectSprite(ctx, bx - w * 0.04, by, w * 1.08, h * 0.26, w * 0.08);
  ctx.fillStyle = shade; ctx.fill();
  // sheen
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(bx + w * 0.14, by + h * 0.32, w * 0.12, h * 0.5);
  if (s >= 14) {
    ctx.fillStyle = '#5a78b0'; ctx.font = '700 ' + Math.round(s * 0.18) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Bl', x, by + h * 0.62);
  }
}

// ---- tight pants: a pair of very tight dark-indigo jeans ----
function tightPants(ctx, x, y, s) {
  const w = s * 0.6, h = s * 0.95, bx = x - w * 0.5, by = y - h;
  const col = '#3a3a5a', shade = shadeColor(col, -0.3), hi = shadeColor(col, 0.2);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.04, w * 0.5, s * 0.07); ctx.fill();
  // waistband
  rrectSprite(ctx, bx, by, w, h * 0.2, w * 0.1); ctx.fillStyle = shade; ctx.fill();
  // two tapering legs (skinny — narrow at the ankle)
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(bx, by + h * 0.16); ctx.lineTo(x - w * 0.04, by + h * 0.16);
  ctx.lineTo(x - w * 0.12, by + h); ctx.lineTo(bx + w * 0.02, by + h); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + w * 0.04, by + h * 0.16); ctx.lineTo(bx + w, by + h * 0.16);
  ctx.lineTo(bx + w * 0.98, by + h); ctx.lineTo(x + w * 0.12, by + h); ctx.closePath(); ctx.fill();
  // centre seam shadow + denim highlight
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.moveTo(x, by + h * 0.18); ctx.lineTo(x, by + h * 0.7); ctx.stroke();
  ctx.fillStyle = hi; ctx.fillRect(bx + w * 0.08, by + h * 0.24, w * 0.05, h * 0.6);
}

// ---- weed: a small green herb bud (clustered leaflets) ----
function weedBud(ctx, x, y, s) {
  const col = '#3f7a3a', dark = '#256020', hi = '#5fa050';
  const cy = y - s * 0.4, r = s * 0.42;
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, r * 0.7, s * 0.06); ctx.fill();
  // stem
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.5, s * 0.08); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, y); ctx.stroke();
  // a fan of pointed leaflets radiating up
  for (const a of [-1.3, -0.9, -0.5, -1.05, -0.7]) {
    const ex = x + Math.cos(a) * r, ey = cy + Math.sin(a) * r;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x, cy);
    ctx.quadraticCurveTo(x + Math.cos(a) * r * 0.4 - s * 0.06, cy + Math.sin(a) * r * 0.5, ex, ey);
    ctx.quadraticCurveTo(x + Math.cos(a) * r * 0.4 + s * 0.06, cy + Math.sin(a) * r * 0.5, x, cy);
    ctx.closePath(); ctx.fill();
  }
  // central bud cluster
  ctx.fillStyle = hi;
  ctx.beginPath(); ctx.arc(x, cy - s * 0.04, r * 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(x + s * 0.04, cy + s * 0.02, r * 0.16, 0, Math.PI * 2); ctx.fill();
}

// ---- molly: a couple of loose magenta capsules / pills ----
function mollyPills(ctx, x, y, s) {
  const col = '#e060c0', shade = '#a8308a', cap = '#ffffff';
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, s * 0.5, s * 0.07); ctx.fill();
  // capsule 1 (tilted)
  ctx.save(); ctx.translate(x - s * 0.12, y - s * 0.34); ctx.rotate(-0.4);
  rrectSprite(ctx, -s * 0.26, -s * 0.1, s * 0.52, s * 0.2, s * 0.1); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = cap; rrectSprite(ctx, -s * 0.26, -s * 0.1, s * 0.26, s * 0.2, s * 0.1); ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.03);
  rrectSprite(ctx, -s * 0.26, -s * 0.1, s * 0.52, s * 0.2, s * 0.1); ctx.stroke();
  ctx.restore();
  // round pill 2
  ctx.beginPath(); ctx.arc(x + s * 0.18, y - s * 0.16, s * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  ctx.strokeStyle = shade; ctx.beginPath(); ctx.moveTo(x + s * 0.06, y - s * 0.16); ctx.lineTo(x + s * 0.3, y - s * 0.16); ctx.stroke();
  // highlight glints
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.arc(x + s * 0.13, y - s * 0.22, s * 0.04, 0, Math.PI * 2); ctx.fill();
}

// ---- teen sex (tasteful/abstract): a red-pink warning heart with a slash ----
function warningHeart(ctx, x, y, s) {
  const col = '#c0285a', dark = '#8a1840';
  const cy = y - s * 0.42, r = s * 0.4;
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, r * 0.8, s * 0.06); ctx.fill();
  // heart shape (two lobes + point)
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(x, cy + r * 0.9);
  ctx.bezierCurveTo(x - r * 1.2, cy - r * 0.2, x - r * 0.4, cy - r * 0.95, x, cy - r * 0.3);
  ctx.bezierCurveTo(x + r * 0.4, cy - r * 0.95, x + r * 1.2, cy - r * 0.2, x, cy + r * 0.9);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // warning slash across it
  ctx.strokeStyle = '#f5f0f0'; ctx.lineWidth = Math.max(1.5, s * 0.08); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - r * 0.7, cy + r * 0.55); ctx.lineTo(x + r * 0.7, cy - r * 0.55); ctx.stroke();
  ctx.lineCap = 'butt';
}

// ---- obeah: a dark ritual charm — a little candle/skull-ish fetish token ----
function obeahCharm(ctx, x, y, s) {
  const col = '#5a2a6a', dark = '#3a1646', bone = '#d8d0c0';
  const cy = y - s * 0.4;
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, s * 0.4, s * 0.07); ctx.fill();
  // cloth-wrapped charm body
  rrectSprite(ctx, x - s * 0.28, cy - s * 0.08, s * 0.56, s * 0.5, s * 0.1);
  ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // binding cords across it
  ctx.strokeStyle = '#2a1030'; ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath(); ctx.moveTo(x - s * 0.28, cy + s * 0.1); ctx.lineTo(x + s * 0.28, cy + s * 0.1);
  ctx.moveTo(x - s * 0.28, cy + s * 0.24); ctx.lineTo(x + s * 0.28, cy + s * 0.24); ctx.stroke();
  // little pale skull/bone token tied on top
  ctx.fillStyle = bone;
  ctx.beginPath(); ctx.arc(x, cy - s * 0.16, s * 0.14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark; // eye sockets
  ctx.beginPath(); ctx.arc(x - s * 0.05, cy - s * 0.18, s * 0.03, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.05, cy - s * 0.18, s * 0.03, 0, Math.PI * 2); ctx.fill();
}

// ---- pork: a pink ham / pork cut with a bone end ----
function porkCut(ctx, x, y, s) {
  const col = '#e0a0a0', shade = '#c07878', rind = '#f0d0c8', bone = '#efe8da';
  const cy = y - s * 0.4, w = s * 0.8, h = s * 0.6;
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, w * 0.5, s * 0.07); ctx.fill();
  // ham body (teardrop-ish oval)
  ctx.fillStyle = col;
  ctx.beginPath(); ctx.ellipse(x + s * 0.04, cy, w * 0.46, h * 0.5, -0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // rind highlight
  ctx.fillStyle = rind;
  ctx.beginPath(); ctx.ellipse(x - s * 0.06, cy - h * 0.18, w * 0.26, h * 0.18, -0.3, 0, Math.PI * 2); ctx.fill();
  // scoring marks
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.025);
  ctx.beginPath(); ctx.moveTo(x - s * 0.1, cy - s * 0.04); ctx.lineTo(x + s * 0.2, cy - s * 0.12);
  ctx.moveTo(x - s * 0.08, cy + s * 0.08); ctx.lineTo(x + s * 0.22, cy + s * 0.0); ctx.stroke();
  // protruding bone end
  ctx.fillStyle = bone;
  ctx.beginPath(); ctx.arc(x + w * 0.42, cy - h * 0.22, s * 0.09, 0, Math.PI * 2); ctx.fill();
}

// ---- jw: a cream "Watchtower"-style tract / booklet ----
function jwTract(ctx, x, y, s) {
  const cream = '#cfc8b0', shade = '#a89e80', ink = '#5a5440';
  const w = s * 0.66, h = s * 0.86, bx = x - w * 0.5, by = y - h * 0.92;
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x + s * 0.03, by + h + s * 0.04, w * 0.5, s * 0.07); ctx.fill();
  // back page peeking (booklet)
  rrectSprite(ctx, bx + s * 0.05, by + s * 0.04, w, h, w * 0.05);
  ctx.fillStyle = shade; ctx.fill();
  // front cover
  rrectSprite(ctx, bx, by, w, h, w * 0.05);
  ctx.fillStyle = cream; ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
  // spine line
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.moveTo(bx + w * 0.1, by); ctx.lineTo(bx + w * 0.1, by + h); ctx.stroke();
  // masthead bar + headline lines
  ctx.fillStyle = '#8a7f5a'; ctx.fillRect(bx + w * 0.18, by + h * 0.1, w * 0.72, h * 0.12);
  ctx.fillStyle = ink;
  for (let i = 0; i < 3; i++) ctx.fillRect(bx + w * 0.18, by + h * (0.32 + i * 0.12), w * 0.66, h * 0.05);
  if (s >= 14) {
    ctx.fillStyle = '#3a3528'; ctx.font = '700 ' + Math.round(s * 0.13) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('JW', bx + w * 0.54, by + h * 0.16);
  }
}

// ---- roadfix: an orange roadwork cone + fresh-asphalt patch (money pit) ----
function roadworkSign(ctx, x, y, s) {
  const orange = '#e8821e', dark = '#b5610c';
  // fresh dark asphalt patch on the ground
  ctx.fillStyle = '#1f1c18';
  ellipsePath(ctx, x, y - s * 0.04, s * 0.7, s * 0.22); ctx.fill();
  ctx.fillStyle = '#34302a';
  ellipsePath(ctx, x - s * 0.06, y - s * 0.06, s * 0.4, s * 0.12); ctx.fill();
  // traffic cone
  const baseY = y - s * 0.12, topY = y - s * 0.95;
  ctx.fillStyle = orange;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.34, baseY); ctx.lineTo(x - s * 0.08, topY);
  ctx.lineTo(x + s * 0.08, topY); ctx.lineTo(x + s * 0.34, baseY); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
  // white reflective bands
  ctx.fillStyle = '#f2ede2';
  ctx.beginPath(); ctx.moveTo(x - s * 0.24, baseY - s * 0.28); ctx.lineTo(x - s * 0.14, baseY - s * 0.52);
  ctx.lineTo(x + s * 0.14, baseY - s * 0.52); ctx.lineTo(x + s * 0.24, baseY - s * 0.28); ctx.closePath(); ctx.fill();
  // wide base slab
  ctx.fillStyle = dark; rrectSprite(ctx, x - s * 0.4, baseY - s * 0.02, s * 0.8, s * 0.12, s * 0.04); ctx.fill();
}

// ---- constituent: an angry citizen with a raised placard ----
function angryCitizen(ctx, x, y, s) {
  person(ctx, x, y, s, '#b04a3c');
  // raised placard on a stick (right hand up)
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + s * 0.28, y - s * 0.42); ctx.lineTo(x + s * 0.34, y - s * 1.3); ctx.stroke();
  ctx.fillStyle = '#efe9da';
  rrectSprite(ctx, x + s * 0.06, y - s * 1.66, s * 0.6, s * 0.36, s * 0.04); ctx.fill();
  ctx.strokeStyle = '#9a9484'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // angry red scrawl on the sign
  ctx.strokeStyle = '#c0281e'; ctx.lineWidth = Math.max(1, s * 0.04);
  for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(x + s * 0.14, y - s * (1.54 - i * 0.14)); ctx.lineTo(x + s * 0.58, y - s * (1.54 - i * 0.14)); ctx.stroke(); }
}

// ---- lightpole: a fallen utility pole lying across the road, lamp head ----
function fallenPole(ctx, x, y, s) {
  const grey = '#8a8f96', dark = '#5a5f66', lamp = '#cfd6dc';
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x, y + s * 0.06, s * 1.1, s * 0.12); ctx.fill();
  // the pole, lying diagonally
  ctx.save(); ctx.translate(x, y - s * 0.2); ctx.rotate(-0.18);
  rrectSprite(ctx, -s * 1.0, -s * 0.1, s * 1.8, s * 0.2, s * 0.08); ctx.fillStyle = grey; ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
  // length shading
  ctx.fillStyle = dark; ctx.fillRect(-s * 0.98, s * 0.0, s * 1.76, s * 0.08);
  // lamp head at one end (right)
  ctx.fillStyle = '#3a3f46';
  rrectSprite(ctx, s * 0.7, -s * 0.16, s * 0.34, s * 0.16, s * 0.04); ctx.fill();
  ctx.fillStyle = lamp;
  ctx.beginPath(); ctx.ellipse(s * 0.92, -s * 0.04, s * 0.14, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---- hustlerlunch: a hustler holding up a box-lunch food box ----
function boxLunchHustler(ctx, x, y, s) {
  person(ctx, x, y, s, '#d06a30');
  // styrofoam box-lunch held up in both hands
  ctx.fillStyle = '#eef0ee';
  rrectSprite(ctx, x - s * 0.26, y - s * 0.66, s * 0.52, s * 0.26, s * 0.05); ctx.fill();
  ctx.strokeStyle = '#b8bcb8'; ctx.lineWidth = Math.max(1, s * 0.035); ctx.stroke();
  // box lid seam
  ctx.strokeStyle = '#c8ccc8'; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.moveTo(x - s * 0.26, y - s * 0.55); ctx.lineTo(x + s * 0.26, y - s * 0.55); ctx.stroke();
  // a little steam rising
  ctx.strokeStyle = 'rgba(230,230,220,0.6)'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.lineCap = 'round';
  for (const dx of [-0.1, 0.08]) {
    ctx.beginPath();
    ctx.moveTo(x + s * dx, y - s * 0.7);
    ctx.quadraticCurveTo(x + s * (dx + 0.06), y - s * 0.82, x + s * dx, y - s * 0.94); ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

// ---- voter: a person holding up a ballot / "X" sign ----
function ballotVoter(ctx, x, y, s) {
  person(ctx, x, y, s, '#2a7f7f');
  // ballot card held up
  ctx.fillStyle = '#f4f1e6';
  rrectSprite(ctx, x - s * 0.02, y - s * 0.98, s * 0.42, s * 0.34, s * 0.04); ctx.fill();
  ctx.strokeStyle = '#b8b49c'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // a bold X marked on the ballot
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + s * 0.06, y - s * 0.92); ctx.lineTo(x + s * 0.32, y - s * 0.7);
  ctx.moveTo(x + s * 0.32, y - s * 0.92); ctx.lineTo(x + s * 0.06, y - s * 0.7); ctx.stroke();
  ctx.lineCap = 'butt';
}

// ---- contractor: a hard-hat worker holding a clipboard / invoice ----
function hardHatContractor(ctx, x, y, s) {
  person(ctx, x, y, s, '#caa65a');
  // yellow hard hat over the head
  ctx.fillStyle = '#e8c84a';
  ctx.beginPath(); ctx.arc(x, y - s * 1.14, s * 0.24, Math.PI, 0); ctx.fill();
  ctx.fillStyle = shadeColor('#e8c84a', 0.25);
  ctx.beginPath(); ctx.arc(x - s * 0.06, y - s * 1.2, s * 0.1, Math.PI, 0); ctx.fill();
  // brim
  ctx.fillStyle = shadeColor('#e8c84a', -0.2);
  ctx.beginPath(); ctx.ellipse(x, y - s * 1.14, s * 0.28, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  // centre ridge
  ctx.strokeStyle = shadeColor('#e8c84a', -0.3); ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.moveTo(x, y - s * 1.36); ctx.lineTo(x, y - s * 1.14); ctx.stroke();
  // clipboard / invoice in hand
  ctx.fillStyle = '#c89a4a';
  rrectSprite(ctx, x + s * 0.14, y - s * 0.66, s * 0.3, s * 0.36, s * 0.03); ctx.fill();
  ctx.fillStyle = '#f4f1e6';
  rrectSprite(ctx, x + s * 0.17, y - s * 0.63, s * 0.24, s * 0.3, s * 0.02); ctx.fill();
  ctx.strokeStyle = '#9a9484'; ctx.lineWidth = Math.max(1, s * 0.02);
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + s * 0.2, y - s * (0.56 - i * 0.08)); ctx.lineTo(x + s * 0.38, y - s * (0.56 - i * 0.08)); ctx.stroke(); }
}
