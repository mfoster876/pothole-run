// src/portrait.js
// Procedural front-facing bust portraits for the character-select screen and
// game-over card. Pure Canvas 2D — no images, no build step.
//
// API:
//   renderPortrait(ctx, characterId, cx, cy, size)
//     ctx          — CanvasRenderingContext2D
//     characterId  — 'yute' | 'rasta' | 'conductor'
//     cx, cy       — CENTRE of the portrait box in virtual px
//     size         — width AND height of the portrait box in virtual px (~140 on
//                    select screen, ~100 on game-over card)
//
// The portrait (frame + bust) is drawn fully within the size×size box centred on
// (cx, cy).  Unknown ids fall back to a neutral silhouette.

export const PORTRAITS = new Set(['yute', 'rasta', 'conductor']);

// ─── public entry point ──────────────────────────────────────────────────────
export function renderPortrait(ctx, characterId, cx, cy, size) {
  ctx.save();
  // Translate so internal helpers can work in a coordinate space where (0,0) is
  // the top-left corner of the portrait box.
  ctx.translate(cx - size / 2, cy - size / 2);

  switch (characterId) {
    case 'yute':      _drawYute(ctx, size);      break;
    case 'rasta':     _drawRasta(ctx, size);     break;
    case 'conductor': _drawConductor(ctx, size); break;
    default:          _drawSilhouette(ctx, size); break;
  }

  ctx.restore();
}

// ─── palette (matches game house style) ──────────────────────────────────────
const P = {
  // frame / background tones
  frameDark:   '#1a2e1e',
  frameLight:  '#2a4830',
  frameGold:   '#f0c020',
  frameGoldDim:'#9a7a10',
  frameGreen:  '#3fae54',
  frameGreenDim:'#1f6e34',
  frameSlate:  '#263040',
  frameSlateDim:'#131e2a',

  // skin
  skinDark:    '#3a1e0a',   // deep natural brown
  skinMid:     '#7a3e18',   // warm brown mid
  skinLight:   '#c87a3a',   // lighter brown highlight
  skinPale:    '#e8c8a8',   // bleached/very light
  skinPaleEdge:'#c8a080',   // slightly pink at edges of bleached zone
  skinBlotch:  '#d0907a',   // pinkish blotch on bleached skin

  // hair / dreads
  hairBlack:   '#1a1208',
  hairBrown:   '#3a2010',

  // Rasta colours
  rastRed:     '#c0251a',
  rastGold:    '#f0c020',
  rastGreen:   '#28a040',
  rastRedDark: '#7a1208',
  rastGoldDark:'#9a7a10',
  rastGreenDark:'#186028',

  // uniform (yute)
  shirtWhite:  '#f0ede0',
  shirtShadow: '#c8c4b0',
  tieGold:     '#c8960a',
  tieGoldShad: '#8a6206',
  khakiCol:    '#c8ac6a',

  // conductor
  capNavy:     '#182238',
  capNavyMid:  '#243450',
  capBrim:     '#0e1620',
  blackLip:    '#1a1010',
  pinkLipCtr:  '#e87888',
  tattooInk:   '#2a2040',

  // outline + shadow
  outline:     '#0a0806',
  shadow:      'rgba(0,0,0,0.35)',
  highlight:   'rgba(255,255,255,0.18)',
};

// ─── low-level helpers ────────────────────────────────────────────────────────

/** Rounded-rectangle path (no fill/stroke — caller does that). */
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

/** Filled ellipse helper. */
function ellipse(ctx, cx, cy, rx, ry, fill) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

/** Outlined ellipse. */
function ellipseStroke(ctx, cx, cy, rx, ry, stroke, lw) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();
}

// ─── shared sub-components ───────────────────────────────────────────────────

/**
 * Draw the framed background panel.
 * @param {string} bg      - inner background fill
 * @param {string} border1 - outer border colour
 * @param {string} border2 - inner border colour
 * @param {number} cornerR - corner radius factor (0–0.12 of size)
 */
function _frame(ctx, size, bg, border1, border2) {
  const pad = size * 0.04;
  const r   = size * 0.10;

  // outer drop-shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  rrect(ctx, pad + 2, pad + 2, size - pad * 2, size - pad * 2, r);
  ctx.fill();

  // background panel
  ctx.fillStyle = bg;
  rrect(ctx, pad, pad, size - pad * 2, size - pad * 2, r);
  ctx.fill();

  // outer border
  ctx.strokeStyle = border1; ctx.lineWidth = Math.max(2, size * 0.030);
  rrect(ctx, pad, pad, size - pad * 2, size - pad * 2, r);
  ctx.stroke();

  // inner highlight line
  ctx.strokeStyle = border2; ctx.lineWidth = Math.max(1, size * 0.015);
  rrect(ctx, pad + size * 0.028, pad + size * 0.028,
        size - pad * 2 - size * 0.056, size - pad * 2 - size * 0.056, r * 0.8);
  ctx.stroke();
}

/**
 * Generic neck + shoulders block.
 * neckX/neckY — centre-bottom of the head (top of neck), in local coords.
 * shoulderW   — total shoulder span (half on each side).
 */
function _shoulders(ctx, neckX, neckY, neckW, neckH, shoulderW, shirtFill, shirtShadow, size) {
  // shadow under chin
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ellipse(ctx, neckX, neckY + neckH * 0.2, neckW * 0.7, neckH * 0.25);
  ctx.fill();

  // shoulders / chest (trapezoid via clip-friendly polygon)
  const sw = shoulderW * 0.5;
  const sy = neckY + neckH;           // bottom of neck = top of shoulder block
  const sh = size * 0.22;             // height of visible shoulder area
  ctx.beginPath();
  ctx.moveTo(neckX - neckW * 0.5, neckY);
  ctx.lineTo(neckX + neckW * 0.5, neckY);
  ctx.lineTo(neckX + sw, sy + sh);
  ctx.lineTo(neckX - sw, sy + sh);
  ctx.closePath();
  ctx.fillStyle = shirtFill; ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, size * 0.018); ctx.stroke();

  // shadow band across lower shirt
  ctx.fillStyle = shirtShadow;
  ctx.beginPath();
  ctx.moveTo(neckX - neckW * 0.4, neckY + neckH * 0.5);
  ctx.lineTo(neckX + neckW * 0.4, neckY + neckH * 0.5);
  ctx.lineTo(neckX + sw * 0.85, sy + sh);
  ctx.lineTo(neckX - sw * 0.85, sy + sh);
  ctx.closePath();
  ctx.fill();

  // neck itself
  ctx.fillStyle = shirtFill;
  ctx.fillRect(neckX - neckW * 0.5, neckY - neckH, neckW, neckH);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, size * 0.018);
  ctx.strokeRect(neckX - neckW * 0.5, neckY - neckH, neckW, neckH);
}

/** Simple eye pair: white sclera + dark iris + pupil + glint. */
function _eyes(ctx, cx, cy, eyeSpan, eyeR, irisColor) {
  const lx = cx - eyeSpan / 2, rx = cx + eyeSpan / 2;
  for (const ex of [lx, rx]) {
    // sclera
    ellipse(ctx, ex, cy, eyeR * 1.05, eyeR * 0.75, '#f2efdf');
    // iris
    ellipse(ctx, ex, cy, eyeR * 0.68, eyeR * 0.68, irisColor);
    // pupil
    ellipse(ctx, ex, cy, eyeR * 0.36, eyeR * 0.36, '#0e0a06');
    // glint
    ellipse(ctx, ex - eyeR * 0.18, cy - eyeR * 0.22, eyeR * 0.16, eyeR * 0.16, 'rgba(255,255,255,0.80)');
    // outline
    ellipseStroke(ctx, ex, cy, eyeR * 1.05, eyeR * 0.75, P.outline, Math.max(1, eyeR * 0.25));
  }
}

/** Simple nose: two small oval nostrils and a bridge shadow. */
function _nose(ctx, cx, cy, size) {
  const nr = size * 0.038;
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ellipse(ctx, cx - nr * 1.1, cy, nr, nr * 0.65); ctx.fill();
  ellipse(ctx, cx + nr * 1.1, cy, nr, nr * 0.65); ctx.fill();
  // bridge line
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = Math.max(1, size * 0.012);
  ctx.beginPath(); ctx.moveTo(cx, cy - nr * 2.2); ctx.lineTo(cx, cy); ctx.stroke();
}

/** Mouth: a simple curved line with a hint of lips. */
function _mouth(ctx, cx, cy, w, lipsColor, expressionCurve) {
  // lower lip fill
  ctx.fillStyle = lipsColor;
  ctx.beginPath();
  ctx.ellipse(cx, cy + w * 0.06, w * 0.46, w * 0.14, 0, 0, Math.PI);
  ctx.fill();

  // smile/neutral curve
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, w * 0.08);
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.38, cy);
  ctx.quadraticCurveTo(cx, cy + expressionCurve, cx + w * 0.38, cy);
  ctx.stroke();
}

/** Eyebrow pair: bold flat strokes. */
function _eyebrows(ctx, cx, cy, eyeSpan, eyeR, browColor, tilt) {
  // tilt > 0 = outer end up (friendly/neutral); < 0 = inner up (frown)
  const lx = cx - eyeSpan / 2, rx = cx + eyeSpan / 2;
  ctx.strokeStyle = browColor; ctx.lineWidth = Math.max(1.5, eyeR * 0.65);
  ctx.lineCap = 'round';
  for (const [ex, sign] of [[lx, -1], [rx, 1]]) {
    ctx.beginPath();
    ctx.moveTo(ex - eyeR * 0.8, cy + tilt * sign * eyeR * 0.4);
    ctx.lineTo(ex + eyeR * 0.8, cy - tilt * sign * eyeR * 0.4);
    ctx.stroke();
  }
  ctx.lineCap = 'butt';
}

// ─── YUTE — School Yute ───────────────────────────────────────────────────────
function _drawYute(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  // frame: warm dark green background, gold border
  _frame(ctx, s, '#122010', P.frameGold, P.frameGoldDim);

  // ── body / uniform ──
  const neckBaseY = s * 0.88;
  const neckW     = s * 0.148;
  const neckH     = s * 0.085;

  // Shirt — white with a shadow band
  _shoulders(ctx, cx, neckBaseY, neckW, neckH, s * 0.70, P.shirtWhite, P.shirtShadow, s);

  // Collar points (white shirt collar)
  ctx.fillStyle = P.shirtWhite;
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.5, neckBaseY - neckH);
  ctx.lineTo(cx - neckW * 1.3, neckBaseY + neckH * 0.2);
  ctx.lineTo(cx - neckW * 0.1, neckBaseY + neckH * 0.05);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  ctx.fillStyle = P.shirtWhite;
  ctx.beginPath();
  ctx.moveTo(cx + neckW * 0.5, neckBaseY - neckH);
  ctx.lineTo(cx + neckW * 1.3, neckBaseY + neckH * 0.2);
  ctx.lineTo(cx + neckW * 0.1, neckBaseY + neckH * 0.05);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  // Tie — gold/school-colour, hanging down from collar
  ctx.fillStyle = P.tieGold;
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.040, neckBaseY + neckH * 0.08);
  ctx.lineTo(cx + s * 0.040, neckBaseY + neckH * 0.08);
  ctx.lineTo(cx + s * 0.025, neckBaseY + neckH * 0.60);
  ctx.lineTo(cx,             neckBaseY + neckH * 0.78);
  ctx.lineTo(cx - s * 0.025, neckBaseY + neckH * 0.60);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.tieGoldShad; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  // Knot shadow
  ctx.fillStyle = P.tieGoldShad;
  ctx.fillRect(cx - s * 0.022, neckBaseY + neckH * 0.06, s * 0.044, neckH * 0.16);

  // Neck skin
  ctx.fillStyle = P.skinMid;
  ctx.fillRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.strokeRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);

  // ── head ──
  const headCY = s * 0.52;
  const headRX  = s * 0.195;
  const headRY  = s * 0.220;

  // head shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.014, headRX, headRY);
  ctx.fill();

  // head shape — slightly rounded square-ish (child proportions)
  ctx.fillStyle = P.skinMid;
  ellipse(ctx, cx, headCY, headRX, headRY);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();

  // cheek highlight
  ctx.fillStyle = P.skinLight;
  ellipse(ctx, cx - headRX * 0.48, headCY + headRY * 0.12, headRX * 0.28, headRY * 0.22);
  ctx.fill();
  ellipse(ctx, cx + headRX * 0.48, headCY + headRY * 0.12, headRX * 0.28, headRY * 0.22);
  ctx.fill();

  // ── short neat hair / close fade ──
  // Dark cap of hair sitting close to the skull
  ctx.fillStyle = P.hairBlack;
  ctx.beginPath();
  ctx.ellipse(cx, headCY - headRY * 0.18, headRX * 0.94, headRY * 0.58, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.018); ctx.stroke();

  // Ear pair
  for (const sign of [-1, 1]) {
    ctx.fillStyle = P.skinMid;
    ellipse(ctx, cx + sign * headRX * 0.96, headCY + headRY * 0.10,
            headRX * 0.10, headRY * 0.14);
    ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.015); ctx.stroke();
  }

  // ── face features ──
  // Eyebrows — thick, youthful, slightly raised (hopeful)
  const eyeY   = headCY - headRY * 0.08;
  const eyeSpan = headRX * 0.88;
  const eyeR   = s * 0.044;
  _eyebrows(ctx, cx, eyeY - eyeR * 1.55, eyeSpan, eyeR, P.hairBlack, 0.6);

  // Eyes — warm brown iris, wide (child)
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR * 1.1, '#6b3a14');

  // Nose
  _nose(ctx, cx, eyeY + eyeR * 2.1, s);

  // Mouth — open, slight hopeful smile
  _mouth(ctx, cx, eyeY + eyeR * 3.8, s * 0.18, P.skinMid, s * 0.016);

  // ── name label ──
  ctx.fillStyle = P.frameGold;
  ctx.font = `700 ${Math.round(s * 0.092)}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SCHOOL', s * 0.50, s * 0.092);
  ctx.fillStyle = '#cbe7cf';
  ctx.font = `500 ${Math.round(s * 0.078)}px "Courier New", monospace`;
  ctx.fillText('YUTE', s * 0.50, s * 0.152);
}

// ─── RASTA — Rasta Musician ────────────────────────────────────────────────────
function _drawRasta(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  // frame: deep warm night, green border
  _frame(ctx, s, '#0e1a10', P.frameGreen, P.frameGreenDim);

  // ── body / shirt (dark, relaxed) ──
  const neckBaseY = s * 0.90;
  const neckW     = s * 0.152;
  const neckH     = s * 0.080;

  _shoulders(ctx, cx, neckBaseY, neckW, neckH, s * 0.68, '#1a2e1e', '#0e1c12', s);

  // Neck skin
  ctx.fillStyle = P.skinDark;
  ctx.fillRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.strokeRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);

  // Light beard / goatee on the chin — wispy
  const headCY = s * 0.50;
  const headRX  = s * 0.185;
  const headRY  = s * 0.215;
  const chinY   = headCY + headRY * 0.90;

  ctx.fillStyle = P.hairBlack;
  ctx.beginPath();
  ctx.ellipse(cx, chinY + s * 0.018, headRX * 0.38, headRY * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── head ──
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.014, headRX, headRY);
  ctx.fill();

  ctx.fillStyle = P.skinDark;
  ellipse(ctx, cx, headCY, headRX, headRY);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();

  // Face plane highlight (forehead)
  ctx.fillStyle = '#4a2810';
  ellipse(ctx, cx, headCY - headRY * 0.25, headRX * 0.62, headRY * 0.36);
  ctx.fill();

  // Ears
  for (const sign of [-1, 1]) {
    ctx.fillStyle = P.skinDark;
    ellipse(ctx, cx + sign * headRX * 0.95, headCY + headRY * 0.08,
            headRX * 0.10, headRY * 0.13);
    ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  }

  // ── Dreadlocks ──
  // Locks hang from behind the tam down to shoulder level.
  // Painted BEHIND the shoulders, in front of the frame.
  const lockColors = [P.hairBlack, P.hairBrown, P.hairBlack, '#241408', P.hairBlack];
  const lockPositions = [-0.72, -0.42, -0.08, 0.28, 0.58]; // relative to headRX, left side
  const lockY0 = headCY - headRY * 0.48;
  const lockBot = neckBaseY + s * 0.08;
  for (let i = 0; i < lockPositions.length; i++) {
    const lx = cx + lockPositions[i] * headRX * 1.18;
    const lw = s * 0.038 + (i % 2) * s * 0.008;
    ctx.fillStyle = lockColors[i % lockColors.length];
    ctx.beginPath();
    ctx.moveTo(lx - lw / 2, lockY0);
    ctx.quadraticCurveTo(lx - lw * 0.8, (lockY0 + lockBot) / 2, lx - lw * 0.4, lockBot);
    ctx.lineTo(lx + lw * 0.4, lockBot);
    ctx.quadraticCurveTo(lx + lw * 0.8, (lockY0 + lockBot) / 2, lx + lw / 2, lockY0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, s * 0.010); ctx.stroke();
  }

  // ── Rasta tam / crown ──
  // Knitted crown of red, gold, green bands sitting high on the head.
  const tamBotY = headCY - headRY * 0.40;
  const tamTopY = headCY - headRY * 1.28;
  const tamW    = headRX * 1.08;

  // Main tam dome (green base)
  ctx.fillStyle = P.rastGreen;
  ctx.beginPath();
  ctx.ellipse(cx, tamBotY, tamW, (tamBotY - tamTopY) * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tam ribbing bands (red → gold → green from bottom to top)
  const bands = [
    { y0: 0.0, y1: 0.30, col: P.rastRed,   dark: P.rastRedDark },
    { y0: 0.30, y1: 0.60, col: P.rastGold,  dark: P.rastGoldDark },
    { y0: 0.60, y1: 1.0,  col: P.rastGreen, dark: P.rastGreenDark },
  ];
  const tamH = tamBotY - tamTopY;
  for (const b of bands) {
    const by0 = tamBotY - b.y1 * tamH;
    const by1 = tamBotY - b.y0 * tamH;
    const bcy = (by0 + by1) / 2;
    const bry = (by1 - by0) / 2;
    const brx = tamW * (0.60 + 0.40 * (1 - b.y0));
    ctx.fillStyle = b.col;
    ctx.beginPath();
    ctx.ellipse(cx, bcy, brx, bry, 0, 0, Math.PI * 2);
    ctx.fill();
    // rib shadow
    ctx.fillStyle = b.dark;
    ctx.beginPath();
    ctx.ellipse(cx, bcy + bry * 0.3, brx * 0.92, bry * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Tam brim fold (gold)
  ctx.fillStyle = P.rastGold;
  ctx.beginPath();
  ctx.ellipse(cx, tamBotY, tamW, tamH * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.018); ctx.stroke();

  // Tam outline
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022);
  ctx.beginPath();
  ctx.ellipse(cx, tamBotY, tamW, (tamBotY - tamTopY) * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ── face features ──
  const eyeY    = headCY + headRY * 0.00;
  const eyeSpan = headRX * 0.84;
  const eyeR    = s * 0.042;

  // eyebrows — calm, level (serenity)
  _eyebrows(ctx, cx, eyeY - eyeR * 1.5, eyeSpan, eyeR, P.hairBlack, 0.15);

  // Eyes — calm, half-lidded look (warm dark brown)
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR, '#3a1a08');

  // Nose (broad, gentle)
  _nose(ctx, cx, eyeY + eyeR * 2.2, s);

  // Mouth — gentle closed-lip smile, warm
  _mouth(ctx, cx, eyeY + eyeR * 4.0, s * 0.18, '#5a2a10', s * 0.012);

  // ── name label ──
  ctx.fillStyle = P.rastGreen;
  ctx.font = `700 ${Math.round(s * 0.088)}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('RASTA', s * 0.50, s * 0.090);
  ctx.fillStyle = P.rastGold;
  ctx.font = `500 ${Math.round(s * 0.074)}px "Courier New", monospace`;
  ctx.fillText('MUSICIAN', s * 0.50, s * 0.148);
}

// ─── CONDUCTOR — Bleachaz Conductor ───────────────────────────────────────────
function _drawConductor(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  // frame: slate/urban dark, bright gold swagger
  _frame(ctx, s, P.frameSlateDim, P.frameGold, '#4a3808');

  const neckBaseY = s * 0.90;
  const neckW     = s * 0.148;
  const neckH     = s * 0.080;

  // ── Body / Shoulders — RIGHT side is NATURAL dark skin (unbleached arm)
  //    LEFT side (viewer left = conductor's right) is the shirt side
  //    We draw the full shoulder block then overdraw the right shoulder in natural skin.

  // Full shirt shoulder block first
  const sw = s * 0.35;
  const sy = neckBaseY + neckH;
  const sh = s * 0.20;

  // Shirt side (left — conductor's right): dark navy conductor shirt
  ctx.fillStyle = '#1e2a3a';
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.5, neckBaseY);
  ctx.lineTo(cx, neckBaseY);
  ctx.lineTo(cx, sy + sh);
  ctx.lineTo(cx - sw, sy + sh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  // Natural dark arm (right side — conductor's left): bare brown arm, no bleach
  ctx.fillStyle = P.skinDark;
  ctx.beginPath();
  ctx.moveTo(cx, neckBaseY);
  ctx.lineTo(cx + neckW * 0.5, neckBaseY);
  ctx.lineTo(cx + sw, sy + sh);
  ctx.lineTo(cx, sy + sh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  // Shirt shadow on left shoulder
  ctx.fillStyle = '#111a26';
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.4, neckBaseY + neckH * 0.3);
  ctx.lineTo(cx - 2, neckBaseY + neckH * 0.3);
  ctx.lineTo(cx - 2, sy + sh);
  ctx.lineTo(cx - sw * 0.88, sy + sh);
  ctx.closePath();
  ctx.fill();

  // Dividing line between bleached shirt side and natural skin arm (dramatic edge)
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.lineWidth = Math.max(2, s * 0.022);
  ctx.beginPath();
  ctx.moveTo(cx, neckBaseY); ctx.lineTo(cx, sy + sh);
  ctx.stroke();

  // Tattoos on natural-skin right side neck/shoulder area
  // Two small simple ink marks
  const tatX = cx + neckW * 0.75;
  const tatY = neckBaseY - neckH * 0.5;
  ctx.strokeStyle = P.tattooInk; ctx.lineWidth = Math.max(1, s * 0.014);
  ctx.lineCap = 'round';
  // Star-cross mark
  ctx.beginPath();
  ctx.moveTo(tatX - s * 0.022, tatY);
  ctx.lineTo(tatX + s * 0.022, tatY);
  ctx.moveTo(tatX, tatY - s * 0.022);
  ctx.lineTo(tatX, tatY + s * 0.022);
  ctx.stroke();
  // Small curved line below — decorative tat
  ctx.beginPath();
  ctx.arc(tatX + s * 0.006, tatY + s * 0.042, s * 0.016, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // ── Neck — bleached pale (with slight blotch at base where it meets natural shoulder) ──
  ctx.fillStyle = P.skinPale;
  ctx.fillRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.strokeRect(cx - neckW * 0.5, neckBaseY - neckH, neckW, neckH);
  // Blotch edge at lower neck where bleach is uneven (pinkish)
  ctx.fillStyle = P.skinBlotch;
  ctx.beginPath();
  ctx.ellipse(cx + neckW * 0.15, neckBaseY - neckH * 0.1, neckW * 0.28, neckH * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── Head ──
  const headCY = s * 0.515;
  const headRX  = s * 0.185;
  const headRY  = s * 0.212;

  // head shadow
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.012, headRX, headRY);
  ctx.fill();

  // Bleached face — unnaturally light, slightly pinkish
  ctx.fillStyle = P.skinPale;
  ellipse(ctx, cx, headCY, headRX, headRY);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();

  // Pink blotch on forehead / cheek edges — uneven bleach pattern
  ctx.fillStyle = P.skinBlotch;
  ellipse(ctx, cx - headRX * 0.52, headCY - headRY * 0.08, headRX * 0.26, headRY * 0.20);
  ctx.fill();
  ellipse(ctx, cx + headRX * 0.44, headCY + headRY * 0.18, headRX * 0.20, headRY * 0.16);
  ctx.fill();
  // Slightly darker edge around jaw (transition zone)
  ctx.strokeStyle = P.skinBlotch; ctx.lineWidth = Math.max(2, s * 0.020);
  ctx.beginPath();
  ctx.ellipse(cx, headCY, headRX * 0.96, headRY * 0.94, 0, Math.PI * 0.25, Math.PI * 0.85);
  ctx.stroke();

  // Pale face highlight (centre forehead plane)
  ctx.fillStyle = 'rgba(255,240,220,0.32)';
  ellipse(ctx, cx, headCY - headRY * 0.28, headRX * 0.50, headRY * 0.32);
  ctx.fill();

  // Ears — natural skin tone (contrast: bleaching doesn't usually reach the ears)
  for (const sign of [-1, 1]) {
    ctx.fillStyle = sign < 0 ? P.skinPale : P.skinDark; // left ear = bleached side, right = natural
    ellipse(ctx, cx + sign * headRX * 0.95, headCY + headRY * 0.08,
            headRX * 0.10, headRY * 0.13);
    ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  }

  // ── Cap — peaked bus conductor's cap ──
  const capBrimY = headCY - headRY * 0.50;
  const capTopY  = headCY - headRY * 1.06;
  const capW     = headRX * 1.12;

  // Cap body
  ctx.fillStyle = P.capNavy;
  ctx.beginPath();
  ctx.moveTo(cx - capW, capBrimY);
  ctx.quadraticCurveTo(cx, capTopY, cx + capW, capBrimY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.020); ctx.stroke();

  // Cap band (gold trim)
  ctx.fillStyle = P.frameGold;
  ctx.fillRect(cx - capW * 0.94, capBrimY - s * 0.016, capW * 1.88, s * 0.016);

  // Shading band mid-cap
  ctx.fillStyle = P.capNavyMid;
  ctx.beginPath();
  ctx.moveTo(cx - capW * 0.86, capBrimY - s * 0.014);
  ctx.quadraticCurveTo(cx, capBrimY + (capTopY - capBrimY) * 0.55, cx + capW * 0.86, capBrimY - s * 0.014);
  ctx.quadraticCurveTo(cx, capBrimY + (capTopY - capBrimY) * 0.30, cx - capW * 0.86, capBrimY - s * 0.014);
  ctx.closePath(); ctx.fill();

  // Peak / brim
  ctx.fillStyle = P.capBrim;
  ctx.beginPath();
  ctx.ellipse(cx - capW * 0.15, capBrimY, capW * 0.80, s * 0.040, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  // ── Face features ──
  const eyeY    = headCY + headRY * 0.02;
  const eyeSpan = headRX * 0.84;
  const eyeR    = s * 0.042;

  // Eyebrows — confident, slightly raised on one side (swagger)
  _eyebrows(ctx, cx, eyeY - eyeR * 1.5, eyeSpan, eyeR, '#3a2808', 0.4);

  // Eyes — dark iris, direct and confident
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR, '#2a1608');

  // Nose
  _nose(ctx, cx, eyeY + eyeR * 2.2, s);

  // Mouth — BLACK lips with pink centre (characteristic bleaching effect)
  // Black outer lips
  ctx.fillStyle = P.blackLip;
  ctx.beginPath();
  ctx.ellipse(cx, eyeY + eyeR * 4.0 + s * 0.006, s * 0.082, s * 0.030, 0, 0, Math.PI * 2);
  ctx.fill();
  // Pink / rose centre of lips
  ctx.fillStyle = P.pinkLipCtr;
  ctx.beginPath();
  ctx.ellipse(cx, eyeY + eyeR * 4.0 + s * 0.004, s * 0.056, s * 0.016, 0, 0, Math.PI * 2);
  ctx.fill();
  // Lip line
  ctx.strokeStyle = P.blackLip; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.070, eyeY + eyeR * 4.0);
  ctx.quadraticCurveTo(cx, eyeY + eyeR * 4.0 + s * 0.010, cx + s * 0.070, eyeY + eyeR * 4.0);
  ctx.stroke();

  // ── name label ──
  ctx.fillStyle = P.frameGold;
  ctx.font = `700 ${Math.round(s * 0.080)}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('BLEACHAZ', s * 0.50, s * 0.086);
  ctx.fillStyle = '#cbe7cf';
  ctx.font = `500 ${Math.round(s * 0.070)}px "Courier New", monospace`;
  ctx.fillText('CONDUCTOR', s * 0.50, s * 0.142);
}

// ─── FALLBACK — neutral silhouette ───────────────────────────────────────────
function _drawSilhouette(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  _frame(ctx, s, '#111a12', '#5a5a5a', '#3a3a3a');

  // Grey bust silhouette
  const neckBaseY = s * 0.88;
  const headCY    = s * 0.52;
  const headRX    = s * 0.185;
  const headRY    = s * 0.215;
  const col       = '#4a4a4a';
  const dark      = '#303030';

  // shoulders
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(cx - headRX * 0.5, neckBaseY);
  ctx.lineTo(cx + headRX * 0.5, neckBaseY);
  ctx.lineTo(cx + headRX * 1.8, neckBaseY + s * 0.2);
  ctx.lineTo(cx - headRX * 1.8, neckBaseY + s * 0.2);
  ctx.closePath(); ctx.fill();

  // head
  ctx.fillStyle = col;
  ellipse(ctx, cx, headCY, headRX, headRY);
  ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();

  // Question mark
  ctx.fillStyle = '#6a6a6a';
  ctx.font = `700 ${Math.round(s * 0.22)}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('?', cx, headCY + headRY * 0.06);
}
