import { projectEntity, curveOffsetAt } from './road.js';
import { roadsideFeature, drawSpeedLimit, drawSafetyBillboard } from './signs.js';

// Posted speed limit by stage character: urban New Kingston + the rural gorge are 50,
// the open highways (Holland Bamboo, Negril) are 80. Drives the roadside roundels.
function limitForStage(stage) {
  const sc = stage && stage.scenery;
  return (sc === 'palm' || sc === 'bamboo') ? 80 : 50;
}

// The FAR verge is phase-shifted by this many rows so the two sides of the road never
// mirror each other — different props, and signs/billboards land at different points.
const FAR_PHASE = 7;

// Draw one roadside slot: either a road-safety sign (speed roundel / billboard) when the
// cadence calls for one at this row, or the stage's own prop. Returns true if a sign was
// drawn (so the caller can skip the prop). `limit` is the posted km/h for speed signs.
function drawRoadside(ctx, kind, normX, camZ, position, W, H, rowIdx, limit) {
  const feat = roadsideFeature(rowIdx, limit);
  if (!feat) { drawProp(ctx, kind, normX, camZ, position, W, H, rowIdx); return; }
  const p = projectEntity(normX, camZ, W, H);
  if (!p.visible || p.y < H * 0.5 || p.size < 2) return;
  p.x += curveOffsetAt(position, camZ);
  if (feat.kind === 'speed') drawSpeedLimit(ctx, p.x, p.y, p.size, feat.limit);
  else drawSafetyBillboard(ctx, p.x, p.y, p.size, feat.idx);
}

// Roadside props that scroll with the road to give depth, speed and a sense of
// place. Each stage picks a `scenery` kind; props are drawn off both edges, beyond
// the marl shoulder, and follow the road's curve.
const GAP = 520;     // world units between prop rows
const COUNT = 26;    // rows drawn ahead
const EDGE = 1.9;    // off the asphalt, out on the grass (asphalt edge = 1.0)

// Fern Gully constants — tighter rows, a receding back-layer at 0.6× the main edge
const FERN_GAP   = 380;   // world units between fern rows (tighter than the base GAP)
const FERN_COUNT = 32;    // more rows drawn ahead for a denser gorge
const FERN_EDGE  = 2.1;   // main bank, slightly further out
const FERN_BACK  = 1.5;   // inner back-layer (closer to road, receding depth)

// New Kingston landmark cycle — 14 distinct props, cycled by row index so each
// pass down the strip shows a varied but repeating street.  Zinc fences appear
// every 3rd slot to keep the texture dominant; landmarks fill the rest.
const NK_PROPS = [
  'zinc',            // 0  zinc fence
  'nk_emancipation', // 1  Redemption Song / Emancipation Park statue
  'zinc',            // 2
  'nk_island_grill', // 3  Island Grill fast-food storefront
  'nk_soundsystem',  // 4  speaker-box stack (sound-system culture)
  'zinc',            // 5
  'nk_patty',        // 6  Tastee / Juici patty shop
  'nk_handcart',     // 7  piled handcarts
  'zinc',            // 8
  'nk_ncb_tower',    // 9  NCB bank high-rise
  'nk_higgler',      // 10 tarp stall + higgler silhouette
  'zinc',            // 11
  'nk_scotiabank',   // 12 Scotiabank tower
  'nk_cafe',         // 13 small coffee café
  'zinc',            // 14
  'nk_jtb',          // 15 Jamaica Tourist Board building
  'nk_recordshop',   // 16 hand-painted record-shop / Beat Street sign
  'zinc',            // 17
  'nk_bpo',          // 18 glassy BPO call-centre block
  'nk_soundsystem',  // 19
  'zinc',            // 20
  'nk_emancipation', // 21
  'nk_higgler',      // 22
  'zinc',            // 23
];
const NK_LEN = NK_PROPS.length;

export function renderScenery(ctx, stage, position, W, H) {
  const kind = stage.scenery || 'pole';
  if (kind === 'fern') {
    // Dense gorge: two offset row grids — a deep back layer + the main bank
    const offMain = ((position % FERN_GAP) + FERN_GAP) % FERN_GAP;
    const offBack = ((position % (FERN_GAP * 1.4)) + FERN_GAP * 1.4) % (FERN_GAP * 1.4);
    // Back (inner) layer — darker depth tint applied by drawing at closer edge
    for (let n = FERN_COUNT; n >= 1; n--) {
      const camZ = n * FERN_GAP * 1.4 - offBack;
      if (camZ <= 1) continue;
      drawFernBack(ctx, -FERN_BACK, camZ, position, W, H);
      drawFernBack(ctx, FERN_BACK,  camZ, position, W, H);
    }
    // Main bank — the two sides run on phase-shifted rows so they never mirror, and the
    // road-safety signs / fatality billboards punch in along the gorge.
    const fLimit = limitForStage(stage);
    for (let n = FERN_COUNT; n >= 1; n--) {
      const camZ = n * FERN_GAP - offMain;
      if (camZ <= 1) continue;
      const rowIdx = Math.floor((position + n * FERN_GAP - offMain) / FERN_GAP);
      drawRoadside(ctx, kind, -FERN_EDGE, camZ, position, W, H, rowIdx, fLimit);
      drawRoadside(ctx, kind, FERN_EDGE,  camZ, position, W, H, rowIdx + FAR_PHASE, fLimit);
    }
    return;
  }

  if (kind === 'zinc') {
    // New Kingston — draw a distant city back-layer first (tallest buildings
    // silhouetted against the sky), then the near roadside prop cycle.
    drawNKSkyline(ctx, W, H);
    const off = ((position % GAP) + GAP) % GAP;
    const nkLimit = limitForStage(stage);
    for (let n = COUNT; n >= 1; n--) {
      const camZ = n * GAP - off;
      if (camZ <= 1) continue;
      // Row index is derived from integer position so props persist correctly. The two
      // sides run on phase-shifted rows so opposite verges show different storefronts,
      // and the road-safety signs / billboards land at different points on each side.
      const rowIdx = Math.floor((position + n * GAP - off) / GAP);
      const farIdx = rowIdx + FAR_PHASE;
      const nearKind = NK_PROPS[((rowIdx % NK_LEN) + NK_LEN) % NK_LEN];
      const farKind  = NK_PROPS[((farIdx % NK_LEN) + NK_LEN) % NK_LEN];
      drawRoadside(ctx, nearKind, -EDGE, camZ, position, W, H, rowIdx, nkLimit);
      drawRoadside(ctx, farKind,   EDGE, camZ, position, W, H, farIdx, nkLimit);
    }
    return;
  }

  const off = ((position % GAP) + GAP) % GAP;
  const limit = limitForStage(stage);
  for (let n = COUNT; n >= 1; n--) {
    const camZ = n * GAP - off;
    if (camZ <= 1) continue;
    // Phase-shifted sides so opposite verges vary, with speed signs / safety billboards.
    const rowIdx = Math.floor((position + n * GAP - off) / GAP);
    drawRoadside(ctx, kind, -EDGE, camZ, position, W, H, rowIdx, limit);
    drawRoadside(ctx, kind, EDGE, camZ, position, W, H, rowIdx + FAR_PHASE, limit);
  }
}

// ─── New Kingston distant skyline ─────────────────────────────────────────────
// Drawn once per frame behind everything else; fixed haze layer + tower blocks.
function drawNKSkyline(ctx, W, H) {
  const horizon = H * 0.48; // just above the vanishing-point horizon
  // Sky haze gradient — dusty urban amber/grey
  const grad = ctx.createLinearGradient(0, horizon - H * 0.12, 0, horizon);
  grad.addColorStop(0, 'rgba(210,190,160,0.0)');
  grad.addColorStop(1, 'rgba(180,160,120,0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, horizon - H * 0.12, W, H * 0.12);

  // A handful of simple tower silhouettes spread across the horizon
  const towers = [
    { x: 0.12, wf: 0.025, hf: 0.08, col: '#4a6080' },  // mid-rise
    { x: 0.22, wf: 0.02,  hf: 0.11, col: '#3a5070' },  // NCB-ish tall
    { x: 0.34, wf: 0.03,  hf: 0.07, col: '#586878' },
    { x: 0.55, wf: 0.022, hf: 0.10, col: '#3a4e60' },  // Scotia-ish
    { x: 0.67, wf: 0.028, hf: 0.065,'col': '#607080' },
    { x: 0.78, wf: 0.018, hf: 0.085, col: '#4a5868' },
    { x: 0.88, wf: 0.024, hf: 0.06, col: '#556070' },
  ];
  for (const t of towers) {
    const tx = t.x * W, tw = t.wf * W, th = t.hf * H;
    ctx.fillStyle = t.col;
    ctx.globalAlpha = 0.45;
    ctx.fillRect(tx - tw / 2, horizon - th, tw, th);
    // simple window grid — 2 columns
    ctx.fillStyle = 'rgba(255,240,180,0.25)';
    for (let wy = 3; wy < th - 4; wy += 5) {
      ctx.fillRect(tx - tw * 0.35, horizon - th + wy, tw * 0.2, 3);
      ctx.fillRect(tx + tw * 0.1,  horizon - th + wy, tw * 0.2, 3);
    }
    ctx.globalAlpha = 1.0;
  }
}

// ─── Prop dispatcher ─────────────────────────────────────────────────────────
// Draw a receding back-layer fern clump, tinted darker to sell depth.
function drawFernBack(ctx, normX, camZ, position, W, H) {
  const p = projectEntity(normX, camZ, W, H);
  if (!p.visible || p.y < H * 0.5 || p.size < 2) return;
  p.x += curveOffsetAt(position, camZ);
  const lean = normX < 0 ? 1 : -1;
  ctx.save();
  ctx.globalAlpha = 0.72;
  fernTree(ctx, p.x, p.y, p.size * 0.88, lean, true /* dark */);
  ctx.restore();
}

function drawProp(ctx, kind, normX, camZ, position, W, H, rowIdx = 0) {
  const p = projectEntity(normX, camZ, W, H);
  if (!p.visible || p.y < H * 0.5 || p.size < 2) return; // cull above horizon / too tiny
  p.x += curveOffsetAt(position, camZ);
  const lean = normX < 0 ? 1 : -1; // lean toward the road centre
  switch (kind) {
    case 'fern':           fernTree(ctx, p.x, p.y, p.size, lean); break;
    case 'bamboo':         bamboo(ctx, p.x, p.y, p.size, lean); break;
    case 'palm':           palm(ctx, p.x, p.y, p.size, lean); break;
    case 'zinc':           zinc(ctx, p.x, p.y, p.size); break;
    case 'neon':           neonPost(ctx, p.x, p.y, p.size); break;
    // New Kingston landmarks
    case 'nk_emancipation': nkEmancipation(ctx, p.x, p.y, p.size); break;
    case 'nk_island_grill': nkIslandGrill(ctx, p.x, p.y, p.size); break;
    case 'nk_patty':        nkPattyShop(ctx, p.x, p.y, p.size); break;
    case 'nk_ncb_tower':    nkNCBTower(ctx, p.x, p.y, p.size); break;
    case 'nk_scotiabank':   nkScotiabank(ctx, p.x, p.y, p.size); break;
    case 'nk_bpo':          nkBPO(ctx, p.x, p.y, p.size); break;
    case 'nk_cafe':         nkCafe(ctx, p.x, p.y, p.size); break;
    case 'nk_jtb':          nkJTB(ctx, p.x, p.y, p.size); break;
    case 'nk_soundsystem':  nkSoundSystem(ctx, p.x, p.y, p.size); break;
    case 'nk_handcart':     nkHandcarts(ctx, p.x, p.y, p.size); break;
    case 'nk_higgler':      nkHiggler(ctx, p.x, p.y, p.size); break;
    case 'nk_recordshop':   nkRecordShop(ctx, p.x, p.y, p.size); break;
    default: pole(ctx, p.x, p.y, p.size);
  }
}

// ─── Original prop draws ──────────────────────────────────────────────────────

// A low, dense clump of ferns — not a tall tree. Dark damp greens, fronds fanning
// up and arching over the road (set `lean`). Leaflet ticks give the pinnate look.
// dark=true: uses a deeper, receding palette for the back layer.
function fernTree(ctx, x, y, s, lean, dark = false) {
  const greens = dark
    ? ['#0b2210', '#112e18', '#174020']   // darker depth tint for back layer
    : ['#12381a', '#1c5226', '#277034'];
  // dark damp base mound
  ctx.fillStyle = dark ? '#091a0e' : '#10311a';
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

// ─── New Kingston landmark prop draws ────────────────────────────────────────

// Helper: pixel-font text at small sizes — just a filled rect label so it reads
// as a sign without requiring a font.  col = sign bg, tcol = text stripe colour.
function signBoard(ctx, x, y, w, h, col, tcol) {
  ctx.fillStyle = col;
  ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = tcol;
  // Two horizontal stripes stand in for lettering
  ctx.fillRect(x - w * 0.38, y - h * 0.72, w * 0.76, h * 0.18);
  ctx.fillRect(x - w * 0.32, y - h * 0.42, w * 0.64, h * 0.14);
}

// Emancipation Park "Redemption Song" statue.
// Two dignified bronze standing figures on a shared plinth, gazing upward;
// a small fountain spray arc beneath them.  Treated as a national monument.
function nkEmancipation(ctx, x, y, s) {
  const plinH = s * 0.55, plinW = s * 1.1;
  // Circular fountain pool at ground level
  ctx.fillStyle = '#3a6878';
  ctx.beginPath(); ctx.ellipse(x, y, plinW * 0.72, plinW * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  // Fountain spray — a few small arcs
  ctx.strokeStyle = 'rgba(160,220,240,0.7)'; ctx.lineWidth = Math.max(1, s * 0.04);
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * s * 0.08, y);
    ctx.quadraticCurveTo(x + i * s * 0.22, y - s * 0.35, x + i * s * 0.38, y - s * 0.1);
    ctx.stroke();
  }
  // Plinth / circular base
  ctx.fillStyle = '#c8a870';
  ctx.beginPath(); ctx.ellipse(x, y, plinW * 0.42, plinW * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(x - plinW * 0.3, y - plinH, plinW * 0.6, plinH);

  // Two figures — simple bronze-tone silhouettes, arms slightly raised skyward,
  // heads tilted up.  Drawn side by side with a small gap.
  const figH = s * 1.8, figW = s * 0.28;
  const bronze = '#7a5a28';
  for (let side = -1; side <= 1; side += 2) {
    const fx = x + side * s * 0.3;
    const fy = y - plinH;
    // Legs
    ctx.fillStyle = bronze;
    ctx.fillRect(fx - figW * 0.28, fy - figH * 0.45, figW * 0.22, figH * 0.45);
    ctx.fillRect(fx + figW * 0.06, fy - figH * 0.45, figW * 0.22, figH * 0.45);
    // Torso
    ctx.fillRect(fx - figW * 0.3, fy - figH * 0.85, figW * 0.6, figH * 0.42);
    // Arms raised slightly outward and upward
    ctx.save();
    ctx.translate(fx, fy - figH * 0.78);
    ctx.rotate(side * -0.55);
    ctx.fillRect(-figW * 0.08, -figH * 0.28, figW * 0.14, figH * 0.28);
    ctx.restore();
    // Head (tilted up — offset top)
    ctx.beginPath();
    ctx.ellipse(fx, fy - figH * 0.92, figW * 0.22, figW * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Island Grill — orange/green fast-food storefront.
function nkIslandGrill(ctx, x, y, s) {
  const bh = s * 1.7, bw = s * 1.8;
  // Building body
  ctx.fillStyle = '#1a3a1a'; // deep green
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Orange fascia strip
  ctx.fillStyle = '#e06010';
  ctx.fillRect(x - bw / 2, y - bh * 1.0, bw, bh * 0.28);
  // Stylised logo area: green oval on orange
  ctx.fillStyle = '#22661a';
  ctx.beginPath(); ctx.ellipse(x, y - bh + bh * 0.14, bw * 0.22, bh * 0.09, 0, 0, Math.PI * 2); ctx.fill();
  // Sign text stripes on fascia
  ctx.fillStyle = '#fff8e8';
  ctx.fillRect(x - bw * 0.32, y - bh + bh * 0.34, bw * 0.64, bh * 0.05);
  // Windows / counter opening
  ctx.fillStyle = '#d09050';
  ctx.fillRect(x - bw * 0.35, y - bh * 0.56, bw * 0.7, bh * 0.28);
  // Door
  ctx.fillStyle = '#0e280e';
  ctx.fillRect(x - bw * 0.1, y - bh * 0.3, bw * 0.2, bh * 0.3);
}

// Tastee / Juici-style patty shop — red/yellow branding.
function nkPattyShop(ctx, x, y, s) {
  const bh = s * 1.55, bw = s * 1.6;
  // Building
  ctx.fillStyle = '#c01818';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Yellow sign band
  ctx.fillStyle = '#f5c800';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh * 0.3);
  // "PATTY" sign stripes
  ctx.fillStyle = '#c01818';
  ctx.fillRect(x - bw * 0.28, y - bh + bh * 0.06, bw * 0.56, bh * 0.08);
  ctx.fillRect(x - bw * 0.22, y - bh + bh * 0.17, bw * 0.44, bh * 0.06);
  // Window
  ctx.fillStyle = '#f0d080';
  ctx.fillRect(x - bw * 0.38, y - bh * 0.6, bw * 0.76, bh * 0.22);
  // Door
  ctx.fillStyle = '#7a0a0a';
  ctx.fillRect(x - bw * 0.1, y - bh * 0.35, bw * 0.2, bh * 0.35);
  // Small "HOT PATTIES" awning
  ctx.fillStyle = '#f5c800';
  ctx.beginPath();
  ctx.moveTo(x - bw * 0.45, y - bh * 0.62);
  ctx.lineTo(x + bw * 0.45, y - bh * 0.62);
  ctx.lineTo(x + bw * 0.42, y - bh * 0.72);
  ctx.lineTo(x - bw * 0.42, y - bh * 0.72);
  ctx.fill();
}

// NCB bank tower — deep blue high-rise.
function nkNCBTower(ctx, x, y, s) {
  const bh = s * 3.4, bw = s * 1.1;
  // Tower body
  ctx.fillStyle = '#1a3055';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Glass curtain wall — lighter blue rectangles
  ctx.fillStyle = '#2a5080';
  for (let row = 0; row < 9; row++) {
    const ry = y - bh + row * bh * 0.1 + bh * 0.05;
    ctx.fillRect(x - bw * 0.38, ry, bw * 0.32, bh * 0.065);
    ctx.fillRect(x + bw * 0.06, ry, bw * 0.32, bh * 0.065);
  }
  // NCB logo band at top — yellow stripe
  ctx.fillStyle = '#f5c800';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh * 0.07);
  ctx.fillStyle = '#1a3055';
  ctx.fillRect(x - bw * 0.28, y - bh + bh * 0.015, bw * 0.56, bh * 0.035); // "NCB" stripes
}

// Scotia bank tower — red.
function nkScotiabank(ctx, x, y, s) {
  const bh = s * 3.0, bw = s * 1.0;
  ctx.fillStyle = '#8a1010';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Glass panels — lighter
  ctx.fillStyle = '#c03030';
  for (let row = 0; row < 8; row++) {
    const ry = y - bh + row * bh * 0.115 + bh * 0.05;
    ctx.fillRect(x - bw * 0.36, ry, bw * 0.28, bh * 0.07);
    ctx.fillRect(x + bw * 0.08, ry, bw * 0.28, bh * 0.07);
  }
  // White logo band at top
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh * 0.065);
  ctx.fillStyle = '#8a1010';
  ctx.fillRect(x - bw * 0.25, y - bh + bh * 0.014, bw * 0.5, bh * 0.03);
}

// BPO / call-centre — glass curtain-wall mid-rise.
function nkBPO(ctx, x, y, s) {
  const bh = s * 2.2, bw = s * 2.0;
  // Building
  ctx.fillStyle = '#3a4a58';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Full-height glass facade — a grid of pale blue squares
  ctx.fillStyle = '#6898b8';
  const cols = 4, rows = 6;
  const cw = bw * 0.18, ch = bh * 0.12;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillRect(
        x - bw * 0.42 + c * bw * 0.22,
        y - bh + r * bh * 0.15 + bh * 0.06,
        cw, ch
      );
    }
  }
  // Entrance canopy
  ctx.fillStyle = '#2a3a48';
  ctx.fillRect(x - bw * 0.28, y - bh * 0.22, bw * 0.56, bh * 0.04);
}

// Small coffee café storefront.
function nkCafe(ctx, x, y, s) {
  const bh = s * 1.4, bw = s * 1.4;
  // Wall
  ctx.fillStyle = '#a87850';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Awning — dark teal stripe
  ctx.fillStyle = '#1a6060';
  ctx.beginPath();
  ctx.moveTo(x - bw * 0.52, y - bh * 0.65);
  ctx.lineTo(x + bw * 0.52, y - bh * 0.65);
  ctx.lineTo(x + bw * 0.48, y - bh * 0.78);
  ctx.lineTo(x - bw * 0.48, y - bh * 0.78);
  ctx.fill();
  // Awning scallop fringe
  ctx.fillStyle = '#158080';
  for (let i = 0; i < 5; i++) {
    const ax = x - bw * 0.44 + i * bw * 0.22;
    ctx.beginPath(); ctx.arc(ax, y - bh * 0.65, bw * 0.055, 0, Math.PI); ctx.fill();
  }
  // Sign above
  ctx.fillStyle = '#2a1a08';
  ctx.fillRect(x - bw * 0.3, y - bh, bw * 0.6, bh * 0.18);
  ctx.fillStyle = '#d8a060';
  ctx.fillRect(x - bw * 0.22, y - bh + bh * 0.04, bw * 0.44, bh * 0.06);
  // Window + door
  ctx.fillStyle = '#c8a870';
  ctx.fillRect(x - bw * 0.36, y - bh * 0.56, bw * 0.3, bh * 0.2);
  ctx.fillStyle = '#7a5030';
  ctx.fillRect(x + bw * 0.06, y - bh * 0.38, bw * 0.22, bh * 0.38);
}

// Jamaica Tourist Board — modern office building with JTB signage.
function nkJTB(ctx, x, y, s) {
  const bh = s * 2.0, bw = s * 1.9;
  // Main building
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Coloured accent stripe — JTB uses black/gold/green
  ctx.fillStyle = '#1a1a0a';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh * 0.18);
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x - bw / 2, y - bh * 0.82, bw, bh * 0.05);
  // "JTB" sign stripes on dark band
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x - bw * 0.22, y - bh + bh * 0.04, bw * 0.44, bh * 0.06);
  ctx.fillRect(x - bw * 0.18, y - bh + bh * 0.11, bw * 0.36, bh * 0.04);
  // Windows — regular grid on light wall
  ctx.fillStyle = '#7ab0c8';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      ctx.fillRect(
        x - bw * 0.42 + c * bw * 0.23,
        y - bh * 0.75 + r * bh * 0.22,
        bw * 0.16, bh * 0.13
      );
    }
  }
  // Entrance / logo column
  ctx.fillStyle = '#1a1a0a';
  ctx.fillRect(x - bw * 0.12, y - bh * 0.32, bw * 0.24, bh * 0.32);
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x - bw * 0.08, y - bh * 0.28, bw * 0.16, bh * 0.04);
}

// Hand-built sound-system speaker-box stack — Orange Street culture.
function nkSoundSystem(ctx, x, y, s) {
  const boxW = s * 1.0, boxH = s * 0.85;
  // Stack of 4 speaker boxes, slightly offset for hand-built character
  const offsets = [0, s * 0.05, -s * 0.04, s * 0.02];
  for (let i = 0; i < 4; i++) {
    const bx = x + offsets[i];
    const by = y - i * boxH * 0.98;
    ctx.fillStyle = i % 2 === 0 ? '#1a1208' : '#0e0c04';
    ctx.fillRect(bx - boxW / 2, by - boxH, boxW, boxH);
    // Speaker cone circles
    ctx.fillStyle = '#2a2010';
    ctx.beginPath(); ctx.arc(bx, by - boxH * 0.5, boxW * 0.33, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1a0808';
    ctx.beginPath(); ctx.arc(bx, by - boxH * 0.5, boxW * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#3a2808';
    ctx.beginPath(); ctx.arc(bx, by - boxH * 0.5, boxW * 0.08, 0, Math.PI * 2); ctx.fill();
    // Cabinet edge highlight
    ctx.strokeStyle = '#3a3020'; ctx.lineWidth = 1;
    ctx.strokeRect(bx - boxW / 2, by - boxH, boxW, boxH);
  }
  // Rough power lead dangling
  ctx.strokeStyle = '#1a1808'; ctx.lineWidth = Math.max(1, s * 0.04);
  ctx.beginPath();
  ctx.moveTo(x + boxW * 0.3, y - boxH * 2);
  ctx.quadraticCurveTo(x + boxW * 0.5, y - boxH, x + boxW * 0.4, y);
  ctx.stroke();
}

// Piled handcarts — a cluster of wooden push-carts stacked roadside.
function nkHandcarts(ctx, x, y, s) {
  const cartW = s * 0.9, cartH = s * 0.5;
  for (let i = 0; i < 3; i++) {
    const cx = x + (i - 1) * s * 0.55;
    const cy = y - i * s * 0.18;
    // Cart bed
    ctx.fillStyle = '#8a6030';
    ctx.fillRect(cx - cartW / 2, cy - cartH, cartW, cartH * 0.5);
    // Sides / frame
    ctx.strokeStyle = '#6a4820'; ctx.lineWidth = Math.max(1.5, s * 0.05);
    ctx.strokeRect(cx - cartW / 2, cy - cartH, cartW, cartH * 0.5);
    // Handle bar
    ctx.beginPath(); ctx.moveTo(cx - cartW * 0.44, cy - cartH);
    ctx.lineTo(cx - cartW * 0.6, cy - cartH * 1.55); ctx.stroke();
    // Two wheels
    ctx.fillStyle = '#3a2810';
    ctx.beginPath(); ctx.arc(cx - cartW * 0.3, cy - cartH * 0.08, s * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + cartW * 0.3, cy - cartH * 0.08, s * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#5a3818'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx - cartW * 0.3, cy - cartH * 0.08, s * 0.13, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + cartW * 0.3, cy - cartH * 0.08, s * 0.13, 0, Math.PI * 2); ctx.stroke();
  }
}

// Tarp-and-umbrella market stall + higgler silhouette.
function nkHiggler(ctx, x, y, s) {
  // Tarp canopy — blue tarps are everywhere
  ctx.fillStyle = '#1858b0';
  ctx.beginPath();
  ctx.moveTo(x - s * 1.0, y - s * 1.55);
  ctx.lineTo(x + s * 1.0, y - s * 1.55);
  ctx.lineTo(x + s * 0.85, y - s * 0.9);
  ctx.lineTo(x - s * 0.85, y - s * 0.9);
  ctx.fill();
  // Tarp underside shadow
  ctx.fillStyle = '#0e3878';
  ctx.fillRect(x - s * 0.82, y - s * 1.0, s * 1.64, s * 0.1);
  // Support poles
  ctx.fillStyle = '#7a6848';
  ctx.fillRect(x - s * 0.8, y - s * 1.5, s * 0.06, s * 1.5);
  ctx.fillRect(x + s * 0.74, y - s * 1.5, s * 0.06, s * 1.5);
  // Table with goods (colour blocks)
  ctx.fillStyle = '#8a6030';
  ctx.fillRect(x - s * 0.7, y - s * 0.7, s * 1.4, s * 0.12);
  ctx.fillStyle = '#f0c820'; ctx.fillRect(x - s * 0.58, y - s * 0.82, s * 0.24, s * 0.12);
  ctx.fillStyle = '#d83820'; ctx.fillRect(x - s * 0.28, y - s * 0.82, s * 0.24, s * 0.12);
  ctx.fillStyle = '#30a830'; ctx.fillRect(x + s * 0.06, y - s * 0.82, s * 0.24, s * 0.12);
  // Higgler silhouette — standing figure beside the stall
  ctx.fillStyle = '#2a1808';
  ctx.beginPath(); ctx.arc(x + s * 0.75, y - s * 1.38, s * 0.14, 0, Math.PI * 2); ctx.fill(); // head
  ctx.fillRect(x + s * 0.68, y - s * 1.24, s * 0.14, s * 0.52); // torso
  ctx.fillRect(x + s * 0.60, y - s * 0.72, s * 0.12, s * 0.44); // left leg
  ctx.fillRect(x + s * 0.74, y - s * 0.72, s * 0.12, s * 0.44); // right leg
}

// Hand-painted record shop / Beat Street sound-system signage.
function nkRecordShop(ctx, x, y, s) {
  const bh = s * 1.6, bw = s * 1.7;
  // Wall — sun-bleached cream
  ctx.fillStyle = '#e0d0a0';
  ctx.fillRect(x - bw / 2, y - bh, bw, bh);
  // Painted sign band — hand-painted look via jagged top edge
  ctx.fillStyle = '#1a0868';
  ctx.beginPath();
  ctx.moveTo(x - bw / 2, y - bh * 0.92);
  ctx.lineTo(x - bw * 0.3, y - bh * 1.04);
  ctx.lineTo(x - bw * 0.1, y - bh * 0.97);
  ctx.lineTo(x + bw * 0.12, y - bh * 1.06);
  ctx.lineTo(x + bw * 0.3, y - bh * 0.95);
  ctx.lineTo(x + bw / 2, y - bh * 1.02);
  ctx.lineTo(x + bw / 2, y - bh * 0.68);
  ctx.lineTo(x - bw / 2, y - bh * 0.68);
  ctx.fill();
  // "BEAT STREET" lettering stripes
  ctx.fillStyle = '#f0d800';
  ctx.fillRect(x - bw * 0.4, y - bh * 0.88, bw * 0.8, bh * 0.07);
  ctx.fillRect(x - bw * 0.34, y - bh * 0.78, bw * 0.68, bh * 0.05);
  // Record (vinyl disc silhouette)
  ctx.fillStyle = '#0a0810';
  ctx.beginPath(); ctx.arc(x - bw * 0.3, y - bh * 0.48, s * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a1020';
  ctx.beginPath(); ctx.arc(x - bw * 0.3, y - bh * 0.48, s * 0.08, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d01818';
  ctx.beginPath(); ctx.arc(x - bw * 0.3, y - bh * 0.48, s * 0.04, 0, Math.PI * 2); ctx.fill();
  // Stacked CDs / records on shelf
  ctx.fillStyle = '#3a2860';
  ctx.fillRect(x + bw * 0.02, y - bh * 0.62, bw * 0.42, bh * 0.25);
  ctx.fillStyle = '#c8a0d8';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(x + bw * 0.04 + i * bw * 0.08, y - bh * 0.6, bw * 0.05, bh * 0.2);
  }
  // Doorway
  ctx.fillStyle = '#100808';
  ctx.fillRect(x + bw * 0.14, y - bh * 0.38, bw * 0.22, bh * 0.38);
}
