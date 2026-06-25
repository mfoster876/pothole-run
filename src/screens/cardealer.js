// src/screens/cardealer.js
// Car Dealer: rotating turntable showroom. Browse the vehicle ladder,
// buy (spends wallet), or select an owned ride as your active vehicle.
import { VEHICLES, getVehicle } from '../vehicles.js';
import { formatMoney } from '../money.js';
import { drawCart } from '../cartSprite.js';
import { createCart } from '../cart.js';
import { getCharacter } from '../characters.js';

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function dealerRects(W, H) {
  const bw = 160, bh = 48;
  return {
    back:   { x: 24, y: 18, w: 80, h: 36 },
    prev:   { x: W * 0.08 - bw / 2, y: H * 0.56 - bh / 2, w: bw, h: bh },
    next:   { x: W * 0.92 - bw / 2, y: H * 0.56 - bh / 2, w: bw, h: bh },
    action: { x: W / 2 - 140, y: H * 0.80 - bh / 2, w: 280, h: bh }
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

export function render(ctx, { save, W, H, idx }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020'; ctx.font = '700 44px "Courier New", monospace';
  ctx.fillText('CAR DEALER', W / 2, H * 0.09);

  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('wallet: ' + formatMoney(save.wallet), W / 2, H * 0.17);

  const R = dealerRects(W, H);
  btn(ctx, R.back, '‹ HUB', { font: '700 18px "Courier New", monospace', stroke: '#9fb8a3', text: '#9fb8a3' });

  const veh = VEHICLES[idx % VEHICLES.length];
  const owned = save.garage.includes(veh.id);
  const isActive = save.vehicle === veh.id;

  // Turntable: draw the cart sprite centred
  const previewCart = createCart(getCharacter('yute'), veh); previewCart.lean = 0;
  drawCart(ctx, previewCart, W / 2, H * 0.45, 22);

  // Vehicle name + price
  ctx.fillStyle = '#f4f1e6'; ctx.font = '700 28px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(veh.name, W / 2, H * 0.27);

  ctx.fillStyle = owned ? '#3fae54' : '#f0c020';
  ctx.font = '500 20px "Courier New", monospace';
  ctx.fillText(owned ? (isActive ? '▶ DRIVING' : 'OWNED') : formatMoney(veh.price), W / 2, H * 0.33);

  // Stat bars
  ctx.font = '500 13px "Courier New", monospace'; ctx.textBaseline = 'middle';
  const stats = [['SPD', veh.speed / 2.0], ['GRIP', veh.handling / 1.6], ['TUF', veh.toughness / 2.1]];
  let sx = W / 2 - 165;
  for (const [label, val] of stats) {
    ctx.fillStyle = '#9fb8a3'; ctx.textAlign = 'left';
    ctx.fillText(label, sx, H * 0.38);
    ctx.fillStyle = '#2a3a2e'; ctx.fillRect(sx + 46, H * 0.38 - 6, 60, 12);
    ctx.fillStyle = '#3fae54'; ctx.fillRect(sx + 46, H * 0.38 - 6, 60 * Math.max(0.04, Math.min(1, val)), 12);
    sx += 120;
  }

  // Prev / Next arrows
  btn(ctx, R.prev, '‹ PREV', { font: '700 22px "Courier New", monospace' });
  btn(ctx, R.next, 'NEXT ›', { font: '700 22px "Courier New", monospace' });

  // Vehicle count indicator
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText((idx % VEHICLES.length + 1) + ' / ' + VEHICLES.length, W / 2, H * 0.56);

  // Action button: BUY / SELECT / DRIVING
  if (owned && isActive) {
    btn(ctx, R.action, '▶ DRIVING', { stroke: '#3fae54', text: '#3fae54', font: '700 24px "Courier New", monospace' });
  } else if (owned) {
    btn(ctx, R.action, 'SELECT', { stroke: '#f0c020', text: '#f0c020', font: '700 24px "Courier New", monospace' });
  } else {
    const canBuy = save.wallet >= veh.price;
    btn(ctx, R.action, 'BUY  ' + formatMoney(veh.price), {
      font: '700 22px "Courier New", monospace',
      stroke: canBuy ? '#f0c020' : '#5a5a5a',
      text: canBuy ? '#f0c020' : '#7a7a7a'
    });
  }
}

export function hit(x, y, { W, H, save, idx }) {
  const R = dealerRects(W, H);
  if (inRect(R.back, x, y)) return 'back';
  if (inRect(R.prev, x, y)) return 'prev';
  if (inRect(R.next, x, y)) return 'next';
  if (inRect(R.action, x, y)) {
    const veh = VEHICLES[idx % VEHICLES.length];
    const owned = save.garage.includes(veh.id);
    if (owned && save.vehicle === veh.id) return null; // already driving
    if (owned) return 'select';
    return 'buy';
  }
  return null;
}
