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

  // the persona standing at the back, pushing — drawn behind the sound-system box
  drawDriver(ctx, cart.character, s);

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

// The driver, viewed from behind, standing taller than the cart. Origin is the
// cart centre (already translated). Headgear distinguishes each persona.
function drawDriver(ctx, ch, s) {
  const id = ch && ch.id;
  const skin = '#7a4a28';
  const shirt = { yute: '#dfe3ea', rasta: '#3f7a3a', conductor: '#d8a23a', police: '#27407a',
    taxi: '#9a3b2c', business: '#b04a78', jonkonnu: '#c0392b' }[id] || '#cfae6a';
  // torso + shoulders (lower half hidden by the sound box drawn after this)
  ctx.fillStyle = shirt;
  ctx.fillRect(-s * 0.3, -s * 1.18, s * 0.6, s * 0.5);
  // sleeved arms reaching forward to the car-rim steering wheel
  ctx.strokeStyle = shirt; ctx.lineWidth = s * 0.13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.18, -s * 1.02); ctx.lineTo(s * 0.08, -s * 1.0); ctx.stroke();
  ctx.strokeStyle = skin; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 1.0); ctx.lineTo(s * 0.2, -s * 0.98); ctx.stroke();
  // neck + head
  ctx.fillStyle = skin; ctx.fillRect(-s * 0.06, -s * 1.26, s * 0.12, s * 0.12);
  ctx.beginPath(); ctx.arc(0, -s * 1.38, s * 0.145, 0, Math.PI * 2); ctx.fillStyle = skin; ctx.fill();
  // headgear per persona
  if (id === 'rasta') {
    ctx.fillStyle = '#2a8a3a'; ctx.beginPath(); ctx.arc(0, -s * 1.42, s * 0.21, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#e0b020'; ctx.fillRect(-s * 0.21, -s * 1.42, s * 0.42, s * 0.05);
    ctx.fillStyle = '#c0392b'; ctx.fillRect(-s * 0.21, -s * 1.37, s * 0.42, s * 0.05);
    ctx.strokeStyle = '#1c1208'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(-s * 0.16, -s * 1.3); ctx.lineTo(-s * 0.22, -s * 1.04); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.16, -s * 1.3); ctx.lineTo(s * 0.22, -s * 1.04); ctx.stroke();
  } else if (id === 'conductor') {
    ctx.fillStyle = '#2b2b30'; ctx.beginPath(); ctx.arc(0, -s * 1.42, s * 0.19, Math.PI, 0); ctx.fill();
    ctx.fillRect(-s * 0.2, -s * 1.42, s * 0.32, s * 0.04);
  } else if (id === 'jonkonnu') {
    ctx.fillStyle = '#c0392b'; ctx.fillRect(-s * 0.18, -s * 1.74, s * 0.36, s * 0.32);
    ctx.fillStyle = '#e0b020'; ctx.fillRect(-s * 0.18, -s * 1.64, s * 0.36, s * 0.06);
    ctx.fillStyle = '#2a8a3a'; ctx.fillRect(-s * 0.18, -s * 1.54, s * 0.36, s * 0.06);
  } else if (id === 'police') {
    ctx.fillStyle = '#1a2740'; ctx.beginPath(); ctx.arc(0, -s * 1.42, s * 0.19, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#d8c24a'; ctx.fillRect(-s * 0.06, -s * 1.46, s * 0.12, s * 0.05);
  } else {
    ctx.fillStyle = '#1c1208'; ctx.beginPath(); ctx.arc(0, -s * 1.38, s * 0.18, Math.PI, 0); ctx.fill();
  }
}
