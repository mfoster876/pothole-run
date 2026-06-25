import { conditionTier } from './wreck.js';
import { formatMoney } from './money.js';

export function renderHud(ctx, { stageName, coins, distance, condition }, W) {
  ctx.font = '700 26px "Courier New", monospace';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'rgba(14,26,18,0.78)';
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = '#f4f1e6';
  ctx.textAlign = 'left';
  ctx.fillText(stageName.toUpperCase(), 24, 28);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#f0c020';
  ctx.fillText(formatMoney(coins), W / 2, 28);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#cbe7cf';
  ctx.fillText(Math.floor(distance) + ' m', W - 24, 28);

  const mw = 220, mx = W - mw - 24, my = 64;
  ctx.fillStyle = '#1c1c1c';
  ctx.fillRect(mx, my, mw, 16);
  const tier = conditionTier(condition);
  const color = tier === 'good' ? '#3fae54' : tier === 'warn' ? '#e0a52a' : '#c0382c';
  ctx.fillStyle = color;
  ctx.fillRect(mx + 2, my + 2, (mw - 4) * (condition.value / condition.max), 12);
  ctx.fillStyle = '#cbe7cf';
  ctx.textAlign = 'right';
  ctx.font = '500 14px "Courier New", monospace';
  ctx.fillText('CART', mx - 8, my + 8);
}

export function renderTouchZones(ctx, W, H) {
  ctx.font = '700 40px "Courier New", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(244,241,230,0.30)';
  ctx.textAlign = 'center';
  ctx.fillText('◄', W * 0.08, H * 0.86);
  ctx.fillText('►', W * 0.92, H * 0.86);
}
