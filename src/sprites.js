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
    case 'bus': drawBus(ctx, sx, sy, s * 1.35); break;
    case 'coaster': drawCoaster(ctx, sx, sy, s * 1.15); break;
    case 'hustler': person(ctx, sx, sy, s, '#d06a30'); break;
    case 'jaywalker': drawJaywalker(ctx, sx, sy, s, seed); break;
    case 'beggar': drawBeggar(ctx, sx, sy, s); break;
    case 'vendor': drawVendor(ctx, sx, sy, s); break;
    case 'peanutcart': drawPeanutCart(ctx, sx, sy, s); break;
    case 'sunlight': drawSunlight(ctx, sx, sy, s, seed); break;
    case 'police': drawPolice(ctx, sx, sy, s); break;
    case 'wiper': wiperYouth(ctx, sx, sy, s, seed); break;
    case 'stall': roundedBar(ctx, sx, sy, s * 1.2, s * 0.8, '#7a4a22'); break;
    case 'water':  waterBottle(ctx, sx, sy, s); break;
    case 'tools':  hardwareTools(ctx, sx, sy, s, seed); break;
    case 'coffee': coffeeBag(ctx, sx, sy, s); break;
    case 'fruit':  drawFruit(ctx, sx, sy, s); break;
    // Drink pickups — soda cans vs spirit bottles by alcohol content
    case 'ting':       drinkCan(ctx, sx, sy, s, '#7ec850', '#5a9e30', 'T'); break;
    case 'boom':       drinkCan(ctx, sx, sy, s, '#161616', '#000000', 'B'); break;
    case 'redstripe':  drinkBottle(ctx, sx, sy, s, '#d12b1f', '#8a0f08', 'RS'); break;
    case 'whiterum':   drinkBottle(ctx, sx, sy, s, '#eef2f5', '#b0bcc8', 'WR'); break;
    case 'spirulina':  drinkBottle(ctx, sx, sy, s, '#1f8a4c', '#0f5a2e', 'SP'); break;
    case 'rootstonic': drinkBottle(ctx, sx, sy, s, '#7a4a22', '#4a2a10', 'RT'); break;
    // Di Politician's top-shelf bottles
    case 'henny':      drinkBottle(ctx, sx, sy, s, '#b5651d', '#6e3a0e', 'HN'); break;
    case 'rose':       drinkBottle(ctx, sx, sy, s, '#e89aa6', '#b35f6e', 'RO'); break;
    case 'whitewine':  drinkBottle(ctx, sx, sy, s, '#ece6b0', '#b8b070', 'WW'); break;
    case 'champagne':  drinkBottle(ctx, sx, sy, s, '#f7d873', '#c9a830', 'CH'); break;
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
    case 'constituent':  angryCitizen(ctx, sx, sy, s, seed); break;
    case 'lightpole':    fallenPole(ctx, sx, sy, s); break;
    case 'hustlerlunch': boxLunchHustler(ctx, sx, sy, s); break;
    case 'voter':        ballotVoter(ctx, sx, sy, s); break;
    case 'contractor':   hardHatContractor(ctx, sx, sy, s); break;
    // Politician GOOD money pickups
    case 'privatebribe': drawPrivateBribe(ctx, sx, sy, s); break;
    case 'ladynight':    drawLadyNight(ctx, sx, sy, s); break;
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
const BILL = {
  100: '#c0392b', 500: '#2a7fa0', 1000: '#6f3aa0', 5000: '#1f9a5a',
  // mega-bills — the politician deals in huge notes (rich, distinct colours)
  20000: '#4a2a8a',   // deep purple
  50000: '#1f8a8a',   // teal
  100000: '#a01f3a',  // crimson
  500000: '#a07a18',  // regal gold
};
const BILL_LABEL = {
  100: '100', 500: '500', 1000: '1K', 5000: '5K',
  20000: '20K', 50000: '50K', 100000: '100K', 500000: '500K',
};
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
    const label = BILL_LABEL[value] || String(value);
    // shrink the type a touch for longer labels (e.g. "100K"/"500K") so fat
    // mega-notes still read cleanly without the text overflowing the note
    const fontScale = label.length >= 4 ? 0.24 : 0.34;
    ctx.fillStyle = gilt ? '#f7d44a' : '#ffffff';
    ctx.font = '700 ' + Math.round(s * fontScale) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, x, cy);
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

// ---- JUTC bus: the big yellow vehicle() body, plus a Jamaican flag decal on the
// rear panel. The flag = gold saltire (X) splitting the field into four triangles:
// TOP & BOTTOM green, LEFT & RIGHT black, gold bands riding the diagonals.
function drawBus(ctx, x, y, s) {
  vehicle(ctx, x, y, s, '#e7c84a');
  // rear panel sits between the blue window (ends ~y-0.5s) and the dark bumper
  // (starts y-0.2s). Centre the flag on that band, on the lower-left of the panel.
  const fw = s * 0.5, fh = s * 0.3;
  const fx = x - fw * 0.5, fy = y - s * 0.46;
  drawJamaicanFlag(ctx, fx, fy, fw, fh, s);
}

// Paint a Jamaican flag decal into the rect (fx,fy,fw,fh). `s` gates detail so it
// degrades to a tiny green/gold/black emblem when very small.
function drawJamaicanFlag(ctx, fx, fy, fw, fh, s) {
  const green = '#1f9a44', black = '#101010', gold = '#f0c020';
  const cx = fx + fw * 0.5, cy = fy + fh * 0.5;
  // very small: a simple stacked emblem (green / gold / black) so it still "reads"
  if (s < 18) {
    ctx.fillStyle = green; ctx.fillRect(fx, fy, fw, fh);
    ctx.fillStyle = gold;  ctx.fillRect(fx, cy - fh * 0.16, fw, fh * 0.32);
    ctx.fillStyle = black; ctx.fillRect(fx, cy - fh * 0.05, fw, fh * 0.1);
    return;
  }
  // four triangles meeting at the centre — top/bottom green, left/right black
  ctx.fillStyle = green; // top
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + fw, fy); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(fx, fy + fh); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill(); // bottom
  ctx.fillStyle = black; // left
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy + fh); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(fx + fw, fy); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(cx, cy); ctx.closePath(); ctx.fill(); // right
  // gold saltire bands riding the two diagonals
  ctx.strokeStyle = gold; ctx.lineWidth = Math.max(1.5, fh * 0.18); ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(fx, fy); ctx.lineTo(fx + fw, fy + fh);
  ctx.moveTo(fx + fw, fy); ctx.lineTo(fx, fy + fh);
  ctx.stroke();
  // thin dark frame so the decal sits cleanly on the yellow body
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = Math.max(1, fh * 0.05);
  ctx.strokeRect(fx, fy, fw, fh);
}

// ---- Coaster bus: a chaotic, overloaded route minibus (white body), rear/3-quarter
// view. Passengers hang out the side windows; an open sliding door shows a conductor
// leaning out waving a fan of cash. Tilted slightly to read as in-a-hurry.
function drawCoaster(ctx, x, y, s) {
  // overall in-a-hurry lean — tip the whole bus a touch toward the viewer-right
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(0.06);

  const body = '#eef0f2', shade = '#c4c9cf', dark = '#1c1c20', glass = '#16242e';
  const bw = s * 1.15, bh = s * 0.95;      // body extents (rear panel)
  const bx = -bw * 0.5, by = -bh;          // top-left of the rear panel

  // ground shadow (under the leaned body)
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(0, s * 0.06, bw * 0.5, s * 0.12, 0, 0, Math.PI * 2); ctx.fill();

  // ---- main white body ----
  rrectSprite(ctx, bx, by, bw, bh, s * 0.1); ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // side wall in shadow (the 3-quarter "side" we see, on the viewer-left)
  ctx.fillStyle = shade;
  rrectSprite(ctx, bx, by + bh * 0.04, bw * 0.30, bh * 0.92, s * 0.08); ctx.fill();
  // dark skirt / bumper along the bottom
  ctx.fillStyle = dark; ctx.fillRect(bx, -s * 0.2, bw, s * 0.2);

  // ---- rear window band (back of the bus) ----
  ctx.fillStyle = glass;
  rrectSprite(ctx, bx + bw * 0.36, by + bh * 0.12, bw * 0.56, bh * 0.30, s * 0.05); ctx.fill();
  // rear destination/route board over the window
  ctx.fillStyle = '#d8b43a'; ctx.fillRect(bx + bw * 0.40, by + bh * 0.04, bw * 0.46, bh * 0.07);

  // ---- side window strip (viewer-left), with PASSENGERS hanging out ----
  const winY = by + bh * 0.18, winH = bh * 0.26;
  ctx.fillStyle = glass;
  rrectSprite(ctx, bx + bw * 0.04, winY, bw * 0.28, winH, s * 0.04); ctx.fill();
  // mullions splitting it into a couple of panes
  ctx.strokeStyle = body; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath();
  ctx.moveTo(bx + bw * 0.14, winY); ctx.lineTo(bx + bw * 0.14, winY + winH);
  ctx.moveTo(bx + bw * 0.23, winY); ctx.lineTo(bx + bw * 0.23, winY + winH); ctx.stroke();
  // a couple of heads + an arm poking out of the windows
  coasterPassenger(ctx, bx + bw * 0.09, winY + winH * 0.5, s, '#7a4a28', '#c0392b', true);
  coasterPassenger(ctx, bx + bw * 0.19, winY + winH * 0.45, s, '#6a4424', '#2a7f7f', false);

  // ---- OPEN sliding door on the side (dark gap) toward the rear of the strip ----
  const dx0 = bx + bw * 0.30, dyTop = by + bh * 0.16, dw = bw * 0.16, dh = bh * 0.66;
  ctx.fillStyle = '#0a0a0c'; // the dark open doorway
  rrectSprite(ctx, dx0, dyTop, dw, dh, s * 0.03); ctx.fill();
  // the slid-open door panel, parked just behind the opening (slight white edge)
  ctx.fillStyle = shade; ctx.fillRect(dx0 - s * 0.04, dyTop, s * 0.04, dh);

  // ---- CONDUCTOR leaning out of the doorway, waving a fan of cash ----
  drawConductorInDoor(ctx, dx0 + dw * 0.5, dyTop + dh * 0.42, s);

  // ---- wheels + a little tail-light to keep it a road vehicle ----
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(bx + bw * 0.22, 0, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bx + bw * 0.80, 0, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d23a2a'; ctx.fillRect(bx + bw * 0.84, -s * 0.16, s * 0.12, s * 0.1);

  ctx.restore();
}

// A passenger head (+ optional waving arm) leaning out of a coaster window.
function coasterPassenger(ctx, hx, hy, s, skin, shirt, arm) {
  // head
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(hx, hy, s * 0.11, 0, Math.PI * 2); ctx.fill();
  // hair cap
  ctx.fillStyle = '#1c1208';
  ctx.beginPath(); ctx.arc(hx, hy - s * 0.02, s * 0.11, Math.PI, 0); ctx.fill();
  // shoulder / shirt below the sill
  ctx.fillStyle = shirt;
  rrectSprite(ctx, hx - s * 0.1, hy + s * 0.06, s * 0.2, s * 0.14, s * 0.04); ctx.fill();
  // an arm flung out the window
  if (arm) {
    ctx.strokeStyle = skin; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(hx + s * 0.06, hy + s * 0.06);
    ctx.quadraticCurveTo(hx + s * 0.18, hy - s * 0.06, hx + s * 0.22, hy - s * 0.18);
    ctx.stroke();
    ctx.lineCap = 'butt';
  }
}

// The conductor leaning out of the open door, one hand fanning a spread of banknotes.
function drawConductorInDoor(ctx, cxk, cyk, s) {
  const skin = '#5a3a20', shirt = '#d8a23a', shirtShade = '#a8771f';
  // torso leaning out of the doorway (tilted toward the road)
  ctx.save();
  ctx.translate(cxk, cyk);
  ctx.rotate(0.25);
  ctx.fillStyle = shirt;
  rrectSprite(ctx, -s * 0.12, -s * 0.18, s * 0.26, s * 0.4, s * 0.05); ctx.fill();
  ctx.fillStyle = shirtShade;
  rrectSprite(ctx, s * 0.02, -s * 0.16, s * 0.1, s * 0.36, s * 0.04); ctx.fill();
  // head
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, -s * 0.26, s * 0.12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#15110a';
  ctx.beginPath(); ctx.arc(0, -s * 0.28, s * 0.12, Math.PI, 0); ctx.fill();
  // arm reaching out, fanning the cash
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.08); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, -s * 0.06);
  ctx.quadraticCurveTo(-s * 0.28, -s * 0.04, -s * 0.4, -s * 0.18);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // a spread fan of banknotes at the hand (small green/tan note shapes)
  const handX = -s * 0.42, handY = -s * 0.2;
  const notes = ['#2f8a4a', '#3f9a5a', '#c9b486', '#2f8a4a'];
  for (let i = 0; i < notes.length; i++) {
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(-0.9 + i * 0.32);     // fan them out
    ctx.fillStyle = notes[i];
    rrectSprite(ctx, 0, -s * 0.05, s * 0.26, s * 0.11, s * 0.02); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = Math.max(0.6, s * 0.012);
    rrectSprite(ctx, 0, -s * 0.05, s * 0.26, s * 0.11, s * 0.02); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
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

// ---- fruit: a vendor's mango with a banana behind it — bright market fruit ----
function drawFruit(ctx, x, y, s) {
  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.5, s * 0.1); ctx.fill();
  // banana arc tucked behind
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#f2c233'; ctx.lineWidth = Math.max(2, s * 0.16);
  ctx.beginPath(); ctx.arc(x + s * 0.04, y - s * 0.16, s * 0.42, Math.PI * 1.12, Math.PI * 1.96); ctx.stroke();
  // mango body (front, tilted oval)
  ctx.fillStyle = '#f2992a';
  ctx.beginPath(); ctx.ellipse(x - s * 0.06, y - s * 0.30, s * 0.34, s * 0.27, -0.35, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c06a12'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // ruddy blush + sheen
  ctx.fillStyle = 'rgba(220,70,40,0.55)';
  ctx.beginPath(); ctx.ellipse(x - s * 0.16, y - s * 0.40, s * 0.13, s * 0.1, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.ellipse(x + s * 0.0, y - s * 0.40, s * 0.07, s * 0.04, -0.4, 0, Math.PI * 2); ctx.fill();
  // green leaf + stem on top
  ctx.strokeStyle = '#3a7a28'; ctx.lineWidth = Math.max(1, s * 0.035);
  ctx.beginPath(); ctx.moveTo(x + s * 0.06, y - s * 0.5); ctx.lineTo(x + s * 0.12, y - s * 0.62); ctx.stroke();
  ctx.fillStyle = '#4a9a34';
  ctx.beginPath(); ctx.ellipse(x + s * 0.2, y - s * 0.64, s * 0.12, s * 0.06, 0.5, 0, Math.PI * 2); ctx.fill();
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

// ---- pork (drawn as BACON): a couple of wavy streaky-bacon rashers ----
function porkCut(ctx, x, y, s) {
  const meat = '#c0503f', meatDk = '#9a3a2c', fat = '#f3d9cf';
  const w = s * 0.92, th = s * 0.22;
  const wave = (t) => Math.sin(t * Math.PI * 3) * s * 0.05;   // gentle ripple along each strip
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.02, y + s * 0.06, s * 0.52, s * 0.08); ctx.fill();
  // two stacked rashers (back one sits higher/left so they read as a pile)
  for (let r = 0; r < 2; r++) {
    const oy = y - s * 0.16 - r * s * 0.28;
    const left = x - r * s * 0.05 - w * 0.5;
    // strip body: wavy top edge across, wavy bottom edge back
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) { const t = i / 10, px = left + w * t, py = oy + wave(t); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    for (let i = 10; i >= 0; i--) { const t = i / 10; ctx.lineTo(left + w * t, oy + th + wave(t)); }
    ctx.closePath();
    ctx.fillStyle = meat; ctx.fill();
    ctx.strokeStyle = meatDk; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
    // streaky pale-fat ribbons running the length (what makes it read as bacon)
    ctx.strokeStyle = fat; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
    for (const fy of [0.32, 0.68]) {
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const t = i / 10, px = left + w * t, py = oy + th * fy + wave(t); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
  }
}

// A knock-down reaction drawn at the cart plane — the consequence of reckless driving,
// shown WITHOUT gore (this is a teaching tool, not a shock piece): an impact dust puff and
// a dazed, knocked-over figure "seeing stars". `t` = seconds remaining (~0.7→0); prog runs
// 0 (impact) →1 (settled). `variation` picks one of several micro-reactions; `cat` is
// 'pedestrian' or 'animal'.
export function drawRoadkill(ctx, x, y, s, variation, cat, t) {
  const prog = Math.max(0, Math.min(1, 1 - (t || 0) / 0.7));
  const v = ((variation % 4) + 4) % 4;
  ctx.save();
  // impact dust puff — a soft tan/grey cloud that expands and fades (no blood)
  const puff = s * (0.3 + 0.5 * prog);
  ctx.save();
  ctx.globalAlpha = 0.5 * (1 - prog * 0.7);
  ctx.fillStyle = '#b6ac96';
  for (let i = 0; i < 4; i++) {
    const a = i * 1.6 + v;
    ctx.beginPath(); ctx.arc(x + Math.cos(a) * puff * 0.7, y + s * 0.06 + Math.sin(a) * puff * 0.3, puff * (0.36 + 0.14 * i), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  if (cat === 'animal') {
    // an animal knocked onto its side, legs out — startled, not gory
    ctx.fillStyle = '#7a5a36';
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.02, s * 0.42, s * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4a3420'; ctx.lineWidth = Math.max(1.5, s * 0.07); ctx.lineCap = 'round';
    for (const dx of [-0.18, 0.0, 0.18]) {
      ctx.beginPath(); ctx.moveTo(x + s * dx, y - s * 0.08); ctx.lineTo(x + s * dx + s * 0.06, y - s * 0.34); ctx.stroke();
    }
    ctx.lineCap = 'butt'; ctx.restore(); return;
  }

  // a person knocked down — intact, sitting up dazed, arms thrown up (the flailing hands)
  const skin = '#7a4a28', shirt = '#3f7a9a';
  const tilt = [-0.4, 0.2, 0.7, -0.8][v];
  const armsUp = v % 2 === 0;
  const flail = Math.sin(prog * Math.PI * 5) * 0.35 * (1 - prog * 0.6);
  ctx.translate(x, y - s * 0.02);
  ctx.rotate(tilt * 0.28);
  // torso (sat/knocked back)
  ctx.fillStyle = shirt;
  rrect(ctx, -s * 0.26, -s * 0.18, s * 0.52, s * 0.3, s * 0.08); ctx.fill();
  // legs splayed out
  ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(s * 0.18, 0.02 * s); ctx.lineTo(s * 0.5, s * 0.16 + flail * s * 0.18);
  ctx.moveTo(s * 0.18, s * 0.06); ctx.lineTo(s * 0.52, -s * 0.06 - flail * s * 0.18);
  ctx.stroke();
  // arms — up & flailing (even) or flung to the side (odd)
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.09);
  ctx.beginPath();
  if (armsUp) {
    ctx.moveTo(-s * 0.16, -s * 0.1); ctx.lineTo(-s * 0.3, -s * 0.5 + flail * s * 0.18);
    ctx.moveTo(-s * 0.08, -s * 0.1); ctx.lineTo(-s * 0.02, -s * 0.54 - flail * s * 0.18);
  } else {
    ctx.moveTo(-s * 0.16, -s * 0.08); ctx.lineTo(-s * 0.48, -s * 0.2 + flail * s * 0.2);
    ctx.moveTo(-s * 0.1, s * 0.04);   ctx.lineTo(-s * 0.42, s * 0.18);
  }
  ctx.stroke(); ctx.lineCap = 'butt';
  // head + hair (no blood)
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.06, s * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1c1208'; ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.1, s * 0.13, Math.PI, 0); ctx.fill();
  // dazed "seeing stars" circling the head — a cartoon ouch, not gore
  ctx.fillStyle = '#f0c020';
  for (let k = 0; k < 3; k++) {
    const a = prog * 6 + k * 2.1;
    star(ctx, -s * 0.3 + Math.cos(a) * s * 0.24, -s * 0.3 + Math.sin(a) * s * 0.12, s * 0.05);
  }
  ctx.restore();
}

// A tiny 4-point sparkle/star (for the dazed "seeing stars" effect).
function star(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, rr = i % 2 ? r * 0.4 : r;
    const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.fill();
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

// ---- constituent: an angry citizen with a raised placard, wearing party
// colours — GREEN (#1f9a44, JLP) or ORANGE (#e8821e, PNP). A seed-based coin
// flip picks the colour per spawn so a mix appears on the road.
function angryCitizen(ctx, x, y, s, seed) {
  const flip = mulberry32(Math.floor((seed || 0.137) * 2147483647) ^ 0x9c0a)();
  const shirt = flip < 0.5 ? '#1f9a44' : '#e8821e';
  person(ctx, x, y, s, shirt);
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

// ============================================================================
// New Kingston street characters + a sun-glare hazard (New Kingston set)
// ============================================================================

// ---- jaywalker: a pedestrian caught MID-STRIDE crossing the road. Same 12-bit
// person build, but the legs are split into a walking gait (one forward, one
// back), the arms swing in opposition, and the whole figure leans forward so it
// clearly reads as someone walking across — not standing. Seed nudges the pose.
function drawJaywalker(ctx, x, y, s, seed) {
  const rnd = mulberry32(Math.floor((seed || 0.137) * 2147483647) ^ 0x4a17);
  const color = '#3a6ea5';
  const shade = shadeColor(color, -0.35), hi = shadeColor(color, 0.3);
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';
  // seed-driven stride: how far the front foot reaches, plus a small lean
  const stride = s * (0.16 + rnd() * 0.08);
  const lean = (0.06 + rnd() * 0.05);  // forward tilt in radians (toward viewer-right)

  ctx.save();
  ctx.translate(x, y - s * 0.36);  // pivot near the hips so the lean swings the upper body
  ctx.rotate(lean);
  ctx.translate(-x, -(y - s * 0.36));

  // walking legs — front leg swung forward, back leg trailing behind (thigh + shin)
  ctx.strokeStyle = shade; ctx.lineWidth = Math.max(2, s * 0.12); ctx.lineCap = 'round';
  const hipY = y - s * 0.38;
  // back (trailing) leg — knee bent, foot lifted behind
  ctx.beginPath();
  ctx.moveTo(x - s * 0.04, hipY);
  ctx.quadraticCurveTo(x - stride * 0.7, hipY + s * 0.18, x - stride, y - s * 0.02);
  ctx.stroke();
  // front (leading) leg — reaching ahead, foot planted forward
  ctx.beginPath();
  ctx.moveTo(x + s * 0.02, hipY);
  ctx.quadraticCurveTo(x + stride * 0.6, hipY + s * 0.16, x + stride, y);
  ctx.stroke();

  // torso — base, tucked just above the hips
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x - s * 0.2, y - s * 0.88, s * 0.4, s * 0.52, s * 0.06); ctx.fill();
  ctx.fillStyle = shade;
  ctx.beginPath(); ctx.roundRect(x + s * 0.04, y - s * 0.86, s * 0.14, s * 0.48, s * 0.04); ctx.fill();
  ctx.fillStyle = hi;
  ctx.beginPath(); ctx.roundRect(x - s * 0.18, y - s * 0.86, s * 0.08, s * 0.44, s * 0.04); ctx.fill();

  // swinging arms in OPPOSITION to the legs — front arm back, back arm forward
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  // leading-side arm swings BACK
  ctx.beginPath();
  ctx.moveTo(x + s * 0.16, y - s * 0.82);
  ctx.quadraticCurveTo(x + s * 0.34, y - s * 0.66, x + s * 0.30, y - s * 0.44);
  ctx.stroke();
  // trailing-side arm swings FORWARD (across the front)
  ctx.beginPath();
  ctx.moveTo(x - s * 0.16, y - s * 0.82);
  ctx.quadraticCurveTo(x - s * 0.30, y - s * 0.62, x - s * 0.18, y - s * 0.46);
  ctx.stroke();

  // neck + head (round)
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.07, y - s * 1.02, s * 0.14, s * 0.18);
  ctx.beginPath(); ctx.arc(x, y - s * 1.08, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 1.14, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinHi; ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 1.04, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = skinShadow; ctx.fill();
  if (s >= 14) {
    ctx.fillStyle = '#1a0a04';
    ctx.beginPath(); ctx.arc(x - s * 0.08, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.04, y - s * 1.1, Math.max(1, s * 0.04), 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ---- beggar: a crippled man in a manual WHEELCHAIR — two big spoked side wheels,
// a small front caster, a seated figure with a blanket over the legs and one hand
// out asking. Muted clothing. A New Kingston street fixture.
function drawBeggar(ctx, x, y, s) {
  const cloth = '#6a6356', clothShade = shadeColor('#6a6356', -0.3);
  const blanket = '#7d4a2e', blanketShade = '#5a3320';
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';
  const metal = '#5a5e63', metalHi = '#9aa0a6', tyre = '#1c1c1e', spoke = '#b8bcc0';
  const wheelR = s * 0.42, wheelCY = y - wheelR;     // big drive wheel sits on the ground
  const wheelCX = x + s * 0.06;                       // wheel centred slightly behind seat

  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipsePath(ctx, x, y + s * 0.04, s * 0.7, s * 0.11); ctx.fill();

  // small front caster wheel (ahead/left of the figure)
  ctx.fillStyle = '#3a3d41';
  ctx.beginPath(); ctx.arc(x - s * 0.46, y - s * 0.16, s * 0.14, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = metalHi;
  ctx.beginPath(); ctx.arc(x - s * 0.46, y - s * 0.16, s * 0.05, 0, Math.PI * 2); ctx.fill();
  // caster fork up to the frame
  ctx.strokeStyle = metal; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.46, y - s * 0.3); ctx.lineTo(x - s * 0.3, y - s * 0.52); ctx.stroke();

  // seated figure: lower body under a blanket (rounded lap mound)
  ctx.fillStyle = blanket;
  rrectSprite(ctx, x - s * 0.36, y - s * 0.7, s * 0.6, s * 0.34, s * 0.1); ctx.fill();
  ctx.fillStyle = blanketShade;
  rrectSprite(ctx, x - s * 0.36, y - s * 0.46, s * 0.6, s * 0.1, s * 0.06); ctx.fill();
  // blanket fold lines
  if (s >= 14) {
    ctx.strokeStyle = blanketShade; ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath(); ctx.moveTo(x - s * 0.22, y - s * 0.68); ctx.lineTo(x - s * 0.16, y - s * 0.4);
    ctx.moveTo(x + s * 0.02, y - s * 0.68); ctx.lineTo(x + s * 0.06, y - s * 0.4); ctx.stroke();
  }

  // torso (muted shirt) rising from the seat
  ctx.fillStyle = cloth;
  ctx.beginPath(); ctx.roundRect(x - s * 0.22, y - s * 1.04, s * 0.42, s * 0.4, s * 0.06); ctx.fill();
  ctx.fillStyle = clothShade;
  ctx.beginPath(); ctx.roundRect(x + s * 0.02, y - s * 1.02, s * 0.16, s * 0.36, s * 0.04); ctx.fill();

  // outstretched begging arm reaching forward/out (palm up, toward viewer-left)
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.18, y - s * 0.96);
  ctx.quadraticCurveTo(x - s * 0.48, y - s * 0.86, x - s * 0.6, y - s * 0.72);
  ctx.stroke();
  // open hand / cupped palm at the end
  ctx.fillStyle = skinHi;
  ctx.beginPath(); ctx.arc(x - s * 0.62, y - s * 0.7, s * 0.08, 0, Math.PI * 2); ctx.fill();

  // neck + head
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.06, y - s * 1.14, s * 0.12, s * 0.14);
  ctx.beginPath(); ctx.arc(x, y - s * 1.2, s * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  ctx.beginPath(); ctx.arc(x - s * 0.06, y - s * 1.25, s * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = skinHi; ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.06, y - s * 1.16, s * 0.09, 0, Math.PI * 2);
  ctx.fillStyle = skinShadow; ctx.fill();
  if (s >= 14) {
    ctx.fillStyle = '#1a0a04';
    ctx.beginPath(); ctx.arc(x - s * 0.07, y - s * 1.22, Math.max(1, s * 0.035), 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.03, y - s * 1.22, Math.max(1, s * 0.035), 0, Math.PI * 2); ctx.fill();
  }

  // chair back-post + push handle behind the figure
  ctx.strokeStyle = metal; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + s * 0.2, y - s * 0.5); ctx.lineTo(x + s * 0.24, y - s * 1.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + s * 0.24, y - s * 1.1); ctx.lineTo(x + s * 0.34, y - s * 1.1); ctx.stroke();

  // BIG drive wheel (drawn over the body so it reads as the near-side wheel)
  ctx.fillStyle = tyre;
  ctx.beginPath(); ctx.arc(wheelCX, wheelCY, wheelR, 0, Math.PI * 2); ctx.fill();
  // inner hub face
  ctx.fillStyle = '#2a2c2e';
  ctx.beginPath(); ctx.arc(wheelCX, wheelCY, wheelR * 0.82, 0, Math.PI * 2); ctx.fill();
  // spokes radiating from the hub
  ctx.strokeStyle = spoke; ctx.lineWidth = Math.max(1, s * 0.03);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(wheelCX, wheelCY);
    ctx.lineTo(wheelCX + Math.cos(a) * wheelR * 0.78, wheelCY + Math.sin(a) * wheelR * 0.78);
    ctx.stroke();
  }
  // chrome hub
  ctx.fillStyle = metalHi;
  ctx.beginPath(); ctx.arc(wheelCX, wheelCY, wheelR * 0.16, 0, Math.PI * 2); ctx.fill();
  // outer hand-rim (the smaller push ring beside the tyre)
  ctx.strokeStyle = metal; ctx.lineWidth = Math.max(1.5, s * 0.04);
  ctx.beginPath(); ctx.arc(wheelCX, wheelCY, wheelR * 0.92, 0, Math.PI * 2); ctx.stroke();
}

// ---- vendor: a man selling flowers & fruit — standing figure holding a tray of
// produce: red ROSES, little round green GUINEP clusters, and pinkish-red
// pear-shaped OTAHEITE APPLES. Bright and lively. New Kingston street seller.
function drawVendor(ctx, x, y, s) {
  // the man himself (warm casual shirt)
  person(ctx, x, y, s, '#1f7a5a');

  // a shallow woven tray held out in front, at waist height
  const tw = s * 0.86, th = s * 0.22, tx = x - tw * 0.5, ty = y - s * 0.6;
  ctx.fillStyle = '#9a6b34';            // straw/wood tray
  rrectSprite(ctx, tx, ty, tw, th, th * 0.4); ctx.fill();
  ctx.fillStyle = shadeColor('#9a6b34', -0.25);
  rrectSprite(ctx, tx, ty + th * 0.55, tw, th * 0.5, th * 0.3); ctx.fill();
  ctx.strokeStyle = '#6a4720'; ctx.lineWidth = Math.max(1, s * 0.03);
  rrectSprite(ctx, tx, ty, tw, th, th * 0.4); ctx.stroke();
  // woven texture hint
  if (s >= 14) {
    ctx.strokeStyle = 'rgba(60,40,16,0.4)'; ctx.lineWidth = Math.max(1, s * 0.02);
    for (const t of [0.25, 0.5, 0.75]) {
      ctx.beginPath(); ctx.moveTo(tx + tw * t, ty + th * 0.1); ctx.lineTo(tx + tw * t, ty + th * 0.9); ctx.stroke();
    }
  }

  // hands cupping the tray so it reads as "held"
  ctx.fillStyle = '#a87050';
  ctx.beginPath(); ctx.arc(tx + s * 0.02, ty + th * 0.5, s * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(tx + tw - s * 0.02, ty + th * 0.5, s * 0.06, 0, Math.PI * 2); ctx.fill();

  // ---- produce heaped on the tray (drawn above the tray lip) ----
  const topY = ty - s * 0.02;
  // red ROSES (left) — a couple of layered red blooms on short green stems
  for (const rx of [tx + tw * 0.12, tx + tw * 0.26]) {
    ctx.strokeStyle = '#2f7a3a'; ctx.lineWidth = Math.max(1, s * 0.035); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(rx, ty + th * 0.4); ctx.lineTo(rx, topY - s * 0.1); ctx.stroke();
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.arc(rx, topY - s * 0.16, s * 0.1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shadeColor('#c0392b', 0.2);
    ctx.beginPath(); ctx.arc(rx - s * 0.02, topY - s * 0.18, s * 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shadeColor('#c0392b', -0.3);
    ctx.beginPath(); ctx.arc(rx + s * 0.03, topY - s * 0.12, s * 0.03, 0, Math.PI * 2); ctx.fill();
  }

  // green GUINEP clusters (centre) — little knots of round green berries
  const gx = tx + tw * 0.5;
  for (const [ox, oy] of [[-0.05, -0.04], [0.05, -0.06], [0, -0.12], [-0.02, -0.16], [0.06, -0.14]]) {
    ctx.fillStyle = '#4f8f2a';
    ctx.beginPath(); ctx.arc(gx + s * ox, topY + s * oy, s * 0.055, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = shadeColor('#4f8f2a', 0.22);
    ctx.beginPath(); ctx.arc(gx + s * ox - s * 0.015, topY + s * oy - s * 0.015, s * 0.022, 0, Math.PI * 2); ctx.fill();
  }

  // pinkish-red OTAHEITE APPLES (right) — pear-shaped, fat bottom narrowing up
  for (const ax of [tx + tw * 0.74, tx + tw * 0.88]) {
    ctx.fillStyle = '#d23a5a';
    ctx.beginPath();
    ctx.moveTo(ax, topY - s * 0.26);                       // narrow stem top
    ctx.bezierCurveTo(ax - s * 0.12, topY - s * 0.18, ax - s * 0.11, topY + s * 0.02, ax, topY + s * 0.02);
    ctx.bezierCurveTo(ax + s * 0.11, topY + s * 0.02, ax + s * 0.12, topY - s * 0.18, ax, topY - s * 0.26);
    ctx.closePath(); ctx.fill();
    // glossy highlight + a tiny stem
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(ax - s * 0.03, topY - s * 0.12, s * 0.03, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = Math.max(1, s * 0.025);
    ctx.beginPath(); ctx.moveTo(ax, topY - s * 0.26); ctx.lineTo(ax + s * 0.02, topY - s * 0.32); ctx.stroke();
  }
}

// ---- peanutcart: a man pushing a little WHISTLING peanut cart — a two-wheeled
// push-cart with a domed lid, a small chimney/whistle puffing steam, the side
// labelled "PEANUTS", and a man pushing from behind.
function drawPeanutCart(ctx, x, y, s) {
  const cart = '#b5651d', cartShade = shadeColor('#b5651d', -0.3), cartHi = shadeColor('#b5651d', 0.25);
  const dome = '#cf7a2a', metal = '#8a8f96';
  const skin = '#7a5030', skinHi = '#a87050', skinShadow = '#4a2e14';
  const shirt = '#d8d2c4', shirtShade = shadeColor('#d8d2c4', -0.25);

  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipsePath(ctx, x - s * 0.1, y + s * 0.04, s * 0.78, s * 0.11); ctx.fill();

  // ---- the pushing man (behind, toward viewer-right) ----
  const mx = x + s * 0.62;
  // legs
  ctx.fillStyle = '#3a3a44';
  ctx.fillRect(mx - s * 0.1, y - s * 0.38, s * 0.09, s * 0.38);
  ctx.fillRect(mx + s * 0.04, y - s * 0.38, s * 0.09, s * 0.38);
  // torso leaning forward into the push
  ctx.save();
  ctx.translate(mx, y - s * 0.5);
  ctx.rotate(-0.22);
  ctx.fillStyle = shirt;
  ctx.beginPath(); ctx.roundRect(-s * 0.18, -s * 0.4, s * 0.36, s * 0.48, s * 0.06); ctx.fill();
  ctx.fillStyle = shirtShade;
  ctx.beginPath(); ctx.roundRect(-s * 0.02, -s * 0.38, s * 0.14, s * 0.44, s * 0.04); ctx.fill();
  ctx.restore();
  // pushing arm reaching to the cart handle
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mx - s * 0.1, y - s * 0.78);
  ctx.quadraticCurveTo(mx - s * 0.34, y - s * 0.66, mx - s * 0.5, y - s * 0.58);
  ctx.stroke();
  // head
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(mx + s * 0.04, y - s * 1.02, s * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinHi;
  ctx.beginPath(); ctx.arc(mx - s * 0.02, y - s * 1.07, s * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinShadow;
  ctx.beginPath(); ctx.arc(mx + s * 0.1, y - s * 0.98, s * 0.09, 0, Math.PI * 2); ctx.fill();

  // ---- the cart body (in front of the man) ----
  const cw = s * 0.92, ch = s * 0.5, cbx = x - cw * 0.55, cby = y - s * 0.66;
  // cart handle running back to the man
  ctx.strokeStyle = metal; ctx.lineWidth = Math.max(2, s * 0.06); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cbx + cw, cby + ch * 0.3); ctx.lineTo(mx - s * 0.46, y - s * 0.56); ctx.stroke();
  // box body
  rrectSprite(ctx, cbx, cby, cw, ch, s * 0.06); ctx.fillStyle = cart; ctx.fill();
  ctx.strokeStyle = cartShade; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // lighter top edge + darker base band
  ctx.fillStyle = cartHi; ctx.fillRect(cbx + cw * 0.04, cby + ch * 0.06, cw * 0.92, ch * 0.12);
  ctx.fillStyle = cartShade; ctx.fillRect(cbx, cby + ch * 0.74, cw, ch * 0.26);
  // "PEANUTS" labelled on the side
  if (s >= 14) {
    ctx.fillStyle = '#f4ead0'; ctx.font = '700 ' + Math.round(s * 0.16) + 'px "Courier New", monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('PEANUTS', x - cw * 0.05, cby + ch * 0.46);
  }

  // domed lid on top of the cart
  ctx.fillStyle = dome;
  ctx.beginPath(); ctx.ellipse(x - cw * 0.05, cby, cw * 0.34, ch * 0.34, 0, Math.PI, 0); ctx.fill();
  ctx.strokeStyle = cartShade; ctx.lineWidth = Math.max(1, s * 0.035);
  ctx.beginPath(); ctx.ellipse(x - cw * 0.05, cby, cw * 0.34, ch * 0.34, 0, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.ellipse(x - cw * 0.12, cby - ch * 0.06, cw * 0.12, ch * 0.1, 0, Math.PI, 0); ctx.fill();

  // little chimney / whistle on the dome
  const chx = x - cw * 0.05, chTop = cby - ch * 0.34;
  ctx.fillStyle = metal;
  rrectSprite(ctx, chx - s * 0.05, chTop - s * 0.18, s * 0.1, s * 0.2, s * 0.02); ctx.fill();
  ctx.fillStyle = '#c0c4c8';
  rrectSprite(ctx, chx - s * 0.07, chTop - s * 0.2, s * 0.14, s * 0.05, s * 0.02); ctx.fill();
  // a wisp of steam curling up from the whistle
  ctx.strokeStyle = 'rgba(235,235,228,0.7)'; ctx.lineWidth = Math.max(1, s * 0.035); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(chx, chTop - s * 0.2);
  ctx.quadraticCurveTo(chx - s * 0.12, chTop - s * 0.34, chx + s * 0.02, chTop - s * 0.46);
  ctx.quadraticCurveTo(chx + s * 0.14, chTop - s * 0.58, chx - s * 0.02, chTop - s * 0.7);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // two cart wheels (near side shown)
  ctx.fillStyle = '#1c1c1e';
  ctx.beginPath(); ctx.arc(cbx + cw * 0.26, y - s * 0.02, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cbx + cw * 0.74, y - s * 0.02, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = metal;
  ctx.beginPath(); ctx.arc(cbx + cw * 0.26, y - s * 0.02, s * 0.05, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cbx + cw * 0.74, y - s * 0.02, s * 0.05, 0, Math.PI * 2); ctx.fill();
}

// ---- sunlight: a fierce patch of blazing sun-glare lying on the road. A hot
// white-gold core with radiating gold rays and a shimmer — a HAZARD (it burns
// the Bleachaz Conductor), not a pickup. Seed jitters the ray lengths.
function drawSunlight(ctx, x, y, s, seed) {
  const rnd = mulberry32(Math.floor((seed || 0.2) * 2147483647) ^ 0x5a07);
  const core = '#fff3c0', ray = '#f0c020', hot = '#ffd84a';
  const cy = y - s * 0.34;             // sit the glare just off the road surface
  const R = s * 0.62;

  // a hot wash on the asphalt under the glare (warm radial bloom)
  ctx.fillStyle = 'rgba(255,210,80,0.22)';
  ellipsePath(ctx, x, y - s * 0.04, s * 0.95, s * 0.32); ctx.fill();

  // radiating gold rays (alternating long/short, seed-jittered) behind the core
  ctx.strokeStyle = ray; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.lineCap = 'round';
  const rays = 12;
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2;
    const len = R * ((i % 2 ? 1.5 : 1.18) + (rnd() - 0.5) * 0.3);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * R * 0.6, cy + Math.sin(a) * R * 0.6 * 0.5);   // squash vertically (road plane)
    ctx.lineTo(x + Math.cos(a) * len, cy + Math.sin(a) * len * 0.5);
    ctx.stroke();
  }

  // hot outer glow ring
  ctx.fillStyle = 'rgba(255,200,40,0.5)';
  ctx.beginPath(); ctx.ellipse(x, cy, R * 0.7, R * 0.7 * 0.62, 0, 0, Math.PI * 2); ctx.fill();
  // blazing core
  ctx.fillStyle = hot;
  ctx.beginPath(); ctx.ellipse(x, cy, R * 0.5, R * 0.5 * 0.62, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.ellipse(x, cy, R * 0.34, R * 0.34 * 0.62, 0, 0, Math.PI * 2); ctx.fill();
  // white-hot centre point
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(x - s * 0.04, cy - s * 0.03, R * 0.16, R * 0.12, 0, 0, Math.PI * 2); ctx.fill();

  // a couple of sharp shimmer glints (heat-haze sparkle), only when big enough
  if (s >= 14) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = Math.max(1, s * 0.04);
    for (const [gx, gy, gl] of [[0.34, -0.18, 0.18], [-0.4, 0.1, 0.14]]) {
      const px = x + s * gx, py = cy + s * gy;
      ctx.beginPath(); ctx.moveTo(px - s * gl, py); ctx.lineTo(px + s * gl, py);
      ctx.moveTo(px, py - s * gl); ctx.lineTo(px, py + s * gl); ctx.stroke();
    }
  }
}

// ============================================================================
// Politician GOOD money pickups (Private-Sector Bribe, Lady of di Night)
// ============================================================================

// ---- privatebribe: an open briefcase STUFFED with banded cash bundles — a
// shady backhander. Brown leather case (#6a4a2a) packed with green banknotes
// (#1f9a4c), a $ hint, and a subtle gold glint to read as a coveted money pickup.
function drawPrivateBribe(ctx, x, y, s) {
  const cash = '#1f9a4c', cashHi = shadeColor('#1f9a4c', 0.22), cashShade = shadeColor('#1f9a4c', -0.3);
  const leather = '#6a4a2a', leatherShade = shadeColor('#6a4a2a', -0.3), leatherHi = shadeColor('#6a4a2a', 0.2);
  const band = '#e8d8a0';
  const cw = s * 1.04, ch = s * 0.6, cbx = x - cw * 0.5, cby = y - ch * 0.92;

  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ellipsePath(ctx, x, cby + ch + s * 0.06, cw * 0.52, s * 0.1); ctx.fill();

  // ---- open lid standing up behind the case ----
  ctx.save();
  ctx.translate(cbx + cw * 0.5, cby);
  ctx.rotate(-0.16);
  rrectSprite(ctx, -cw * 0.5, -ch * 0.78, cw, ch * 0.78, s * 0.06);
  ctx.fillStyle = leatherShade; ctx.fill();
  ctx.strokeStyle = leather; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // soft satin lining inside the lid
  ctx.fillStyle = leatherHi;
  rrectSprite(ctx, -cw * 0.42, -ch * 0.68, cw * 0.84, ch * 0.56, s * 0.05); ctx.fill();
  ctx.restore();

  // ---- lower case shell (the open box holding the cash) ----
  rrectSprite(ctx, cbx, cby, cw, ch, s * 0.07);
  ctx.fillStyle = leather; ctx.fill();
  ctx.strokeStyle = leatherShade; ctx.lineWidth = Math.max(1, s * 0.045); ctx.stroke();
  // darker inner well
  ctx.fillStyle = leatherShade;
  rrectSprite(ctx, cbx + cw * 0.05, cby + ch * 0.08, cw * 0.9, ch * 0.84, s * 0.05); ctx.fill();

  // ---- bundles of banded banknotes packed into the case ----
  const bundleW = cw * 0.26, bundleH = ch * 0.66, gap = cw * 0.04;
  const startX = cbx + cw * 0.10;
  for (let i = 0; i < 3; i++) {
    const bx = startX + i * (bundleW + gap);
    const lift = (i === 1 ? s * 0.06 : 0);   // middle bundle sits a touch higher
    const byTop = cby + ch * 0.16 - lift;
    // bundle body
    rrectSprite(ctx, bx, byTop, bundleW, bundleH, s * 0.02);
    ctx.fillStyle = cash; ctx.fill();
    // top note edge highlight + lower shade so it reads as a thick stack
    ctx.fillStyle = cashHi; ctx.fillRect(bx, byTop, bundleW, bundleH * 0.18);
    ctx.fillStyle = cashShade; ctx.fillRect(bx, byTop + bundleH * 0.82, bundleW, bundleH * 0.18);
    // stacked-note striations
    ctx.strokeStyle = cashShade; ctx.lineWidth = Math.max(0.6, s * 0.014);
    for (let k = 1; k < 4; k++) {
      const ly = byTop + bundleH * (0.18 + k * 0.16);
      ctx.beginPath(); ctx.moveTo(bx + bundleW * 0.06, ly); ctx.lineTo(bx + bundleW * 0.94, ly); ctx.stroke();
    }
    // paper currency band across the middle
    ctx.fillStyle = band;
    ctx.fillRect(bx, byTop + bundleH * 0.40, bundleW, bundleH * 0.22);
    ctx.strokeStyle = shadeColor(band, -0.3); ctx.lineWidth = Math.max(0.6, s * 0.012);
    ctx.strokeRect(bx, byTop + bundleH * 0.40, bundleW, bundleH * 0.22);
    // a $ hint on the middle bundle's band when big enough
    if (i === 1 && s >= 14) {
      ctx.fillStyle = '#2a6a3a'; ctx.font = '700 ' + Math.round(s * 0.18) + 'px "Courier New", monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('$', bx + bundleW * 0.5, byTop + bundleH * 0.51);
    }
  }

  // handle on the front of the case
  ctx.strokeStyle = leatherHi; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - cw * 0.16, cby + ch * 0.98);
  ctx.quadraticCurveTo(x, cby + ch * 1.16, x + cw * 0.16, cby + ch * 0.98);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // subtle gold glint — coveted-money signal
  ctx.strokeStyle = 'rgba(247,212,74,0.8)'; ctx.lineWidth = Math.max(1, s * 0.045); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cbx + cw * 0.18, cby - ch * 0.06); ctx.lineTo(cbx + cw * 0.30, cby - ch * 0.18);
  ctx.moveTo(cbx + cw * 0.24, cby - ch * 0.04); ctx.lineTo(cbx + cw * 0.24, cby - ch * 0.2);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

// ---- ladynight: "Lady of di Night" — a TASTEFUL, non-explicit film-noir
// silhouette. A streetlamp casts a warm pool of light (#f0c060), and an elegant
// standing woman in a dress (magenta/red accent #c0306a) waits beneath it with a
// small clutch. Classy, suggestive only by setting — nothing lewd.
function drawLadyNight(ctx, x, y, s) {
  const glow = '#f0c060', dress = '#c0306a', dressShade = shadeColor('#c0306a', -0.3);
  const dressHi = shadeColor('#c0306a', 0.22);
  const skin = '#caa07c', skinShade = '#9a7050';
  const lamp = '#3a3f46', lampHi = '#9aa0a6';
  const hair = '#1c140e';

  // lamppost stands to the viewer-right of the figure
  const poleX = x + s * 0.62;

  // ---- warm pool of lamplight cast on the road under everything ----
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x + s * 0.18, y - s * 0.02, s * 0.95, s * 0.3, 0, 0, Math.PI * 2);
  ctx.clip();
  // layered radial-ish bloom (brightest near the lamp side)
  ctx.fillStyle = 'rgba(240,192,96,0.30)';
  ctx.beginPath(); ctx.ellipse(x + s * 0.18, y - s * 0.02, s * 0.95, s * 0.3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,224,150,0.30)';
  ctx.beginPath(); ctx.ellipse(x + s * 0.3, y - s * 0.04, s * 0.6, s * 0.2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // ---- the lamppost ----
  // base
  ctx.fillStyle = lamp;
  rrectSprite(ctx, poleX - s * 0.08, y - s * 0.18, s * 0.16, s * 0.18, s * 0.03); ctx.fill();
  // tall pole
  ctx.fillStyle = lamp;
  ctx.fillRect(poleX - s * 0.04, y - s * 1.5, s * 0.08, s * 1.34);
  ctx.fillStyle = lampHi;
  ctx.fillRect(poleX - s * 0.04, y - s * 1.5, s * 0.025, s * 1.34);
  // curved arm reaching back over the lady
  ctx.strokeStyle = lamp; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(poleX, y - s * 1.5);
  ctx.quadraticCurveTo(poleX - s * 0.2, y - s * 1.66, poleX - s * 0.44, y - s * 1.6);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // lamp head + glowing globe at the end of the arm
  const headX = poleX - s * 0.46, headY = y - s * 1.58;
  ctx.fillStyle = lamp;
  rrectSprite(ctx, headX - s * 0.1, headY - s * 0.12, s * 0.2, s * 0.1, s * 0.03); ctx.fill();
  // halo around the bulb
  ctx.fillStyle = 'rgba(240,192,96,0.5)';
  ctx.beginPath(); ctx.arc(headX, headY + s * 0.04, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(headX, headY + s * 0.04, s * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff6da';
  ctx.beginPath(); ctx.arc(headX, headY + s * 0.04, s * 0.045, 0, Math.PI * 2); ctx.fill();

  // ---- the elegant standing figure (under the light, lit from her right) ----
  // long flowing dress — a tapering A-line from waist to the road
  ctx.fillStyle = dress;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.1, y - s * 0.72);            // left waist
  ctx.lineTo(x + s * 0.1, y - s * 0.72);            // right waist
  ctx.quadraticCurveTo(x + s * 0.26, y - s * 0.34, x + s * 0.22, y);  // right hem flare
  ctx.lineTo(x - s * 0.22, y);                       // hem
  ctx.quadraticCurveTo(x - s * 0.26, y - s * 0.34, x - s * 0.1, y - s * 0.72); // left flare
  ctx.closePath(); ctx.fill();
  // dress shade (left, away from the lamp) + lit highlight (right, toward lamp)
  ctx.fillStyle = dressShade;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.1, y - s * 0.72);
  ctx.quadraticCurveTo(x - s * 0.26, y - s * 0.34, x - s * 0.22, y);
  ctx.lineTo(x - s * 0.04, y);
  ctx.lineTo(x - s * 0.02, y - s * 0.72); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dressHi;
  ctx.fillRect(x + s * 0.05, y - s * 0.66, s * 0.05, s * 0.6);

  // slim torso / bodice up to the shoulders
  ctx.fillStyle = dress;
  rrectSprite(ctx, x - s * 0.12, y - s * 1.02, s * 0.24, s * 0.34, s * 0.06); ctx.fill();
  ctx.fillStyle = dressHi;
  rrectSprite(ctx, x + s * 0.04, y - s * 1.0, s * 0.06, s * 0.3, s * 0.03); ctx.fill();

  // arm resting at her side, hand holding a small clutch on the lamp side
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(1.5, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + s * 0.1, y - s * 0.96);
  ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.8, x + s * 0.16, y - s * 0.62);
  ctx.stroke();
  // far arm (shaded, tucked)
  ctx.strokeStyle = skinShade;
  ctx.beginPath();
  ctx.moveTo(x - s * 0.1, y - s * 0.96);
  ctx.quadraticCurveTo(x - s * 0.18, y - s * 0.8, x - s * 0.14, y - s * 0.64);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // small clutch purse at the near hand
  ctx.fillStyle = shadeColor(dress, -0.15);
  rrectSprite(ctx, x + s * 0.1, y - s * 0.66, s * 0.16, s * 0.1, s * 0.03); ctx.fill();
  ctx.strokeStyle = glow; ctx.lineWidth = Math.max(0.8, s * 0.02);
  rrectSprite(ctx, x + s * 0.1, y - s * 0.66, s * 0.16, s * 0.1, s * 0.03); ctx.stroke();
  // a small gold clasp dot
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(x + s * 0.18, y - s * 0.61, Math.max(0.8, s * 0.02), 0, Math.PI * 2); ctx.fill();

  // neck + head, tilted slightly toward the lamplight
  ctx.fillStyle = skin;
  ctx.fillRect(x - s * 0.04, y - s * 1.12, s * 0.08, s * 0.12);
  ctx.beginPath(); ctx.arc(x + s * 0.01, y - s * 1.2, s * 0.13, 0, Math.PI * 2);
  ctx.fillStyle = skin; ctx.fill();
  // lit cheek (lamp side) + shaded far cheek
  ctx.fillStyle = shadeColor(skin, 0.18);
  ctx.beginPath(); ctx.arc(x + s * 0.05, y - s * 1.22, s * 0.06, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinShade;
  ctx.beginPath(); ctx.arc(x - s * 0.05, y - s * 1.16, s * 0.05, 0, Math.PI * 2); ctx.fill();

  // styled hair — a soft sweep falling to one shoulder
  ctx.fillStyle = hair;
  ctx.beginPath();
  ctx.arc(x + s * 0.01, y - s * 1.24, s * 0.15, Math.PI * 0.95, Math.PI * 2.15);
  ctx.fill();
  // hair sweeping down the far side past the shoulder
  ctx.beginPath();
  ctx.moveTo(x - s * 0.12, y - s * 1.22);
  ctx.quadraticCurveTo(x - s * 0.2, y - s * 1.02, x - s * 0.12, y - s * 0.86);
  ctx.quadraticCurveTo(x - s * 0.05, y - s * 1.0, x - s * 0.04, y - s * 1.18);
  ctx.closePath(); ctx.fill();
}
