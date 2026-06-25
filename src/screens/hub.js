// src/screens/hub.js
// The main menu hub: four big buttons leading to the four sub-screens.
// Render style matches the existing canvas/monospace house style in game.js.
import { formatMoney } from '../money.js';
import { rankFor, nextRank } from '../ranks.js';

// Lazy-built button rects — recalculated each render for the current W/H.
function hubRects(W, H) {
  const bw = Math.round(W * 0.60), bh = 50;
  const bx = (W - bw) / 2;
  return {
    play:        { x: bx, y: H * 0.34 - bh / 2, w: bw, h: bh },
    races:       { x: bx, y: H * 0.45 - bh / 2, w: bw, h: bh },
    mechshop:    { x: bx, y: H * 0.56 - bh / 2, w: bw, h: bh },
    cardealer:   { x: bx, y: H * 0.67 - bh / 2, w: bw, h: bh },
    aspirations: { x: bx, y: H * 0.78 - bh / 2, w: bw, h: bh },
    help:        { x: W - 64, y: 18, w: 46, h: 46 }  // small "?" — How To Play
  };
}

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 32px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

export function render(ctx, { save, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);

  // Title
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020'; ctx.font = '700 58px "Courier New", monospace';
  ctx.fillText('POTHOLE RUN', W / 2, H * 0.10);

  // Rank + lifetime + wallet banner
  const rank = rankFor(save.lifetimeEarned);
  const next = nextRank(save.lifetimeEarned);
  ctx.fillStyle = '#3fae54'; ctx.font = '700 22px "Courier New", monospace';
  ctx.fillText(rank.label, W / 2, H * 0.195);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('lifetime: ' + formatMoney(save.lifetimeEarned) + '   wallet: ' + formatMoney(save.wallet), W / 2, H * 0.235);
  if (next) {
    ctx.fillStyle = '#5a7a5e'; ctx.font = '500 13px "Courier New", monospace';
    ctx.fillText('next: ' + next.label + ' — ' + formatMoney(next.min - save.lifetimeEarned) + ' to go', W / 2, H * 0.27);
  }

  const R = hubRects(W, H);
  btn(ctx, R.play,        'PLAY',         { stroke: '#f0c020', text: '#f0c020', font: '700 32px "Courier New", monospace' });
  btn(ctx, R.races,       'STREET RACES', { stroke: '#e0a52a', text: '#e0a52a', font: '700 26px "Courier New", monospace' });
  btn(ctx, R.mechshop,    'MECH SHOP',    { stroke: '#cbe7cf' });
  btn(ctx, R.cardealer,   'CAR DEALER',   { stroke: '#cbe7cf' });
  btn(ctx, R.aspirations, 'ASPIRATIONS',  { stroke: '#9fb8a3', text: '#9fb8a3' });
  btn(ctx, R.help, '?', { stroke: '#f0c020', text: '#f0c020', font: '700 28px "Courier New", monospace' });

  // Repair reminder — every ride needs upkeep between plays; nudge it for best driving.
  if ((save.condition || 0) < 100) {
    const crit = save.condition < 50;
    ctx.fillStyle = crit ? '#e0584a' : '#e0a52a';
    ctx.font = '700 14px "Courier New", monospace'; ctx.textAlign = 'center';
    ctx.fillText('⚠ ride at ' + Math.round(save.condition) + '% — repair at di MECH SHOP fi best driving',
      W / 2, H * 0.90);
  }

  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 13px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('♪ press M to mute   ·   ? = how to play', W / 2, H * 0.96);
}

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

export function hit(x, y, { W, H }) {
  const R = hubRects(W, H);
  if (inRect(R.help, x, y))        return 'help';
  if (inRect(R.play, x, y))        return 'play';
  if (inRect(R.races, x, y))       return 'races';
  if (inRect(R.mechshop, x, y))    return 'mechshop';
  if (inRect(R.cardealer, x, y))   return 'cardealer';
  if (inRect(R.aspirations, x, y)) return 'aspirations';
  return null;
}
