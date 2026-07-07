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
    case 'bump': drawSpeedBump(ctx, sx, sy, s); break;
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
    case 'broomman': drawBroomMan(ctx, sx, sy, s); break;
    case 'coconutcart': drawCoconutCart(ctx, sx, sy, s); break;
    case 'sunlight': drawSunlight(ctx, sx, sy, s, seed); break;
    case 'police': drawPolice(ctx, sx, sy, s); break;
    case 'wiper': wiperYouth(ctx, sx, sy, s, seed); break;
    case 'stall': drawStall(ctx, sx, sy, s); break;
    case 'water':  waterBottle(ctx, sx, sy, s); break;
    case 'tools':  hardwareTools(ctx, sx, sy, s, seed); break;
    case 'rope':   ropeLashing(ctx, sx, sy, s); break;   // the raft's repair pickup
    case 'coffee': coffeeBag(ctx, sx, sy, s); break;
    case 'fruit':  drawFruit(ctx, sx, sy, s); break;
    // Jamaican street food — national ackee + the beef/veggie patty
    case 'ackee':       drawAckee(ctx, sx, sy, s); break;
    case 'unripeackee': drawUnripeAckee(ctx, sx, sy, s); break;   // closed pod — POISON
    case 'plantain':    drawPlantain(ctx, sx, sy, s); break;
    case 'breadfruit':  drawBreadfruit(ctx, sx, sy, s); break;
    case 'patty':       drawPatty(ctx, sx, sy, s, false); break;
    case 'veggiepatty': drawPatty(ctx, sx, sy, s, true); break;
    // Bog Walk river-mode obstacles
    case 'swimmer':     drawSwimmer(ctx, sx, sy, s, seed); break;
    case 'tyreswing':   drawTyreSwing(ctx, sx, sy, s, seed); break;
    case 'rockfall':    drawRockfall(ctx, sx, sy, s, seed); break;
    case 'floatbottle': floatBottle(ctx, sx, sy, s); break;
    case 'plasticbag':  plasticBag(ctx, sx, sy, s); break;
    case 'croc':        crocodile(ctx, sx, sy, s, seed); break;
    case 'burntcar':    riverCar(ctx, sx, sy, s, true); break;
    case 'floatcar':    riverCar(ctx, sx, sy, s, false); break;
    case 'limerock':    limestoneRock(ctx, sx, sy, s, seed); break;
    case 'rivermumma':  riverMumma(ctx, sx, sy, s, seed); break;
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
    // the DIY recipe: curry-powder bag + toothpaste tube bundled as ONE pickup
    case 'blchmix':     curryPowderBag(ctx, sx - s * 0.22, sy, s * 0.8); toothpasteTube(ctx, sx + s * 0.3, sy, s * 0.75); break;
    case 'blchtub':     bleachingCream(ctx, sx, sy, s); break;   // the shop tub (same as the Yute's)
    // School Yute wholesome items — dedicated icons of the real things
    case 'books':      drawBookStack(ctx, sx, sy, s); break;
    case 'stationery': drawStationery(ctx, sx, sy, s); break;
    case 'bagjuice':   drawBagJuice(ctx, sx, sy, s); break;
    case 'lasco':      drawLasco(ctx, sx, sy, s); break;
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
    // Di Principal — authority perks (pickups) + office compromises (avoid)
    case 'schoolbell':     drawSchoolBell(ctx, sx, sy, s); break;
    case 'extralessons':   drawExtraLessons(ctx, sx, sy, s); break;
    case 'placementbribe': drawBrownEnvelope(ctx, sx, sy, s); break;
    case 'ptameeting':     drawPtaNotice(ctx, sx, sy, s); break;
    default: crater(ctx, sx, sy, s, seed);
  }
}

// ---- crater: a flat moon-crater in the road. Torn-asphalt rim, exposed pale
// limestone-marl floor (what sits under Jamaican asphalt), damp shadowed depression.
function crater(ctx, x, y, size, seed) {
  const base = Math.floor((seed || 0.137) * 2147483647);
  const vr = mulberry32(base ^ 0xA71C);
  // Seed-driven VARIETY: craters differ in apparent size, depth, and whether they've
  // filled with water — so a road never reads as a row of identical holes.
  const scale = 0.78 + vr() * 0.58;          // 0.78 … 1.36 apparent size
  const depth = 0.55 + vr() * 0.9;           // shallow scrape … deep crater
  const wet   = vr() < 0.34;                  // ~1 in 3 are water-filled
  const rx = size * 0.95 * scale, ry = size * 0.36 * scale;
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
  // damp, shadowed depression toward the far lip — DEEPER holes read darker/lower
  jaggedPath(ctx, x, y + ry * 0.22 * depth, rx * 0.64, ry * (0.5 + 0.28 * depth), 13, mulberry32(base ^ 0x7777), 0.18);
  ctx.fillStyle = `rgba(50,44,34,${0.5 + 0.35 * depth})`; ctx.fill();
  if (wet) {
    // muddy rain-water pool sitting in the hole — a flat sheen with a sky-tint and a
    // bright specular streak (this is what throws the splash when you hit it).
    jaggedPath(ctx, x, y + ry * 0.10, rx * 0.82, ry * 0.72, 14, mulberry32(base ^ 0x2b1a), 0.10);
    ctx.fillStyle = 'rgba(70,96,110,0.72)'; ctx.fill();
    ctx.fillStyle = 'rgba(150,180,195,0.55)';
    ellipsePath(ctx, x - rx * 0.16, y - ry * 0.02, rx * 0.34, ry * 0.16); ctx.fill();
    ctx.strokeStyle = 'rgba(200,220,230,0.5)'; ctx.lineWidth = Math.max(1, size * 0.02);
    ctx.beginPath(); ctx.ellipse(x, y + ry * 0.06, rx * 0.5, ry * 0.4, 0, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  }
  // lit asphalt rim on the near edge (catches the light)
  ctx.strokeStyle = 'rgba(150,150,150,0.4)';
  ctx.lineWidth = Math.max(1, size * 0.045);
  ctx.beginPath(); ctx.ellipse(x, y - ry * 0.02, rx * 1.06, ry * 1.06, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  // cracks radiating into the surrounding asphalt (more on the bigger craters)
  ctx.strokeStyle = 'rgba(10,10,10,0.45)'; ctx.lineWidth = Math.max(1, size * 0.022);
  const cr = mulberry32(base ^ 0x13af);
  const nCracks = 3 + Math.round(scale * 2);
  for (let i = 0; i < nCracks; i++) {
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
// A struck coin standing on the road: darker milled rim, a raised inner face, an embossed
// ring and $ mark, a metallic sheen arc and a bright glint — reads as minted metal, not a
// flat token. Centre sits at (x, y-r) so the coin rests its base on the ground line y.
function drawCoin(ctx, x, y, r, fill, stroke) {
  const cy = y - r;
  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x, y, r * 0.9, r * 0.22); ctx.fill();
  // milled outer rim (the darker metal)
  ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fillStyle = stroke; ctx.fill();
  // raised inner face
  ctx.beginPath(); ctx.arc(x, cy, r * 0.82, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  // embossed inner ring
  ctx.strokeStyle = stroke; ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.beginPath(); ctx.arc(x, cy, r * 0.6, 0, Math.PI * 2); ctx.stroke();
  // embossed $ mark in the rim metal
  ctx.fillStyle = stroke;
  ctx.font = '700 ' + Math.max(5, Math.round(r * 0.85)) + 'px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('$', x, cy + r * 0.04);
  // metallic sheen arc (upper-left) + a bright specular glint
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = Math.max(1, r * 0.11);
  ctx.beginPath(); ctx.arc(x, cy, r * 0.82, Math.PI * 0.92, Math.PI * 1.42); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(x - r * 0.34, cy - r * 0.34, r * 0.12, 0, Math.PI * 2); ctx.fill();
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
    drawCoin(ctx, x, y, s * 0.5, fill, stroke);
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

// A real Jamaican sleeping policeman: a raised asphalt hump painted with fading
// yellow warning bands, sitting proud of the road with a cast shadow — not a grey bar.
function drawSpeedBump(ctx, x, y, s) {
  const w = s * 0.85, h = s * 0.30;   // half-width / mound height
  // cast shadow at the base
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ctx.beginPath(); ctx.ellipse(x, y + h * 0.12, w * 1.02, h * 0.28, 0, 0, Math.PI * 2); ctx.fill();
  // the asphalt mound (half-ellipse) — slightly darker than the road so it reads raised
  ctx.fillStyle = '#3e3e44';
  ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, Math.PI, 0); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  // worn yellow warning bands painted over the hump
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, Math.PI, 0); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#d8b020';
  const band = Math.max(3, s * 0.16);
  for (let bx = -w; bx < w; bx += band * 2) ctx.fillRect(x + bx, y - h, band, h);
  // sun highlight along the crest + wear scuffs so the paint looks driven-over
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  ctx.beginPath(); ctx.ellipse(x, y - h * 0.28, w * 0.9, h * 0.34, 0, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(62,62,68,0.5)';
  ctx.fillRect(x - w * 0.5, y - h * 0.55, w, h * 0.18);
  ctx.restore();
}

// ---- vendor stall: a Jamaican roadside higgler's market stall — a wooden table of
// produce under a blue tarp awning. Replaces the old flat brown block (which read as an
// unfinished placeholder). `y` is the ground line; the stall is built upward from there.
function drawStall(ctx, x, y, s) {
  const w = s * 1.3;                 // table width
  const legH = s * 0.5;              // table/leg height
  const topY = y - legH;            // tabletop line
  const lx = x - w / 2, rx = x + w / 2;

  // soft ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipsePath(ctx, x, y + s * 0.05, w * 0.6, s * 0.13); ctx.fill();

  // wooden legs
  const legW = Math.max(2, s * 0.11);
  ctx.fillStyle = '#5e3f22';
  ctx.fillRect(lx + legW * 0.4, topY, legW, legH);
  ctx.fillRect(rx - legW * 1.4, topY, legW, legH);

  // tabletop plank with a darker front edge
  ctx.fillStyle = '#8a5a2c'; ctx.fillRect(lx, topY - s * 0.14, w, s * 0.14);
  ctx.fillStyle = '#6e4421'; ctx.fillRect(lx, topY - s * 0.02, w, s * 0.05);

  // produce laid out on the table — oranges, ackee-red, callaloo-green, yellow yam
  const goods = ['#e08a2a', '#cf3a2a', '#3f8a3a', '#e0b020'];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = goods[i];
    ellipsePath(ctx, lx + w * (0.2 + i * 0.2), topY - s * 0.2, s * 0.13, s * 0.1); ctx.fill();
  }

  // two canopy poles rising from the back corners
  const canY = topY - s * 0.8;
  ctx.strokeStyle = '#5a3e22'; ctx.lineWidth = Math.max(1.5, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lx + s * 0.12, topY - s * 0.14); ctx.lineTo(lx + s * 0.12, canY);
  ctx.moveTo(rx - s * 0.12, topY - s * 0.14); ctx.lineTo(rx - s * 0.12, canY);
  ctx.stroke();

  // blue market-tarp awning: a slab with a sagging front valance
  const cw = w * 1.16;
  ctx.fillStyle = '#2f6fb0';
  ctx.beginPath();
  ctx.moveTo(x - cw / 2, canY);
  ctx.lineTo(x + cw / 2, canY);
  ctx.lineTo(x + cw / 2, canY + s * 0.13);
  ctx.quadraticCurveTo(x, canY + s * 0.28, x - cw / 2, canY + s * 0.13);
  ctx.closePath(); ctx.fill();
  // sunlit top edge of the tarp
  ctx.fillStyle = '#3f86cc'; ctx.fillRect(x - cw / 2, canY, cw, Math.max(1.5, s * 0.05));
}
// ---- animal figures — 12-bit lift ----

// Goat — the classic Jamaican roadside ram: white coat with tan patches, head UP and
// alert on a proper raised neck, back-swept horns, floppy ears, beard, flicked-up tail.
function drawGoat(ctx, x, y, r) {
  const coat = '#ece4d4', patch = '#b98a52', shadow = '#c4b498', dark = '#4a3a24';

  // legs — four, with visible knee bend and small dark hooves
  ctx.strokeStyle = '#d8cdb8'; ctx.lineWidth = Math.max(1.5, r * 0.13); ctx.lineCap = 'round';
  for (const [lx, lean] of [[-0.5, -0.04], [-0.24, 0.02], [0.2, -0.02], [0.46, 0.05]]) {
    ctx.beginPath();
    ctx.moveTo(x + r * lx, y - r * 0.42);
    ctx.lineTo(x + r * (lx + lean), y - r * 0.18);
    ctx.lineTo(x + r * (lx + lean * 2), y + r * 0.04);
    ctx.stroke();
    ctx.fillStyle = dark;
    ctx.fillRect(x + r * (lx + lean * 2) - r * 0.05, y + r * 0.02, r * 0.1, r * 0.07);
  }

  // body — deep chest tapering to the hip, white coat
  const by = y - r * 0.52;
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.66, by + r * 0.02);                                   // chest
  ctx.quadraticCurveTo(x - r * 0.72, by - r * 0.28, x - r * 0.34, by - r * 0.32); // shoulder
  ctx.quadraticCurveTo(x + r * 0.1, by - r * 0.40, x + r * 0.52, by - r * 0.30);  // back line
  ctx.quadraticCurveTo(x + r * 0.72, by - r * 0.24, x + r * 0.66, by + r * 0.04); // rump
  ctx.quadraticCurveTo(x + r * 0.3, by + r * 0.30, x - r * 0.2, by + r * 0.26);   // belly
  ctx.quadraticCurveTo(x - r * 0.6, by + r * 0.24, x - r * 0.66, by + r * 0.02);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.03); ctx.stroke();
  // tan patches (saddle + rump) — the mixed coat every Jamaican road goat wears
  ctx.fillStyle = patch;
  ctx.beginPath(); ctx.ellipse(x + r * 0.08, by - r * 0.16, r * 0.30, r * 0.18, 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + r * 0.52, by - r * 0.04, r * 0.16, r * 0.14, -0.2, 0, Math.PI * 2); ctx.fill();
  // belly shadow
  ctx.fillStyle = 'rgba(120,100,70,0.25)';
  ctx.beginPath(); ctx.ellipse(x, by + r * 0.16, r * 0.5, r * 0.12, 0, 0, Math.PI * 2); ctx.fill();

  // tail — short, flicked UP (the goat tell)
  ctx.strokeStyle = coat; ctx.lineWidth = Math.max(1.5, r * 0.11);
  ctx.beginPath(); ctx.moveTo(x + r * 0.64, by - r * 0.2);
  ctx.quadraticCurveTo(x + r * 0.78, by - r * 0.42, x + r * 0.70, by - r * 0.52); ctx.stroke();

  // raised neck up to an ALERT head (watching the traffic it refuses to move for)
  const hx = x - r * 0.72, hy = by - r * 0.72;
  ctx.fillStyle = coat;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.6, by + r * 0.02);
  ctx.lineTo(hx - r * 0.02, hy + r * 0.06);
  ctx.lineTo(hx + r * 0.22, hy + r * 0.18);
  ctx.lineTo(x - r * 0.3, by - r * 0.28);
  ctx.closePath(); ctx.fill();
  // head — a tidy wedge, muzzle down-left
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.16, hy - r * 0.18);
  ctx.lineTo(hx - r * 0.26, hy + r * 0.02);
  ctx.lineTo(hx - r * 0.30, hy + r * 0.16);
  ctx.lineTo(hx - r * 0.12, hy + r * 0.22);
  ctx.lineTo(hx + r * 0.2, hy + r * 0.06);
  ctx.closePath();
  ctx.fillStyle = coat; ctx.fill();
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.025); ctx.stroke();
  // tan blaze down the face
  ctx.fillStyle = patch;
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.1, hy - r * 0.14); ctx.lineTo(hx - r * 0.2, hy + r * 0.04);
  ctx.lineTo(hx - r * 0.12, hy + r * 0.1); ctx.lineTo(hx + r * 0.12, hy - r * 0.06);
  ctx.closePath(); ctx.fill();
  // floppy ear (drops back from the crown)
  ctx.fillStyle = patch;
  ctx.beginPath(); ctx.ellipse(hx + r * 0.2, hy + r * 0.02, r * 0.17, r * 0.08, 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = shadow; ctx.stroke();
  // horns — two back-swept curves (not nubs)
  ctx.strokeStyle = '#8a7a50'; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.08, hy - r * 0.16);
  ctx.quadraticCurveTo(hx + r * 0.3, hy - r * 0.44, hx + r * 0.5, hy - r * 0.4);
  ctx.moveTo(hx + r * 0.16, hy - r * 0.12);
  ctx.quadraticCurveTo(hx + r * 0.36, hy - r * 0.34, hx + r * 0.52, hy - r * 0.3);
  ctx.stroke();
  // eye (calm, unbothered) + nostril + beard
  ctx.fillStyle = '#1a1008';
  ctx.beginPath(); ctx.arc(hx - r * 0.02, hy - r * 0.02, Math.max(1, r * 0.05), 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath(); ctx.arc(hx - r * 0.26, hy + r * 0.12, Math.max(1, r * 0.035), 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1, r * 0.07);
  ctx.beginPath(); ctx.moveTo(hx - r * 0.14, hy + r * 0.2); ctx.lineTo(hx - r * 0.18, hy + r * 0.38); ctx.stroke();
  ctx.lineCap = 'butt';
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

// Dog: a JAMAICAN MONGREL ("pothound" / Caribbean potcake) — lean and rangy with a
// smooth short tan coat, cocked upright ears, a long face, a white chest bib, and a
// thin tail carried up in a curl. (See the Caribbean potcake type: smooth coat,
// cocked ears, long face.)
function drawDog(ctx, x, y, r) {
  const mid = '#b08a52', shadow = '#6a4a26', hi = '#d2b382', bib = '#e8e0d0', nose = '#2a1a0a';
  const by = y - r * 0.30;   // body carried high — long legs under a lean frame

  // long thin legs — the rangy street-dog stance
  ctx.strokeStyle = shadow; ctx.lineWidth = Math.max(1.5, r * 0.13); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - r * 0.40, by + r * 0.20); ctx.lineTo(x - r * 0.42, y + r * 0.06);
  ctx.moveTo(x - r * 0.16, by + r * 0.22); ctx.lineTo(x - r * 0.14, y + r * 0.06);
  ctx.moveTo(x + r * 0.16, by + r * 0.20); ctx.lineTo(x + r * 0.20, y + r * 0.06);
  ctx.moveTo(x + r * 0.40, by + r * 0.20); ctx.lineTo(x + r * 0.46, y + r * 0.06);
  ctx.stroke();

  // lean body: deep chest tapering to a tucked-up waist (not a barrel)
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.moveTo(x - r * 0.56, by - r * 0.18);
  ctx.quadraticCurveTo(x - r * 0.62, by + r * 0.16, x - r * 0.34, by + r * 0.24);   // chest drops low
  ctx.quadraticCurveTo(x + r * 0.10, by + r * 0.26, x + r * 0.34, by + r * 0.10);   // belly tucks UP
  ctx.quadraticCurveTo(x + r * 0.56, by + r * 0.02, x + r * 0.54, by - r * 0.16);   // slim hindquarter
  ctx.quadraticCurveTo(x, by - r * 0.36, x - r * 0.56, by - r * 0.18);              // straight back
  ctx.closePath(); ctx.fill();
  // back highlight (smooth short coat sheen)
  ctx.beginPath(); ctx.ellipse(x - r * 0.06, by - r * 0.16, r * 0.32, r * 0.08, -0.1, 0, Math.PI * 2);
  ctx.fillStyle = hi; ctx.fill();
  // a hint of rib shading on the lean flank
  ctx.strokeStyle = 'rgba(90,60,32,0.35)'; ctx.lineWidth = Math.max(1, r * 0.03);
  for (const dx of [-0.16, -0.05, 0.06]) {
    ctx.beginPath(); ctx.moveTo(x + r * dx, by - r * 0.02);
    ctx.quadraticCurveTo(x + r * (dx + 0.03), by + r * 0.08, x + r * dx, by + r * 0.16); ctx.stroke();
  }

  // thin tail carried UP in a curl over the back
  ctx.strokeStyle = mid; ctx.lineWidth = Math.max(1.5, r * 0.09); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + r * 0.52, by - r * 0.12);
  ctx.quadraticCurveTo(x + r * 0.78, by - r * 0.44, x + r * 0.56, by - r * 0.58); ctx.stroke();

  // head on a longer neck, alert
  const hx = x - r * 0.56, hy = by - r * 0.52;
  ctx.strokeStyle = mid; ctx.lineWidth = Math.max(2, r * 0.20);
  ctx.beginPath(); ctx.moveTo(x - r * 0.44, by - r * 0.16); ctx.lineTo(hx + r * 0.08, hy + r * 0.12); ctx.stroke();
  ctx.fillStyle = mid;
  ctx.beginPath(); ctx.arc(hx, hy, r * 0.22, 0, Math.PI * 2); ctx.fill();
  // cocked upright ears — the pothound tell (one pricked, one half-flopped at the tip)
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.02, hy - r * 0.14);
  ctx.lineTo(hx + r * 0.10, hy - r * 0.42); ctx.lineTo(hx + r * 0.20, hy - r * 0.12);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(hx - r * 0.20, hy - r * 0.10);
  ctx.lineTo(hx - r * 0.30, hy - r * 0.34); ctx.lineTo(hx - r * 0.34, hy - r * 0.26);  // tip kinks over
  ctx.lineTo(hx - r * 0.26, hy - r * 0.30); ctx.lineTo(hx - r * 0.08, hy - r * 0.16);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.moveTo(hx + r * 0.06, hy - r * 0.15); ctx.lineTo(hx + r * 0.10, hy - r * 0.34);
  ctx.lineTo(hx + r * 0.15, hy - r * 0.13); ctx.closePath(); ctx.fill();
  // long face: muzzle reaching well forward
  ctx.fillStyle = mid;
  ctx.beginPath(); ctx.ellipse(hx - r * 0.22, hy + r * 0.05, r * 0.20, r * 0.10, 0.08, 0, Math.PI * 2); ctx.fill();
  // white chest bib running up the throat (classic mongrel marking)
  ctx.fillStyle = bib;
  ctx.beginPath(); ctx.ellipse(x - r * 0.44, by + r * 0.04, r * 0.10, r * 0.17, 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + r * 0.02, hy + r * 0.19, r * 0.07, r * 0.10, 0.2, 0, Math.PI * 2); ctx.fill();
  // nose
  ctx.fillStyle = nose;
  ctx.beginPath(); ctx.arc(hx - r * 0.40, hy + r * 0.03, Math.max(1.5, r * 0.06), 0, Math.PI * 2); ctx.fill();
  // eye
  ctx.beginPath(); ctx.arc(hx - r * 0.08, hy - r * 0.05, Math.max(1.5, r * 0.06), 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hx - r * 0.10, hy - r * 0.07, Math.max(0.5, r * 0.025), 0, Math.PI * 2);
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

// A foreshortened body extension so traffic reads LONG, not a flat cardboard face:
// the roof recedes toward the horizon from the rear roofline, narrowing as it goes,
// with edge seams selling the perspective. Matches the gameplay `len` on the hazard —
// what you see stretching up the road is the flank you can now side-swipe.
function vehicleBodyExtension(ctx, x, roofY, halfW, ext, roofColor, seamColor) {
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - halfW, roofY);
  ctx.lineTo(x + halfW, roofY);
  ctx.lineTo(x + halfW * 0.78, roofY - ext);
  ctx.lineTo(x - halfW * 0.78, roofY - ext);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = seamColor; ctx.lineWidth = Math.max(1, halfW * 0.05);
  ctx.beginPath();
  ctx.moveTo(x - halfW, roofY); ctx.lineTo(x - halfW * 0.78, roofY - ext);
  ctx.moveTo(x + halfW, roofY); ctx.lineTo(x + halfW * 0.78, roofY - ext);
  ctx.stroke();
}

// ---- JUTC bus: the big yellow vehicle() body, plus a Jamaican flag decal on the
// rear panel. The flag = gold saltire (X) splitting the field into four triangles:
// TOP & BOTTOM green, LEFT & RIGHT black, gold bands riding the diagonals.
function drawBus(ctx, x, y, s) {
  // the LONG roof receding up the road — a JUTC bus is a wall, not a square
  vehicleBodyExtension(ctx, x, y - s * 0.9, s * 0.55, s * 0.9, '#c9a832', '#8a6f18');
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

  // the minibus body stretching up the road — long enough to side-swipe
  vehicleBodyExtension(ctx, 0, by + s * 0.05, bw * 0.46, s * 0.6, '#d9dde0', '#aab0b5');

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
  // route taxis run LONG — the roof recedes up the road ahead of the rear face
  vehicleBodyExtension(ctx, x, top + s * 0.06, w * 0.9, s * 0.55, '#c9ccd0', '#8a8f93');
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

// ---- rope lashing: the raft repair pickup — a coiled sisal rope over a fresh bamboo
// slat (you re-lash the raft's poles, you don't spanner them) ----
function ropeLashing(ctx, x, y, s) {
  // drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.06, s * 0.55, s * 0.1); ctx.fill();
  const cy = y - s * 0.45;
  // fresh bamboo slat lying behind the coil, node ring visible
  ctx.strokeStyle = '#9aa84a'; ctx.lineWidth = Math.max(2.5, s * 0.16); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.58, cy + s * 0.34); ctx.lineTo(x + s * 0.58, cy + s * 0.22); ctx.stroke();
  ctx.strokeStyle = '#6f7c30'; ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath(); ctx.moveTo(x + s * 0.14, cy + s * 0.20); ctx.lineTo(x + s * 0.14, cy + s * 0.36); ctx.stroke();
  // sisal coil face-on: a fat ring with an open centre (unmistakably a coil of rope)
  ctx.strokeStyle = '#c8a86a'; ctx.lineWidth = Math.max(3, s * 0.22); ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.arc(x, cy, s * 0.26, 0, Math.PI * 2); ctx.stroke();
  // rim shading top and bottom of the band so it reads round
  ctx.strokeStyle = '#a5854c'; ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.beginPath(); ctx.arc(x, cy, s * 0.36, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, cy, s * 0.16, 0, Math.PI * 2); ctx.stroke();
  // radial twist strands across the band — the rope's lay
  ctx.strokeStyle = '#8a6f3d'; ctx.lineWidth = Math.max(1, s * 0.04);
  for (let i = 0; i < 10; i++) {
    const a = i * (Math.PI / 5) + 0.2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * s * 0.165, cy + Math.sin(a) * s * 0.165);
    ctx.lineTo(x + Math.cos(a + 0.3) * s * 0.355, cy + Math.sin(a + 0.3) * s * 0.355);
    ctx.stroke();
  }
  // loose working end trailing off the coil onto the slat
  ctx.strokeStyle = '#c8a86a'; ctx.lineWidth = Math.max(1.5, s * 0.09); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + s * 0.24, cy + s * 0.20);
  ctx.quadraticCurveTo(x + s * 0.52, cy + s * 0.30, x + s * 0.46, cy + s * 0.44); ctx.stroke();
  ctx.lineCap = 'butt';
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

// ---- ackee: Jamaica's national fruit — a split red-pink pod opening to reveal the
// glossy yellow arils and their shiny black seeds (only ripe, open ackee is safe). ----
function drawAckee(ctx, x, y, s) {
  // A ripe OPEN ackee as it actually hangs: one red leathery pod split into three
  // petals folded outward, the cream arils clustered in the middle, each capped by
  // its glossy black seed — plus the stem and a leaf so it reads as picked fruit.
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.06, s * 0.5, s * 0.1); ctx.fill();
  const cy = y - s * 0.26;                       // pod centre
  // stem + leaf
  ctx.strokeStyle = '#4a6a2a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, cy - s * 0.30); ctx.quadraticCurveTo(x + s * 0.08, cy - s * 0.46, x + s * 0.16, cy - s * 0.54); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#3f7d3a';
  ctx.beginPath(); ctx.ellipse(x + s * 0.30, cy - s * 0.54, s * 0.17, s * 0.07, -0.5, 0, Math.PI * 2); ctx.fill();
  // three petals of the split pod, radiating out and down from the centre
  for (const ang of [Math.PI * 0.5 - 2.1, Math.PI * 0.5, Math.PI * 0.5 + 2.1]) {
    const px = x + Math.cos(ang) * s * 0.22, py = cy + Math.sin(ang) * s * 0.22;
    ctx.fillStyle = '#c4361f';
    ctx.beginPath(); ctx.ellipse(px, py, s * 0.34, s * 0.20, ang, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#8a2010'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
    // sun-ripened blush along the petal's outer edge
    ctx.fillStyle = '#e05a30';
    ctx.beginPath(); ctx.ellipse(px + Math.cos(ang) * s * 0.12, py + Math.sin(ang) * s * 0.12, s * 0.20, s * 0.10, ang, 0, Math.PI * 2); ctx.fill();
  }
  // pale inner membrane where the pod opened
  ctx.fillStyle = '#e8c9a0';
  ctx.beginPath(); ctx.arc(x, cy, s * 0.19, 0, Math.PI * 2); ctx.fill();
  // the cream-yellow arils with their glossy black seeds
  for (const [dx, dy] of [[-0.11, 0.05], [0.11, 0.05], [0, -0.09]]) {
    const ax = x + s * dx, ay = cy + s * dy;
    ctx.fillStyle = '#f4d060';
    ctx.beginPath(); ctx.ellipse(ax, ay + s * 0.03, s * 0.095, s * 0.115, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#c8a030'; ctx.lineWidth = Math.max(1, s * 0.02); ctx.stroke();
    ctx.fillStyle = '#141414';
    ctx.beginPath(); ctx.ellipse(ax, ay - s * 0.07, s * 0.055, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(ax + s * 0.02, ay - s * 0.09, s * 0.017, 0, Math.PI * 2); ctx.fill();
  }
}

// ---- unripe ackee: the SAME fruit at its dangerous stage — the full RED shell, but still
// CLOSED all around. No split, no cream arils on show; at most the black seed tips barely
// poke through the sealed seams. It reads as "ackee, but shut" so the player learns the
// rule: if the pod no open (no arils showing), no eat it. ----
function drawUnripeAckee(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.06, s * 0.44, s * 0.1); ctx.fill();
  const cy = y - s * 0.24;                        // pod centre
  // stem + leaf (same anatomy as the ripe ackee, so it reads as the same fruit)
  ctx.strokeStyle = '#4a6a2a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, cy - s * 0.34); ctx.quadraticCurveTo(x + s * 0.08, cy - s * 0.50, x + s * 0.16, cy - s * 0.58); ctx.stroke();
  ctx.lineCap = 'butt';
  ctx.fillStyle = '#3f7d3a';
  ctx.beginPath(); ctx.ellipse(x + s * 0.30, cy - s * 0.58, s * 0.17, s * 0.07, -0.5, 0, Math.PI * 2); ctx.fill();
  // the sealed pod body: a rounded three-lobe teardrop in the full ripe-shell red
  ctx.fillStyle = '#c23a24';
  ctx.beginPath(); ctx.ellipse(x, cy + s * 0.04, s * 0.34, s * 0.40, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#7d1d10'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // deeper red shading low on the pod for roundness
  ctx.fillStyle = 'rgba(125,29,16,0.35)';
  ctx.beginPath(); ctx.ellipse(x + s * 0.06, cy + s * 0.20, s * 0.24, s * 0.20, 0.2, 0, Math.PI * 2); ctx.fill();
  // deep seams marking the three lobes still fused shut (NO opening — that's the tell)
  ctx.strokeStyle = '#6b150c'; ctx.lineWidth = Math.max(1.2, s * 0.035); ctx.lineCap = 'round';
  for (const dx of [-0.15, 0.0, 0.15]) {
    ctx.beginPath();
    ctx.moveTo(x + s * dx * 0.4, cy - s * 0.30);
    ctx.quadraticCurveTo(x + s * dx, cy + s * 0.02, x + s * dx * 0.9, cy + s * 0.40);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
  // black seed tips BARELY poking through the base of each sealed seam — the only hint of
  // what's inside; no cream aril shows (that's what says "not open, not safe")
  for (const dx of [-0.15, 0.0, 0.15]) {
    const tx = x + s * dx * 0.9, ty = cy + s * 0.34;
    ctx.fillStyle = '#17110e';
    ctx.beginPath(); ctx.ellipse(tx, ty, s * 0.035, s * 0.045, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';   // tiny gloss dot so the tip reads as seed
    ctx.beginPath(); ctx.arc(tx - s * 0.012, ty - s * 0.015, s * 0.012, 0, Math.PI * 2); ctx.fill();
  }
  // waxy sheen down one side of the shell
  ctx.fillStyle = 'rgba(255,215,190,0.30)';
  ctx.beginPath(); ctx.ellipse(x - s * 0.13, cy - s * 0.02, s * 0.07, s * 0.20, -0.15, 0, Math.PI * 2); ctx.fill();
}

// ---- patty: a golden, flaky, half-moon Jamaican patty with a crimped edge. The beef
// version glows turmeric-gold with a warm meaty peek; the ital VEGGIE version carries a
// green callaloo filling + a little leaf mark so the Rasta's ital patty reads at a glance.
function drawPatty(ctx, x, y, s, veggie) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.06, s * 0.55, s * 0.1); ctx.fill();
  const crust = veggie ? '#e6c24a' : '#e8b23a', crustDk = veggie ? '#b79228' : '#b6821f';
  // pastry half-moon (flat side down)
  ctx.fillStyle = crust;
  ctx.beginPath();
  ctx.ellipse(x, y - s * 0.10, s * 0.5, s * 0.42, 0, Math.PI, Math.PI * 2);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = crustDk; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // baked sheen across the top
  ctx.fillStyle = 'rgba(255,240,200,0.45)';
  ctx.beginPath(); ctx.ellipse(x - s * 0.12, y - s * 0.30, s * 0.22, s * 0.08, -0.2, 0, Math.PI * 2); ctx.fill();
  // crimped edge along the straight (top) side
  ctx.strokeStyle = crustDk; ctx.lineWidth = Math.max(1, s * 0.05); ctx.lineCap = 'round';
  for (let i = -4; i <= 4; i++) {
    const px = x + i * s * 0.10;
    ctx.beginPath(); ctx.moveTo(px, y - s * 0.12); ctx.lineTo(px, y - s * 0.03); ctx.stroke();
  }
  // filling peeking through a split — meaty brown, or ital callaloo green
  ctx.fillStyle = veggie ? '#2f7d34' : '#7a3b1a';
  ctx.beginPath(); ctx.ellipse(x, y - s * 0.16, s * 0.16, s * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  if (veggie) {
    // a small green leaf badge so the ital patty is unmistakable
    ctx.fillStyle = '#3fa845';
    ctx.beginPath(); ctx.ellipse(x + s * 0.30, y - s * 0.34, s * 0.12, s * 0.06, -0.6, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1f6a26'; ctx.lineWidth = Math.max(1, s * 0.02);
    ctx.beginPath(); ctx.moveTo(x + s * 0.22, y - s * 0.30); ctx.lineTo(x + s * 0.38, y - s * 0.38); ctx.stroke();
  }
}

// ============================================================================
// School-Yute wholesome pickups — dedicated icons of the actual items
// ============================================================================

// ---- bag juice: a heat-sealed clear-plastic sachet of bright juice (a Jamaican
// "suck-suck" / Bigga bag juice) — crimped seals top & bottom, coloured liquid,
// a sheen on the plastic and a drip at the bitten corner.
function drawBagJuice(ctx, x, y, s) {
  const w = s * 0.62, h = s * 0.94, bx = x - w * 0.5, by = y - h;
  const juice = '#e23f7a', juiceDk = '#9a1f4a';
  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, w * 0.5, s * 0.08); ctx.fill();
  // clear plastic envelope
  rrectSprite(ctx, bx, by, w, h, w * 0.16);
  ctx.fillStyle = 'rgba(226,236,240,0.55)'; ctx.fill();
  ctx.strokeStyle = 'rgba(120,140,150,0.85)'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // juice fill (most of the bag) with a darker settled layer at the bottom
  rrectSprite(ctx, bx + w * 0.10, by + h * 0.16, w * 0.80, h * 0.74, w * 0.12);
  ctx.fillStyle = juice; ctx.fill();
  rrectSprite(ctx, bx + w * 0.10, by + h * 0.58, w * 0.80, h * 0.32, w * 0.12);
  ctx.fillStyle = juiceDk; ctx.fill();
  // crimped heat-seal bands (ribbed) top & bottom
  ctx.fillStyle = '#dfe7ea';
  ctx.fillRect(bx, by + h * 0.02, w, h * 0.12);
  ctx.fillRect(bx, by + h * 0.88, w, h * 0.10);
  ctx.strokeStyle = 'rgba(150,165,170,0.9)'; ctx.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const lx = bx + (w / 6) * i;
    ctx.beginPath(); ctx.moveTo(lx, by + h * 0.03); ctx.lineTo(lx, by + h * 0.13); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lx, by + h * 0.89); ctx.lineTo(lx, by + h * 0.97); ctx.stroke();
  }
  // sheen down one side of the plastic
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillRect(bx + w * 0.18, by + h * 0.20, w * 0.10, h * 0.58);
  // a drip at the bitten top-right corner (it's been opened)
  ctx.fillStyle = juice;
  ctx.beginPath(); ctx.arc(bx + w * 0.84, by + h * 0.20, s * 0.045, 0, Math.PI * 2); ctx.fill();
}

// ---- book stack: three school books stacked, coloured covers, cream page-edges,
// spines on the left — clearly books, not a bottle.
function drawBookStack(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, s * 0.64, s * 0.1); ctx.fill();
  const layers = [
    { w: 1.24, h: 0.30, c: '#2f6f3a', d: '#1c4a25', dx: 0.00 },  // green (bottom)
    { w: 1.06, h: 0.28, c: '#c0451f', d: '#7a2810', dx: 0.12 },  // red
    { w: 0.90, h: 0.26, c: '#1f5f9a', d: '#123f68', dx: -0.05 }, // blue (top)
  ];
  let baseY = y;
  for (const L of layers) {
    const w = s * L.w, h = s * L.h, bx = x - w * 0.5 + s * L.dx, top = baseY - h;
    // cover
    rrectSprite(ctx, bx, top, w, h, h * 0.18); ctx.fillStyle = L.c; ctx.fill();
    ctx.strokeStyle = L.d; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
    // cream page block along the bottom front
    ctx.fillStyle = '#efe6cf'; ctx.fillRect(bx + w * 0.06, top + h * 0.60, w * 0.88, h * 0.28);
    ctx.strokeStyle = 'rgba(170,155,120,0.8)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx + w * 0.06, top + h * 0.73); ctx.lineTo(bx + w * 0.94, top + h * 0.73); ctx.stroke();
    // spine band on the left
    ctx.fillStyle = L.d; ctx.fillRect(bx, top, w * 0.12, h);
    // title slip on the cover
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(bx + w * 0.30, top + h * 0.12, w * 0.5, h * 0.16);
    baseY = top + h * 0.10;  // next book sits on top with a slight overlap
  }
}

// ---- stationery: a spiral notebook with a yellow pencil lying across it ----
function drawStationery(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, s * 0.6, s * 0.09); ctx.fill();
  const w = s * 1.02, h = s * 1.18, nx = x - w * 0.5, ny = y - h;
  // notebook cover
  rrectSprite(ctx, nx, ny, w, h, s * 0.06); ctx.fillStyle = '#1f9ad9'; ctx.fill();
  ctx.strokeStyle = '#0f5e8a'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // ruled white label area
  ctx.fillStyle = '#f4f7fb'; rrectSprite(ctx, nx + w * 0.18, ny + h * 0.14, w * 0.68, h * 0.7, s * 0.03); ctx.fill();
  ctx.strokeStyle = 'rgba(120,150,170,0.7)'; ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    const ly = ny + h * 0.14 + (h * 0.7) * (i / 5);
    ctx.beginPath(); ctx.moveTo(nx + w * 0.22, ly); ctx.lineTo(nx + w * 0.8, ly); ctx.stroke();
  }
  // spiral binding down the left
  ctx.strokeStyle = '#9aa3ab'; ctx.lineWidth = Math.max(1.5, s * 0.05);
  for (let i = 0; i < 7; i++) {
    const sy = ny + h * 0.08 + (h * 0.84) * (i / 6);
    ctx.beginPath(); ctx.arc(nx + w * 0.07, sy, s * 0.05, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
  }
  // a yellow pencil lying diagonally across the cover
  ctx.save(); ctx.translate(x + s * 0.05, y - h * 0.5); ctx.rotate(-0.6);
  const pl = s * 1.04, pw = s * 0.14;
  ctx.fillStyle = '#f0c020'; ctx.fillRect(-pl * 0.5, -pw * 0.5, pl * 0.80, pw);          // body
  ctx.fillStyle = '#d8a800'; ctx.fillRect(-pl * 0.5, 0, pl * 0.80, pw * 0.5);            // underside shade
  // sharpened wood tip + graphite
  ctx.fillStyle = '#d8b070'; ctx.beginPath(); ctx.moveTo(pl * 0.30, -pw * 0.5); ctx.lineTo(pl * 0.46, 0); ctx.lineTo(pl * 0.30, pw * 0.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2a2a2a'; ctx.beginPath(); ctx.moveTo(pl * 0.41, -pw * 0.16); ctx.lineTo(pl * 0.46, 0); ctx.lineTo(pl * 0.41, pw * 0.16); ctx.closePath(); ctx.fill();
  // ferrule + pink eraser
  ctx.fillStyle = '#c0c4c8'; ctx.fillRect(-pl * 0.5, -pw * 0.5, pl * 0.06, pw);
  ctx.fillStyle = '#e88aa0'; ctx.fillRect(-pl * 0.5 - s * 0.06, -pw * 0.5, s * 0.06, pw);
  ctx.restore();
}

// ---- Lasco: a foil food-drink sachet (the powdered shake) — red/white packet ----
function drawLasco(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x + s * 0.04, y + s * 0.05, s * 0.5, s * 0.08); ctx.fill();
  const w = s * 0.74, h = s * 1.12, bx = x - w * 0.5, by = y - h;
  // crimped top seal (ribbed)
  ctx.fillStyle = '#d8d8d8'; ctx.fillRect(bx - s * 0.02, by, w + s * 0.04, h * 0.12);
  ctx.strokeStyle = 'rgba(150,150,150,0.9)'; ctx.lineWidth = 1;
  for (let i = 1; i < 7; i++) { const lx = bx + (w / 7) * i; ctx.beginPath(); ctx.moveTo(lx, by); ctx.lineTo(lx, by + h * 0.12); ctx.stroke(); }
  // red packet body
  rrectSprite(ctx, bx, by + h * 0.10, w, h * 0.86, s * 0.04); ctx.fillStyle = '#cf2030'; ctx.fill();
  ctx.strokeStyle = '#8a121c'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // white label band with brand text
  ctx.fillStyle = '#f4f4f4'; ctx.fillRect(bx, by + h * 0.40, w, h * 0.26);
  if (s >= 14) {
    ctx.fillStyle = '#cf2030'; ctx.font = '700 ' + Math.round(s * 0.18) + 'px "Arial", "Helvetica", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('LASCO', x, by + h * 0.53);
  }
  // a little glass-of-shake icon below the band
  ctx.fillStyle = '#f0d8a0'; rrectSprite(ctx, x - w * 0.14, by + h * 0.70, w * 0.28, h * 0.16, s * 0.02); ctx.fill();
  // foil sheen
  ctx.fillStyle = 'rgba(255,255,255,0.30)'; ctx.fillRect(bx + w * 0.14, by + h * 0.14, w * 0.1, h * 0.7);
}

// ============================================================================
// Roadside characters — broom-selling rasta + the donkey coconut cart
// ============================================================================

// ---- broom man: a rasta walking the road selling brooms — a knitted red/gold/green
// tam with locks, and a bundle of light-brown wooden broom handles slung over the
// shoulder with their dried-brown-leaf heads splayed up.
function drawBroomMan(ctx, x, y, s) {
  // the man, in an earth-tone shirt
  person(ctx, x, y, s, '#3a6a3a');

  // ---- bundle of thatch yard brooms over the (viewer-left) shoulder ----
  // Each broom is a straight handle with a FILLED tapered straw head at the top and a
  // dark binding wrap where head meets handle — solid shapes that read as brooms at
  // road distance, instead of a tangle of thin fan lines.
  const sxk = x - s * 0.18, syk = y - s * 0.82;     // shoulder anchor
  const handles = ['#c8a86a', '#a07c40', '#c8a86a'];
  for (let i = 0; i < 3; i++) {
    const ang = -0.95 + i * 0.17;                    // fan the bundle up-right
    const tipX = sxk + Math.cos(ang) * s * 1.30, tipY = syk + Math.sin(ang) * s * 1.30;
    // handle, running from just behind the shoulder up to the head
    ctx.strokeStyle = handles[i]; ctx.lineWidth = Math.max(2, s * 0.07); ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(sxk - Math.cos(ang) * s * 0.35, syk - Math.sin(ang) * s * 0.35);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    // straw head: a filled taper widening from the binding out past the handle tip
    const hx = Math.cos(ang), hy2 = Math.sin(ang);           // along the handle
    const px2 = -hy2, py2 = hx;                              // perpendicular
    const baseX = tipX - hx * s * 0.10, baseY = tipY - hy2 * s * 0.10;
    const endX = tipX + hx * s * 0.52, endY = tipY + hy2 * s * 0.52;
    ctx.fillStyle = i % 2 ? '#c89a38' : '#d8b24a';
    ctx.beginPath();
    ctx.moveTo(baseX + px2 * s * 0.05, baseY + py2 * s * 0.05);
    ctx.lineTo(endX + px2 * s * 0.20, endY + py2 * s * 0.20);
    ctx.lineTo(endX - px2 * s * 0.20, endY - py2 * s * 0.20);
    ctx.lineTo(baseX - px2 * s * 0.05, baseY - py2 * s * 0.05);
    ctx.closePath(); ctx.fill();
    // a few darker straw streaks so the head reads as bound thatch
    ctx.strokeStyle = '#a8842c'; ctx.lineWidth = Math.max(1, s * 0.025);
    for (const f of [-0.6, 0, 0.6]) {
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(endX + px2 * s * 0.16 * f, endY + py2 * s * 0.16 * f);
      ctx.stroke();
    }
    // binding wrap at the neck of the head
    ctx.strokeStyle = '#5a3a18'; ctx.lineWidth = Math.max(2, s * 0.06);
    ctx.beginPath();
    ctx.moveTo(baseX + px2 * s * 0.08, baseY + py2 * s * 0.08);
    ctx.lineTo(baseX - px2 * s * 0.08, baseY - py2 * s * 0.08);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';

  // ---- knitted RASTA TAM over the crown, with a couple of locks ----
  ctx.fillStyle = '#1f7a34';
  ctx.beginPath(); ctx.arc(x, y - s * 1.10, s * 0.27, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.fillStyle = '#f0c020'; ctx.fillRect(x - s * 0.27, y - s * 1.15, s * 0.54, s * 0.045);
  ctx.fillStyle = '#c0241c'; ctx.fillRect(x - s * 0.27, y - s * 1.10, s * 0.54, s * 0.045);
  ctx.fillStyle = '#15110a'; ctx.fillRect(x - s * 0.24, y - s * 1.04, s * 0.48, s * 0.04); // headband
  ctx.strokeStyle = '#1a120a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
  for (const lx of [-0.2, 0.2]) {
    ctx.beginPath(); ctx.moveTo(x + s * lx, y - s * 1.02);
    ctx.quadraticCurveTo(x + s * lx * 1.25, y - s * 0.9, x + s * lx, y - s * 0.76); ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

// ---- coconut cart: a tired old donkey hauling a wooden cart piled with coconuts,
// a straw-hatted higgler driving it and bawling "Coconut!". A rare rural sight.
function drawCoconutCart(ctx, x, y, s) {
  const donkey = '#9a9286', donkeyDk = '#6f685d';
  const wood = '#9a6a34', woodDk = '#6a4820';
  // long ground shadow under donkey + cart
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ellipsePath(ctx, x, y + s * 0.05, s * 1.5, s * 0.13); ctx.fill();

  // ===== DONKEY (left) — head drooping low, old & tired =====
  const dx = x - s * 1.05, by = y - s * 0.5;
  ctx.strokeStyle = donkeyDk; ctx.lineWidth = Math.max(1.5, s * 0.1); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(dx - s * 0.2, by); ctx.lineTo(dx - s * 0.22, y);
  ctx.moveTo(dx + s * 0.02, by); ctx.lineTo(dx + s * 0.0, y);
  ctx.moveTo(dx + s * 0.18, by); ctx.lineTo(dx + s * 0.2, y);
  ctx.moveTo(dx + s * 0.34, by); ctx.lineTo(dx + s * 0.36, y);
  ctx.stroke();
  // sway-backed body
  ctx.beginPath(); ctx.ellipse(dx + s * 0.08, by - s * 0.05, s * 0.42, s * 0.24, 0.06, 0, Math.PI * 2);
  ctx.fillStyle = donkey; ctx.fill();
  ctx.beginPath(); ctx.ellipse(dx + s * 0.08, by + s * 0.06, s * 0.36, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fillStyle = donkeyDk; ctx.fill();   // belly shadow
  // rib hints
  ctx.strokeStyle = 'rgba(80,72,60,0.5)'; ctx.lineWidth = Math.max(1, s * 0.02);
  for (const rx of [-0.06, 0.04, 0.14]) { ctx.beginPath(); ctx.moveTo(dx + s * rx, by - s * 0.14); ctx.lineTo(dx + s * rx, by + s * 0.04); ctx.stroke(); }
  // drooping neck + low head
  ctx.strokeStyle = donkey; ctx.lineWidth = Math.max(2, s * 0.2); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(dx - s * 0.28, by - s * 0.12);
  ctx.quadraticCurveTo(dx - s * 0.5, by - s * 0.02, dx - s * 0.56, by + s * 0.18); ctx.stroke();
  ctx.fillStyle = donkey; ctx.beginPath(); ctx.ellipse(dx - s * 0.6, by + s * 0.24, s * 0.16, s * 0.1, 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = donkeyDk; ctx.beginPath(); ctx.ellipse(dx - s * 0.66, by + s * 0.3, s * 0.07, s * 0.06, 0.5, 0, Math.PI * 2); ctx.fill();
  // long ears flopped down (tired)
  ctx.strokeStyle = donkey; ctx.lineWidth = Math.max(1.5, s * 0.07);
  ctx.beginPath(); ctx.moveTo(dx - s * 0.54, by + s * 0.12); ctx.lineTo(dx - s * 0.62, by + s * 0.3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(dx - s * 0.5, by + s * 0.12); ctx.lineTo(dx - s * 0.5, by + s * 0.32); ctx.stroke();
  // sad half-closed eye
  ctx.fillStyle = '#1a1208'; ctx.beginPath(); ctx.arc(dx - s * 0.58, by + s * 0.2, Math.max(1, s * 0.03), 0, Math.PI * 2); ctx.fill();
  // tail
  ctx.strokeStyle = donkeyDk; ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath(); ctx.moveTo(dx + s * 0.48, by - s * 0.16); ctx.lineTo(dx + s * 0.56, by + s * 0.06); ctx.stroke();
  ctx.lineCap = 'butt';

  // ===== shaft from donkey back to the cart =====
  ctx.strokeStyle = woodDk; ctx.lineWidth = Math.max(1.5, s * 0.05);
  ctx.beginPath(); ctx.moveTo(dx + s * 0.4, by + s * 0.05); ctx.lineTo(x + s * 0.05, y - s * 0.42); ctx.stroke();

  // ===== CART (right) =====
  const cw = s * 1.0, ch = s * 0.5, cbx = x + s * 0.05, cby = y - s * 0.86;
  rrectSprite(ctx, cbx, cby, cw, ch, s * 0.04); ctx.fillStyle = wood; ctx.fill();
  ctx.strokeStyle = woodDk; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  ctx.strokeStyle = 'rgba(60,40,16,0.5)'; ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(cbx, cby + ch * (i / 4)); ctx.lineTo(cbx + cw, cby + ch * (i / 4)); ctx.stroke(); }
  // big spoked wheel (near side)
  const wx = cbx + cw * 0.5, wy = y - s * 0.04, wr = s * 0.3;
  ctx.fillStyle = '#2a1c0e'; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = wood; ctx.beginPath(); ctx.arc(wx, wy, wr * 0.82, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = woodDk; ctx.lineWidth = Math.max(1.5, s * 0.05);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(a) * wr * 0.78, wy + Math.sin(a) * wr * 0.78); ctx.stroke(); }
  ctx.fillStyle = '#3a2810'; ctx.beginPath(); ctx.arc(wx, wy, wr * 0.16, 0, Math.PI * 2); ctx.fill();
  // ===== heap of COCONUTS piled in the bed =====
  const heap = [
    [-0.3, -0.08, '#3f7a2a'], [-0.1, -0.16, '#6a4a24'], [0.1, -0.1, '#3f7a2a'],
    [0.3, -0.14, '#7a5a2a'], [0.0, -0.28, '#4f8a30'], [0.2, -0.3, '#6a4a24'], [-0.18, -0.32, '#3f7a2a'],
  ];
  for (const [ox, oy, c] of heap) {
    const ccx = cbx + cw * 0.5 + cw * ox, ccy = cby + ch * 0.2 + s * oy;
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(ccx, ccy, s * 0.16, s * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(ccx - s * 0.05, ccy - s * 0.06, s * 0.04, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(ccx, ccy, s * 0.16, s * 0.18, 0, 0, Math.PI * 2); ctx.stroke();
  }
  // ===== DRIVER perched at the back of the cart =====
  const mx = cbx + cw * 0.92, mtop = y - s * 0.5;
  ctx.fillStyle = '#b06a2a'; rrectSprite(ctx, mx - s * 0.12, mtop - s * 0.3, s * 0.24, s * 0.4, s * 0.05); ctx.fill();
  ctx.fillStyle = '#7a5030'; ctx.beginPath(); ctx.arc(mx, mtop - s * 0.42, s * 0.13, 0, Math.PI * 2); ctx.fill();
  // straw hat
  ctx.fillStyle = '#d8b56a'; ctx.beginPath(); ctx.ellipse(mx, mtop - s * 0.5, s * 0.22, s * 0.06, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(mx, mtop - s * 0.52, s * 0.11, Math.PI, 0); ctx.fill();
  // arm with a switch toward the donkey
  ctx.strokeStyle = '#7a5030'; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(mx - s * 0.08, mtop - s * 0.2); ctx.lineTo(mx - s * 0.3, mtop - s * 0.34); ctx.stroke();
  ctx.lineCap = 'butt';

  // ===== "Coconut!" shout-bubble (only when big enough to read) =====
  if (s >= 16) {
    const bw = s * 1.0, bh = s * 0.42, bx2 = mx - bw * 0.2, btop = mtop - s * 1.12;
    ctx.fillStyle = '#ffffff'; rrectSprite(ctx, bx2, btop, bw, bh, s * 0.1); ctx.fill();
    ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
    // tail pointing down to the driver
    ctx.fillStyle = '#ffffff'; ctx.beginPath();
    ctx.moveTo(bx2 + bw * 0.18, btop + bh); ctx.lineTo(bx2 + bw * 0.08, btop + bh + s * 0.16); ctx.lineTo(bx2 + bw * 0.32, btop + bh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1a6a2a'; ctx.font = '700 ' + Math.round(s * 0.24) + 'px "Arial", "Helvetica", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Coconut!', bx2 + bw * 0.5, btop + bh * 0.5);
  }
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
  // A growing GANJA PLANT, not a vague bud: a central stalk carrying tiers of the
  // unmistakable serrated fan leaves — long centre finger, shorter fingers splayed
  // either side — darker below, brighter at the crown, like the real plant.
  const col = '#3f7a3a', dark = '#256020', hi = '#5fa050';
  ctx.fillStyle = 'rgba(0,0,0,0.18)'; ellipsePath(ctx, x + s * 0.03, y + s * 0.03, s * 0.34, s * 0.06); ctx.fill();
  // one slim serrated leaflet (a cannabis leaf "finger"): pointed, edges notched
  const finger = (bx, by, a, len, w) => {
    const tx = bx + Math.cos(a) * len, ty = by + Math.sin(a) * len;
    const px = -Math.sin(a), py = Math.cos(a);            // perpendicular for width/serration
    ctx.beginPath(); ctx.moveTo(bx, by);
    for (const [f, ww] of [[0.3, 1], [0.45, 0.55], [0.62, 0.9], [0.78, 0.45], [1, 0]]) {
      ctx.lineTo(bx + (tx - bx) * f + px * w * ww, by + (ty - by) * f + py * w * ww);
    }
    for (const [f, ww] of [[0.78, 0.45], [0.62, 0.9], [0.45, 0.55], [0.3, 1]]) {
      ctx.lineTo(bx + (tx - bx) * f - px * w * ww, by + (ty - by) * f - py * w * ww);
    }
    ctx.closePath(); ctx.fill();
  };
  // one fan leaf at (lx,ly) pointing along `up`: 7 fingers, centre longest
  const fanLeaf = (lx, ly, up, size, colr) => {
    ctx.fillStyle = colr;
    for (const [da, lf] of [[0, 1], [-0.5, 0.82], [0.5, 0.82], [-1.0, 0.6], [1.0, 0.6], [-1.5, 0.38], [1.5, 0.38]]) {
      finger(lx, ly, up + da, size * lf, size * 0.09);
    }
  };
  // stalk
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.5, s * 0.07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + s * 0.03, y - s * 0.5, x, y - s * 0.92); ctx.stroke();
  // lower tier: two side leaves drooping outward (older, darker)
  fanLeaf(x - s * 0.04, y - s * 0.34, Math.PI * 1.12, s * 0.34, dark);
  fanLeaf(x + s * 0.04, y - s * 0.34, -Math.PI * 0.12, s * 0.34, dark);
  // mid tier: two leaves angled up at 45° either side
  fanLeaf(x - s * 0.02, y - s * 0.58, -Math.PI * 0.75, s * 0.38, col);
  fanLeaf(x + s * 0.02, y - s * 0.58, -Math.PI * 0.25, s * 0.38, col);
  // crown: the classic upright fan leaf (brightest — the icon silhouette)
  fanLeaf(x, y - s * 0.9, -Math.PI / 2, s * 0.46, hi);
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
// Victim looks, keyed by the entity type that was actually hit — the knocked-down
// figure keeps the same shirt / coat as the walking sprite so the player recognises
// exactly who they plowed through. Falls back to a generic look for unknown types.
const ROADKILL_LOOK = {
  hustler:   { shirt: '#d06a30' },
  jaywalker: { shirt: '#3f7a9a' },
  beggar:    { shirt: '#6a6a72', wheel: true },     // his overturned wheelchair wheel
  vendor:    { shirt: '#c0392b', fruit: true },     // her spilled fruit rolls loose
  peanutcart:{ shirt: '#8a6a3a', fruit: true },
  broomman:  { shirt: '#3a6a3a', brooms: true, tam: true },
  wiper:     { shirt: '#b8b83a' },
  goat:   { body: '#cfc0a0', legs: '#9a8a66', horns: true },
  dog:    { body: '#b08a52', legs: '#6a4a26' },   // matches the live mongrel's tan coat
  cat:    { body: '#8a8a92', legs: '#5a5a62', scale: 0.75 },
  cattle: { body: '#5a3c28', legs: '#3a2418', scale: 1.3, horns: true },
  croc:   { body: '#4a7a3a', legs: '#2f5a26', scale: 1.2 },
};

export function drawRoadkill(ctx, x, y, s, variation, cat, t, type, water) {
  const prog = Math.max(0, Math.min(1, 1 - (t || 0) / 0.7));
  const v = ((variation % 4) + 4) % 4;
  const look = ROADKILL_LOOK[type] || {};
  ctx.save();
  // impact burst — a tan dust puff on the road, a white splash on the river
  // (dust rising off water would break the scene)
  const puff = s * (0.3 + 0.5 * prog);
  ctx.save();
  ctx.globalAlpha = 0.5 * (1 - prog * 0.7);
  if (water) {
    // expanding foam rings + droplets thrown up
    ctx.strokeStyle = '#e8f4f2'; ctx.lineWidth = Math.max(1.5, s * 0.07);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.ellipse(x, y + s * 0.06, puff * (0.5 + 0.3 * i), puff * (0.2 + 0.12 * i), 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = '#dff0ee';
    for (let i = 0; i < 5; i++) {
      const a = i * 1.25 + v;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * puff * 0.6, y - puff * (0.3 + 0.25 * Math.sin(a * 2)), s * 0.045, 0, Math.PI * 2); ctx.fill();
    }
  } else {
    ctx.fillStyle = '#b6ac96';
    for (let i = 0; i < 4; i++) {
      const a = i * 1.6 + v;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * puff * 0.7, y + s * 0.06 + Math.sin(a) * puff * 0.3, puff * (0.36 + 0.14 * i), 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.restore();

  if (cat === 'animal') {
    // an animal knocked onto its side, legs out — startled, not gory
    const as = s * (look.scale || 1);
    ctx.fillStyle = look.body || '#7a5a36';
    ctx.beginPath(); ctx.ellipse(x, y - as * 0.02, as * 0.42, as * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = look.legs || '#4a3420'; ctx.lineWidth = Math.max(1.5, as * 0.07); ctx.lineCap = 'round';
    for (const dx of [-0.18, 0.0, 0.18]) {
      ctx.beginPath(); ctx.moveTo(x + as * dx, y - as * 0.08); ctx.lineTo(x + as * dx + as * 0.06, y - as * 0.34); ctx.stroke();
    }
    if (look.horns) {
      ctx.strokeStyle = '#d8ccb0'; ctx.lineWidth = Math.max(1.5, as * 0.06);
      ctx.beginPath(); ctx.moveTo(x - as * 0.38, y - as * 0.16); ctx.lineTo(x - as * 0.5, y - as * 0.3);
      ctx.moveTo(x - as * 0.32, y - as * 0.2); ctx.lineTo(x - as * 0.38, y - as * 0.36); ctx.stroke();
    }
    ctx.lineCap = 'butt'; ctx.restore(); return;
  }

  // a person knocked down — intact, sitting up dazed, arms thrown up (the flailing hands)
  const skin = '#7a4a28', shirt = look.shirt || '#3f7a9a';
  // the victim's signature belongings scattered by the impact — who you hit stays legible
  if (look.brooms) {
    ctx.strokeStyle = '#c8a86a'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.lineCap = 'round';
    for (const [bx, by, ba] of [[-0.7, 0.16, 0.3], [0.55, 0.22, -0.2]]) {
      const hx = x + s * bx, hy2 = y + s * by;
      ctx.beginPath(); ctx.moveTo(hx, hy2); ctx.lineTo(hx + Math.cos(ba) * s * 0.7, hy2 + Math.sin(ba) * s * 0.14); ctx.stroke();
      ctx.fillStyle = '#d8b24a';
      ctx.beginPath(); ctx.ellipse(hx - Math.cos(ba) * s * 0.12, hy2 + s * 0.01, s * 0.14, s * 0.07, ba, 0, Math.PI * 2); ctx.fill();
    }
    ctx.lineCap = 'butt';
  }
  if (look.fruit) {
    for (const [fx, fy, fc] of [[-0.6, 0.18, '#e8a020'], [0.62, 0.1, '#d04a2a'], [0.45, 0.26, '#e8d24a']]) {
      ctx.fillStyle = fc; ctx.beginPath(); ctx.arc(x + s * fx, y + s * fy, s * 0.09, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (look.wheel) {
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = Math.max(1.5, s * 0.05);
    ctx.beginPath(); ctx.arc(x + s * 0.62, y + s * 0.04, s * 0.2, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    for (let k = 0; k < 3; k++) {
      const a = k * 2.1 + prog * 2;
      ctx.moveTo(x + s * 0.62, y + s * 0.04);
      ctx.lineTo(x + s * 0.62 + Math.cos(a) * s * 0.2, y + s * 0.04 + Math.sin(a) * s * 0.2);
    }
    ctx.stroke();
  }
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
  // head + hair (no blood) — the broom seller keeps his knitted rasta tam
  ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.06, s * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = look.tam ? '#1f7a34' : '#1c1208';
  ctx.beginPath(); ctx.arc(-s * 0.3, -s * 0.1, s * 0.13, Math.PI, 0); ctx.fill();
  if (look.tam) {
    ctx.fillStyle = '#f0c020'; ctx.fillRect(-s * 0.43, -s * 0.115, s * 0.26, s * 0.025);
    ctx.fillStyle = '#c0241c'; ctx.fillRect(-s * 0.43, -s * 0.09, s * 0.26, s * 0.025);
  }
  // dazed "seeing stars" circling the head — a cartoon ouch, not gore
  ctx.fillStyle = '#f0c020';
  for (let k = 0; k < 3; k++) {
    const a = prog * 6 + k * 2.1;
    star(ctx, -s * 0.3 + Math.cos(a) * s * 0.24, -s * 0.3 + Math.sin(a) * s * 0.12, s * 0.05);
  }
  ctx.restore();
}

// Ripe plantain — a hand of two fat yellow plantains, black-tipped and sugar-flecked
// (ripe, not green), joined at the crown.
function drawPlantain(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.05, s * 0.46, s * 0.09); ctx.fill();
  for (const [dx, rot] of [[-0.10, -0.28], [0.12, -0.06]]) {
    ctx.save();
    ctx.translate(x + s * dx, y - s * 0.30); ctx.rotate(rot);
    // the fruit: a fat crescent
    ctx.fillStyle = '#e8c020';
    ctx.beginPath();
    ctx.moveTo(-s * 0.10, s * 0.30);
    ctx.quadraticCurveTo(-s * 0.30, 0, -s * 0.08, -s * 0.30);
    ctx.lineTo(s * 0.08, -s * 0.26);
    ctx.quadraticCurveTo(-s * 0.08, 0, s * 0.10, s * 0.26);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#a8842c'; ctx.lineWidth = Math.max(1, s * 0.025); ctx.stroke();
    // ridge line + ripe sugar flecks + black tips
    ctx.strokeStyle = '#c8a02c'; ctx.lineWidth = Math.max(1, s * 0.02);
    ctx.beginPath(); ctx.moveTo(-s * 0.06, s * 0.24); ctx.quadraticCurveTo(-s * 0.18, 0, -s * 0.02, -s * 0.24); ctx.stroke();
    ctx.fillStyle = '#6b4a1a';
    for (const [fx, fy] of [[-0.14, 0.08], [-0.08, -0.10], [-0.16, -0.02]]) {
      ctx.beginPath(); ctx.ellipse(s * fx, s * fy, s * 0.03, s * 0.015, 0.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#241a0a';
    ctx.beginPath(); ctx.arc(-s * 0.09, s * 0.29, s * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  // the crown joining the hand
  ctx.fillStyle = '#8a6a28';
  ctx.beginPath(); ctx.arc(x + s * 0.02, y - s * 0.60, s * 0.07, 0, Math.PI * 2); ctx.fill();
}

// Roast breadfruit — the round country staple, roasted: charred green-brown skin with
// the tell-tale dimple grid, split to show the steaming cream heart.
function drawBreadfruit(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.05, s * 0.44, s * 0.09); ctx.fill();
  const cy = y - s * 0.30, R = s * 0.34;
  // charred-roast body (green-brown)
  ctx.fillStyle = '#6b6a2c';
  ctx.beginPath(); ctx.arc(x, cy, R, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a3418'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // char patches from the coal fire
  ctx.fillStyle = 'rgba(30,24,10,0.55)';
  ctx.beginPath(); ctx.arc(x - R * 0.45, cy + R * 0.35, R * 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + R * 0.55, cy - R * 0.15, R * 0.25, 0, Math.PI * 2); ctx.fill();
  // the dimpled skin grid
  ctx.fillStyle = 'rgba(20,20,8,0.35)';
  for (let gy = -2; gy <= 2; gy++) {
    for (let gx = -2; gx <= 2; gx++) {
      const px = x + gx * R * 0.32, py = cy + gy * R * 0.32;
      if ((px - x) ** 2 + (py - cy) ** 2 < (R * 0.85) ** 2) {
        ctx.beginPath(); ctx.arc(px, py, Math.max(1, R * 0.06), 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  // split open at the top — creamy roasted heart + stem
  ctx.fillStyle = '#f2e2b8';
  ctx.beginPath(); ctx.ellipse(x + R * 0.1, cy - R * 0.55, R * 0.42, R * 0.20, 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c8a86a'; ctx.lineWidth = Math.max(1, s * 0.02); ctx.stroke();
  ctx.strokeStyle = '#4a5a20'; ctx.lineWidth = Math.max(1.5, s * 0.04); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - R * 0.5, cy - R * 0.75); ctx.lineTo(x - R * 0.7, cy - R * 1.05); ctx.stroke();
  ctx.lineCap = 'butt';
}

// ── Di Principal's road objects ───────────────────────────────────────────────
// brass hand bell — one ring and di pickney scatter (clears the road)
function drawSchoolBell(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.38, s * 0.09); ctx.fill();
  // wooden handle
  ctx.strokeStyle = '#6a4420'; ctx.lineWidth = Math.max(2, s * 0.09); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x, y - s * 0.52); ctx.lineTo(x, y - s * 0.78); ctx.stroke(); ctx.lineCap = 'butt';
  // brass dome + flared rim
  ctx.fillStyle = '#d8a020';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.30, y - s * 0.10);
  ctx.quadraticCurveTo(x - s * 0.30, y - s * 0.56, x, y - s * 0.56);
  ctx.quadraticCurveTo(x + s * 0.30, y - s * 0.56, x + s * 0.30, y - s * 0.10);
  ctx.lineTo(x + s * 0.36, y - s * 0.02); ctx.lineTo(x - s * 0.36, y - s * 0.02);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#8a6210'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
  // shine + clapper
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.beginPath(); ctx.ellipse(x - s * 0.12, y - s * 0.38, s * 0.05, s * 0.12, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a3210'; ctx.beginPath(); ctx.arc(x, y + s * 0.02, s * 0.06, 0, Math.PI * 2); ctx.fill();
}
// exercise book + chalk — after-school extra lessons (the fees are the pickup)
function drawExtraLessons(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.42, s * 0.09); ctx.fill();
  ctx.save();
  ctx.translate(x, y - s * 0.24); ctx.rotate(-0.08);
  ctx.fillStyle = '#3f9a5f'; ctx.fillRect(-s * 0.34, -s * 0.24, s * 0.68, s * 0.48);
  ctx.strokeStyle = '#1f6a3a'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.strokeRect(-s * 0.34, -s * 0.24, s * 0.68, s * 0.48);
  ctx.fillStyle = '#f4f1e6'; ctx.fillRect(-s * 0.26, -s * 0.16, s * 0.52, s * 0.14);
  ctx.fillStyle = '#1f6a3a';
  ctx.font = `700 ${Math.max(6, Math.round(s * 0.14))}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('LESSONS', 0, -s * 0.09);
  // the fee — a folded note tucked in the book
  ctx.fillStyle = '#4a9a4a'; ctx.fillRect(-s * 0.12, s * 0.06, s * 0.30, s * 0.12);
  ctx.strokeStyle = '#2a6a2a'; ctx.strokeRect(-s * 0.12, s * 0.06, s * 0.30, s * 0.12);
  ctx.restore();
}
// the brown envelope — a school-placement bribe (temptation to AVOID)
function drawBrownEnvelope(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.44, s * 0.09); ctx.fill();
  ctx.save();
  ctx.translate(x, y - s * 0.22); ctx.rotate(0.06);
  // cash peeking out the open top
  ctx.fillStyle = '#4a9a4a'; ctx.fillRect(-s * 0.22, -s * 0.34, s * 0.44, s * 0.18);
  ctx.strokeStyle = '#2a6a2a'; ctx.lineWidth = Math.max(1, s * 0.025); ctx.strokeRect(-s * 0.22, -s * 0.34, s * 0.44, s * 0.18);
  // manila envelope
  ctx.fillStyle = '#c8a050'; ctx.fillRect(-s * 0.36, -s * 0.20, s * 0.72, s * 0.42);
  ctx.strokeStyle = '#8a6a28'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.strokeRect(-s * 0.36, -s * 0.20, s * 0.72, s * 0.42);
  // flap creases
  ctx.beginPath();
  ctx.moveTo(-s * 0.36, -s * 0.20); ctx.lineTo(0, s * 0.04); ctx.lineTo(s * 0.36, -s * 0.20);
  ctx.stroke();
  ctx.restore();
}
// PTA meeting notice — a board pon a post that flags yuh down
function drawPtaNotice(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.20)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.36, s * 0.09); ctx.fill();
  ctx.strokeStyle = '#6a4420'; ctx.lineWidth = Math.max(2, s * 0.07);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - s * 0.62); ctx.stroke();
  ctx.fillStyle = '#7a5a9a'; ctx.fillRect(x - s * 0.34, y - s * 0.94, s * 0.68, s * 0.36);
  ctx.strokeStyle = '#4a3468'; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.strokeRect(x - s * 0.34, y - s * 0.94, s * 0.68, s * 0.36);
  ctx.fillStyle = '#f4f1e6';
  ctx.font = `700 ${Math.max(6, Math.round(s * 0.2))}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('PTA', x, y - s * 0.76);
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

// ============================================================================
// Bog Walk river-mode obstacles (Rio Cobre) — all sit on a little water ripple
// ============================================================================
function ripple(ctx, x, y, s) {
  ctx.strokeStyle = 'rgba(220,235,240,0.45)'; ctx.lineWidth = Math.max(1, s * 0.05);
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.1, s * 0.7, s * 0.16, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.1, s * 0.95, s * 0.22, 0, 0, Math.PI * 2); ctx.stroke();
}
// generic floating bottle — NO brand/logo (stylised litter, "Red Stripe"-safe)
function floatBottle(ctx, x, y, s) {
  ripple(ctx, x, y, s);
  ctx.save(); ctx.translate(x, y - s * 0.08); ctx.rotate(-0.35);
  ctx.fillStyle = '#cf3b2c';                                   // generic brown/red glass
  rrectSprite(ctx, -s * 0.5, -s * 0.16, s * 1.0, s * 0.32, s * 0.12); ctx.fill();
  ctx.fillStyle = '#8a1f14'; rrectSprite(ctx, s * 0.34, -s * 0.09, s * 0.22, s * 0.18, s * 0.05); ctx.fill(); // neck
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; rrectSprite(ctx, -s * 0.42, -s * 0.12, s * 0.7, s * 0.06, s * 0.03); ctx.fill();
  ctx.restore();
}
function plasticBag(ctx, x, y, s) {
  ripple(ctx, x, y, s);
  ctx.fillStyle = 'rgba(210,228,234,0.75)';
  ctx.beginPath();
  ctx.moveTo(x - s * 0.4, y);
  ctx.quadraticCurveTo(x - s * 0.55, y - s * 0.5, x - s * 0.1, y - s * 0.42);
  ctx.quadraticCurveTo(x + s * 0.2, y - s * 0.6, x + s * 0.45, y - s * 0.3);
  ctx.quadraticCurveTo(x + s * 0.55, y - s * 0.02, x + s * 0.3, y);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(160,185,195,0.8)'; ctx.lineWidth = Math.max(1, s * 0.03); ctx.stroke();
}
function crocodile(ctx, x, y, s, seed) {
  ripple(ctx, x, y, s);
  const g = ['#2f4f2c', '#3a5f36', '#264726'];
  // low body ridge just above the water
  ctx.fillStyle = g[0];
  ctx.beginPath(); ctx.ellipse(x, y - s * 0.05, s * 0.85, s * 0.2, 0, Math.PI, Math.PI * 2); ctx.fill();
  // snout
  ctx.fillStyle = g[1]; rrectSprite(ctx, x + s * 0.4, y - s * 0.16, s * 0.6, s * 0.16, s * 0.05); ctx.fill();
  // dorsal scutes
  ctx.fillStyle = g[2];
  for (let i = -3; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(x + i * s * 0.22, y - s * 0.12); ctx.lineTo(x + i * s * 0.22 + s * 0.08, y - s * 0.32); ctx.lineTo(x + i * s * 0.22 + s * 0.16, y - s * 0.12); ctx.closePath(); ctx.fill(); }
  // eyes above the waterline
  ctx.fillStyle = '#e8d24a'; ellipsePath(ctx, x + s * 0.2, y - s * 0.22, s * 0.07, s * 0.07); ctx.fill();
  ellipsePath(ctx, x + s * 0.02, y - s * 0.22, s * 0.07, s * 0.07); ctx.fill();
  ctx.fillStyle = '#101008'; ellipsePath(ctx, x + s * 0.2, y - s * 0.22, s * 0.03, s * 0.05); ctx.fill();
  ellipsePath(ctx, x + s * 0.02, y - s * 0.22, s * 0.03, s * 0.05); ctx.fill();
  // teeth on the snout
  ctx.fillStyle = '#f0efe0';
  for (let i = 0; i < 5; i++) { ctx.fillRect(x + s * 0.44 + i * s * 0.11, y - s * 0.02, s * 0.03, s * 0.05); }
}
// half-submerged car wreck — burnt (charred) or a rusted floating hulk
function riverCar(ctx, x, y, s, burnt) {
  ripple(ctx, x, y, s);
  const body = burnt ? '#241f1c' : '#6a6f66', roof = burnt ? '#120f0d' : '#4c5048';
  ctx.fillStyle = body; rrectSprite(ctx, x - s * 0.7, y - s * 0.28, s * 1.4, s * 0.34, s * 0.08); ctx.fill();
  ctx.fillStyle = roof;
  ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.28); ctx.lineTo(x + s * 0.35, y - s * 0.28); ctx.lineTo(x + s * 0.2, y - s * 0.6); ctx.lineTo(x - s * 0.25, y - s * 0.6); ctx.closePath(); ctx.fill();
  if (burnt) {
    // scorched windows + a curl of smoke
    ctx.fillStyle = '#0a0806'; ctx.fillRect(x - s * 0.22, y - s * 0.56, s * 0.4, s * 0.24);
    ctx.strokeStyle = 'rgba(120,120,120,0.5)'; ctx.lineWidth = Math.max(1, s * 0.05);
    ctx.beginPath(); ctx.moveTo(x, y - s * 0.6); ctx.quadraticCurveTo(x + s * 0.14, y - s * 0.85, x - s * 0.04, y - s * 1.05); ctx.stroke();
  } else {
    ctx.fillStyle = '#8aa6b0'; ctx.fillRect(x - s * 0.22, y - s * 0.56, s * 0.4, s * 0.22); // glass
    ctx.fillStyle = 'rgba(120,90,50,0.5)'; ctx.fillRect(x - s * 0.7, y - s * 0.1, s * 1.4, s * 0.08); // rust waterline
  }
}
// jutting limestone boulder (also used along the banks in scenery)
function limestoneRock(ctx, x, y, s, seed) {
  ripple(ctx, x, y, s);
  const base = Math.floor((seed || 0.3) * 2147483647);
  jaggedPath(ctx, x, y - s * 0.25, s * 0.8, s * 0.6, 11, mulberry32(base ^ 0x5b17), 0.22);
  ctx.fillStyle = '#c9b78a'; ctx.fill();
  ctx.strokeStyle = '#9a8656'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // shaded clefts + sunlit top
  ctx.fillStyle = 'rgba(255,250,225,0.4)'; jaggedPath(ctx, x - s * 0.12, y - s * 0.5, s * 0.4, s * 0.22, 9, mulberry32(base ^ 0x1a2b), 0.2); ctx.fill();
  ctx.strokeStyle = 'rgba(90,74,44,0.6)'; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.moveTo(x - s * 0.1, y - s * 0.55); ctx.lineTo(x - s * 0.02, y - s * 0.1); ctx.stroke();
}
// A person SWIMMING the Rio Cobre — kids and adults crossing the channel. Seed picks the
// build (kid vs adult) and the top: a mesh shirt in rasta colours, or a plain white merino.
// Low in the water: head + stroking arm + shirted back above a ripple ring, kick splash behind.
function drawSwimmer(ctx, x, y, s, seed) {
  const r = mulberry32(Math.floor((seed || 0.42) * 2147483647) ^ 0x51ca);
  const kid = r() < 0.35, k = kid ? 0.72 : 1;         // pickney swim likkle
  const mesh = r() < 0.6;                              // mesh rasta top vs white merino
  const stroke = r() * Math.PI * 2;                    // where in the stroke the arm is
  ripple(ctx, x, y, s * k);
  // kick splash behind the feet
  ctx.fillStyle = 'rgba(240,250,250,0.7)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(x - s * k * (0.55 + i * 0.13), y - s * k * (0.02 + (i % 2) * 0.06), s * k * 0.05, 0, Math.PI * 2); ctx.fill();
  }
  const skin = '#6b432a';
  // shirted back arching above the water
  ctx.fillStyle = mesh ? '#1c3a24' : '#eef0ea';        // mesh base is dark under the bands
  ctx.beginPath(); ctx.ellipse(x - s * k * 0.14, y - s * k * 0.14, s * k * 0.34, s * k * 0.15, -0.15, 0, Math.PI * 2); ctx.fill();
  if (mesh) {
    // rasta bands across the mesh, broken by little holes (drawn as gaps in alpha)
    const bands = ['#2a8a3a', '#e0b020', '#c0392b'];
    for (let b = 0; b < 3; b++) {
      ctx.fillStyle = bands[b];
      ctx.beginPath(); ctx.ellipse(x - s * k * 0.14, y - s * k * (0.20 - b * 0.06), s * k * (0.32 - b * 0.02), s * k * 0.035, -0.15, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = 'rgba(20,30,22,0.35)';             // the mesh weave reads as dark stipple
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(x - s * k * (0.02 + (i % 3) * 0.12), y - s * k * (0.12 + Math.floor(i / 3) * 0.08), s * k * 0.016, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.strokeStyle = '#c9ccc2'; ctx.lineWidth = Math.max(1, s * k * 0.02);   // merino seams
    ctx.beginPath(); ctx.ellipse(x - s * k * 0.14, y - s * k * 0.14, s * k * 0.34, s * k * 0.15, -0.15, 0, Math.PI * 2); ctx.stroke();
  }
  // head up for a breath
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(x + s * k * 0.26, y - s * k * 0.24, s * k * 0.13, 0, Math.PI * 2); ctx.fill();
  // the reaching stroke arm — arcs out of the water ahead
  const lift = 0.5 + 0.5 * Math.sin(stroke);           // frozen mid-stroke per spawn
  ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * k * 0.07); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x + s * k * 0.12, y - s * k * 0.14);
  ctx.quadraticCurveTo(x + s * k * 0.38, y - s * k * (0.3 + 0.28 * lift), x + s * k * (0.52 + 0.1 * lift), y - s * k * (0.1 + 0.1 * lift));
  ctx.stroke(); ctx.lineCap = 'butt';
}

// ROCKFALL — a boulder just off the gorge wall: big jagged limestone block sitting on the
// road, loose stones scattered where it bounced, and pale dust still hanging above it so
// it reads as freshly FALLEN, not parked.
function drawRockfall(ctx, x, y, s, seed) {
  const base = Math.floor((seed || 0.33) * 2147483647);
  const vr = mulberry32(base ^ 0x6d2b);
  const scale = 0.85 + vr() * 0.4;
  // ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ellipsePath(ctx, x, y + s * 0.04, s * 0.62 * scale, s * 0.14 * scale); ctx.fill();
  // the boulder — jagged limestone block
  jaggedPath(ctx, x, y - s * 0.34 * scale, s * 0.55 * scale, s * 0.42 * scale, 9, mulberry32(base ^ 0x1c3f), 0.24);
  ctx.fillStyle = '#b3a37c'; ctx.fill();
  ctx.strokeStyle = '#7d6f4e'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
  // sunlit top facet + a shaded cleft
  ctx.fillStyle = 'rgba(250,244,220,0.5)';
  jaggedPath(ctx, x - s * 0.1 * scale, y - s * 0.52 * scale, s * 0.3 * scale, s * 0.14 * scale, 7, mulberry32(base ^ 0x4e11), 0.2); ctx.fill();
  ctx.strokeStyle = 'rgba(70,58,36,0.65)'; ctx.lineWidth = Math.max(1, s * 0.035);
  ctx.beginPath(); ctx.moveTo(x - s * 0.06, y - s * 0.5 * scale); ctx.lineTo(x + s * 0.06, y - s * 0.12); ctx.stroke();
  // loose stones scattered where it bounced
  ctx.fillStyle = '#9a8a68';
  for (let i = 0; i < 4; i++) {
    const a = vr() * Math.PI * 2, rr = 0.55 + vr() * 0.45;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * s * 0.6 * rr, y + Math.sin(a) * s * 0.1 * rr, Math.max(1.5, s * (0.05 + vr() * 0.04)), 0, Math.PI * 2);
    ctx.fill();
  }
  // dust still hanging above — the "it JUST fell" cue
  ctx.fillStyle = 'rgba(214,202,170,0.4)';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(x - s * 0.15 + i * s * 0.16, y - s * (0.72 + i * 0.14) * scale, s * (0.12 + i * 0.045), 0, Math.PI * 2);
    ctx.fill();
  }
}

// A car-tyre rope swing off an overhanging branch — pure river culture. Seed picks the
// moment you catch: somebody STANDING braced on the tyre, LEAPING head-first, or the
// SPLASH just after (empty tyre still swinging). A person in your channel either way.
function drawTyreSwing(ctx, x, y, s, seed) {
  const r = mulberry32(Math.floor((seed || 0.5) * 2147483647) ^ 0x77e1);
  const pose = Math.floor(r() * 3);                     // 0 standing · 1 diving · 2 splashed
  const side = r() < 0.5 ? -1 : 1;                      // which bank the branch reaches from
  const shirt = ['#c0392b', '#e0b020', '#2a8a3a', '#eef0ea'][Math.floor(r() * 4)];
  const skin = '#6b432a';
  const tyX = x, tyY = y - s * 0.72;                    // the tyre hangs above the water
  // overhanging branch coming in from the bank + the rope down to the tyre
  ctx.strokeStyle = '#4a3a20'; ctx.lineWidth = Math.max(2, s * 0.09); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + side * s * 1.5, y - s * 1.9);
  ctx.quadraticCurveTo(x + side * s * 0.6, y - s * 1.78, x + side * s * 0.12, y - s * 1.62); ctx.stroke();
  ctx.fillStyle = '#2f6a30';                            // a tuft of leaves on the branch
  ctx.beginPath(); ctx.ellipse(x + side * s * 1.1, y - s * 1.92, s * 0.42, s * 0.2, side * 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#b09a6a'; ctx.lineWidth = Math.max(1.5, s * 0.045);
  ctx.beginPath(); ctx.moveTo(x + side * s * 0.12, y - s * 1.62); ctx.lineTo(tyX, tyY - s * 0.16); ctx.stroke();
  ctx.lineCap = 'butt';
  // the car tyre (black torus, side-on)
  ctx.strokeStyle = '#15151a'; ctx.lineWidth = Math.max(3, s * 0.13);
  ctx.beginPath(); ctx.arc(tyX, tyY, s * 0.2, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'; ctx.lineWidth = Math.max(1, s * 0.03);
  ctx.beginPath(); ctx.arc(tyX - s * 0.05, tyY - s * 0.06, s * 0.16, Math.PI * 0.9, Math.PI * 1.6); ctx.stroke();
  if (pose === 0) {
    // STANDING braced on top of the tyre, arms wide for balance
    ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.055); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(tyX - s * 0.05, tyY - s * 0.48); ctx.lineTo(tyX - s * 0.28, tyY - s * 0.6);
    ctx.moveTo(tyX + s * 0.05, tyY - s * 0.48); ctx.lineTo(tyX + s * 0.28, tyY - s * 0.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tyX - s * 0.045, tyY - s * 0.34); ctx.lineTo(tyX - s * 0.06, tyY - s * 0.2);
    ctx.moveTo(tyX + s * 0.045, tyY - s * 0.34); ctx.lineTo(tyX + s * 0.06, tyY - s * 0.2); ctx.stroke();
    ctx.lineCap = 'butt';
    ctx.fillStyle = shirt; ctx.fillRect(tyX - s * 0.09, tyY - s * 0.56, s * 0.18, s * 0.24);
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(tyX, tyY - s * 0.64, s * 0.075, 0, Math.PI * 2); ctx.fill();
  } else if (pose === 1) {
    // LEAPING off — head-first toward the water beside the tyre, arms reaching
    const dx = -side * s * 0.42, px = tyX + dx, py = tyY + s * 0.12;
    ctx.fillStyle = shirt;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-side * 2.3);
    ctx.fillRect(-s * 0.08, -s * 0.2, s * 0.16, s * 0.34); ctx.restore();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(px + dx * 0.5, py + s * 0.26, s * 0.07, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = skin; ctx.lineWidth = Math.max(2, s * 0.05); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px + dx * 0.5, py + s * 0.3); ctx.lineTo(px + dx * 0.85, py + s * 0.44); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - dx * 0.2, py - s * 0.24); ctx.lineTo(px - dx * 0.55, py - s * 0.36); ctx.stroke();
    ctx.lineCap = 'butt';
  } else {
    // JUST SPLASHED — empty tyre, a white plume where they went in
    ripple(ctx, x - side * s * 0.35, y, s * 0.7);
    ctx.fillStyle = 'rgba(240,250,250,0.85)';
    for (const [ox, oy, rr] of [[0, -0.16, 0.09], [-0.14, -0.05, 0.06], [0.13, -0.06, 0.06], [0, -0.32, 0.05]]) {
      ctx.beginPath(); ctx.arc(x - side * s * 0.35 + ox * s, y + oy * s, rr * s, 0, Math.PI * 2); ctx.fill();
    }
  }
}

// River Mumma — the folklore siren on her rock, now a WHOLE FAMILY of sirens: seed picks
// her skin tone, her build (some are busty — she lures, that's the folklore), her tail
// colour, and her hair. Some wear flowing locks; some wear DREADLOCKS that read as
// appealing thick locks from a distance — but up close (large s = the raft is passing)
// the dreads are SNAKES, heads out and striking after the rider. Tasteful, no explicit
// detail; the danger reads as an eerie shimmer that turns predatory as you close.
function riverMumma(ctx, x, y, s, seed) {
  const r = mulberry32(Math.floor((seed || 0.7) * 2147483647) ^ 0x3fb2);
  const SKINS = ['#6b4a34', '#8a5c3a', '#4a2f1e', '#a06a42'];   // the sirens come in every shade
  const skin = SKINS[Math.floor(r() * SKINS.length)];
  const busty = r() < 0.5;
  const dreads = r() < 0.5;
  const tail = ['#2f8f86', '#3a7fa0', '#3f9a5f'][Math.floor(r() * 3)];
  const close = s >= 30;                                        // the pass-by: snakes come out
  ripple(ctx, x, y, s);
  ctx.save();
  ctx.fillStyle = 'rgba(70,200,190,0.18)'; ellipsePath(ctx, x, y - s * 0.5, s * 0.9, s * 0.9); ctx.fill(); // aura
  // rock she sits on
  ctx.fillStyle = '#9a8a66'; ctx.beginPath(); ctx.ellipse(x, y, s * 0.5, s * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  // tail curving into the water (+ a flick of fin)
  ctx.fillStyle = tail;
  ctx.beginPath(); ctx.moveTo(x + s * 0.1, y - s * 0.2); ctx.quadraticCurveTo(x + s * 0.7, y - s * 0.1, x + s * 0.6, y + s * 0.25);
  ctx.quadraticCurveTo(x + s * 0.4, y + s * 0.1, x + s * 0.1, y - s * 0.05); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x + s * 0.6, y + s * 0.22); ctx.lineTo(x + s * 0.78, y + s * 0.1); ctx.lineTo(x + s * 0.74, y + s * 0.3); ctx.closePath(); ctx.fill();
  // torso in HER skin tone
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(x - s * 0.05, y - s * 0.5, s * 0.2, s * 0.34, 0, 0, Math.PI * 2); ctx.fill();
  if (busty) {
    // a fuller figure — two shaded curves across the chest (cartoon silhouette, nothing explicit)
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.arc(x - s * 0.12, y - s * 0.56, s * 0.085, 0.15, Math.PI - 0.6); ctx.fill();
    ctx.beginPath(); ctx.arc(x + s * 0.03, y - s * 0.56, s * 0.085, 0.45, Math.PI - 0.3); ctx.fill();
  }
  // head in the same tone
  ctx.fillStyle = skin; ellipsePath(ctx, x - s * 0.05, y - s * 0.86, s * 0.15, s * 0.16); ctx.fill();
  if (!dreads) {
    // long flowing dark hair (the folklore detail — she combs it on the rocks)
    ctx.strokeStyle = '#15100a'; ctx.lineWidth = Math.max(1, s * 0.06); ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(x - s * 0.05 + i * s * 0.06, y - s * 0.92);
      ctx.quadraticCurveTo(x - s * 0.35 + i * s * 0.05, y - s * 0.5, x - s * 0.28 + i * s * 0.05, y - s * 0.1);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  } else if (!close) {
    // DISTANT dread siren: thick, appealing rope locks swept over the shoulder
    ctx.strokeStyle = '#241a0e'; ctx.lineWidth = Math.max(1.5, s * 0.085); ctx.lineCap = 'round';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.moveTo(x - s * 0.05 + i * s * 0.055, y - s * 0.94);
      ctx.quadraticCurveTo(x - s * 0.32 + i * s * 0.06, y - s * 0.55, x - s * 0.24 + i * s * 0.07, y - s * 0.12);
      ctx.stroke();
    }
    ctx.lineCap = 'butt';
  } else {
    // CLOSE PASS: the locks ARE snakes — bodies writhing outward, heads striking back
    // toward the passing rider with eyes and bared fangs.
    for (let i = -2; i <= 2; i++) {
      const sway = (i % 2 === 0 ? 1 : -1) * s * 0.12;
      const bx = x - s * 0.05 + i * s * 0.055, by = y - s * 0.94;
      const hx = x - s * (0.36 - Math.abs(i) * 0.04) + i * s * 0.1 + sway * 0.4;
      const hy = y - s * (0.45 - i * 0.09);
      ctx.strokeStyle = '#2c4a1e'; ctx.lineWidth = Math.max(1.5, s * 0.075); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx - s * 0.2 + sway, by + s * 0.25, hx, hy);
      ctx.stroke(); ctx.lineCap = 'butt';
      // striking head — wedge jaw open toward the rider (screen-down / outward)
      ctx.fillStyle = '#3a5f28';
      ctx.beginPath(); ctx.moveTo(hx, hy);
      ctx.lineTo(hx - s * 0.1, hy + s * 0.06); ctx.lineTo(hx - s * 0.02, hy + s * 0.11);
      ctx.closePath(); ctx.fill();
      // eye + fangs
      ctx.fillStyle = '#e8d24a'; ctx.beginPath(); ctx.arc(hx - s * 0.03, hy + s * 0.03, s * 0.016, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f4f1e6';
      ctx.beginPath(); ctx.moveTo(hx - s * 0.085, hy + s * 0.065); ctx.lineTo(hx - s * 0.075, hy + s * 0.095); ctx.lineTo(hx - s * 0.062, hy + s * 0.068); ctx.closePath(); ctx.fill();
    }
  }
  ctx.restore();
}
