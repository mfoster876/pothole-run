import { conditionTier } from './wreck.js';

export function drawCart(ctx, cart, cx, cy, s) {
  const tier = conditionTier(cart.condition);

  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.5, s * 1.1, s * 0.22, 0, 0, Math.PI * 2); ctx.fill();

  wheel(ctx, cx - s * 0.8, cy + s * 0.35, s * 0.32);
  wheel(ctx, cx + s * 0.8, cy + s * 0.35, s * 0.32);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(cart.lean * 0.15);
  ctx.fillStyle = '#7a4a22';
  ctx.fillRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  ctx.strokeStyle = '#5c3413'; ctx.lineWidth = 3;
  ctx.strokeRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.38, -s * 0.2); ctx.lineTo(i * s * 0.38, s * 0.22); ctx.stroke(); }

  ctx.fillStyle = '#222226';
  ctx.fillRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.strokeStyle = '#0e0e10'; ctx.strokeRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#3a3a40'; ctx.fill();
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#15151a'; ctx.fill();

  ctx.strokeStyle = '#9a9a9a'; ctx.lineWidth = s * 0.08;
  ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.2); ctx.lineTo(s * 0.2, -s * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(s * 0.22, -s * 1.02, s * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = s * 0.06; ctx.stroke();

  if (tier !== 'good') {
    ctx.strokeStyle = tier === 'critical' ? '#2a160a' : '#3a2412';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.1); ctx.lineTo(-s * 0.1, s * 0.15);
    ctx.lineTo(s * 0.1, -s * 0.05); ctx.stroke();
  }
  ctx.restore();
}
function wheel(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#1c1c1c'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fillStyle = '#8a8a8a'; ctx.fill();
}
