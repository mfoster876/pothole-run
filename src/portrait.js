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

export const PORTRAITS = new Set(['yute', 'rasta', 'conductor', 'politician']);

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
    case 'politician':_drawPolitician(ctx, size); break;
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

  // politician — half-orange / half-green suit + British court wig
  poliOrange:    '#e8821e',
  poliOrangeDim: '#b5610c',
  poliGreen:     '#1f8a3c',
  poliGreenDim:  '#14622a',
  wigCream:      '#ece9e0',
  wigShadow:     '#c8c4b8',

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
 * Clip subsequent drawing to the inner frame panel so the bust can never spill past
 * the frame edge. No extra ctx.save() — the ctx.save() in renderPortrait owns the
 * restore, which clears this clip when the portrait is done.
 */
function _clipPanel(ctx, size) {
  const pad = size * 0.04;
  const r   = size * 0.10;
  rrect(ctx, pad, pad, size - pad * 2, size - pad * 2, r);
  ctx.clip();
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
  _clipPanel(ctx, s);

  // ── vertical layout anchors (all inside the frame) ──
  const headCY  = s * 0.49;
  const headRX  = s * 0.172;
  const headRY  = s * 0.200;
  const chinY   = headCY + headRY * 0.92;
  const neckW   = s * 0.130;
  const neckTopY = chinY - headRY * 0.05;
  const neckBotY = chinY + s * 0.075;
  const shTopY  = neckBotY - s * 0.004;
  const shBotY  = s * 0.955;            // just inside the frame bottom
  const shHalf  = s * 0.34;

  // ── Dreadlocks (behind everything) — hang down past the shoulders, in-frame ──
  const lockColors = [P.hairBlack, P.hairBrown, P.hairBlack, '#241408', P.hairBlack, P.hairBrown];
  const lockPositions = [-0.80, -0.48, -0.14, 0.30, 0.62, 0.88];
  const lockY0  = headCY - headRY * 0.30;
  const lockBot = s * 0.94;
  for (let i = 0; i < lockPositions.length; i++) {
    const lx = cx + lockPositions[i] * headRX * 1.25;
    const lw = s * 0.034 + (i % 2) * s * 0.008;
    ctx.fillStyle = lockColors[i % lockColors.length];
    ctx.beginPath();
    ctx.moveTo(lx - lw / 2, lockY0);
    ctx.quadraticCurveTo(lx - lw * 0.9, (lockY0 + lockBot) / 2, lx - lw * 0.4, lockBot);
    ctx.lineTo(lx + lw * 0.4, lockBot);
    ctx.quadraticCurveTo(lx + lw * 0.9, (lockY0 + lockBot) / 2, lx + lw / 2, lockY0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, s * 0.009); ctx.stroke();
    // knot rings down the lock
    ctx.strokeStyle = 'rgba(0,0,0,0.40)'; ctx.lineWidth = Math.max(1, s * 0.006);
    for (const t of [0.35, 0.6, 0.85]) {
      const ly = lockY0 + (lockBot - lockY0) * t;
      ctx.beginPath(); ctx.moveTo(lx - lw * 0.5, ly); ctx.lineTo(lx + lw * 0.5, ly); ctx.stroke();
    }
  }

  // ── Shoulders / shirt (dark, relaxed) ──
  ctx.fillStyle = '#1a2e1e';
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.5, neckBotY);
  ctx.lineTo(cx + neckW * 0.5, neckBotY);
  ctx.lineTo(cx + shHalf, shBotY);
  ctx.lineTo(cx - shHalf, shBotY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();
  ctx.fillStyle = '#0e1c12';
  ctx.beginPath();
  ctx.moveTo(cx - shHalf * 0.85, shBotY);
  ctx.quadraticCurveTo(cx, shTopY + (shBotY - shTopY) * 0.18, cx + shHalf * 0.85, shBotY);
  ctx.closePath(); ctx.fill();

  // ── Neck ──
  ctx.fillStyle = P.skinDark;
  ctx.fillRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.strokeRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);

  // ── Goatee under the chin ──
  ctx.fillStyle = P.hairBlack;
  ellipse(ctx, cx, chinY + s * 0.012, headRX * 0.38, headRY * 0.22); ctx.fill();

  // ── Head ──
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.012, headRX, headRY); ctx.fill();
  ctx.fillStyle = P.skinDark;
  ellipse(ctx, cx, headCY, headRX, headRY); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();
  // forehead plane highlight
  ctx.fillStyle = '#4a2810';
  ellipse(ctx, cx, headCY - headRY * 0.24, headRX * 0.60, headRY * 0.34); ctx.fill();

  // Ears
  for (const sign of [-1, 1]) {
    ctx.fillStyle = P.skinDark;
    ellipse(ctx, cx + sign * headRX * 0.95, headCY + headRY * 0.06, headRX * 0.10, headRY * 0.13); ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  }

  // ── Rasta tam / crown — red/gold/green knit dome on top of the head ──
  const tamBotY = headCY - headRY * 0.34;
  const tamTopY = headCY - headRY * 1.18;
  const tamW    = headRX * 1.12;
  ctx.fillStyle = P.rastGreen;
  ctx.beginPath();
  ctx.ellipse(cx, tamBotY, tamW, (tamBotY - tamTopY) * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
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
    ctx.beginPath(); ctx.ellipse(cx, bcy, brx, bry, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = b.dark;
    ctx.beginPath(); ctx.ellipse(cx, bcy + bry * 0.3, brx * 0.92, bry * 0.35, 0, 0, Math.PI * 2); ctx.fill();
  }
  // brim fold + outline
  ctx.fillStyle = P.rastGold;
  ctx.beginPath(); ctx.ellipse(cx, tamBotY, tamW, tamH * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.018); ctx.stroke();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022);
  ctx.beginPath();
  ctx.ellipse(cx, tamBotY, tamW, (tamBotY - tamTopY) * 0.55, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ── face features ──
  const eyeY    = headCY + headRY * 0.04;
  const eyeSpan = headRX * 0.84;
  const eyeR    = s * 0.040;
  _eyebrows(ctx, cx, eyeY - eyeR * 1.5, eyeSpan, eyeR, P.hairBlack, 0.15);
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR, '#3a1a08');
  _nose(ctx, cx, eyeY + eyeR * 2.2, s);
  _mouth(ctx, cx, eyeY + eyeR * 3.9, s * 0.17, '#5a2a10', s * 0.012);

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
// Bleach reaches only the FACE & NECK; both arms / the bare chest stay natural dark
// skin, the chest dusted with baby powder, hair styled in bantu knots. The whole
// bust is laid out to sit INSIDE the frame (no spill off the bottom edge).
function _drawConductor(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  // frame: slate/urban dark, bright gold swagger
  _frame(ctx, s, P.frameSlateDim, P.frameGold, '#4a3808');
  _clipPanel(ctx, s);

  // ── vertical layout anchors (all inside the frame) ──
  const headCY  = s * 0.47;
  const headRX  = s * 0.180;
  const headRY  = s * 0.205;
  const chinY   = headCY + headRY * 0.92;
  const neckW   = s * 0.135;
  const neckTopY = chinY - headRY * 0.06;
  const neckBotY = chinY + s * 0.085;
  const shTopY  = neckBotY - s * 0.004;
  const shBotY  = s * 0.955;            // just inside the frame bottom (panel ends ~0.96)
  const shHalf  = s * 0.36;

  // ── Bare dark-skin shoulders / chest — BOTH arms black ──
  ctx.fillStyle = P.skinDark;
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.5, neckBotY);
  ctx.lineTo(cx + neckW * 0.5, neckBotY);
  ctx.lineTo(cx + shHalf, shBotY);
  ctx.lineTo(cx - shHalf, shBotY);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();

  // rounded-pec shading
  ctx.fillStyle = '#2a1407';
  ctx.beginPath();
  ctx.moveTo(cx - shHalf * 0.86, shBotY);
  ctx.quadraticCurveTo(cx, shTopY + (shBotY - shTopY) * 0.16, cx + shHalf * 0.86, shBotY);
  ctx.closePath();
  ctx.fill();

  // ── Baby-powder dusting across the chest (the signature look) ──
  for (const [bx, by, brx, bry, a] of [
    [cx - shHalf * 0.34, shTopY + s * 0.085, s * 0.092, s * 0.075, 0.85],
    [cx + shHalf * 0.32, shTopY + s * 0.095, s * 0.086, s * 0.070, 0.85],
    [cx,                 shTopY + s * 0.055, s * 0.072, s * 0.055, 0.80],
    [cx - shHalf * 0.02, shTopY + s * 0.150, s * 0.130, s * 0.060, 0.70],
  ]) {
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(brx, bry));
    g.addColorStop(0, `rgba(246,246,240,${a})`);
    g.addColorStop(1, 'rgba(246,246,240,0)');
    ctx.fillStyle = g;
    ellipse(ctx, bx, by, brx, bry); ctx.fill();
  }
  // powder specks
  ctx.fillStyle = 'rgba(246,246,240,0.9)';
  for (const [px, py] of [
    [cx - shHalf * 0.20, shTopY + s * 0.110], [cx + shHalf * 0.18, shTopY + s * 0.120],
    [cx + shHalf * 0.02, shTopY + s * 0.070], [cx - shHalf * 0.42, shTopY + s * 0.135],
    [cx + shHalf * 0.38, shTopY + s * 0.140],
  ]) { ellipse(ctx, px, py, s * 0.006, s * 0.006); ctx.fill(); }

  // ── Gold chain (swagger) ──
  ctx.strokeStyle = P.frameGold; ctx.lineWidth = Math.max(1.5, s * 0.013);
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.45, neckBotY);
  ctx.quadraticCurveTo(cx, neckBotY + s * 0.055, cx + neckW * 0.45, neckBotY);
  ctx.stroke();
  ctx.fillStyle = P.frameGold;
  ellipse(ctx, cx, neckBotY + s * 0.050, s * 0.012, s * 0.014); ctx.fill();

  // ── Tattoo on the viewer-right shoulder ──
  const tatX = cx + shHalf * 0.42, tatY = shTopY + s * 0.085;
  ctx.strokeStyle = P.tattooInk; ctx.lineWidth = Math.max(1, s * 0.012);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(tatX - s * 0.020, tatY); ctx.lineTo(tatX + s * 0.020, tatY);
  ctx.moveTo(tatX, tatY - s * 0.020); ctx.lineTo(tatX, tatY + s * 0.020);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // ── Bleached neck ──
  ctx.fillStyle = P.skinPale;
  ctx.fillRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016);
  ctx.strokeRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);
  // pinkish uneven blotch at the bleach line where it meets the dark chest
  ctx.fillStyle = P.skinBlotch;
  ellipse(ctx, cx + neckW * 0.12, neckBotY - s * 0.012, neckW * 0.30, s * 0.012); ctx.fill();

  // ── Head — bleached pale face ──
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.012, headRX, headRY); ctx.fill();
  ctx.fillStyle = P.skinPale;
  ellipse(ctx, cx, headCY, headRX, headRY); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();

  // uneven bleach blotches + forehead highlight
  ctx.fillStyle = P.skinBlotch;
  ellipse(ctx, cx - headRX * 0.52, headCY - headRY * 0.04, headRX * 0.24, headRY * 0.18); ctx.fill();
  ellipse(ctx, cx + headRX * 0.46, headCY + headRY * 0.20, headRX * 0.18, headRY * 0.15); ctx.fill();
  ctx.fillStyle = 'rgba(255,240,220,0.30)';
  ellipse(ctx, cx, headCY - headRY * 0.22, headRX * 0.48, headRY * 0.28); ctx.fill();

  // Ears — natural dark (bleach skips them)
  for (const sign of [-1, 1]) {
    ctx.fillStyle = P.skinDark;
    ellipse(ctx, cx + sign * headRX * 0.96, headCY + headRY * 0.06, headRX * 0.10, headRY * 0.13); ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  }

  // ── Bantu knots ── close dark scalp cap, then knotted buns over the crown.
  ctx.fillStyle = P.hairBlack;
  ctx.beginPath();
  ctx.ellipse(cx, headCY - headRY * 0.06, headRX * 0.98, headRY * 0.70, 0, Math.PI, 2 * Math.PI);
  ctx.fill();

  const knots = [
    [-0.60, -0.66, 0.16], [0.00, -0.80, 0.17], [0.60, -0.66, 0.16],
    [-0.34, -1.00, 0.14], [0.34, -1.00, 0.14],
  ];
  for (const [kx, ky, kr] of knots) {
    const bx = cx + kx * headRX;
    const by = headCY + ky * headRY;
    const r  = kr * headRX;
    ctx.fillStyle = '#0e0a05';                       // base ring
    ellipse(ctx, bx, by + r * 0.35, r * 1.15, r * 0.70); ctx.fill();
    ctx.fillStyle = P.hairBlack;                     // knot ball
    ellipse(ctx, bx, by, r, r); ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.010); ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = Math.max(1, s * 0.008);
    ctx.beginPath(); ctx.arc(bx, by, r * 0.6, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';        // sheen
    ellipse(ctx, bx - r * 0.3, by - r * 0.3, r * 0.28, r * 0.22); ctx.fill();
  }

  // ── Face features ──
  const eyeY    = headCY + headRY * 0.04;
  const eyeSpan = headRX * 0.84;
  const eyeR    = s * 0.042;
  _eyebrows(ctx, cx, eyeY - eyeR * 1.5, eyeSpan, eyeR, '#3a2808', 0.4);
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR, '#2a1608');
  _nose(ctx, cx, eyeY + eyeR * 2.2, s);

  // Black lips with pink centre (characteristic)
  const lipY = eyeY + eyeR * 4.0;
  ctx.fillStyle = P.blackLip;
  ellipse(ctx, cx, lipY + s * 0.006, s * 0.078, s * 0.028); ctx.fill();
  ctx.fillStyle = P.pinkLipCtr;
  ellipse(ctx, cx, lipY + s * 0.004, s * 0.052, s * 0.014); ctx.fill();
  ctx.strokeStyle = P.blackLip; ctx.lineWidth = Math.max(1, s * 0.014);
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.066, lipY);
  ctx.quadraticCurveTo(cx, lipY + s * 0.010, cx + s * 0.066, lipY);
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

// ─── POLITICIAN — "Di Politician" ─────────────────────────────────────────────
// Statesmanlike bust: dark suit, white shirt, red tie, gold lapel pin, greying
// side-parted hair and a sly, money-magnet smirk. Laid out to sit inside the frame.
function _drawPolitician(ctx, size) {
  const s = size;
  const cx = s * 0.50;

  _frame(ctx, s, P.frameSlateDim, P.frameGold, '#4a3808');
  _clipPanel(ctx, s);

  const headCY = s * 0.47, headRX = s * 0.175, headRY = s * 0.200;
  const chinY  = headCY + headRY * 0.92;
  const neckW  = s * 0.120;
  const neckTopY = chinY - headRY * 0.05;
  const neckBotY = chinY + s * 0.070;
  const shTopY = neckBotY - s * 0.004, shBotY = s * 0.955, shHalf = s * 0.36;

  // ── Suit shoulders — HALF-ORANGE (viewer-left) / HALF-GREEN (viewer-right) ──
  // The jacket polygon, painted with a vertical split down the centre line.
  const jacketPath = () => {
    ctx.beginPath();
    ctx.moveTo(cx - neckW * 0.5, neckBotY);
    ctx.lineTo(cx + neckW * 0.5, neckBotY);
    ctx.lineTo(cx + shHalf, shBotY);
    ctx.lineTo(cx - shHalf, shBotY);
    ctx.closePath();
  };
  // green base fills the whole jacket
  jacketPath(); ctx.fillStyle = P.poliGreen; ctx.fill();
  // clip to the jacket, then overpaint the LEFT half orange (split at cx)
  ctx.save();
  jacketPath(); ctx.clip();
  ctx.fillStyle = P.poliOrange;
  ctx.fillRect(cx - shHalf - s * 0.02, neckBotY - s * 0.02, shHalf + s * 0.02, shBotY - neckBotY + s * 0.04);
  // lower shadow bands — darker tone of each half so both sides keep depth
  ctx.fillStyle = P.poliOrangeDim;
  ctx.fillRect(cx - shHalf - s * 0.02, shBotY - (shBotY - neckBotY) * 0.34, shHalf + s * 0.02, (shBotY - neckBotY) * 0.4);
  ctx.fillStyle = P.poliGreenDim;
  ctx.fillRect(cx, shBotY - (shBotY - neckBotY) * 0.34, shHalf + s * 0.02, (shBotY - neckBotY) * 0.4);
  ctx.restore();
  // jacket outline + centre seam
  jacketPath(); ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.016); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = Math.max(1, s * 0.012);
  ctx.beginPath(); ctx.moveTo(cx, neckBotY); ctx.lineTo(cx, shBotY); ctx.stroke();

  // white shirt V
  ctx.fillStyle = '#eef0f2';
  ctx.beginPath();
  ctx.moveTo(cx - neckW * 0.55, neckBotY);
  ctx.lineTo(cx + neckW * 0.55, neckBotY);
  ctx.lineTo(cx, shBotY);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.012); ctx.stroke();
  // red tie
  ctx.fillStyle = '#c0251a';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.028, neckBotY + s * 0.005);
  ctx.lineTo(cx + s * 0.028, neckBotY + s * 0.005);
  ctx.lineTo(cx + s * 0.020, shBotY);
  ctx.lineTo(cx - s * 0.020, shBotY);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7a1208'; ctx.lineWidth = Math.max(1, s * 0.010); ctx.stroke();
  // gold lapel pin
  ctx.fillStyle = P.frameGold;
  ellipse(ctx, cx - shHalf * 0.42, shTopY + s * 0.07, s * 0.013, s * 0.013); ctx.fill();

  // ── Neck ──
  ctx.fillStyle = P.skinMid;
  ctx.fillRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014);
  ctx.strokeRect(cx - neckW * 0.5, neckTopY, neckW, neckBotY - neckTopY);

  // ── Head ──
  ctx.fillStyle = 'rgba(0,0,0,0.30)';
  ellipse(ctx, cx + s * 0.012, headCY + s * 0.012, headRX, headRY); ctx.fill();
  ctx.fillStyle = P.skinMid;
  ellipse(ctx, cx, headCY, headRX, headRY); ctx.fill();
  ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1.5, s * 0.022); ctx.stroke();
  ctx.fillStyle = P.skinLight;
  ellipse(ctx, cx - headRX * 0.46, headCY + headRY * 0.14, headRX * 0.24, headRY * 0.18); ctx.fill();
  ellipse(ctx, cx + headRX * 0.46, headCY + headRY * 0.14, headRX * 0.24, headRY * 0.18); ctx.fill();

  // ears
  for (const sign of [-1, 1]) {
    ctx.fillStyle = P.skinMid;
    ellipse(ctx, cx + sign * headRX * 0.96, headCY + headRY * 0.06, headRX * 0.10, headRY * 0.13); ctx.fill();
    ctx.strokeStyle = P.outline; ctx.lineWidth = Math.max(1, s * 0.014); ctx.stroke();
  }

  // ── British barrister/judge court wig — cream dome of horizontal curl-rows,
  //    round side-curls bunched over each ear, framing the face, with a tail. ──
  // helper: one cream curl with a soft grey underside shadow
  const curl = (kx, ky, kr) => {
    ctx.fillStyle = P.wigShadow;
    ellipse(ctx, kx, ky + kr * 0.30, kr * 1.02, kr * 0.74); ctx.fill();
    ctx.fillStyle = P.wigCream;
    ellipse(ctx, kx, ky, kr, kr * 0.78); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ellipse(ctx, kx - kr * 0.28, ky - kr * 0.24, kr * 0.32, kr * 0.24); ctx.fill();
  };

  // cream dome cap behind the curls (covers the crown to the brow)
  ctx.fillStyle = P.wigCream;
  ctx.beginPath();
  ctx.ellipse(cx, headCY - headRY * 0.16, headRX * 1.04, headRY * 0.78, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = P.wigShadow; ctx.lineWidth = Math.max(1, s * 0.012); ctx.stroke();

  // rows of tight horizontal curls across the crown (top row smallest)
  const rows = [
    { y: -0.86, n: 4, r: 0.20, span: 0.62 },
    { y: -0.64, n: 5, r: 0.22, span: 0.78 },
    { y: -0.42, n: 6, r: 0.23, span: 0.92 },
    { y: -0.22, n: 6, r: 0.22, span: 0.96 },
  ];
  for (const row of rows) {
    for (let i = 0; i < row.n; i++) {
      const t = row.n === 1 ? 0.5 : i / (row.n - 1);
      const kx = cx + (t - 0.5) * 2 * headRX * row.span;
      const ky = headCY + headRY * row.y;
      curl(kx, ky, headRX * row.r);
    }
  }

  // bunched round side-curls stacked over each ear (the barrister side-rolls)
  for (const sign of [-1, 1]) {
    for (let j = 0; j < 3; j++) {
      const sx = cx + sign * headRX * (1.02 + j * 0.02);
      const sy = headCY + headRY * (0.04 + j * 0.30);
      curl(sx, sy, headRX * 0.22);
    }
  }

  // a slight tail of curls hanging at the lower back-centre
  curl(cx, headCY + headRY * 0.96, headRX * 0.18);

  // ── Face features — sly & confident ──
  const eyeY = headCY + headRY * 0.02, eyeSpan = headRX * 0.84, eyeR = s * 0.040;
  _eyebrows(ctx, cx, eyeY - eyeR * 1.5, eyeSpan, eyeR, '#2a2620', 0.35);
  _eyes(ctx, cx, eyeY, eyeSpan, eyeR, '#2a1a0c');
  _nose(ctx, cx, eyeY + eyeR * 2.2, s);
  // smug asymmetric smirk
  ctx.strokeStyle = '#3a1e10'; ctx.lineWidth = Math.max(1.5, s * 0.018); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.060, eyeY + eyeR * 3.9);
  ctx.quadraticCurveTo(cx, eyeY + eyeR * 4.2, cx + s * 0.070, eyeY + eyeR * 3.6);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // ── name label ──
  ctx.fillStyle = P.frameGold;
  ctx.font = `700 ${Math.round(s * 0.082)}px "Courier New", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('DI', s * 0.50, s * 0.086);
  ctx.fillStyle = '#cbe7cf';
  ctx.font = `500 ${Math.round(s * 0.066)}px "Courier New", monospace`;
  ctx.fillText('POLITICIAN', s * 0.50, s * 0.146);
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
