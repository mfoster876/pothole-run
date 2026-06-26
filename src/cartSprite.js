import { conditionTier } from './wreck.js';
import { HOP } from './constants.js';

// Draw the player's ride, rear-view, centred at (cx, cy) with body scale s.
// Dispatches on cart.vehicle.sprite; the handcart is the signature default.
export function drawCart(ctx, cart, cx, cy, s) {
  const tier = conditionTier(cart.condition);
  const veh = cart.vehicle || { sprite: 'handcart', body: '#7a4a22' };
  // conductor's progressive bleaching stage (0 natural → 4 skull); others ignore it
  const bleach = Math.max(0, Math.min(4, cart.bleachLevel || 0));

  // parabolic hop lift when airborne after a sleeping policeman (bump hazard)
  const peak = (HOP && HOP.height) || 64;   // virtual px at apex
  const air  = (HOP && HOP.air)    || 0.85; // seconds airborne
  const p    = Math.min(1, Math.max(0, (cart.jumpT || 0) / air)); // 1→0 as timer decays
  const lift = peak * 4 * p * (1 - p); // parabola: 0 at takeoff/landing, peak at mid-hop

  // ground shadow — shrinks and fades as the cart climbs
  const shadowScale = 1 - lift / (peak * 1.6);
  ctx.fillStyle = `rgba(0,0,0,${(0.28 * shadowScale).toFixed(3)})`;
  ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.5, s * 1.05 * shadowScale, s * 0.22 * shadowScale, 0, 0, Math.PI * 2); ctx.fill();

  // ---- soft-shoulder TOPPLE death: tip the whole ride onto its side and fling
  // the driver free. toppleT runs 0 (upright) → 1 (fully over, driver sprawled).
  const topple = Math.max(0, Math.min(1, cart.toppleT || 0));
  if (topple > 0) {
    drawToppledCart(ctx, cart, cx, cy, s, topple, tier, bleach);
    return;
  }

  ctx.save();
  ctx.translate(cx, cy - lift); // subtract lift so cart rises then falls
  ctx.rotate(cart.lean * 0.15 + (cart.reel || 0)); // reel = teetering on two wheels on the shoulder
  switch (veh.sprite) {
    case 'bicycle':    drawBicycle(ctx, cart, s, bleach); break;
    case 'yengyeng':   drawYengYeng(ctx, cart, s, bleach); break;
    case 'probox':     drawCar(ctx, cart, s, { roof: 0.92, taper: 0.04, light: '#d23a2a', wagon: true }, bleach); break;
    case 'swift':      drawCar(ctx, cart, s, { roof: 0.86, taper: 0.10, light: '#d23a2a' }, bleach); break;
    case 'x6':         drawCar(ctx, cart, s, { roof: 1.08, taper: 0.06, light: '#c81e1e', suv: true }, bleach); break;
    case 'audi':       drawCar(ctx, cart, s, { roof: 0.82, taper: 0.12, light: '#e23a3a' }, bleach); break;
    case 'porsche':    drawCar(ctx, cart, s, { roof: 0.70, taper: 0.18, light: '#e23a3a', wide: true }, bleach); break;
    case 'pickup':     drawCar(ctx, cart, s, { roof: 0.90, taper: 0.04, light: '#d23a2a', tray: true }, bleach); break;
    case 'jetour':     drawCar(ctx, cart, s, { roof: 1.10, taper: 0.05, light: '#37e0c8', suv: true, ev: true }, bleach); break;
    case 'cybertruck': drawCyber(ctx, cart, s, bleach); break;
    default:           drawHandcart(ctx, cart, s, tier, cart.goldHandcart, bleach); break;
  }
  // Coherent, escalating battle damage by tier — drawn in the same local frame as the
  // body and tailored to the vehicle family (cracked glass + smoke for cars, snapped
  // slats for the handcart, a buckled wheel for the two-wheelers). The worse the ride
  // looks, the closer the joyride is to ending in a wreck.
  const fam = veh.sprite === 'handcart' ? 'handcart'
    : veh.sprite === 'cybertruck' ? 'cyber'
    : (veh.sprite === 'bicycle' || veh.sprite === 'yengyeng') ? 'bike'
    : 'car';
  vehicleDamage(ctx, s, tier, fam);
  ctx.restore();
}

// ============ soft-shoulder topple death ============
// Rotates the whole ride onto its outer (shoulder) side and flings the driver
// free in a tumbling arc. t: 0 upright → 1 fully over with the driver sprawled.
function drawToppledCart(ctx, cart, cx, cy, s, t, tier, bleach) {
  const veh = cart.vehicle || { sprite: 'handcart', body: '#7a4a22' };
  const angle = t * 1.4; // up to ~90° onto its side

  // ground shadow stretches out as the ride goes over
  ctx.fillStyle = `rgba(0,0,0,${(0.26 + 0.08 * t).toFixed(3)})`;
  ctx.beginPath();
  ctx.ellipse(cx + s * 0.4 * t, cy + s * 0.5, s * (1.05 + 0.5 * t), s * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- the ride, rotated about its base (wheels stay planted, body falls over) ----
  ctx.save();
  ctx.translate(cx, cy + s * 0.34);   // pivot near the wheel/base line
  ctx.rotate(angle);                  // positive = toward the outer shoulder
  ctx.translate(0, -s * 0.34);        // back up so the body draws in its usual frame
  // draw the ride WITHOUT its own driver where possible — the handcart bakes the
  // driver in, so for it we skip the driver by using a tierless body; other rides
  // keep their through-window head (fine — the flung body reads as the ejection).
  switch (veh.sprite) {
    case 'bicycle':    drawBicycle(ctx, cart, s, bleach); break;
    case 'yengyeng':   drawYengYeng(ctx, cart, s, bleach); break;
    case 'probox':     drawCar(ctx, cart, s, { roof: 0.92, taper: 0.04, light: '#d23a2a', wagon: true }, bleach); break;
    case 'swift':      drawCar(ctx, cart, s, { roof: 0.86, taper: 0.10, light: '#d23a2a' }, bleach); break;
    case 'x6':         drawCar(ctx, cart, s, { roof: 1.08, taper: 0.06, light: '#c81e1e', suv: true }, bleach); break;
    case 'audi':       drawCar(ctx, cart, s, { roof: 0.82, taper: 0.12, light: '#e23a3a' }, bleach); break;
    case 'porsche':    drawCar(ctx, cart, s, { roof: 0.70, taper: 0.18, light: '#e23a3a', wide: true }, bleach); break;
    case 'pickup':     drawCar(ctx, cart, s, { roof: 0.90, taper: 0.04, light: '#d23a2a', tray: true }, bleach); break;
    case 'jetour':     drawCar(ctx, cart, s, { roof: 1.10, taper: 0.05, light: '#37e0c8', suv: true, ev: true }, bleach); break;
    case 'cybertruck': drawCyber(ctx, cart, s, bleach); break;
    default:           drawHandcartShell(ctx, cart, s, tier); break; // handcart sans driver
  }
  ctx.restore();

  // ---- the driver, flung free, tumbling out and landing beside the ride ----
  // arc OUT (toward the shoulder) and DOWN to the ground by t=1.
  const ex = cx + s * (0.5 + 1.0 * t);            // outward along the shoulder
  const ey = cy - s * 1.1 * Math.sin(Math.PI * t) + s * 0.5 * t; // up then down onto ground
  const spin = t * 2.6;                            // tumbling rotation
  drawEjectedDriver(ctx, cart.character, s, ex, ey, spin, t, bleach);
}

// The handcart body WITHOUT the driver baked in (used by the topple so the driver
// can be flung separately). Mirrors drawHandcart minus drawDriver().
function drawHandcartShell(ctx, cart, s, tier) {
  const gold = cart.goldHandcart;
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
  // sound-system box
  ctx.fillStyle = '#222226';
  ctx.fillRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.strokeStyle = '#0e0e10'; ctx.strokeRect(-s * 0.5, -s * 0.85, s, s * 0.7);
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.2, 0, Math.PI * 2); ctx.fillStyle = '#3a3a40'; ctx.fill();
  ctx.beginPath(); ctx.arc(-s * 0.16, -s * 0.5, s * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#15151a'; ctx.fill();
  // steering rod + rim wheel
  ctx.strokeStyle = strutColor; ctx.lineWidth = s * 0.08;
  ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.2); ctx.lineTo(s * 0.2, -s * 0.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(s * 0.22, -s * 1.02, s * 0.18, 0, Math.PI * 2);
  ctx.strokeStyle = wheelRim; ctx.lineWidth = s * 0.06; ctx.stroke();
  if (tier !== 'good') {
    ctx.strokeStyle = tier === 'critical' ? '#2a160a' : '#3a2412'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.1); ctx.lineTo(-s * 0.1, s * 0.15); ctx.lineTo(s * 0.1, -s * 0.05); ctx.stroke();
  }
}

// A simple tumbling body — head + limbs in the driver's shirt/skin colours —
// flung free of the ride. (ex,ey) = body centre, spin = rotation, t = progress.
function drawEjectedDriver(ctx, ch, s, ex, ey, spin, t, bleach = 0) {
  const skin = '#7a4a28', shirt = shirtColor(ch);
  ctx.save();
  ctx.translate(ex, ey);
  ctx.rotate(spin);

  // torso
  ctx.fillStyle = shirt;
  rr(ctx, -s * 0.18, -s * 0.22, s * 0.36, s * 0.44, s * 0.08); ctx.fill();
  // legs (two stubs, splayed as it tumbles)
  ctx.strokeStyle = '#2a2a30'; ctx.lineWidth = s * 0.12; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-s * 0.06, s * 0.18); ctx.lineTo(-s * 0.22, s * 0.42);
  ctx.moveTo(s * 0.06, s * 0.18);  ctx.lineTo(s * 0.24, s * 0.4);
  ctx.stroke();
  // arms (flailing out)
  ctx.strokeStyle = skin; ctx.lineWidth = s * 0.1;
  ctx.beginPath();
  ctx.moveTo(-s * 0.12, -s * 0.12); ctx.lineTo(-s * 0.36, -s * 0.26);
  ctx.moveTo(s * 0.12, -s * 0.12);  ctx.lineTo(s * 0.34, -s * 0.04);
  ctx.stroke();
  ctx.lineCap = 'butt';
  // head (reuse persona headgear so the right character is recognisable)
  drawHead(ctx, ch, s, 0, -s * 0.34, bleach);

  ctx.restore();
}

// ============ the signature sound-system handcart (unchanged behaviour) ============
// gold=true: recolors body and rims to gold while keeping all proportions identical.
function drawHandcart(ctx, cart, s, tier, gold = false, bleach = 0) {
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
  drawDriver(ctx, cart.character, s, bleach);
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
  // (battle damage now drawn uniformly by vehicleDamage() in drawCart)
}

// Escalating, family-coherent battle damage drawn in the body's local frame. `tier`:
// 'good' = pristine (nothing), 'warn' = dented & scratched, 'critical' = falling apart
// (cracked glass, smoke, a hanging part). `family`: 'car' | 'cyber' | 'handcart' | 'bike'.
function vehicleDamage(ctx, s, tier, family) {
  if (tier === 'good') return;
  const heavy = tier === 'critical';
  // dents — dark crumple blotches on the bodywork (all families)
  ctx.fillStyle = 'rgba(20,14,8,0.42)';
  ctx.beginPath(); ctx.ellipse(-s * 0.55, s * 0.04, s * 0.16, s * 0.1, 0.3, 0, Math.PI * 2); ctx.fill();
  if (heavy) { ctx.beginPath(); ctx.ellipse(s * 0.46, -s * 0.04, s * 0.2, s * 0.12, -0.2, 0, Math.PI * 2); ctx.fill(); }
  // a raking scratch
  ctx.strokeStyle = heavy ? 'rgba(10,8,4,0.8)' : 'rgba(40,30,18,0.6)'; ctx.lineWidth = Math.max(1.5, s * 0.03);
  ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.18); ctx.lineTo(-s * 0.05, s * 0.08); ctx.lineTo(s * 0.16, -s * 0.08); ctx.stroke();

  if (family === 'car' || family === 'cyber') {
    // spider-cracked rear glass across the window band
    ctx.strokeStyle = 'rgba(228,234,240,0.55)'; ctx.lineWidth = Math.max(0.8, s * 0.018);
    const gx = 0, gy = -s * 0.55;
    for (let a = 0; a < 6; a++) {
      const ang = a * 1.05;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx + Math.cos(ang) * s * 0.3, gy + Math.sin(ang) * s * 0.16); ctx.stroke();
    }
    if (heavy) { ctx.beginPath(); ctx.arc(gx, gy, s * 0.13, 0, Math.PI * 2); ctx.stroke(); }
    // smashed tail-light (dark wedge over a light)
    ctx.fillStyle = 'rgba(10,6,4,0.6)'; ctx.fillRect(-s * 0.9, s * 0.04, s * 0.18, s * 0.1);
    if (heavy) {
      // a bumper piece left dangling
      ctx.strokeStyle = '#3a3a40'; ctx.lineWidth = Math.max(2, s * 0.06); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s * 0.5, s * 0.2); ctx.lineTo(s * 0.66, s * 0.4); ctx.stroke(); ctx.lineCap = 'butt';
      // smoke from a dying engine, rising off the rear
      ctx.fillStyle = 'rgba(60,60,64,0.38)';
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(s * 0.1 + i * s * 0.12, -s * (0.7 + i * 0.34), s * (0.15 + i * 0.09), 0, Math.PI * 2); ctx.fill(); }
    }
  } else if (family === 'handcart') {
    // a snapped slat + (heavy) a missing board gap
    ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = Math.max(2, s * 0.05);
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.18); ctx.lineTo(-s * 0.34, s * 0.2); ctx.stroke();
    if (heavy) { ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(s * 0.2, -s * 0.18, s * 0.16, s * 0.38); }
  } else { // bike / yengyeng — a buckled wheel rim
    ctx.strokeStyle = '#15151a'; ctx.lineWidth = Math.max(1.5, s * 0.05);
    ctx.beginPath(); ctx.arc(-s * 0.55, s * 0.35, s * 0.3, 0.5, 2.5); ctx.stroke();
  }
}

// ============ generic car body, rear-view ============
// opts: roof (cabin height ×s), taper (roofline narrowing), light (tail colour),
// suv/wide/tray/wagon/ev flavour flags.
function drawCar(ctx, cart, s, opts, bleach = 0) {
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
  drawHead(ctx, cart.character, s * 0.6, 0, roofTop + s * 0.2, bleach);
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
function drawCyber(ctx, cart, s, bleach = 0) {
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
  drawHead(ctx, cart.character, s * 0.55, 0, -s * 0.74, bleach);
  // full-width LED tail-bar
  ctx.fillStyle = '#e23a3a'; ctx.fillRect(-s * 0.78, -s * 0.06, s * 1.56, s * 0.06);
  ctx.fillStyle = '#e8e8e0'; ctx.fillRect(-s * 0.16, s * 0.04, s * 0.32, s * 0.1);
}

// ============ bicycle — rider on top, thin wheels ============
function drawBicycle(ctx, cart, s, bleach = 0) {
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
  drawRider(ctx, cart.character, s, -s * 0.1, bleach);
}

// ============ yeng yeng — small motorbike, rider leaning ============
function drawYengYeng(ctx, cart, s, bleach = 0) {
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
  drawRider(ctx, cart.character, s, -s * 0.05, bleach);
}

// ============ figures ============
// A seated/standing rider seen from behind (bicycle, motorbike).
function drawRider(ctx, ch, s, seatY, bleach = 0) {
  const skin = '#7a4a28', shirt = shirtColor(ch);
  ctx.fillStyle = shirt; rr(ctx, -s * 0.2, seatY - s * 0.55, s * 0.4, s * 0.5, s * 0.08); ctx.fill();
  // arms forward to the bars
  ctx.strokeStyle = shirt; ctx.lineWidth = s * 0.12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.12, seatY - s * 0.4); ctx.lineTo(s * 0.22, seatY - s * 0.45); ctx.stroke();
  drawHead(ctx, ch, s, 0, seatY - s * 0.62, bleach);
}

// The driver behind the handcart (taller than the box). Headgear by persona.
function drawDriver(ctx, ch, s, bleach = 0) {
  const id = ch && ch.id;
  const skin = '#7a4a28', shirt = shirtColor(ch);
  ctx.fillStyle = shirt; ctx.fillRect(-s * 0.3, -s * 1.18, s * 0.6, s * 0.5);
  // Politician: half-orange (viewer-left) / half-green (viewer-right) suit torso
  if (id === 'politician') {
    ctx.fillStyle = '#e8821e'; ctx.fillRect(-s * 0.3, -s * 1.18, s * 0.3, s * 0.5);
    ctx.fillStyle = '#1f8a3c'; ctx.fillRect(0,        -s * 1.18, s * 0.3, s * 0.5);
  }
  ctx.strokeStyle = shirt; ctx.lineWidth = s * 0.13; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-s * 0.18, -s * 1.02); ctx.lineTo(s * 0.08, -s * 1.0); ctx.stroke();
  // Bleachaz conductor: bleach reaches only the face & neck — BOTH arms stay black.
  const rightArmSkin = id === 'conductor' ? '#1c1208' : skin;
  ctx.strokeStyle = rightArmSkin; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 1.0); ctx.lineTo(s * 0.2, -s * 0.98); ctx.stroke();
  // neck stub — follows the bleach stage for the conductor (dark→pale→raw)
  let neckSkin = skin;
  if (id === 'conductor') {
    neckSkin = bleach <= 1 ? '#2a1810'         // 0–1: still dark (light patch at 1 below)
             : bleach === 2 ? '#e8d4b8'        // 2: fully bleached pale
             : bleach === 3 ? '#d8b5a0'        // 3: raw, blotchy
             : '#cdb59a';                       // 4: pale skin around the exposed skull
  }
  ctx.fillStyle = neckSkin; ctx.fillRect(-s * 0.06, -s * 1.26, s * 0.12, s * 0.12);
  // stage-1 patchy bleach on the neck stub
  if (id === 'conductor' && bleach === 1) {
    ctx.fillStyle = '#e8d4b8';
    ctx.fillRect(-s * 0.06, -s * 1.26, s * 0.06, s * 0.07);
  }
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
  drawHead(ctx, ch, s, 0, -s * 1.38, bleach);
}

// Head + persona headgear, reusable across rides. (x,y) = head centre, scale = s.
// bleach (conductor only, 0..4) drives progressive bleaching from behind.
function drawHead(ctx, ch, s, x, y, bleach = 0) {
  const id = ch && ch.id, skin = '#7a4a28';
  // Bleachaz conductor: base scalp/skin tone tracks the bleach stage.
  //   0 natural dark · 2 fully bleached pale · 4 the bone of the skull.
  let faceSkin = skin;
  if (id === 'conductor') {
    // Stage 0 starts the FACE a notch lighter than the dark neck/body — the bleach
    // has only just begun on the face. Stage 1 is still dark (patches added).
    faceSkin = bleach === 0 ? '#3e2818'       // fresh: face lifted above dark body
             : bleach === 1 ? '#2a1810'       // dark (patches added at stage 1)
             : bleach === 2 ? '#f0e6d8'       // fully bleached pale
             : bleach === 3 ? '#e2c2ac'       // raw, blotchy pale
             : '#e8e4d8';                       // exposed skull bone
  }
  ctx.beginPath(); ctx.arc(x, y, s * 0.145, 0, Math.PI * 2); ctx.fillStyle = faceSkin; ctx.fill();
  if (id === 'rasta') {
    ctx.fillStyle = '#2a8a3a'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.21, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#e0b020'; ctx.fillRect(x - s * 0.21, y - s * 0.04, s * 0.42, s * 0.05);
    ctx.fillStyle = '#c0392b'; ctx.fillRect(x - s * 0.21, y + s * 0.01, s * 0.42, s * 0.05);
    ctx.strokeStyle = '#1c1208'; ctx.lineWidth = s * 0.05;
    ctx.beginPath(); ctx.moveTo(x - s * 0.16, y + s * 0.08); ctx.lineTo(x - s * 0.22, y + s * 0.34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + s * 0.16, y + s * 0.08); ctx.lineTo(x + s * 0.22, y + s * 0.34); ctx.stroke();
  } else if (id === 'conductor') {
    // Rear-view conductor, staged 0..4. Bantu knots persist while skin/hair
    // remains (0–3); the scalp + back-of-head damage track the bleach level.
    if (bleach <= 3) {
      // dark scalp cap (stage 2+ over the pale head still reads as the hairline)
      ctx.fillStyle = bleach >= 2 ? '#241a12' : '#1c1208';
      ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.16, Math.PI, 0); ctx.fill();
      // bantu knots across the crown
      ctx.fillStyle = '#15110a';
      for (const kx of [-0.12, 0, 0.12]) {
        ctx.beginPath(); ctx.arc(x + s * kx, y - s * 0.12, s * 0.045, 0, Math.PI * 2); ctx.fill();
      }
    }
    if (bleach === 1) {
      // PATCHY: pale bleach blotches creeping over the dark back of the head
      ctx.fillStyle = '#cdb59a';
      ctx.beginPath(); ctx.arc(x - s * 0.05, y + s * 0.02, s * 0.05, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.06, y + s * 0.05, s * 0.04, 0, Math.PI * 2); ctx.fill();
    } else if (bleach === 3) {
      // RAW / PEELING: raw red patches with a torn pale flap on the back of the head
      ctx.fillStyle = '#b5453a';
      ctx.beginPath(); ctx.arc(x - s * 0.04, y + s * 0.03, s * 0.05, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.07, y + s * 0.06, s * 0.035, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#7e2a22';
      ctx.beginPath(); ctx.arc(x - s * 0.04, y + s * 0.05, s * 0.025, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e2c2ac';                       // peeling skin flap
      ctx.beginPath();
      ctx.moveTo(x + s * 0.02, y - s * 0.02);
      ctx.quadraticCurveTo(x + s * 0.12, y, x + s * 0.10, y + s * 0.08);
      ctx.quadraticCurveTo(x + s * 0.04, y + s * 0.03, x + s * 0.02, y - s * 0.02);
      ctx.closePath(); ctx.fill();
    } else if (bleach === 4) {
      // SKULL: exposed cream bone with dark cracks/sutures and clinging red flesh
      ctx.fillStyle = '#bcb6a4';                        // bone contour shadow at the crown
      ctx.beginPath(); ctx.arc(x, y - s * 0.06, s * 0.12, Math.PI, 0); ctx.fill();
      ctx.strokeStyle = '#140f0c'; ctx.lineWidth = Math.max(0.8, s * 0.02); ctx.lineCap = 'round';
      ctx.beginPath();                                  // cranial suture line
      ctx.moveTo(x, y - s * 0.14);
      ctx.lineTo(x - s * 0.03, y - s * 0.04);
      ctx.lineTo(x + s * 0.02, y + s * 0.04); ctx.stroke();
      ctx.lineCap = 'butt';
      ctx.fillStyle = '#b5453a';                        // raw flesh still clinging at the edges
      ctx.beginPath(); ctx.arc(x - s * 0.13, y + s * 0.05, s * 0.035, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + s * 0.13, y + s * 0.06, s * 0.035, 0, Math.PI * 2); ctx.fill();
    }
    // ── lips/mouth on the (slightly visible) face — staged ──
    const lipY = y + s * 0.07;
    const lipW = s * 0.09;
    if (bleach === 0) {
      // FRESH START: CLEAR BLACK LIPS from the very beginning (the characteristic
      // look) — distinct solid-black lips, no pink centre yet (that arrives at 2).
      ctx.fillStyle = '#1a1010';
      ctx.beginPath(); ctx.ellipse(x, lipY, lipW * 0.9, s * 0.030, 0, 0, Math.PI * 2); ctx.fill();
    } else if (bleach === 1) {
      // PATCHY: ordinary dark mouth line (not yet the black-pink bleach mouth)
      ctx.strokeStyle = '#3a1e10'; ctx.lineWidth = Math.max(1, s * 0.022); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x - lipW * 0.7, lipY); ctx.lineTo(x + lipW * 0.7, lipY); ctx.stroke();
      ctx.lineCap = 'butt';
    } else if (bleach === 2) {
      // BLEACHED: black lips with a pink centre (the signature look)
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath(); ctx.ellipse(x, lipY, lipW, s * 0.038, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e0607a';
      ctx.beginPath(); ctx.ellipse(x, lipY, lipW * 0.55, s * 0.018, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a2a50';                        // subtle facial tattoo mark
      ctx.beginPath(); ctx.arc(x + s * 0.07, y - s * 0.02, Math.max(0.8, s * 0.02), 0, Math.PI * 2); ctx.fill();
    } else if (bleach === 3) {
      // RAW: cracked sore mouth over raw red
      ctx.fillStyle = '#b5453a';
      ctx.beginPath(); ctx.ellipse(x, lipY, lipW * 0.9, s * 0.026, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1010';
      ctx.beginPath(); ctx.ellipse(x, lipY + s * 0.004, lipW * 0.95, s * 0.014, 0, 0, Math.PI * 2); ctx.fill();
    } else {
      // SKULL: bared teeth — bone tiles on a dark mouth gap
      ctx.fillStyle = '#140f0c';
      ctx.fillRect(x - lipW, lipY - s * 0.018, lipW * 2, s * 0.044);
      ctx.fillStyle = '#e8e4d8';
      for (let i = -3; i <= 3; i++) ctx.fillRect(x + i * s * 0.026 - s * 0.010, lipY - s * 0.014, s * 0.018, s * 0.036);
    }
  } else if (id === 'jonkonnu') {
    ctx.fillStyle = '#c0392b'; ctx.fillRect(x - s * 0.18, y - s * 0.36, s * 0.36, s * 0.32);
    ctx.fillStyle = '#e0b020'; ctx.fillRect(x - s * 0.18, y - s * 0.26, s * 0.36, s * 0.06);
  } else if (id === 'police') {
    ctx.fillStyle = '#1a2740'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.19, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#d8c24a'; ctx.fillRect(x - s * 0.06, y - s * 0.08, s * 0.12, s * 0.05);
  } else if (id === 'politician') {
    // British court wig — rows of small cream curls across the crown (seen from
    // behind), with side-curl bunches over the ears. cream #ece9e0 / shadow #c8c4b8.
    const cream = '#ece9e0', wshade = '#c8c4b8';
    // cream dome cap over the back/crown of the head
    ctx.fillStyle = cream; ctx.beginPath(); ctx.arc(x, y - s * 0.02, s * 0.2, Math.PI, 0); ctx.fill();
    // small curl helper
    const curl = (cxk, cyk, rk) => {
      ctx.fillStyle = wshade; ctx.beginPath(); ctx.arc(cxk, cyk + rk * 0.3, rk, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = cream;  ctx.beginPath(); ctx.arc(cxk, cyk, rk * 0.9, 0, Math.PI * 2); ctx.fill();
    };
    // two rows of curls across the crown
    for (const cx2 of [-0.13, -0.04, 0.05, 0.14]) curl(x + s * cx2, y - s * 0.12, s * 0.05);
    for (const cx2 of [-0.1, 0, 0.1])             curl(x + s * cx2, y - s * 0.04, s * 0.05);
    // side-curl bunches over each ear
    for (const sign of [-1, 1]) for (let j = 0; j < 2; j++) curl(x + sign * s * 0.18, y + s * (0.02 + j * 0.08), s * 0.045);
  } else if (id === 'yute') {
    // School Yute is BALD — no hair. Bare scalp in the skin tone with a soft sheen.
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(x, y - s * 0.02, s * 0.15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.16)';            // top-of-head sheen
    ctx.beginPath(); ctx.ellipse(x - s * 0.03, y - s * 0.10, s * 0.07, s * 0.03, 0, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'taximan') {
    // Taxi Man — fitted cap (RED band) over short hair, recognisable from behind.
    // short dark hair peeking below the cap
    ctx.fillStyle = '#1c1208'; ctx.beginPath(); ctx.arc(x, y - s * 0.01, s * 0.16, Math.PI, 0); ctx.fill();
    // cap crown dome (dark slate)
    ctx.fillStyle = '#263040'; ctx.beginPath(); ctx.arc(x, y - s * 0.04, s * 0.185, Math.PI, 0); ctx.fill();
    // RED band around the base of the crown (route-taxi accent)
    ctx.fillStyle = '#b5342a'; ctx.fillRect(x - s * 0.185, y - s * 0.05, s * 0.37, s * 0.05);
    ctx.fillStyle = '#7e1f16'; ctx.fillRect(x - s * 0.185, y - s * 0.01, s * 0.37, s * 0.018);
    // adjuster strap notch at the back centre of the cap
    ctx.fillStyle = '#1a222e'; ctx.fillRect(x - s * 0.03, y - s * 0.10, s * 0.06, s * 0.04);
  } else {
    ctx.fillStyle = '#1c1208'; ctx.beginPath(); ctx.arc(x, y, s * 0.18, Math.PI, 0); ctx.fill();
  }
}

function shirtColor(ch) {
  const id = ch && ch.id;
  return { yute: '#9a7a45', rasta: '#3f7a3a', conductor: '#d8a23a', police: '#27407a',
    politician: '#1e2a44', taxi: '#9a3b2c', taximan: '#b5342a', business: '#b04a78', jonkonnu: '#c0392b' }[id] || '#cfae6a';
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
