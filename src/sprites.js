// Draw an entity centred at (sx, sy) with base pixel size `size` (from the road
// projection). Procedural shapes keep Phase 1 asset-free; sprite atlases can
// replace these per type later.
export function drawEntity(ctx, type, sx, sy, size) {
  const s = Math.max(6, size);
  switch (type) {
    case 'coin': disc(ctx, sx, sy, s * 0.5, '#f0c020', '#9a7a10'); break;
    case 'pothole': ellipse(ctx, sx, sy, s * 0.8, s * 0.34, '#1c1c1c'); break;
    case 'manhole': ellipse(ctx, sx, sy, s * 0.7, s * 0.3, '#000000'); break;
    case 'slick': ellipse(ctx, sx, sy, s * 0.9, s * 0.3, 'rgba(70,90,140,0.6)'); break;
    case 'bump': roundedBar(ctx, sx, sy, s * 1.4, s * 0.3, '#8a8a8a'); break;
    case 'goat': blob(ctx, sx, sy, s * 0.6, '#d8c7b0', '#6b5a3a'); break;
    case 'taxi': vehicle(ctx, sx, sy, s, '#c0382c'); break;
    case 'bus': vehicle(ctx, sx, sy, s * 1.2, '#e7c84a'); break;
    case 'hustler': person(ctx, sx, sy, s, '#d06a30'); break;
    case 'stall': roundedBar(ctx, sx, sy, s * 1.2, s * 0.8, '#7a4a22'); break;
    default: ellipse(ctx, sx, sy, s * 0.8, s * 0.34, '#1c1c1c');
  }
}
function disc(ctx, x, y, r, fill, stroke) {
  ctx.beginPath(); ctx.arc(x, y - r, r, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = Math.max(2, r * 0.2);
  ctx.strokeStyle = stroke; ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = fill; ctx.fill();
}
function roundedBar(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill; ctx.fillRect(x - w / 2, y - h, w, h);
}
function blob(ctx, x, y, r, body, leg) {
  ctx.fillStyle = leg; ctx.fillRect(x - r * 0.5, y - r * 0.5, r, r * 0.6);
  ctx.beginPath(); ctx.ellipse(x, y - r * 0.6, r, r * 0.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = body; ctx.fill();
}
function vehicle(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.fillRect(x - s * 0.55, y - s * 0.9, s * 1.1, s * 0.9);
  ctx.fillStyle = '#1c1c1c'; ctx.fillRect(x - s * 0.55, y - s * 0.2, s * 1.1, s * 0.2);
  ctx.fillStyle = '#bfe0ff'; ctx.fillRect(x - s * 0.4, y - s * 0.8, s * 0.8, s * 0.3);
}
function person(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.fillRect(x - s * 0.2, y - s, s * 0.4, s * 0.8);
  ctx.beginPath(); ctx.arc(x, y - s, s * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = '#6b4a2a'; ctx.fill();
}
