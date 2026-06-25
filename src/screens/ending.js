// src/screens/ending.js
// Bittersweet ending vignette card shown when a player buys an aspiration out.
// Each aspiration gets a 1–2 line patois vignette — earned, a little melancholy.
import { VIGNETTES } from './aspirations.js';
import { ASPIRATIONS } from '../aspirations.js';

function getAspiration(id) { return ASPIRATIONS.find(a => a.id === id); }

// CONTINUE button rect (lazy-built for W/H)
function continueRect(W, H) {
  const bw = Math.round(W * 0.55), bh = 52;
  return { x: (W - bw) / 2, y: H * 0.78, w: bw, h: bh };
}
function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

export function render(ctx, { aspirationId, W, H }) {
  const asp = getAspiration(aspirationId);
  const vignette = VIGNETTES[aspirationId] || '';
  const lines = vignette.split('\n');

  ctx.fillStyle = '#0a1208'; ctx.fillRect(0, 0, W, H);

  // Dim decorative top bar
  ctx.fillStyle = '#1a3020';
  ctx.fillRect(0, 0, W, 6);

  // Aspiration name
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#3fae54'; ctx.font = '700 16px "Courier New", monospace';
  ctx.fillText((asp ? asp.name : aspirationId).toUpperCase(), W / 2, H * 0.12);

  // ACHIEVED header
  ctx.fillStyle = '#f0c020'; ctx.font = '700 48px "Courier New", monospace';
  ctx.fillText('ACHIEVED ✓', W / 2, H * 0.26);

  // Vignette lines — bittersweet patois
  ctx.fillStyle = '#cbe7cf'; ctx.font = '500 19px "Courier New", monospace';
  const startY = H * 0.44;
  const lineGap = 32;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], W / 2, startY + i * lineGap);
  }

  // CONTINUE button
  const r = continueRect(W, H);
  ctx.fillStyle = 'rgba(244,241,230,0.10)'; ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = '#3fae54'; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = '#3fae54'; ctx.font = '700 28px "Courier New", monospace';
  ctx.fillText('CONTINUE', r.x + r.w / 2, r.y + r.h / 2);

  // Dim decorative bottom bar
  ctx.fillStyle = '#1a3020'; ctx.fillRect(0, H - 6, W, 6);
}

export function hit(x, y, { W, H }) {
  if (inRect(continueRect(W, H), x, y)) return 'continue';
  return null;
}
