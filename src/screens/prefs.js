// src/screens/prefs.js — game Preferences: graphics quality + sound, plus a controls note.
// Matches the canvas/monospace house style used across the other screens.

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function rects(W, H) {
  const bw = Math.round(W * 0.62), bx = (W - bw) / 2;
  return {
    back:     { x: 24, y: 18, w: 80, h: 36 },
    graphics: { x: bx, y: H * 0.34, w: bw, h: 64 },
    sound:    { x: bx, y: H * 0.52, w: bw, h: 64 },
  };
}

function toggle(ctx, r, title, value, hint, accent) {
  ctx.fillStyle = 'rgba(244,241,230,0.08)'; ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left'; ctx.fillStyle = '#cbe7cf';
  ctx.font = '700 18px "Courier New", monospace';
  ctx.fillText(title, r.x + 18, r.y + r.h * 0.34);
  ctx.fillStyle = '#7a8a7e'; ctx.font = '500 12px "Courier New", monospace';
  ctx.fillText(hint, r.x + 18, r.y + r.h * 0.72);
  ctx.textAlign = 'right'; ctx.fillStyle = accent;
  ctx.font = '700 24px "Courier New", monospace';
  ctx.fillText(value, r.x + r.w - 18, r.y + r.h * 0.5);
}

export function render(ctx, { save, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020'; ctx.font = '700 36px "Courier New", monospace';
  ctx.fillText('PREFERENCES', W / 2, H * 0.13);

  const R = rects(W, H);
  const fast = save.settings.graphics === 'fast';
  toggle(ctx, R.graphics, 'GRAPHICS', fast ? 'FAST' : 'SMOOTH',
    fast ? 'higher frame rate · fewer effects' : 'full effects · best looking', '#f0c020');
  toggle(ctx, R.sound, 'SOUND', save.settings.muted ? 'OFF' : 'ON',
    'music + sound effects', '#cbe7cf');

  // Controls reminder — the new throttle keys live here so they're discoverable.
  ctx.textAlign = 'center'; ctx.fillStyle = '#9fb8a3'; ctx.font = '500 14px "Courier New", monospace';
  ctx.fillText('steer ← →  ·  throttle ↑ accelerate / ↓ brake (or W / S)', W / 2, H * 0.70);
  ctx.fillStyle = '#7a8a7e'; ctx.font = '500 12px "Courier New", monospace';
  ctx.fillText('pause ❚❚ or P · the cart never fully stops', W / 2, H * 0.745);

  // Back button
  ctx.fillStyle = 'rgba(244,241,230,0.10)'; ctx.fillRect(R.back.x, R.back.y, R.back.w, R.back.h);
  ctx.strokeStyle = '#9fb8a3'; ctx.lineWidth = 2; ctx.strokeRect(R.back.x, R.back.y, R.back.w, R.back.h);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '700 18px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('‹ BACK', R.back.x + R.back.w / 2, R.back.y + R.back.h / 2);
}

export function hit(x, y, { W, H }) {
  const R = rects(W, H);
  if (inRect(R.back, x, y))     return 'back';
  if (inRect(R.graphics, x, y)) return 'graphics';
  if (inRect(R.sound, x, y))    return 'sound';
  return null;
}
