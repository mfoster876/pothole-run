// src/signs.js — roadside road-safety signage: speed-limit roundels and safety
// billboards carrying Jamaica's road-fatality message. This is the game's whole point
// made literal at the edge of the road: the joyride ends in a wreck, so slow down.
//
// GROUND-TRUTH (The Gleaner, current to June 2026): Jamaica recorded 373 road deaths in
// 2025 (jamaica-gleaner.com, "Risky roads", 12 Jan 2026), and 2026 is running ~29% lower —
// 103 dead by 21 May 2026 ("Road death toll passes 100…", 21 May 2026). Speeding is a top
// cause and motorcyclists/young riders are the most at risk — directly on-message for a
// youth reckless-driving safety sim. JA_ROAD_DEATHS/JA_DEATHS_YEAR are the single source
// of truth for the headline figure; update them here and every billboard follows.
export const JA_ROAD_DEATHS = 373;
export const JA_DEATHS_YEAR = 2025;

// Short, fact-grounded road-safety lines (NRSC "Arrive Alive" register). Kept measured for
// a teaching tool — the toll is real, but so is the message that it can be changed (2026 is
// trending down). All shown on GREEN billboards with white text (see drawSafetyBillboard).
export const SAFETY_MESSAGES = [
  { head: String(JA_ROAD_DEATHS) + ' KILLED', sub: 'ON OUR ROADS IN ' + JA_DEATHS_YEAR },
  { head: 'SPEEDING', sub: 'KILLS' },
  { head: 'ARRIVE', sub: 'ALIVE' },
  { head: 'SLOW DOWN', sub: 'REACH HOME SAFE' },
  { head: "DON'T DRINK", sub: '& DRIVE' },
  { head: 'ROAD DEATHS', sub: 'DOWN IN 2026 — KEEP IT' },
];

// Deterministic roadside cadence by row index — kept SPARSE so signs don't crowd the drive:
// roughly one feature every ~18 rows per side, mostly the stage's own prop. Callers pass a
// phase-shifted rowIdx for the FAR side so the two verges never mirror.
//   → { kind: 'speed', limit } | { kind: 'billboard', idx } | null  (null = draw the prop)
export function roadsideFeature(rowIdx, limit) {
  const m = ((rowIdx % 18) + 18) % 18;
  if (m === 5) return { kind: 'speed', limit };
  if (m === 13) return { kind: 'billboard', idx: ((rowIdx % SAFETY_MESSAGES.length) + SAFETY_MESSAGES.length) % SAFETY_MESSAGES.length };
  return null;
}

// Set ctx.font to the largest bold size (≤ startPx) at which `text` fits within maxW, so
// a billboard line never overruns its panel at any draw distance. Falls back gracefully
// where measureText is unavailable (returns startPx).
function fitFont(ctx, text, maxW, startPx) {
  let size = startPx;
  for (; size > 5; size -= 1) {
    ctx.font = '700 ' + Math.round(size) + 'px "Arial", "Helvetica", sans-serif';
    const m = ctx.measureText ? ctx.measureText(text) : null;
    if (!m || !(m.width > maxW)) break;
  }
  return size;
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

// A roadside safety billboard on two legs carrying one SAFETY_MESSAGES entry. Jamaican
// road-safety billboards are GREEN (the NRSC house colour) with white text — so these are
// a green board, a darker green header strip, and a white reflective frame. Big text when
// close enough to read; degrades to a plain green board when tiny/far.
const GREEN = '#1f8a3c', GREEN_DK = '#15662c', WHITE = '#f4f7f0';
export function drawSafetyBillboard(ctx, x, y, s, idx) {
  const m = SAFETY_MESSAGES[((idx % SAFETY_MESSAGES.length) + SAFETY_MESSAGES.length) % SAFETY_MESSAGES.length];
  const w = s * 2.5, h = s * 1.5;
  const panelBottom = y - s * 1.3, panelTop = panelBottom - h;
  const lx = x - w / 2;
  // two legs
  ctx.fillStyle = '#5a5046';
  ctx.fillRect(x - w * 0.36, panelBottom, s * 0.16, y - panelBottom);
  ctx.fillRect(x + w * 0.30, panelBottom, s * 0.16, y - panelBottom);
  // green panel + white reflective frame
  ctx.fillStyle = GREEN; ctx.fillRect(lx, panelTop, w, h);
  ctx.strokeStyle = WHITE; ctx.lineWidth = Math.max(1.5, s * 0.05); ctx.strokeRect(lx, panelTop, w, h);
  // darker-green header strip
  ctx.fillStyle = GREEN_DK; ctx.fillRect(lx, panelTop, w, h * 0.30);
  if (s >= 16) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const maxTextW = w * 0.9;
    // header line (on the header strip) — white, fitted so it never overruns the panel
    ctx.fillStyle = WHITE;
    fitFont(ctx, m.head, maxTextW, h * 0.20);
    ctx.fillText(m.head, x, panelTop + h * 0.16);
    // sub line (on the green field) — white, also width-fitted
    fitFont(ctx, m.sub, maxTextW, h * 0.30);
    ctx.fillText(m.sub, x, panelTop + h * 0.64);
  } else {
    // too small to read — a plain green board still reads as a roadside sign
  }
}
