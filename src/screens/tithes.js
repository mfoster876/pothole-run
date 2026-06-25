// src/screens/tithes.js
// Faith & Offerings screen — pray, read di Word, and/or tithe to sustain
// the player's blessing. The blessing meter shows how much spiritual resilience
// they've banked for the next run.
import { formatMoney } from '../money.js';
import { OFFERINGS, offeringAmount } from '../tithes.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function rects(W, H) {
  const bw = Math.round(W * 0.70);
  const bx = (W - bw) / 2;
  const bh  = 54;

  // Faith action buttons (PRAY, READ DI BIBLE) sit above the offerings
  const faithButtons = [
    { id: 'pray',  rect: { x: bx, y: H * 0.38, w: bw, h: bh } },
    { id: 'bible', rect: { x: bx, y: H * 0.38 + bh + 10, w: bw, h: bh } },
  ];

  // Tithe offering buttons follow underneath
  const offeringStart = H * 0.38 + 2 * (bh + 10) + 20;
  const offeringButtons = OFFERINGS.map((o, i) => ({
    id:   o.id,
    rect: { x: bx, y: offeringStart + i * (bh + 10), w: bw, h: bh },
  }));

  return {
    back:     { x: 24, y: 18, w: 80, h: 36 },
    faith:    faithButtons,
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

function hintText(ctx, r, hint) {
  ctx.fillStyle = '#3a5a40';
  ctx.font = '500 11px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(hint, r.x + r.w / 2, r.y + r.h - 9);
}

export function render(ctx, { save, W, H }) {
  // Background
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  // Title
  ctx.fillStyle = '#f0c020'; ctx.font = '700 38px "Courier New", monospace';
  ctx.fillText('FAITH & OFFERINGS', W / 2, H * 0.09);

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

  // Section header — faith actions
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FREE FAITH ACTIONS', W / 2, H * 0.355);

  // PRAY button
  const R = rects(W, H);
  const prayDone = !!save.prayedSinceRun;
  btn(ctx, R.faith[0].rect, 'PRAY  +8% blessing', {
    font:   '700 20px "Courier New", monospace',
    stroke: prayDone ? '#2a4a2e' : '#7ec8e3',
    text:   prayDone ? '#3a5a40' : '#7ec8e3',
    fill:   prayDone ? 'rgba(0,0,0,0)' : 'rgba(126,200,227,0.07)',
  });
  if (prayDone) hintText(ctx, R.faith[0].rect, 'prayed dis run');

  // READ DI BIBLE button
  const bibleDone = !!save.readBibleSinceRun;
  btn(ctx, R.faith[1].rect, 'READ DI BIBLE  +10% blessing', {
    font:   '700 20px "Courier New", monospace',
    stroke: bibleDone ? '#2a4a2e' : '#a8d8a8',
    text:   bibleDone ? '#3a5a40' : '#a8d8a8',
    fill:   bibleDone ? 'rgba(0,0,0,0)' : 'rgba(168,216,168,0.07)',
  });
  if (bibleDone) hintText(ctx, R.faith[1].rect, 'read di Word dis run');

  // Section header — offerings
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  const offeringHeaderY = R.faith[1].rect.y + R.faith[1].rect.h + 12;
  ctx.fillText('CHOOSE YUH OFFERING', W / 2, offeringHeaderY);

  // Offering buttons
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
  ctx.fillText('Yuh blessing fades each run — pray, read di Word, an\' tithe fi keep it strong.', W / 2, H * 0.93);

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

  // Faith actions — only fire when not already done this cycle
  if (inRect(R.faith[0].rect, x, y)) return save.prayedSinceRun   ? null : 'pray';
  if (inRect(R.faith[1].rect, x, y)) return save.readBibleSinceRun ? null : 'bible';

  // Offering buttons
  for (const { id, rect } of R.offerings) {
    if (inRect(rect, x, y)) {
      const amount = offeringAmount(save, id);
      if (amount > 0) return 'give:' + id;
    }
  }
  return null;
}
