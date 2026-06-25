// src/screens/races.js — bank-gated street-race tier picker + last-result banner.
import { formatMoney } from '../money.js';
import { RACE_TIERS, canEnter } from '../races.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

// One ENTER button per tier row, plus a back button.
function rects(W, H) {
  const r = { back: { x: 24, y: 18, w: 80, h: 36 } };
  const rowH = H * 0.17, top = H * 0.30;
  RACE_TIERS.forEach((t, i) => {
    r['enter:' + t.id] = { x: W * 0.66, y: top + i * rowH - 22, w: W * 0.24, h: 44 };
  });
  return r;
}

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 20px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

export function render(ctx, { save, lastResult, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  ctx.fillStyle = '#f0c020'; ctx.font = '700 42px "Courier New", monospace';
  ctx.fillText('STREET RACES', W / 2, H * 0.10);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('wallet: ' + formatMoney(save.wallet) + '   bank: ' + formatMoney(save.lifetimeEarned), W / 2, H * 0.18);
  ctx.fillStyle = '#5a7a5e'; ctx.font = '500 13px "Courier New", monospace';
  ctx.fillText('pay di buy-in · race 3 rivals to di line · 1st wins di purse (2nd = money back)', W / 2, H * 0.235);

  const R = rects(W, H);
  const rowH = H * 0.17, top = H * 0.30;
  RACE_TIERS.forEach((t, i) => {
    const cy = top + i * rowH;
    const unlocked = (save.lifetimeEarned || 0) >= t.unlockBank;
    const enter = canEnter(save, t);
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = unlocked ? '#f4f1e6' : '#5a5a5a';
    ctx.font = '700 24px "Courier New", monospace';
    ctx.fillText(t.name, W * 0.08, cy - 10);
    ctx.font = '500 14px "Courier New", monospace';
    if (unlocked) {
      ctx.fillStyle = '#9fb8a3';
      ctx.fillText('buy-in ' + formatMoney(t.buyIn) + '   →   purse ' + formatMoney(t.purse), W * 0.08, cy + 16);
    } else {
      ctx.fillStyle = '#7a5a2a';
      ctx.fillText('locked — bank ' + formatMoney(t.unlockBank) + ' to open', W * 0.08, cy + 16);
    }
    btn(ctx, R['enter:' + t.id], unlocked ? 'ENTER' : 'LOCKED', {
      stroke: enter ? '#f0c020' : '#4a4a4a',
      text:   enter ? '#f0c020' : '#6a6a6a'
    });
  });

  // Last race result banner
  if (lastResult) {
    ctx.textAlign = 'center';
    ctx.fillStyle = lastResult.place === 1 ? '#f0c020' : lastResult.place === 2 ? '#3fae54' : '#c0382c';
    ctx.font = '700 22px "Courier New", monospace';
    const tail = lastResult.winnings > 0 ? '  +' + formatMoney(lastResult.winnings) : '';
    ctx.fillText(lastResult.label + tail, W / 2, H * 0.90);
  }

  btn(ctx, R.back, '‹ BACK', { font: '700 18px "Courier New", monospace', stroke: '#9fb8a3', text: '#9fb8a3' });
}

export function hit(x, y, { W, H }) {
  const R = rects(W, H);
  if (inRect(R.back, x, y)) return 'back';
  for (const t of RACE_TIERS) {
    if (inRect(R['enter:' + t.id], x, y)) return 'enter:' + t.id;
  }
  return null;
}
