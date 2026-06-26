import { conditionTier } from './wreck.js';
import { formatMoney } from './money.js';
import { SUPERCHARGE, CART } from './constants.js';

// The cart's internal speed is an abstract unit; this turns it into a "theoretical"
// km/h for the speedometer. Tuned so an easy cruise already sits at the 50 km/h urban
// limit and a deep, reckless run reads well into triple digits — the joyride creeping
// past every limit. URBAN_LIMIT is what the in-game speed-limit signs post.
export const KMH_PER_UNIT = 0.7;
export const URBAN_LIMIT_KMH = 50;
export function speedToKmh(speed) { return Math.round(Math.max(0, speed || 0) * KMH_PER_UNIT); }

export function renderHud(ctx, { stageName, coins, distance, condition, effects = {}, lite = false, speed = 0, throttle = 0 }, W, H = 540) {
  ctx.font = '700 26px "Courier New", monospace';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = 'rgba(14,26,18,0.78)';
  ctx.fillRect(0, 0, W, 56);
  ctx.fillStyle = '#f4f1e6';
  ctx.textAlign = 'left';
  // Start past the top-left ❚❚ PAUSE button (drawn by game.js) so they never overlap.
  ctx.fillText(stageName.toUpperCase(), 140, 28);
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

  // Speed gauge (top-left): fills with current speed, turns GREEN while accelerating (↑)
  // and AMBER while braking (↓), with a direction arrow — so the throttle visibly responds.
  const sw = 150, sx = 58, sy = 64;
  const spdFrac = Math.max(0, Math.min(1, speed / (CART.maxSpeed * 1.3)));
  const accel = throttle > 0, brake = throttle < 0;
  ctx.fillStyle = '#cbe7cf'; ctx.textAlign = 'left'; ctx.font = '500 14px "Courier New", monospace';
  ctx.fillText('SPD', 24, sy + 8);
  ctx.fillStyle = '#1c1c1c'; ctx.fillRect(sx, sy, sw, 16);
  ctx.fillStyle = accel ? '#3fae54' : brake ? '#e0a52a' : '#8fb8d0';
  ctx.fillRect(sx + 2, sy + 2, (sw - 4) * spdFrac, 12);
  if (accel || brake) {
    const ax = sx + sw + 12, ay = sy + 8;
    ctx.fillStyle = accel ? '#3fae54' : '#e0a52a';
    ctx.beginPath();
    if (accel) { ctx.moveTo(ax, ay - 6); ctx.lineTo(ax - 6, ay + 5); ctx.lineTo(ax + 6, ay + 5); }
    else       { ctx.moveTo(ax, ay + 6); ctx.lineTo(ax - 6, ay - 5); ctx.lineTo(ax + 6, ay - 5); }
    ctx.closePath(); ctx.fill();
  }
  // Numeric "theoretical" speed under the gauge — RED once over the 50 km/h urban limit
  // (the speed-limit signs along the road), driving home how reckless the pace really is.
  const kmh = speedToKmh(speed);
  ctx.font = '700 17px "Courier New", monospace'; ctx.textAlign = 'left';
  ctx.fillStyle = kmh > URBAN_LIMIT_KMH ? '#e0584a' : '#cbe7cf';
  ctx.fillText(kmh + ' KM/H', 24, sy + 30);

  // Supercharge (water / boozy drink boost): glowing frame + countdown so the
  // player can see they're invincible and exactly how long it lasts.
  const superT = effects.super || 0;
  // Any impairing boost (booze tipsy OR bleach burn) glows the hotter orange.
  const hot = !!(effects.tipsy || effects.burn);
  const boostLabel = effects.burn ? '🧴 BLEACH BOOST  ' : (effects.tipsy ? '🍺 IRIE BOOST  ' : '⚡ SUPERCHARGE  ');
  if (superT > 0) renderSupercharge(ctx, superT, effects.superMax || SUPERCHARGE.dur, hot, boostLabel, W, H, lite);

  // Once the boost ends the impairment lingers (sloppy steering) — warn the player
  // so the swerve isn't a mystery. (During the boost the boost label covers it.)
  const tipsyT = effects.tipsy || 0;
  const burnT  = effects.burn || 0;
  if (superT <= 0 && (tipsyT > 0 || burnT > 0)) {
    ctx.save();
    const wob = Math.sin((typeof performance !== 'undefined' ? performance.now() : 0) / 1000 * 6) * 3;
    ctx.fillStyle = '#e88a3a'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '700 18px "Courier New", monospace';
    const tail = burnT > 0
      ? '🧴 BLEACH BURN — ' + burnT.toFixed(1) + 's'
      : '🍺 TIPSY — ' + tipsyT.toFixed(1) + 's';
    ctx.fillText(tail, W / 2, 78 + wob);
    ctx.restore();
  }
}

function renderSupercharge(ctx, remaining, max, tipsy, label, W, H, lite = false) {
  ctx.save();
  const pulse = 0.5 + 0.5 * Math.sin((typeof performance !== 'undefined' ? performance.now() : 0) / 1000 * 9);
  const gold = tipsy ? '255,120,60' : '255,215,60';   // boozy/bleach boost glows a hotter orange
  // Pulsing glow frame around the play stage. The soft shadow blur is the priciest HUD
  // effect on mobile — "Fast" graphics skips the blur and keeps just the bright frame.
  ctx.strokeStyle = `rgba(${gold},${0.45 + 0.4 * pulse})`;
  ctx.lineWidth = 7 + 5 * pulse;
  if (!lite) { ctx.shadowColor = `rgba(${gold},0.9)`; ctx.shadowBlur = 26 + 14 * pulse; }
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
  ctx.fillText(label + remaining.toFixed(1) + 's', W / 2, by + 9);
  ctx.restore();
}

// A transient centre-screen toast naming the EXACT pick-up collected (or the negative
// just hit), so feedback is never a vague "irie boost". `toast` = { label, good, t }
// where t is the seconds remaining; it fades out over its final 0.4s.
export function renderPickupToast(ctx, toast, W, H = 540) {
  if (!toast) return;
  const alpha = Math.max(0, Math.min(1, toast.t / 0.4));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 26px "Courier New", monospace';
  const txt = (toast.good ? '✦ ' : '✕ ') + String(toast.label).toUpperCase();
  const bw = ctx.measureText(txt).width + 44, by = H * 0.30;
  ctx.fillStyle = toast.good ? 'rgba(14,26,18,0.85)' : 'rgba(44,12,10,0.88)';
  ctx.fillRect(W / 2 - bw / 2, by - 24, bw, 44);
  ctx.strokeStyle = toast.good ? '#3fae54' : '#c0382c'; ctx.lineWidth = 2;
  ctx.strokeRect(W / 2 - bw / 2, by - 24, bw, 44);
  ctx.fillStyle = toast.good ? '#f0c020' : '#ff8a78';
  ctx.fillText(txt, W / 2, by - 1);
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
