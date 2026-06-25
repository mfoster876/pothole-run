// src/screens/legend.js — per-driver legend: pick-ups that help vs negatives to dodge.
import { getCharacter } from '../characters.js';
import { legendFor } from '../legend.js';
import { renderPortrait } from '../portrait.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
function rects() { return { back: { x: 24, y: 18, w: 80, h: 36 } }; }

export function render(ctx, { characterId, W, H }) {
  const ch = getCharacter(characterId);
  const { good, bad, note } = legendFor(ch);
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  ctx.fillStyle = '#f0c020'; ctx.font = '700 36px "Courier New", monospace';
  ctx.fillText('LEGEND', W / 2, H * 0.085);

  // Driver portrait + name + the risk/reward note
  renderPortrait(ctx, ch.id, W * 0.5, H * 0.235, 96);
  ctx.fillStyle = '#cbe7cf'; ctx.font = '500 15px "Courier New", monospace';
  ctx.fillText(note, W / 2, H * 0.37);

  // Two columns: GOOD (left, green) and AVOID (right, red)
  const colY = H * 0.46, lineH = 26;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#3fae54'; ctx.font = '700 20px "Courier New", monospace';
  ctx.fillText('✦ PICK UP', W * 0.08, colY);
  ctx.fillStyle = '#c0382c';
  ctx.fillText('✕ AVOID', W * 0.56, colY);

  ctx.font = '500 15px "Courier New", monospace';
  ctx.fillStyle = '#e8efe6';
  good.forEach((g, i) => ctx.fillText('• ' + g.label, W * 0.08, colY + 30 + i * lineH));
  if (bad.length) {
    ctx.fillStyle = '#f0b8b0';
    bad.forEach((b, i) => ctx.fillText('• ' + b.label, W * 0.56, colY + 30 + i * lineH));
  } else {
    ctx.fillStyle = '#7a8a7e';
    ctx.fillText('(nothing — drive free)', W * 0.56, colY + 30);
  }

  // Back button
  const R = rects();
  ctx.fillStyle = 'rgba(244,241,230,0.10)'; ctx.fillRect(R.back.x, R.back.y, R.back.w, R.back.h);
  ctx.strokeStyle = '#9fb8a3'; ctx.lineWidth = 2; ctx.strokeRect(R.back.x, R.back.y, R.back.w, R.back.h);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '700 18px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('‹ BACK', R.back.x + R.back.w / 2, R.back.y + R.back.h / 2);
}

export function hit(x, y, { W, H }) {
  if (inRect(rects().back, x, y)) return 'back';
  return null;
}
