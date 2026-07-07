// src/screens/hub.js
// The main menu hub: four big buttons leading to the four sub-screens.
// Render style matches the existing canvas/monospace house style in game.js.
import { formatMoney } from '../money.js';
import { rankFor, nextRank } from '../ranks.js';

// Lazy-built button rects — recalculated each render for the current W/H.
function hubRects(W, H) {
  const bw = Math.round(W * 0.60), bh = 50;
  const bx = (W - bw) / 2;
  return {
    play:        { x: bx, y: H * 0.34 - bh / 2, w: bw, h: bh },
    races:       { x: bx, y: H * 0.45 - bh / 2, w: bw, h: bh },
    mechshop:    { x: bx, y: H * 0.56 - bh / 2, w: bw, h: bh },
    cardealer:   { x: bx, y: H * 0.67 - bh / 2, w: bw, h: bh },
    aspirations: { x: bx, y: H * 0.78 - bh / 2, w: bw, h: bh },
    help:        { x: W - 64, y: 18, w: 46, h: 46 }, // small "?" — How To Play
    prefs:       { x: 18,    y: 18, w: 46, h: 46 }   // small "⚙" — Preferences
  };
}

// A drawn vector gear (emoji glyphs like ⚙ don't render in the canvas monospace font, so
// the settings cog has to be drawn) — a toothed ring with a hollow centre.
function drawGear(ctx, cx, cy, r, color, bg) {
  const teeth = 8;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < teeth * 2; i++) {
    const ang = (i / (teeth * 2)) * Math.PI * 2;
    const rad = (i % 2 === 0) ? r : r * 0.74;
    const px = cx + Math.cos(ang) * rad, py = cy + Math.sin(ang) * rad;
    i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
  }
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = bg;                                   // punch the centre hole
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.36, 0, Math.PI * 2); ctx.fill();
}

// ─── Animated menu backdrop ───────────────────────────────────────────────────
// A living Pothole Run scene behind the buttons: a warm sun, parallax Blue-Mountain
// ridges, drifting clouds, and a road rushing toward the viewer with the sound-system
// cart bobbing along. Driven by wall-clock time so it moves every frame; a scrim over
// it keeps the button band perfectly readable.
function menuRidge(ctx, W, H, baseY, amp, drift, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, baseY);
  const steps = 14;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W;
    const h = Math.sin(i * 0.9 + drift) * 0.5 + Math.sin(i * 2.1 + drift * 0.6) * 0.3;
    ctx.lineTo(x, baseY - amp * (0.4 + 0.6 * (h * 0.5 + 0.5)));
  }
  ctx.lineTo(W, baseY); ctx.closePath(); ctx.fill();
}
function menuCloud(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
  ctx.arc(x + r * 0.5, y + r * 0.12, r * 0.5, 0, Math.PI * 2);
  ctx.arc(x - r * 0.5, y + r * 0.14, r * 0.45, 0, Math.PI * 2);
  ctx.arc(x + r * 0.08, y - r * 0.22, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
}
function menuCart(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(0,0,0,0.32)';
  ctx.beginPath(); ctx.ellipse(x, y + s * 0.52, s * 1.1, s * 0.18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#141414';
  for (const wx of [-s * 0.7, s * 0.7]) {
    ctx.beginPath(); ctx.arc(x + wx, y + s * 0.42, s * 0.28, 0, Math.PI * 2); ctx.fillStyle = '#141414'; ctx.fill();
    ctx.beginPath(); ctx.arc(x + wx, y + s * 0.42, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#8a8a8a'; ctx.fill();
  }
  ctx.fillStyle = '#7a4a22'; ctx.fillRect(x - s * 0.95, y, s * 1.9, s * 0.42);
  ctx.strokeStyle = '#5c3413'; ctx.lineWidth = 2; ctx.strokeRect(x - s * 0.95, y, s * 1.9, s * 0.42);
  ctx.fillStyle = '#1e1e22'; ctx.fillRect(x - s * 0.5, y - s * 0.72, s, s * 0.72);
  const stW = s / 3;
  ctx.fillStyle = '#2a8a3a'; ctx.fillRect(x - s * 0.5, y - s * 0.72, stW, s * 0.1);
  ctx.fillStyle = '#e0b020'; ctx.fillRect(x - s * 0.5 + stW, y - s * 0.72, stW, s * 0.1);
  ctx.fillStyle = '#c0392b'; ctx.fillRect(x - s * 0.5 + 2 * stW, y - s * 0.72, stW, s * 0.1);
  ctx.fillStyle = '#45454d'; ctx.beginPath(); ctx.arc(x, y - s * 0.3, s * 0.22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#141418'; ctx.beginPath(); ctx.arc(x, y - s * 0.3, s * 0.16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#34343c'; ctx.beginPath(); ctx.arc(x, y - s * 0.3, s * 0.07, 0, Math.PI * 2); ctx.fill();
}
function drawMenuScene(ctx, W, H, t) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#13281d'); sky.addColorStop(0.55, '#0e1a12'); sky.addColorStop(1, '#0a150e');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  // warm sun glow, top-right
  const sunX = W * 0.82, sunY = H * 0.15;
  const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, H * 0.3);
  glow.addColorStop(0, 'rgba(240,200,90,0.30)'); glow.addColorStop(1, 'rgba(240,200,90,0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(246,212,112,0.55)';
  ctx.beginPath(); ctx.arc(sunX, sunY, H * 0.05, 0, Math.PI * 2); ctx.fill();
  // parallax ridgelines (far, then near)
  menuRidge(ctx, W, H, H * 0.42, H * 0.11, t * 0.05, '#15301f');
  menuRidge(ctx, W, H, H * 0.44, H * 0.08, t * 0.09 + 1.7, '#1b3a26');
  // drifting clouds
  for (let i = 0; i < 3; i++) {
    const cw = W * (0.16 + i * 0.05), speed = 7 + i * 5;
    const cx = ((t * speed + i * W * 0.44) % (W + cw * 2)) - cw;
    ctx.fillStyle = 'rgba(206,222,210,' + (0.10 - i * 0.022) + ')';
    menuCloud(ctx, cx, H * (0.13 + i * 0.055), cw * 0.5);
  }
  // road rushing toward the viewer along the bottom
  const roadTop = H * 0.80, vpX = W / 2, topHalf = W * 0.03, botHalf = W * 0.44;
  ctx.fillStyle = '#3a3e40';
  ctx.beginPath();
  ctx.moveTo(vpX - topHalf, roadTop); ctx.lineTo(vpX + topHalf, roadTop);
  ctx.lineTo(vpX + botHalf, H); ctx.lineTo(vpX - botHalf, H); ctx.closePath(); ctx.fill();
  // animated dashed centre line (dashes accelerate as they near, selling speed)
  const phase = (t * 0.6) % 1;
  for (let k = 0; k < 7; k++) {
    const f = (k + phase) / 7, y = roadTop + (H - roadTop) * f * f, w = 2 + f * 12;
    ctx.fillStyle = 'rgba(240,220,120,' + (0.28 + 0.5 * f) + ')';
    ctx.fillRect(vpX - w / 2, y, w, Math.max(2, (H - roadTop) * f * 0.06 + 2));
  }
  // the sound-system cart, bobbing over the road (low enough to clear the footer text)
  menuCart(ctx, vpX, H * 0.975 + Math.sin(t * 4) * H * 0.005, H * 0.043);
  // contrast scrim — darkest through the button band, lighter at the scenic edges
  const scrim = ctx.createLinearGradient(0, 0, 0, H);
  scrim.addColorStop(0, 'rgba(12,22,15,0.34)');
  scrim.addColorStop(0.30, 'rgba(12,22,15,0.64)');
  scrim.addColorStop(0.78, 'rgba(12,22,15,0.64)');
  scrim.addColorStop(1, 'rgba(12,22,15,0.22)');
  ctx.fillStyle = scrim; ctx.fillRect(0, 0, W, H);
}

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 32px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

export function render(ctx, { save, W, H }) {
  const t = (typeof performance !== 'undefined' ? performance.now() : 0) / 1000;
  drawMenuScene(ctx, W, H, t);

  // Title — on the narrow portrait stage it shrinks and drops below the corner
  // buttons (gear / ?) instead of colliding with them. A gentle bob keeps it alive.
  const compact = W < 700;
  const titleBob = Math.sin(t * 1.4) * 2.5;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020';
  ctx.font = compact ? '700 44px "Courier New", monospace' : '700 58px "Courier New", monospace';
  ctx.fillText('POTHOLE RUN', W / 2, (compact ? H * 0.115 : H * 0.10) + titleBob, W * 0.8);

  // Rank + lifetime + wallet banner
  const rank = rankFor(save.lifetimeEarned);
  const next = nextRank(save.lifetimeEarned);
  ctx.fillStyle = '#3fae54'; ctx.font = '700 22px "Courier New", monospace';
  ctx.fillText(rank.label, W / 2, H * 0.195);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('lifetime: ' + formatMoney(save.lifetimeEarned) + '   wallet: ' + formatMoney(save.wallet), W / 2, H * 0.235);
  if (next) {
    ctx.fillStyle = '#5a7a5e'; ctx.font = '500 13px "Courier New", monospace';
    ctx.fillText('next: ' + next.label + ' — ' + formatMoney(next.min - save.lifetimeEarned) + ' to go', W / 2, H * 0.27);
  }

  const R = hubRects(W, H);
  btn(ctx, R.play,        'PLAY',         { stroke: '#f0c020', text: '#f0c020', font: '700 32px "Courier New", monospace' });
  btn(ctx, R.races,       'STREET RACES', { stroke: '#e0a52a', text: '#e0a52a', font: '700 26px "Courier New", monospace' });
  btn(ctx, R.mechshop,    'MECH SHOP',    { stroke: '#cbe7cf' });
  btn(ctx, R.cardealer,   'CAR DEALER',   { stroke: '#cbe7cf' });
  btn(ctx, R.aspirations, 'ASPIRATIONS',  { stroke: '#9fb8a3', text: '#9fb8a3' });
  btn(ctx, R.help, '?', { stroke: '#f0c020', text: '#f0c020', font: '700 28px "Courier New", monospace' });
  // Settings cog (top-left): drawn gear in its button frame, with a SETTINGS label beneath.
  ctx.fillStyle = 'rgba(244,241,230,0.10)'; ctx.fillRect(R.prefs.x, R.prefs.y, R.prefs.w, R.prefs.h);
  ctx.strokeStyle = '#9fb8a3'; ctx.lineWidth = 2; ctx.strokeRect(R.prefs.x, R.prefs.y, R.prefs.w, R.prefs.h);
  drawGear(ctx, R.prefs.x + R.prefs.w / 2, R.prefs.y + R.prefs.h / 2, 13, '#cbe7cf', '#0e1a12');
  ctx.fillStyle = '#9fb8a3'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 11px "Courier New", monospace';
  ctx.fillText('SETTINGS', R.prefs.x + R.prefs.w / 2, R.prefs.y + R.prefs.h + 10);

  // Repair reminder — every ride needs upkeep between plays; nudge it for best driving.
  // Kept above the animated road strip so the driving cart never sits under the text.
  if ((save.condition || 0) < 100) {
    const crit = save.condition < 50;
    ctx.fillStyle = crit ? '#e0584a' : '#e0a52a';
    ctx.font = '700 14px "Courier New", monospace'; ctx.textAlign = 'center';
    ctx.fillText('⚠ ride at ' + Math.round(save.condition) + '% — repair at di MECH SHOP fi best driving',
      W / 2, H * 0.845, W * 0.94);
  }

  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 13px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚙ settings (top-left)   ·   ? = how to play   ·   M = mute', W / 2, H * 0.875, W * 0.94);
}

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

export function hit(x, y, { W, H }) {
  const R = hubRects(W, H);
  if (inRect(R.help, x, y))        return 'help';
  if (inRect(R.prefs, x, y))       return 'prefs';
  if (inRect(R.play, x, y))        return 'play';
  if (inRect(R.races, x, y))       return 'races';
  if (inRect(R.mechshop, x, y))    return 'mechshop';
  if (inRect(R.cardealer, x, y))   return 'cardealer';
  if (inRect(R.aspirations, x, y)) return 'aspirations';
  return null;
}
