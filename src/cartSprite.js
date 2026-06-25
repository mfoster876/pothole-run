import { conditionTier } from './wreck.js';
import { HOP } from './constants.js';

// Draw the player's ride, rear-view, centred at (cx, cy) with body scale s.
// Dispatches on cart.vehicle.sprite; the handcart is the signature default.
export function drawCart(ctx, cart, cx, cy, s) {
  const tier = conditionTier(cart.condition);
  const veh = cart.vehicle || { sprite: 'handcart', body: '#7a4a22' };

  // parabolic hop lift when airborne after a sleeping policeman (bump hazard)
  const peak = (HOP && HOP.height) || 64;   // virtual px at apex
  const air  = (HOP && HOP.air)    || 0.85; // seconds airborne
  const p    = Math.min(1, Math.max(0, (cart.jumpT || 0) / air)); // 1→0 as timer decays
  const lift = peak * 4 * p * (1 - p); // parabola: 0 at takeoff/landing, peak at mid-hop

  // ground shadow — shrinks and fades as the cart climbs
  const shadowScale = 1 - lift / (peak * 1.6);
  ctx.fillStyle = `rgba(0,0,0,${(0.28 * shadowScale).toFixed(3)})`;
  ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.5, s * 1.05 * shadowScale, s * 0.22 * shadowScale, 0, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(cx, cy - lift); // subtract lift so cart rises then falls
  ctx.rotate(cart.lean * 0.15 + (cart.reel || 0)); // reel = teetering on two wheels on the shoulder
  switch (veh.sprite) {
    case 'bicycle':    drawBicycle(ctx, cart, s); break;
    case 'yengyeng':   drawYengYeng(ctx, cart, s); break;
    case 'probox':     drawCar(ctx, cart, s, { roof: 0.92, taper: 0.04, light: '#d23a2a', wagon: true }); break;
    case 'swift':      drawCar(ctx, cart, s, { roof: 0.86, taper: 0.10, light: '#d23a2a' }); break;
    case 'x6':         drawCar(ctx, cart, s, { roof: 1.08, taper: 0.06, light: '#c81e1e', suv: true }); break;
    case 'audi':       drawCar(ctx, cart, s, { roof: 0.82, taper: 0.12, light: '#e23a3a' }); break;
    case 'porsche':    drawCar(ctx, cart, s, { roof: 0.70, taper: 0.18, light: '#e23a3a', wide: true }); break;
    case 'pickup':     drawCar(ctx, cart, s, { roof: 0.90, taper: 0.04, light: '#d23a2a', tray: true }); break;
    case 'jetour':     drawCar(ctx, cart, s, { roof: 1.10, taper: 0.05, light: '#37e0c8', suv: true, ev: true }); break;
    case 'cybertruck': drawCyber(ctx, cart, s); break;
    default:           drawHandcart(ctx, cart, s, tier, cart.goldHandcart); break;
  }
  // shared damage hint for non-handcart rides (handcart draws its own)
  if (veh.sprite !== 'handcart' && tier !== 'good') {
    ctx.strokeStyle = tier === 'critical' ? 'rgba(20,12,6,0.8)' : 'rgba(40,30,18,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.2); ctx.lineTo(-s * 0.05, s * 0.1);
    ctx.lineTo(s * 0.15, -s * 0.1); ctx.stroke();
  }
  ctx.restore();
}

// ============ the signature sound-system handcart (unchanged behaviour) ============
// gold=true: recolors body and rims to gold while keeping all proportions identical.
function drawHandcart(ctx, cart, s, tier, gold = false) {
  const bodyColor  = gold ? '#d8b020' : '#7a4a22';
  const rimColor   = gold ? '#f0d040' : '#8a8a8a';
  const strokeBody = gold ? '#a07808' : '#5c3413';
  const strutColor = gold ? '#c09010' : '#9a9a9a';
  const wheelRim   = gold ? '#f0d040' : '#c9c9c9';

  wheel(ctx, -s * 0.8, s * 0.35, s * 0.32, rimColor);
  wheel(ctx, s * 0.8, s * 0.35, s * 0.32, rimColor);
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  ctx.strokeStyle = strokeBody; ctx.lineWidth = 3;
  ctx.strokeRect(-s * 0.95, -s * 0.2, s * 1.9, s * 0.42);
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.38, -s * 0.2); ctx.lineTo(i * s * 0.38, s * 0.22); ctx.stroke(); }
  drawDriver(ctx, cart.character, s);
  // sound-system box (always dark — it's electronics)
  ctx.fillStyle = '#222226';
  ctx.fillRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.strokeStyle = '#0e0e10'; ctx.strokeRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.2, 0, Math.PI * 2); ctx.fillStyle = '#3a3a40'; ctx.fill();
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#15151a'; ctx.fill();
  // mopstick-iron steering rod + car-rim wheel
  ctx.strokeStyle = strutColor; ctx.lineWidth = s * 0.08;
  ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.2); ctx.lineTo(s * 0.2, -s * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(s * 0.22, -s * 1.02, s * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = wheelRim; ctx.lineWidth = s * 0.06; ctx.stroke();
  if (tier !== 'good') {
    ctx.strokeStyle = tier === 'critical' ? '#2a160a' : '#3a2412'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.1); ctx.lineTo(-s * 0.1, s * 0.15); ctx.lineTo(s * 0.1, -s * 0.05); ctx.stroke();
  }
}

// ============ generic car body, rear-view ============
// opts: roof (cabin height ×s), taper (roofline narrowing), light (tail colour),
// suv/wide/tray/wagon/ev flavour flags.
function drawCar(ctx, cart, s, opts) {
  const body = cart.vehicle.body;
  const w = s * (opts.wide ? 1.0 : 0.84);
  const roofTop = -s * (0.55 + opts.roof * 0.5);
  // wheels poking out below the body
  wheel(ctx, -w * 0.92, s * 0.34, s * 0.26);
  wheel(ctx, w * 0.92, s * 0.34, s * 0.26);
  // lower body / boot
  rr(ctx, -w, -s * 0.18, w * 2, s * 0.56, s * 0.12); ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = shade(body, -0.4); ctx.lineWidth = 2; ctx.stroke();
  // cabin / rear window, tapered inward toward the roof
  const cw = w * (1 - opts.taper);
  ctx.beginPath();
  ctx.moveTo(-w, -s * 0.14); ctx.lineTo(-cw, roofTop + s * 0.08);
  ctx.quadraticCurveTo(-cw, roofTop, -cw * 0.86, roofTop);
  ctx.lineTo(cw * 0.86, roofTop); ctx.quadraticCurveTo(cw, roofTop, cw, roofTop + s * 0.08);
  ctx.lineTo(w, -s * 0.14); ctx.closePath();
  ctx.fillStyle = shade(body, opts.ev ? 0.05 : -0.08); ctx.fill(); ctx.stroke();
  // rear windscreen (driver shows through)
  rr(ctx, -cw * 0.74, roofTop + s * 0.06, cw * 1.48, s * 0.34, s * 0.05);
  ctx.fillStyle = '#16242e'; ctx.fill();
  drawHead(ctx, cart.character, s * 0.6, 0, roofTop + s * 0.2);
  // body highlight strip
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(-w * 0.96, -s * 0.12, w * 1.92, s * 0.05);
  // tail-lights
  ctx.fillStyle = opts.light;
  rr(ctx, -w * 0.92, s * 0.06, w * 0.34, s * 0.12, s * 0.03); ctx.fill();
  rr(ctx, w * 0.58, s * 0.06, w * 0.34, s * 0.12, s * 0.03); ctx.fill();
  if (opts.ev) { ctx.fillStyle = opts.light; ctx.fillRect(-w * 0.6, s * 0.12, w * 1.2, s * 0.025); } // EV light bar
  // licence plate
  ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-s * 0.16, s * 0.12, s * 0.32, s * 0.1);
  if (opts.tray) { // pickup tailgate lip
    ctx.fillStyle = shade(body, -0.25); ctx.fillRect(-w, -s * 0.22, w * 2, s * 0.08);
  }
}

// ============ Cybertruck — angular stainless wedge ============
function drawCyber(ctx, cart, s) {
  wheel(ctx, -s * 0.82, s * 0.34, s * 0.28);
  wheel(ctx, s * 0.82, s * 0.34, s * 0.28);
  const body = '#aeb4ba';
  ctx.beginPath();
  ctx.moveTo(-s * 0.9, s * 0.3); ctx.lineTo(-s * 0.78, -s * 0.1);
  ctx.lineTo(-s * 0.5, -s * 1.0); ctx.lineTo(s * 0.5, -s * 1.0);
  ctx.lineTo(s * 0.78, -s * 0.1); ctx.lineTo(s * 0.9, s * 0.3); ctx.closePath();
  ctx.fillStyle = body; ctx.fill();
  ctx.strokeStyle = '#6c7176'; ctx.lineWidth = 2; ctx.stroke();
  // facet shading
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 1.0); ctx.lineTo(s * 0.5, -s * 1.0); ctx.lineTo(s * 0.3, -s * 0.5); ctx.lineTo(-s * 0.3, -s * 0.5); ctx.closePath(); ctx.fill();
  // rear glass + driver
  ctx.fillStyle = '#10181c'; rr(ctx, -s * 0.42, -s * 0.92, s * 0.84, s * 0.4, s * 0.04); ctx.fill();
  drawHead(ctx, cart.character, s * 0.55, 0, -s * 0.74);
  // full-width LED tail-bar
  ctx.fillStyle = '#e23a3a'; ctx.fillRect(-s * 0.78, -s * 0.06, s * 1.56, s * 0.06);
  ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-s * 0.16, s * 0.04, s * 0.32, s * 0.1);
}

// ============ bicycle — rider on top, thin wheels ============
function drawBicycle(ctx, cart, s) {
  ctx.strokeStyle = '#15151a'; ctx.lineWidth = s * 0.06;
  spoke(ctx, -s * 0.55, s * 0.36, s * 0.3);
  spoke(ctx, s * 0.55, s * 0.36, s * 0.3);
  // frame
  ctx.strokeStyle = cart.vehicle.body; ctx.lineWidth = s * 0.1; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.55, s * 0.36); ctx.lineTo(0, -s * 0.1); ctx.lineTo(s * 0.55, s * 0.36);
  ctx.moveTo(0, -s * 0.1); ctx.lineTo(s * 0.1, s * 0.36); ctx.stroke();
  // saddle + handlebars
  ctx.fillStyle = '#15151a'; ctx.fillRect(-s * 0.12, -s * 0.2, s * 0.22, s * 0.08);
  ctx.strokeStyle = '#9a9a9a'; ctx.lineWidth = s * 0.05;
  ctx.beginPath(); ctx.moveTo(0, -s * 0.1); ctx.lineTo(s * 0.2, -s * 0.45); ctx.stroke();
  drawRider(ctx, cart.character, s, -s * 0.1);
}

// ============ yeng yeng — small motorbike, rider leaning ============
function drawYengYeng(ctx, cart, s) {
  wheel(ctx, -s * 0.5, s * 0.36, s * 0.26);
  wheel(ctx, s * 0.5, s * 0.36, s * 0.26);
  // body / tank
  ctx.fillStyle = cart.vehicle.body;
  rr(ctx, -s * 0.45, -s * 0.02, s * 0.9, s * 0.32, s * 0.08); ctx.fill();
  ctx.fillStyle = shade(cart.vehicle.body, -0.3); rr(ctx, -s * 0.1, -s * 0.18, s * 0.36, s * 0.22, s * 0.05); ctx.fill();
  // handlebars
  ctx.strokeStyle = '#15151a'; ctx.lineWidth = s * 0.06;
  ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.1); ctx.lineTo(s * 0.34, -s * 0.5); ctx.stroke();
  // red plate
  ctx.fillStyle = '#c0392b'; ctx.fillRect(-s * 0.5, s * 0.18, s * 0.2, s * 0.12);
  drawRider(ctx, cart.character, s, -s * 0.05);
}

// ============ figures ============
// A seated/standing rider seen from behind (bicycle, motorbike).
function drawRider(ctx, ch, s, seatY) {
  const skin = '#7a4a28', shirt = shirtColor(ch);
  ctx.fillStyle = shirt; rr(ctx, -s * 0.2, seatY - s * 0.55, s * 0.4, s * 0.5, s * 0.08); ctx.fill();
  // arms forward to the bars
  ctx.strokeStyle = shirt; ctx.lineWidth = s * 0.12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.12, seatY - s * 0.4); ctx.lineTo(s * 0.22, seatY - s * 0.45); ctx.stroke();
  drawHead(ctx, ch, s, 0, seatY - s * 0.62);
}

// The driver behind the handcart (taller than the box). Headgear by persona.
function drawDriver(ctx, ch, s) {
  const id = ch && ch.id;
  const skin = '#7a4a28', shirt = shirtColor(ch);
  ctx.fillStyle = shirt; ctx.fillRect(-s * 0.3, -s * 1.18, s * 0.6, s * 0.5);
  ctx.strokeStyle = shirt; ctx.lineWidth = s * 0.13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.18, -s * 1.02); ctx.lineTo(s * 0.08, -s * 1.0); ctx.stroke();
  // Bleachaz conductor: left arm stays original un-bleached black, right arm is lighter
  const rightArmSkin = id === 'conductor' ? '#e8d4b8' : skin;
  const leftArmSkin  = id === 'conductor' ? '#1c1208'  : skin;  // un-bleached arm
  ctx.strokeStyle = rightArmSkin; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 1.0); ctx.lineTo(s * 0.2, -s * 0.98); ctx.stroke();
  // neck stub — lighter for conductor (bleached)
  const neckSkin = id === 'conductor' ? '#e8d4b8' : skin;
  ctx.fillStyle = neckSkin; ctx.fillRect(-s * 0.06, -s * 1.26, s * 0.12, s * 0.12);
  // Neck tattoos for conductor: small geometric lines on the neck
  if (id === 'conductor') {
    ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = Math.max(0.8, s * 0.03); ctx.lineCap = 'butt';
    // two small horizontal bars on the neck
    ctx.beginPath();
    ctx.moveTo(-s * 0.055, -s * 1.22); ctx.lineTo(s * 0.055, -s * 1.22);
    ctx.moveTo(-s * 0.04,  -s * 1.17); ctx.lineTo(s * 0.04,  -s * 1.17);
    ctx.stroke();
    // a small left-arm sleeve tattoo on the visible un-bleached arm stub
    ctx.strokeStyle = '#3a3050'; ctx.lineWidth = Math.max(0.8, s * 0.025);
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 1.04); ctx.lineTo(-s * 0.09, -s * 1.06);
    ctx.stroke();
  }
  drawHead(ctx, ch, s, 0, -s * 1.38);
}

// Head + persona headgear, reusable across rides. (x,y) = head centre, scale = s.
function drawHead(ctx, ch, s, x, y) {
  const id = ch && ch.id, skin = '#7a4a28';
  // Bleachaz conductor: white/bleached face instead of standard skin
  const faceSkin = id === 'conductor' ? '#f0e6d8' : skin;
  ctx.beginPath(); ctx.arc(x, y, s * 0.145, 0, Math.PI * 2); ctx.fillStyle = faceSkin; ctx.fill();
  if (id === 'rasta') {
    ctx.fillStyle = '#2a8a3a'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.21, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#e0b020'; ctx.fillRect(x - s * 0.21, y - s * 0.04, s * 0.42, s * 0.05);
    ctx.fillStyle = '#c0392b'; ctx.fillRect(x - s * 0.21, y + s * 0.01, s * 0.42, s * 0.05);
    ctx.strokeStyle = '#1c1208'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(x - s * 0.16, y + s * 0.08); ctx.lineTo(x - s * 0.22, y + s * 0.34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.16, y + s * 0.08); ctx.lineTo(x + s * 0.22, y + s * 0.34); ctx.stroke();
  } else if (id === 'conductor') {
    // Flat conductor cap (dark)
    ctx.fillStyle = '#2b2b30'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.19, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - s * 0.2, y - s * 0.04, s * 0.32, s * 0.04);
    // Black lips with a pink centre — drawn at the lower third of the face
    const lipY = y + s * 0.07;
    const lipW = s * 0.09;
    // outer black lip shape
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.ellipse(x, lipY, lipW, s * 0.038, 0, 0, Math.PI * 2); ctx.fill();
    // pink centre highlight (the inner wet lip colour)
    ctx.fillStyle = '#e0607a';
    ctx.beginPath(); ctx.ellipse(x, lipY, lipW * 0.55, s * 0.018, 0, 0, Math.PI * 2); ctx.fill();
    // subtle facial tattoo: a small mark under the right eye
    ctx.fillStyle = '#2a2a50';
    ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 0.02, Math.max(0.8, s * 0.02), 0, Math.PI * 2); ctx.fill();
  } else if (id === 'jonkonnu') {
    ctx.fillStyle = '#c0392b'; ctx.fillRect(x - s * 0.18, y - s * 0.36, s * 0.36, s * 0.32);
    ctx.fillStyle = '#e0b020'; ctx.fillRect(x - s * 0.18, y - s * 0.26, s * 0.36, s * 0.06);
  } else if (id === 'police') {
    ctx.fillStyle = '#1a2740'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.19, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#d8c24a'; ctx.fillRect(x - s * 0.06, y - s * 0.08, s * 0.12, s * 0.05);
  } else {
    ctx.fillStyle = '#1c1208'; ctx.beginPath(); ctx.arc(x, y, s * 0.18, Math.PI, 0); ctx.fill();
  }
}

function shirtColor(ch) {
  const id = ch && ch.id;
  return { yute: '#dfe3ea', rasta: '#3f7a3a', conductor: '#d8a23a', police: '#27407a',
    taxi: '#9a3b2c', business: '#b04a78', jonkonnu: '#c0392b' }[id] || '#cfae6a';
}
function wheel(ctx, x, y, r, hubColor = '#8a8a8a') {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#1c1c1c'; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r * 0.35, 0, Math.PI * 2); ctx.fillStyle = hubColor; ctx.fill();
}
function spoke(ctx, x, y, r) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x, y, r * 0.12, 0, Math.PI * 2); ctx.fillStyle = '#8a8a8a'; ctx.fill();
}
// rounded-rect path helper
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
// lighten (+) or darken (-) a #rrggbb hex by amt (-1..1)
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c) => Math.max(0, Math.min(255, Math.round(c + amt * 255)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
