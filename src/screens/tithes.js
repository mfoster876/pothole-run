// src/screens/tithes.js
// Tithes & Offerings screen — player chooses a gift; the blessing meter shows
// how much spiritual resilience they've banked for the next run.
import { formatMoney } from '../money.js';
import { OFFERINGS, offeringAmount } from '../tithes.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function rects(W, H) {
  const bw = Math.round(W * 0.70);
  const bx = (W - bw) / 2;
  const bh  = 54;
  const offeringButtons = OFFERINGS.map((o, i) => ({
    id:   o.id,
    rect: { x: bx, y: H * 0.44 + i * (bh + 10), w: bw, h: bh },
  }));
  return {
    back:     { x: 24, y: 18, w: 80, h: 36 },
    offerings: offeringButtons,
  };
}

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.08)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 22px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

export function render(ctx, { save, W, H }) {
  // Background
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  // Title
  ctx.fillStyle = '#f0c020'; ctx.font = '700 40px "Courier New", monospace';
  ctx.fillText('TITHES & OFFERINGS', W / 2, H * 0.09);

  // Wallet line
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 15px "Courier New", monospace';
  ctx.fillText('wallet: ' + formatMoney(save.wallet), W / 2, H * 0.165);

  // Blessing label + meter
  const blessing = Math.max(0, Math.min(1, save.blessing || 0));
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 14px "Courier New", monospace';
  ctx.textAlign = 'left';
  const meterX = Math.round(W * 0.15);
  const meterW = Math.round(W * 0.70);
  ctx.fillText('BLESSING', meterX, H * 0.235);

  // Meter background
  const meterY = H * 0.255;
  const meterH = 14;
  ctx.fillStyle = '#1e2e22'; ctx.fillRect(meterX, meterY, meterW, meterH);
  // Filled portion
  if (blessing > 0) {
    ctx.fillStyle = '#f0c020';
    ctx.fillRect(meterX, meterY, Math.round(meterW * blessing), meterH);
  }
  // Meter border
  ctx.strokeStyle = '#5a7a5e'; ctx.lineWidth = 1;
  ctx.strokeRect(meterX, meterY, meterW, meterH);

  // Blessing fraction label on the right
  ctx.fillStyle = blessing > 0 ? '#f0c020' : '#5a7a5e';
  ctx.font = '500 13px "Courier New", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(Math.round(blessing * 100) + '%', meterX + meterW, H * 0.235);

  // Section header
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 15px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CHOOSE YUH OFFERING', W / 2, H * 0.39);

  // Offering buttons
  const R = rects(W, H);
  for (const { id, rect } of R.offerings) {
    const o = OFFERINGS.find(x => x.id === id);
    const amount = offeringAmount(save, id);
    const affordable = amount > 0;
    const label = o.label + '  ' + formatMoney(amount);
    btn(ctx, rect, label, {
      font:   '700 20px "Courier New", monospace',
      stroke: affordable ? '#f0c020' : '#3a4a3e',
      text:   affordable ? '#f0c020' : '#4a5a4e',
      fill:   affordable ? 'rgba(240,192,32,0.07)' : 'rgba(0,0,0,0)',
    });
  }

  // Patois blessing line
  ctx.fillStyle = '#5a7a5e'; ctx.font = '500 13px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Give wid a clean heart — di Most High walk wid yuh pon di road.', W / 2, H * 0.885);
  ctx.fillStyle = '#3a4a3e'; ctx.font = '500 12px "Courier New", monospace';
  ctx.fillText('Blessing fades each run — keep giving to stay covered.', W / 2, H * 0.93);

  // Back button
  btn(ctx, R.back, '‹ BACK', {
    font:   '700 18px "Courier New", monospace',
    stroke: '#9fb8a3',
    text:   '#9fb8a3',
    fill:   'rgba(244,241,230,0.06)',
  });
}

export function hit(x, y, { save, W, H }) {
  const R = rects(W, H);
  if (inRect(R.back, x, y)) return 'back';
  for (const { id, rect } of R.offerings) {
    if (inRect(rect, x, y)) {
      const amount = offeringAmount(save, id);
      if (amount > 0) return 'give:' + id;
    }
  }
  return null;
}
