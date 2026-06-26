// src/signs.js — roadside road-safety signage: speed-limit roundels and safety
// billboards carrying Jamaica's road-fatality message. This is the game's whole point
// made literal at the edge of the road: the joyride ends in a wreck, so slow down.
//
// ⚠ GROUND-TRUTH: JA_ROAD_DEATHS is the ONE place the fatality figure lives. Jamaica's
// annual road toll has repeatedly run past 400 (e.g. the National Road Safety Council
// reported well over 400 in recent years), so "OVER 400" is a deliberately conservative,
// defensible framing — NOT a precise claim. Set this to the exact current figure you want
// posted and it updates every billboard at once.
export const JA_ROAD_DEATHS = 400;

// Short road-safety lines for the billboards. The first carries the fatality figure;
// the rest are evergreen PSA-style slogans (the NRSC's "Arrive Alive" register).
export const SAFETY_MESSAGES = [
  { head: 'OVER ' + JA_ROAD_DEATHS, sub: 'DEAD EACH YEAR', accent: '#c0382c' },
  { head: 'SLOW DOWN', sub: 'STAY ALIVE',     accent: '#c0382c' },
  { head: 'SPEED', sub: 'KILLS',              accent: '#1a1a1a' },
  { head: "DON'T DRINK", sub: '& DRIVE',      accent: '#c0382c' },
  { head: 'UNDU YUH', sub: 'SPEED',           accent: '#1f8a3c' },
  { head: 'ARRIVE', sub: 'ALIVE',             accent: '#1f8a3c' },
];

// Deterministic roadside cadence by row index: mostly the stage's own prop, with a
// speed-limit sign or a safety billboard punched in at fixed rows. Callers pass a
// phase-shifted rowIdx for the FAR side of the road so the two verges never mirror.
//   → { kind: 'speed', limit } | { kind: 'billboard', idx } | null  (null = draw the prop)
export function roadsideFeature(rowIdx, limit) {
  const m = ((rowIdx % 12) + 12) % 12;
  if (m === 3 || m === 9) return { kind: 'speed', limit };
  if (m === 6) return { kind: 'billboard', idx: ((rowIdx % SAFETY_MESSAGES.length) + SAFETY_MESSAGES.length) % SAFETY_MESSAGES.length };
  return null;
}

// A standard speed-limit sign: a white roundel with a red ring and a black number on a
// grey post. `limit` is the posted km/h (matches the HUD speedometer's km/h reading).
export function drawSpeedLimit(ctx, x, y, s, limit) {
  const postH = s * 2.2, r = s * 0.62;
  const cy = y - postH - r * 0.4;
  // post
  ctx.fillStyle = '#9a9a9e'; ctx.fillRect(x - s * 0.07, y - postH, s * 0.14, postH);
  ctx.fillStyle = '#76767a'; ctx.fillRect(x + s * 0.0, y - postH, s * 0.07, postH); // shaded edge
  // red ring
  ctx.beginPath(); ctx.arc(x, cy, r, 0, Math.PI * 2); ctx.fillStyle = '#c0241c'; ctx.fill();
  // white field
  ctx.beginPath(); ctx.arc(x, cy, r * 0.72, 0, Math.PI * 2); ctx.fillStyle = '#f4f1ea'; ctx.fill();
  // number
  if (s >= 9) {
    ctx.fillStyle = '#15151a';
    ctx.font = '700 ' + Math.round(r * 0.95) + 'px "Arial", "Helvetica", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(limit), x, cy + r * 0.04);
  }
}

// A roadside safety billboard on two legs carrying one SAFETY_MESSAGES entry. Big text
// when it's close enough to read; degrades to a coloured header bar when tiny/far.
export function drawSafetyBillboard(ctx, x, y, s, idx) {
  const m = SAFETY_MESSAGES[((idx % SAFETY_MESSAGES.length) + SAFETY_MESSAGES.length) % SAFETY_MESSAGES.length];
  const w = s * 2.5, h = s * 1.5;
  const panelBottom = y - s * 1.3, panelTop = panelBottom - h;
  const lx = x - w / 2;
  // two legs
  ctx.fillStyle = '#5a5046';
  ctx.fillRect(x - w * 0.36, panelBottom, s * 0.16, y - panelBottom);
  ctx.fillRect(x + w * 0.30, panelBottom, s * 0.16, y - panelBottom);
  // panel + frame
  ctx.fillStyle = '#f1ece0'; ctx.fillRect(lx, panelTop, w, h);
  ctx.strokeStyle = '#2a2620'; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.strokeRect(lx, panelTop, w, h);
  // accent header strip
  ctx.fillStyle = m.accent; ctx.fillRect(lx, panelTop, w, h * 0.30);
  if (s >= 12) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    // header line (on the accent strip, in white)
    ctx.fillStyle = '#fbf7ee';
    ctx.font = '700 ' + Math.round(h * 0.20) + 'px "Arial", "Helvetica", sans-serif';
    ctx.fillText(m.head, x, panelTop + h * 0.16);
    // sub line (on the pale field, in ink)
    ctx.fillStyle = '#1c1a16';
    ctx.font = '700 ' + Math.round(h * 0.30) + 'px "Arial", "Helvetica", sans-serif';
    ctx.fillText(m.sub, x, panelTop + h * 0.64);
  } else {
    // too small to read — keep just the coloured header so it still reads as a sign
    ctx.fillStyle = m.accent; ctx.fillRect(lx, panelTop + h * 0.42, w, h * 0.2);
  }
}
