// src/screens/legend.js — per-driver legend: pick-ups that help vs negatives to dodge.
import { getCharacter } from '../characters.js';
import { legendFor } from '../legend.js';
import { renderPortrait } from '../portrait.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
function rects() { return { back: { x: 24, y: 18, w: 80, h: 36 } }; }

// Draw a titled bullet list at (x, y); returns the y for the next section below it.
function section(ctx, x, y, title, titleColor, items, itemColor, emptyText) {
  const lineH = 19;
  ctx.fillStyle = titleColor; ctx.font = '700 15px "Courier New", monospace';
  ctx.fillText(title, x, y);
  ctx.font = '500 13px "Courier New", monospace';
  if (items.length) {
    ctx.fillStyle = itemColor;
    items.forEach((t, i) => ctx.fillText('• ' + t, x, y + 20 + i * lineH));
    return y + 20 + items.length * lineH + 14;
  }
  ctx.fillStyle = '#7a8a7e';
  ctx.fillText(emptyText, x, y + 20);
  return y + 20 + lineH + 14;
}

export function render(ctx, { characterId, W, H }) {
  const ch = getCharacter(characterId);
  const { good, bad, perks, cons, people, note } = legendFor(ch);
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  ctx.fillStyle = '#f0c020'; ctx.font = '700 32px "Courier New", monospace';
  ctx.fillText('LEGEND', W / 2, H * 0.07);

  // Driver portrait + the risk/reward note
  renderPortrait(ctx, ch.id, W * 0.5, H * 0.19, 76);
  ctx.fillStyle = '#cbe7cf'; ctx.font = 'italic 500 14px "Courier New", monospace';
  ctx.fillText(note, W / 2, H * 0.31);

  // LEFT column = what works FOR you (your unfair edge, then what to grab).
  // RIGHT column = what works AGAINST you (your weakness, what to dodge, who to watch).
  const topY = H * 0.37;
  const colL = W * 0.07, colR = W * 0.54;
  ctx.textAlign = 'left';

  let yL = topY;
  yL = section(ctx, colL, yL, '⚡ UNFAIR EDGE', '#e0a52a', perks, '#e8d8b0', '(none)');
  section(ctx, colL, yL, '✦ PICK UP', '#3fae54', good.map(g => g.label), '#e8efe6', '(none)');

  let yR = topY;
  yR = section(ctx, colR, yR, '⚠ WEAKNESS', '#c0382c', cons, '#f0b8b0', '(none)');
  yR = section(ctx, colR, yR, '✕ AVOID', '#c0382c', bad.map(b => b.label), '#f0b8b0', '(nothing — drive free)');
  section(ctx, colR, yR, 'PEOPLE TO WATCH', '#e0a52a', people, '#e8d8b0', '(none)');

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
