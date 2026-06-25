// src/screens/aspirations.js
// The nine "outs" — the social-mobility ladder. Wave 1 stub: shows all aspirations
// locked/coming soon with prices; purchase wired in Wave 2.
import { formatMoney } from '../money.js';

export const ASPIRATIONS = [
  { id: 'tithes',   name: 'Tithes & Offerings', price: 1500000,   blurb: 'Give faithful, build community.' },
  { id: 'school',   name: 'Education',          price: 3000000,   blurb: 'A degree — the long road up.' },
  { id: 'artist',   name: 'Visual Artist',      price: 4000000,   blurb: 'Studio, materials, first show.' },
  { id: 'business', name: 'Open a Business',     price: 5000000,   blurb: 'Yuh own likkle shop.' },
  { id: 'music',    name: 'Musician / Studio',   price: 6000000,   blurb: 'Book the studio, cut the riddim.' },
  { id: 'migrate',  name: 'Migrate / Fly Weh',   price: 7000000,   blurb: 'Visa, ticket, a new start farin.' },
  { id: 'farm',     name: 'Agriculture',         price: 10000000,  blurb: 'Land, seed, and sweat.' },
  { id: 'hills',    name: 'House inna di Hills',  price: 50000000,  blurb: 'Uptown, gate and all.' },
  { id: 'hotel',    name: 'Hotel / Beachfront',  price: 250000000, blurb: 'Sea in front, yours.' }
];

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

export function render(ctx, { save, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020'; ctx.font = '700 42px "Courier New", monospace';
  ctx.fillText('ASPIRATIONS', W / 2, H * 0.08);

  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 14px "Courier New", monospace';
  ctx.fillText('wallet: ' + formatMoney(save.wallet) + '   — the outs, priced in full', W / 2, H * 0.15);

  // Back button
  const back = { x: 24, y: 18, w: 80, h: 36 };
  ctx.fillStyle = 'rgba(244,241,230,0.10)'; ctx.fillRect(back.x, back.y, back.w, back.h);
  ctx.strokeStyle = '#9fb8a3'; ctx.lineWidth = 2; ctx.strokeRect(back.x, back.y, back.w, back.h);
  ctx.fillStyle = '#9fb8a3'; ctx.font = '700 18px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('‹ HUB', back.x + back.w / 2, back.y + back.h / 2);

  // List aspirations — scrollable if they overflow; for now lay them out vertically
  const rowH = (H * 0.78) / ASPIRATIONS.length;
  const startY = H * 0.195;
  const achieved = (save.aspirations && save.aspirations.achieved) || [];

  for (let i = 0; i < ASPIRATIONS.length; i++) {
    const a = ASPIRATIONS[i];
    const done = achieved.includes(a.id);
    const ry = startY + i * rowH;
    const canAfford = save.wallet >= a.price;
    const rx = W * 0.06, rw = W * 0.88, rh = rowH - 6;

    ctx.fillStyle = done ? 'rgba(63,174,84,0.12)' : 'rgba(244,241,230,0.04)';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = done ? '#3fae54' : '#3a4a3e'; ctx.lineWidth = 1;
    ctx.strokeRect(rx, ry, rw, rh);

    // Name
    ctx.fillStyle = done ? '#3fae54' : '#f4f1e6';
    ctx.font = '700 15px "Courier New", monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(a.name, rx + 12, ry + rh / 2 - 8);

    // Blurb
    ctx.fillStyle = '#9fb8a3'; ctx.font = '500 12px "Courier New", monospace';
    ctx.fillText(a.blurb, rx + 12, ry + rh / 2 + 8);

    // Price / status
    ctx.textAlign = 'right';
    if (done) {
      ctx.fillStyle = '#3fae54'; ctx.font = '700 15px "Courier New", monospace';
      ctx.fillText('ACHIEVED ✓', rx + rw - 10, ry + rh / 2);
    } else {
      ctx.fillStyle = canAfford ? '#f0c020' : '#5a7a5e';
      ctx.font = '700 15px "Courier New", monospace';
      ctx.fillText(formatMoney(a.price), rx + rw - 10, ry + rh / 2 - 8);
      ctx.fillStyle = '#5a6a5e'; ctx.font = '500 11px "Courier New", monospace';
      ctx.fillText('coming soon', rx + rw - 10, ry + rh / 2 + 8);
    }
  }
}

export function hit(x, y, { W, H }) {
  const back = { x: 24, y: 18, w: 80, h: 36 };
  if (inRect(back, x, y)) return 'back';
  return null; // All aspiration rows are locked in Wave 1
}
