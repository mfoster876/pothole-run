// src/screens/help.js
// In-game HELP / HOW TO PLAY screen — paged, 4 pages, patois-flavoured.
// Contract: render(ctx, { save, W, H })  |  hit(x, y, { W, H }) → 'back'|'next'|'prev'|null
// Module owns page state; caller resets via resetHelp() when opening this screen.

let page = 0;
const TOTAL_PAGES = 4;

export function resetHelp() { page = 0; }

// ─── button rects (lazy, W/H-relative) ───────────────────────────────────────

function rects(W, H) {
  return {
    back: { x: 24,            y: 18,              w: 96,  h: 36 },
    prev: { x: W * 0.12,      y: H * 0.895 - 22,  w: 110, h: 40 },
    next: { x: W - W * 0.12 - 110, y: H * 0.895 - 22, w: 110, h: 40 }
  };
}

function inRect(r, x, y) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }

// ─── generic button painter ───────────────────────────────────────────────────

function btn(ctx, r, label, opts = {}) {
  ctx.fillStyle = opts.fill || 'rgba(244,241,230,0.10)';
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = opts.stroke || '#cbe7cf'; ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.fillStyle = opts.text || '#f4f1e6';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = opts.font || '700 20px "Courier New", monospace';
  ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2);
}

// ─── page content ─────────────────────────────────────────────────────────────
// Each page: { title: string, sections: Array<{ head?: string, lines: string[] }> }
// Lines are pre-wrapped to ≈ 86% of a ~390px canvas (≈ 335px at 14px mono ≈ 38 chars).
// Adjust manually for wider screens — renderer uses lineHeight not pixel wrap.

const PAGES = [
  {
    title: 'CONTROLS & GOAL',
    sections: [
      {
        head: 'HOW YUH STEER',
        lines: [
          'Tap or hold the LEFT side of the screen to',
          'slide left; tap or hold the RIGHT side to slide',
          'right. On desktop, use the ARROW KEYS.',
          '',
          'Yuh can ride onto the soft SHOULDER — no',
          'hazards out there, but it\'s bumpy and slowly',
          'drains yuh cart condition while yuh on it.'
        ]
      },
      {
        head: 'THE GOAL',
        lines: [
          'Dodge di craters, survive as long as possible,',
          'and bank as much money as yuh can before di',
          'cart mash up.',
          '',
          'Yuh CART meter (top-right) drops when yuh lick',
          'a hazard. Reach zero and it\'s done. Condition',
          'carries over between runs — but yuh always',
          'start with at least 40% so yuh can roll out.'
        ]
      }
    ]
  },
  {
    title: 'DI ROAD (HAZARDS)',
    sections: [
      {
        head: 'GROUND HAZARDS',
        lines: [
          'CRATERS / POTHOLES — marl-white holes; avoid.',
          'OPEN MANHOLES — stolen covers mean instant',
          '  wreck. Do NOT drive into one.',
          'SLEEPING POLICEMEN — speed bumps bounce yuh',
          '  into a HOP over whatever\'s ahead. But land',
          '  on top of one and it still hurts bad.'
        ]
      },
      {
        head: 'TRAFFIC & ANIMALS',
        lines: [
          'Route taxis, JUTC buses, and coaster buses',
          'barrel down di road — plus di GUST of wind',
          'dem leave behind can push yuh off line.',
          'Goats, cattle, street dogs, and jaywalkers',
          'appear on country roads. Give dem space.',
          'Vendor stalls push out from di roadside.'
        ]
      },
      {
        head: 'WINDSCREEN YOUTHS',
        lines: [
          'Only appear when yuh drive a CAR. Dem rush',
          'yuh at red lights and cost yuh coins if yuh',
          'don\'t dodge dem in time.'
        ]
      }
    ]
  },
  {
    title: 'POWER-UPS',
    sections: [
      {
        head: 'WATER — SUPERCHARGE',
        lines: [
          'Full invincibility + speed burst + a money',
          'flood, glowing frame + countdown timer.',
          'Di most powerful power-up on di road.'
        ]
      },
      {
        head: 'HARDWARE TOOLS',
        lines: [
          'Repairs yuh cart and steadies it. Good when',
          'yuh condition getting low mid-run.'
        ]
      },
      {
        head: 'BLUE MOUNTAIN COFFEE',
        lines: [
          'Ultra-rare jackpot: smooth road opens up and',
          '$5000 bills rain down. Bless up.'
        ]
      },
      {
        head: 'DRINKS (PER DRIVER)',
        lines: [
          'Ting / Boom sodas give everyone a clean boost.',
          'The CONDUCTOR can drink Red Stripe & White Rum.',
          'The RASTA also drinks Spirulina & Roots Tonic.',
          'Strong alcohol boosts yuh first — but then yuh',
          'steer gets sloppy. Watch for di TIPSY warning.'
        ]
      }
    ]
  },
  {
    title: 'MONEY, RANK & FAITH',
    sections: [
      {
        head: 'MONEY & RANK',
        lines: [
          'Every dollar yuh ever bank lifts yuh RANK —',
          'from Cart Bwoy all di way up to Don Dadda.',
          'Yuh WALLET is spendable: use it for repairs,',
          'RIG upgrades, new vehicles, Cash Pot, or',
          'Aspirations. Near-misses build a COMBO that',
          'multiplies yuh earnings; a hit resets it.'
        ]
      },
      {
        head: 'ASPIRATIONS',
        lines: [
          'Buy an Aspiration for a bittersweet ending —',
          'yuh "way out" from di road. Choose wisely.'
        ]
      },
      {
        head: 'FAITH & BLESSINGS',
        lines: [
          'Pray, read yuh Bible, and tithe to earn a',
          'BLESSING: less injury when yuh lick something',
          'and longer invincibility on power-ups. But',
          'blessings fade if yuh neglect dem. Keep di',
          'faith and di road treats yuh a likkle easier.',
          '',
          'No matter how fast it gets — there is always',
          'a way through... if yuh skilled enough.'
        ]
      }
    ]
  }
];

// ─── body-text helper ─────────────────────────────────────────────────────────

function drawLines(ctx, lines, startX, startY, lineH, color, font) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let y = startY;
  for (const line of lines) {
    if (line === '') { y += lineH * 0.55; continue; }
    ctx.fillText(line, startX, y);
    y += lineH;
  }
  return y;
}

// ─── render ───────────────────────────────────────────────────────────────────

export function render(ctx, { save, W, H }) {
  ctx.fillStyle = '#0e1a12'; ctx.fillRect(0, 0, W, H);

  const R = rects(W, H);
  const pg = PAGES[page];

  // Page title
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f0c020';
  ctx.font = '700 28px "Courier New", monospace';
  ctx.fillText(pg.title, W / 2, H * 0.085);

  // Divider line under title
  ctx.strokeStyle = '#3fae54'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W * 0.07, H * 0.115);
  ctx.lineTo(W * 0.93, H * 0.115);
  ctx.stroke();

  // Page n / N indicator
  ctx.fillStyle = '#5a7a5e';
  ctx.font = '500 12px "Courier New", monospace';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillText('PAGE ' + (page + 1) + ' / ' + TOTAL_PAGES, W * 0.93, H * 0.085);

  // Content — sections
  const bodyX   = W * 0.07;
  const bodyFont = '500 13px "Courier New", monospace';
  const headFont = '700 14px "Courier New", monospace';
  const lineH    = 20;
  const sectionGap = 14;

  let y = H * 0.135;

  for (const sec of pg.sections) {
    if (sec.head) {
      ctx.fillStyle = '#9fb8a3';
      ctx.font = headFont;
      ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(sec.head, bodyX, y);
      y += 19;
    }
    y = drawLines(ctx, sec.lines, bodyX, y, lineH, '#f4f1e6', bodyFont);
    y += sectionGap;
  }

  // ── Navigation buttons ────────────────────────────────────────────────────
  // BACK (top-left, always)
  btn(ctx, R.back, '‹ BACK', {
    font:   '700 16px "Courier New", monospace',
    stroke: '#9fb8a3',
    text:   '#9fb8a3'
  });

  // PREV (hidden on first page)
  if (page > 0) {
    btn(ctx, R.prev, '‹ PREV', {
      font:   '700 18px "Courier New", monospace',
      stroke: '#cbe7cf',
      text:   '#f4f1e6'
    });
  }

  // NEXT (hidden on last page)
  if (page < TOTAL_PAGES - 1) {
    btn(ctx, R.next, 'NEXT ›', {
      font:   '700 18px "Courier New", monospace',
      stroke: '#f0c020',
      text:   '#f0c020'
    });
  }
}

// ─── hit ─────────────────────────────────────────────────────────────────────

export function hit(x, y, { W, H }) {
  const R = rects(W, H);
  if (inRect(R.back, x, y)) return 'back';
  if (page > 0              && inRect(R.prev, x, y)) { page--; return 'prev'; }
  if (page < TOTAL_PAGES - 1 && inRect(R.next, x, y)) { page++; return 'next'; }
  return null;
}
