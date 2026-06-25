// src/screens/cashpot.js
// Cash Pot lottery screen — play $100, win (or lose) based on OUTCOMES table.
import { formatMoney } from '../money.js';
import { STAKE, OUTCOMES, expectedValue } from '../cashpot.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function rects(W, H) {
  const bw = Math.round(W * 0.65), bh = 50;
  const bx = (W - bw) / 2;
  return {
    back:  { x: 24, y: 18, w: 80, h: 36 },
    play:  { x: bx, y: H * 0.78 - bh / 2, w: bw, h: bh }
  };
}

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 26px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

// Label for each outcome.
function outcomeLabel(o) {
  if (o.mult === 0)  return 'lose';
  if (o.mult === 1)  return 'money back';
  if (o.mult === 3)  return 'small win';
  if (o.mult === 8)  return 'decent hit';
  if (o.mult === 30) return 'DROP PAN jackpot';
  return o.mult + 'x';
}

export function render(ctx, { save, lastResult, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  // Title
  ctx.fillStyle = '#f0c020'; ctx.font = '700 44px "Courier New", monospace';
  ctx.fillText('CASH POT', W / 2, H * 0.09);

  // Wallet
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('wallet: ' + formatMoney(save.wallet), W / 2, H * 0.17);

  // Payout table header
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 15px "Courier New", monospace';
  ctx.fillText('PAYOUT TABLE', W / 2, H * 0.245);

  // Payout rows — in descending order (jackpot first)
  const tableOutcomes = [...OUTCOMES].reverse();
  const rowH = 34;
  const tableTop = H * 0.28;
  const colX  = W * 0.30;
  const colX2 = W * 0.60;

  for (let i = 0; i < tableOutcomes.length; i++) {
    const o = tableOutcomes[i];
    const ry = tableTop + i * rowH;
    const isLose = o.mult === 0;
    ctx.fillStyle = isLose ? '#5a7a5e' : o.mult === 30 ? '#f0c020' : '#f4f1e6';
    ctx.font = '500 14px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(o.mult === 0 ? '—' : formatMoney(STAKE * o.mult), colX, ry);
    ctx.textAlign = 'left';
    ctx.fillText(outcomeLabel(o), colX + 16, ry);
    // probability
    ctx.fillStyle = '#5a7a5e'; ctx.font = '500 12px "Courier New", monospace';
    ctx.textAlign = 'right';
    // Show a decimal for sub-1% odds so the column reads true (and sums to 100%).
    const pct = o.p * 100;
    ctx.fillText((Number.isInteger(pct) ? pct : pct.toFixed(1)) + '%', colX2, ry);
  }

  // Last result
  if (lastResult != null) {
    ctx.textAlign = 'center';
    if (lastResult.ok && lastResult.mult >= 3) {
      ctx.fillStyle = '#f0c020'; ctx.font = '700 22px "Courier New", monospace';
      ctx.fillText('DROP PAN! +' + formatMoney(lastResult.won), W / 2, H * 0.625);
    } else if (lastResult.ok && lastResult.mult > 0) {
      ctx.fillStyle = '#3fae54'; ctx.font = '700 20px "Courier New", monospace';
      ctx.fillText('+' + formatMoney(lastResult.won) + '  nice.', W / 2, H * 0.625);
    } else if (lastResult.ok && lastResult.mult === 0) {
      ctx.fillStyle = '#c0382c'; ctx.font = '700 20px "Courier New", monospace';
      ctx.fillText('Nutten dis time.', W / 2, H * 0.625);
    } else {
      // ok=false: couldn't afford stake
      ctx.fillStyle = '#c0382c'; ctx.font = '700 18px "Courier New", monospace';
      ctx.fillText('Yuh nuh have ' + formatMoney(STAKE) + '.', W / 2, H * 0.625);
    }
  } else {
    ctx.fillStyle = '#3a4a3e'; ctx.font = '500 16px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Stake $' + STAKE + ' — try yuh luck.', W / 2, H * 0.625);
  }

  const R = rects(W, H);

  // Back button
  btn(ctx, R.back, '‹ BACK', { font: '700 18px "Courier New", monospace', stroke: '#9fb8a3', text: '#9fb8a3' });

  // Play button
  const canPlay = save.wallet >= STAKE;
  btn(ctx, R.play, 'PLAY (' + formatMoney(STAKE) + ')', {
    font: '700 24px "Courier New", monospace',
    stroke: canPlay ? '#f0c020' : '#5a5a5a',
    text:   canPlay ? '#f0c020' : '#7a7a7a'
  });

  // Sub-label under play button
  ctx.fillStyle = '#5a7a5e'; ctx.font = '500 13px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('EV ≈ ' + formatMoney(Math.round(expectedValue() * STAKE)) + ' per play   (di house always eat)', W / 2, H * 0.78 + 36);
}

export function hit(x, y, { W, H }) {
  const R = rects(W, H);
  if (inRect(R.back, x, y)) return 'back';
  if (inRect(R.play, x, y)) return 'play';
  return null;
}
