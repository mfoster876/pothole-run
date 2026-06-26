// src/screens/mechshop.js
// Mech Shop: repair the cart and buy RIG stability upgrades.
// Repair cost = $REPAIR_PRICE per condition point to restore.
// RIG upgrades moved here from the start menu.
import { spend } from '../economy.js';
import { upgradesForVehicle, stabilityBonus } from '../upgrades.js';
import { ownedUpgrades, bustedParts } from '../save.js';
import { getVehicle } from '../vehicles.js';
import { UPKEEP } from '../constants.js';
import { formatMoney } from '../money.js';

export const REPAIR_PRICE = 50; // base $ per condition point above current

// A busted part is re-fitted for a fraction of its original price — cheaper than buying
// new, but a recurring drain every time a crash shakes one loose.
export const REFIT_FACTOR = 0.45;
export function refitCost(upgrade) { return Math.max(1, Math.round((upgrade.price || 0) * REFIT_FACTOR)); }

// Repairs are proportionally dearer on a pricier ride — fixing a Porsche costs many
// times what patching a handcart does.
export function repairFactor(vehicleId) {
  const price = getVehicle(vehicleId).price || 0;
  return 1 + Math.min(UPKEEP.maxRepairFactor - 1, price / UPKEEP.repairPerPrice);
}

export function repairCost(from, to, vehicleId = 'handcart', price = REPAIR_PRICE) {
  return Math.max(0, Math.round((to - from) * price * repairFactor(vehicleId)));
}

export function applyRepair(save, to, price = REPAIR_PRICE) {
  const cost = repairCost(save.condition, to, save.vehicle, price);
  if (!spend(save, cost)) return false;
  save.condition = to;
  return true;
}

// --- Canvas rendering ---
function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

function shopRects(W, H, vehicleId) {
  const bw = Math.round(W * 0.65), bh = 50;
  const bx = (W - bw) / 2;
  const upgrades = upgradesForVehicle(vehicleId).map((u, i) => ({
    id: u.id,
    rect: { x: bx, y: H * 0.55 + i * 62 - bh / 2, w: bw, h: bh }
  }));
  return {
    repair: { x: bx, y: H * 0.36 - bh / 2, w: bw, h: bh },
    upgrades,
    back: { x: 24, y: 18, w: 80, h: 36 }
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

export function render(ctx, { save, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020'; ctx.font = '700 44px "Courier New", monospace';
  ctx.fillText('MECH SHOP', W / 2, H * 0.09);

  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 16px "Courier New", monospace';
  ctx.fillText('condition: ' + Math.round(save.condition) + '%   wallet: ' + formatMoney(save.wallet), W / 2, H * 0.17);

  const R = shopRects(W, H, save.vehicle);

  // Back
  btn(ctx, R.back, '‹ HUB', { font: '700 18px "Courier New", monospace', stroke: '#9fb8a3', text: '#9fb8a3' });

  // Repair to 100%
  const cost = repairCost(save.condition, 100, save.vehicle);
  const canRepair = save.condition < 100;
  const afford = save.wallet >= cost;
  if (canRepair) {
    btn(ctx, R.repair, 'REPAIR TO 100%  ' + formatMoney(cost), {
      font: '700 22px "Courier New", monospace',
      stroke: afford ? '#f0c020' : '#5a5a5a',
      text: afford ? '#f0c020' : '#7a7a7a'
    });
  } else {
    btn(ctx, R.repair, 'CART IS MINT ✓', {
      font: '700 22px "Courier New", monospace',
      stroke: '#3fae54', text: '#3fae54'
    });
  }

  // Condition bar
  const bx = R.repair.x, by = R.repair.y + R.repair.h + 10;
  ctx.fillStyle = '#2a3a2e'; ctx.fillRect(bx, by, R.repair.w, 12);
  const condFrac = Math.max(0, Math.min(1, save.condition / 100));
  ctx.fillStyle = condFrac > 0.5 ? '#3fae54' : condFrac > 0.25 ? '#f0c020' : '#c0382c';
  ctx.fillRect(bx, by, R.repair.w * condFrac, 12);

  // Upgrades section — tailored to the ride you're driving
  const set = upgradesForVehicle(save.vehicle);
  ctx.fillStyle = '#cbe7cf'; ctx.font = '700 18px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TUNE-UPS — ' + getVehicle(save.vehicle).name.toUpperCase(), W / 2, H * 0.435);
  // Tell the player what the parts now DO, and that a crash can bust one (the shakedown).
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 12px "Courier New", monospace';
  ctx.fillText('sharpen handling & grip — but a hard crash can BUST a part (pay to re-fit)', W / 2, H * 0.47);

  const owned = ownedUpgrades(save, save.vehicle);
  const busted = bustedParts(save, save.vehicle);
  const total = set.length;

  // GRIP meter — every part you buy visibly raises GRIP, and GRIP is what you FEEL on the
  // road: steadier steering, soaking up the gusts from passing buses, holding a clean line.
  const maxBonus = set.reduce((s, u) => s + u.stability, 0) || 1;
  const gripFrac = Math.max(0, Math.min(1, stabilityBonus(owned, save.vehicle) / maxBonus));
  ctx.fillStyle = '#9fb8a3'; ctx.font = '500 13px "Courier New", monospace';
  ctx.fillText('GRIP — steadier steering · soaks up gusts · holds the line', W / 2, H * 0.505);
  const gbx = R.repair.x, gby = H * 0.522;
  ctx.fillStyle = '#2a3a2e'; ctx.fillRect(gbx, gby, R.repair.w, 10);
  ctx.fillStyle = '#49b6c8'; ctx.fillRect(gbx, gby, R.repair.w * gripFrac, 10);

  for (let i = 0; i < total; i++) {
    const u = set[i];
    const isOwned = owned.includes(u.id);
    const isBusted = busted.includes(u.id);
    const { rect } = R.upgrades[i];
    if (isOwned) {
      btn(ctx, rect, u.name + '  ✓ OWNED', { stroke: '#3fae54', text: '#3fae54', font: '700 20px "Courier New", monospace' });
    } else if (isBusted) {
      const cost = refitCost(u);
      const afford = save.wallet >= cost;
      btn(ctx, rect, u.name + '  BUST! RE-FIT ' + formatMoney(cost), {
        font: '700 18px "Courier New", monospace',
        stroke: afford ? '#e0584a' : '#5a5a5a',
        text: afford ? '#ffae9e' : '#7a7a7a'
      });
    } else {
      const canBuy = save.wallet >= u.price;
      btn(ctx, rect, u.name + '  ' + formatMoney(u.price), {
        font: '700 20px "Courier New", monospace',
        stroke: canBuy ? '#cbe7cf' : '#5a5a5a',
        text: canBuy ? '#f4f1e6' : '#7a7a7a'
      });
    }
  }
}

export function hit(x, y, { W, H, save }) {
  const R = shopRects(W, H, save.vehicle);
  if (inRect(R.back, x, y)) return 'back';
  if (inRect(R.repair, x, y) && save.condition < 100) return 'repair100';
  const owned = ownedUpgrades(save, save.vehicle);
  const busted = bustedParts(save, save.vehicle);
  for (const { id, rect } of R.upgrades) {
    if (!inRect(rect, x, y) || owned.includes(id)) continue;
    return busted.includes(id) ? 'refit:' + id : 'buy:' + id;
  }
  return null;
}
