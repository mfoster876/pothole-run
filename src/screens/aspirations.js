// src/screens/aspirations.js
// The nine "outs" — the social-mobility ladder.
// ASPIRATIONS data lives in src/aspirations.js (no duplication here).
import { formatMoney } from '../money.js';
import { ASPIRATIONS, isAchieved, canBuy } from '../aspirations.js';

// Vignettes: bittersweet, 1–2 lines, Jamaican patois voice. Earned, a little
// melancholy. Dramatise inequality — dignity, not mockery.
const VIGNETTES = {
  tithes:   'Yuh drop it in di plate knowing di roof still leak.\nGod see di struggle — yuh give anyway.',
  school:   'Di pickney make it through. Graduation day fine.\nBut yuh still counting every dollar come August.',
  artist:   'Yuh painting hang pon di gallery wall uptown.\nDem sell it fi plenty — yuh see a likkle piece, and yuh smile anyway.',
  business: 'Di sign lean against di wall, people call yuh Mr. now.\nBut yuh remember when yuh never know where supper coming from.',
  music:    'Di riddim reach far — England, New York, somewhere cold.\nRoyalties letter come. It never quite reach yuh, but it reach.',
  migrate:  'Ticket in yuh hand. Yard behind yuh getting smaller.\nYuh going, yes. But something — always, always — staying.',
  farm:     'Di land produce. Table full fi di first time in a long while.\nYuh sit quiet. Yuh earn dis.',
  hills:    'Yuh reach di heights. Di view pretty, yes.\nBut it remind yuh who never make it up here with yuh.',
  hotel:    'Guests smile at di sea. Dem never know.\nYuh build dis place with blistered hands, one block at a time.'
};

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

// Cash Pot pill button dimensions (reused in render + hit)
function cashPotRect(W, H) {
  const bw = 160, bh = 36;
  return { x: W - bw - 24, y: 18, w: bw, h: bh };
}

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

  // Cash Pot pill (top-right corner)
  const cp = cashPotRect(W, H);
  ctx.fillStyle = 'rgba(240,192,32,0.10)'; ctx.fillRect(cp.x, cp.y, cp.w, cp.h);
  ctx.strokeStyle = '#f0c020'; ctx.lineWidth = 2; ctx.strokeRect(cp.x, cp.y, cp.w, cp.h);
  ctx.fillStyle = '#f0c020'; ctx.font = '700 15px "Courier New", monospace';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('CASH POT 🎰', cp.x + cp.w / 2, cp.y + cp.h / 2);

  // List aspirations — scrollable if they overflow; lay out vertically
  const rowH = (H * 0.78) / ASPIRATIONS.length;
  const startY = H * 0.195;

  for (let i = 0; i < ASPIRATIONS.length; i++) {
    const a = ASPIRATIONS[i];
    const done = isAchieved(save, a.id);
    const affordable = canBuy(save, a.id);
    const ry = startY + i * rowH;
    const rx = W * 0.06, rw = W * 0.88, rh = rowH - 6;

    ctx.fillStyle = done ? 'rgba(63,174,84,0.12)' : affordable ? 'rgba(240,192,32,0.07)' : 'rgba(244,241,230,0.04)';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = done ? '#3fae54' : affordable ? '#f0c020' : '#3a4a3e'; ctx.lineWidth = 1;
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
    } else if (affordable) {
      ctx.fillStyle = '#f0c020'; ctx.font = '700 15px "Courier New", monospace';
      ctx.fillText(formatMoney(a.price), rx + rw - 10, ry + rh / 2 - 8);
      ctx.fillStyle = '#f0c020'; ctx.font = '500 11px "Courier New", monospace';
      ctx.fillText('BUY', rx + rw - 10, ry + rh / 2 + 8);
    } else {
      ctx.fillStyle = '#5a7a5e';
      ctx.font = '700 15px "Courier New", monospace';
      ctx.fillText(formatMoney(a.price), rx + rw - 10, ry + rh / 2 - 8);
      ctx.fillStyle = '#5a6a5e'; ctx.font = '500 11px "Courier New", monospace';
      ctx.fillText('need more', rx + rw - 10, ry + rh / 2 + 8);
    }
  }
}

export function hit(x, y, { W, H }) {
  const back = { x: 24, y: 18, w: 80, h: 36 };
  if (inRect(back, x, y)) return 'back';
  if (inRect(cashPotRect(W, H), x, y)) return 'cashpot';

  // Check aspiration rows — only affordable, unachieved ones are tappable
  const rowH = (H * 0.78) / ASPIRATIONS.length;
  const startY = H * 0.195;
  const rx = W * 0.06, rw = W * 0.88;
  for (let i = 0; i < ASPIRATIONS.length; i++) {
    const a = ASPIRATIONS[i];
    const ry = startY + i * rowH;
    const rh = rowH - 6;
    if (inRect({ x: rx, y: ry, w: rw, h: rh }, x, y)) {
      // We can't check canBuy here without save; return the id and let game.js decide
      return 'row:' + a.id;
    }
  }
  return null;
}

export { VIGNETTES };
