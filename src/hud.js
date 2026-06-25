import { conditionTier } from './wreck.js';
import { formatMoney } from './money.js';
import { SUPERCHARGE } from './constants.js';

export function renderHud(ctx, { stageName, coins, distance, condition, effects = {} }, W, H = 540) {
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

  // Supercharge (water / boozy drink boost): glowing frame + countdown so the
  // player can see they're invincible and exactly how long it lasts.
  const superT = effects.super || 0;
  if (superT > 0) renderSupercharge(ctx, superT, effects.superMax || SUPERCHARGE.dur, !!effects.tipsy, W, H);

  // Once the boost ends the booze still lingers (sloppy steering) — warn the player
  // so the swerve isn't a mystery. (During the boost the IRIE BOOST label covers it.)
  const tipsyT = effects.tipsy || 0;
  if (tipsyT > 0 && superT <= 0) {
    ctx.save();
    const wob = Math.sin((typeof performance !== 'undefined' ? performance.now() : 0) / 1000 * 6) * 3;
    ctx.fillStyle = '#e88a3a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 18px "Courier New", monospace';
    ctx.fillText('🍺 TIPSY — ' + tipsyT.toFixed(1) + 's', W / 2, 78 + wob);
    ctx.restore();
  }
}

function renderSupercharge(ctx, remaining, max, tipsy, W, H) {
  ctx.save();
  const pulse = 0.5 + 0.5 * Math.sin((typeof performance !== 'undefined' ? performance.now() : 0) / 1000 * 9);
  const gold = tipsy ? '255,120,60' : '255,215,60';   // boozy boost glows a hotter orange
  // Pulsing glow frame around the play stage
  ctx.strokeStyle = `rgba(${gold},${0.45 + 0.4 * pulse})`;
  ctx.lineWidth = 7 + 5 * pulse;
  ctx.shadowColor = `rgba(${gold},0.9)`;
  ctx.shadowBlur = 26 + 14 * pulse;
  ctx.strokeRect(7, 7, W - 14, H - 14);
  ctx.shadowBlur = 0;
  // Countdown bar centred under the cash readout
  const bw = 264, bx = (W - bw) / 2, by = 44;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(bx - 2, by - 2, bw + 4, 22);
  const frac = Math.max(0, Math.min(1, remaining / max));
  ctx.fillStyle = `rgb(${gold})`;
  ctx.fillRect(bx, by, bw * frac, 18);
  ctx.fillStyle = '#1a1208';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 14px "Courier New", monospace';
  ctx.fillText((tipsy ? '🍺 IRIE BOOST  ' : '⚡ SUPERCHARGE  ') + remaining.toFixed(1) + 's', W / 2, by + 9);
  ctx.restore();
}

export function renderTouchZones(ctx, W, H) {
  ctx.font = '700 40px "Courier New", monospace';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(244,241,230,0.30)';
  ctx.textAlign = 'center';
  ctx.fillText('◄', W * 0.08, H * 0.86);
  ctx.fillText('►', W * 0.92, H * 0.86);
}
