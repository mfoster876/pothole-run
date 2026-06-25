// Portrait-mode rotate prompt. Shown when innerHeight > innerWidth.
// Cycles three patois lines every 2.5s with a rotate icon.
// The canvas is drawn in physical pixels here (no virtual-coord scaling needed —
// this overlay always fills the real screen).

const LINES = [
  'Tun yuh phone sideway',
  'Set yuh phone good, like so',
  'A nuh suh yuh fi hol yuh phone'
];
const CYCLE_MS = 2500;

export function renderRotatePrompt(ctx, canvasW, canvasH, now) {
  const idx = Math.floor(now / CYCLE_MS) % LINES.length;

  // Dark translucent overlay
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // raw pixel coords
  ctx.fillStyle = 'rgba(10, 22, 14, 0.94)';
  ctx.fillRect(0, 0, canvasW, canvasH);

  const cx = canvasW / 2, cy = canvasH / 2;
  const icoR = Math.min(canvasW, canvasH) * 0.12;

  // Rotate-phone icon: two concentric quarter-arcs suggesting rotation
  ctx.strokeStyle = '#f0c020';
  ctx.lineWidth = Math.max(3, icoR * 0.14);
  ctx.lineCap = 'round';

  // Outer arc (top of the icon)
  ctx.beginPath();
  ctx.arc(cx, cy - icoR * 0.4, icoR, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  // Arrow head at the arc end
  const ax = cx + Math.cos(Math.PI * 1.9) * icoR;
  const ay = (cy - icoR * 0.4) + Math.sin(Math.PI * 1.9) * icoR;
  ctx.beginPath();
  ctx.moveTo(ax - icoR * 0.18, ay - icoR * 0.1);
  ctx.lineTo(ax, ay);
  ctx.lineTo(ax + icoR * 0.1, ay + icoR * 0.2);
  ctx.stroke();

  // Phone outline (portrait rectangle being rotated)
  const ph = icoR * 0.9, pw = icoR * 0.5;
  ctx.strokeStyle = '#cbe7cf';
  ctx.lineWidth = Math.max(2, icoR * 0.1);
  ctx.beginPath();
  ctx.roundRect(cx - pw / 2, cy - icoR * 0.4 - ph / 2, pw, ph, icoR * 0.08);
  ctx.stroke();
  // Home button dot on the phone
  ctx.beginPath();
  ctx.arc(cx, cy - icoR * 0.4 + ph / 2 - icoR * 0.12, icoR * 0.06, 0, Math.PI * 2);
  ctx.fillStyle = '#cbe7cf'; ctx.fill();

  // Patois message — cycles every 2.5s
  const fSize = Math.max(14, Math.min(canvasW * 0.048, 32));
  ctx.font = '700 ' + fSize + 'px "Courier New", monospace';
  ctx.fillStyle = '#f4f1e6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(LINES[idx], cx, cy + icoR * 1.1);

  // Subtle cycling dots below text
  const dotY = cy + icoR * 1.6;
  for (let i = 0; i < LINES.length; i++) {
    ctx.beginPath();
    ctx.arc(cx + (i - 1) * icoR * 0.35, dotY, Math.max(2, icoR * 0.07), 0, Math.PI * 2);
    ctx.fillStyle = i === idx ? '#f0c020' : 'rgba(200,210,200,0.35)';
    ctx.fill();
  }

  ctx.restore();
}
