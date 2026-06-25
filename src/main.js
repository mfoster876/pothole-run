import { VIRTUAL, MAX_DPR } from './constants.js';
import { renderRotatePrompt } from './screens/rotatePrompt.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

// Letterbox state: how the 960×540 virtual stage maps to the physical canvas.
export const viewport = {
  width: VIRTUAL.width,
  height: VIRTUAL.height,
  scale: 1,
  // Offset in physical pixels from the canvas top-left to the virtual stage origin.
  offsetX: 0,
  offsetY: 0
};

// Letterbox bar colors — filled behind the virtual stage on wide/tall screens.
// Defaults: a neutral sky and ground that read better than solid black.
let lbSky    = '#a7bcae';
let lbGround = '#27592c';

/** Called by the game controller to match bars to the current stage palette. */
export function setLetterboxColors(sky, ground) {
  lbSky    = sky;
  lbGround = ground;
}

// Device-pixel-ratio cap. The "Fast" graphics preference drops this to 1 — rendering at
// 1× instead of 2× quarters the pixels pushed each frame, the single biggest frame-rate win.
let dprCap = MAX_DPR;
export function setDprCap(cap) { dprCap = Math.max(1, cap || MAX_DPR); resize(); }

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const vv = window.visualViewport;
  // Guard against a transient 0 from visualViewport (?? wouldn't catch 0) so the
  // canvas never collapses to nothing on a flaky Android URL-bar resize.
  const cssH = Math.round((vv && vv.height) || window.innerHeight);
  const cssW = Math.round((vv && vv.width)  || window.innerWidth);
  canvas.width  = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';

  // Contain-fit: scale to fit entirely within the viewport (letterbox).
  const scaleX = canvas.width  / VIRTUAL.width;
  const scaleY = canvas.height / VIRTUAL.height;
  viewport.scale   = Math.min(scaleX, scaleY);

  // Centre the virtual stage inside the physical canvas (letterbox bars).
  viewport.offsetX = Math.floor((canvas.width  - VIRTUAL.width  * viewport.scale) / 2);
  viewport.offsetY = Math.floor((canvas.height - VIRTUAL.height * viewport.scale) / 2);

  // Expose physical canvas size (for the rotate prompt overlay).
  viewport.width  = canvas.width;
  viewport.height = canvas.height;
}
window.addEventListener('resize', resize);
window.visualViewport?.addEventListener('resize', resize);
resize();

let updateFn = (dt) => {};
let renderFn = (ctx) => {
  ctx.fillStyle = '#0e1a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
export function setUpdate(fn) { updateFn = fn; }
export function setRender(fn) { renderFn = fn; }

// Portrait detection — true when phone is held upright.
function isPortrait() { return window.innerHeight > window.innerWidth; }

// Game-pause flag: while portrait, the update loop does not advance.
let paused = false;

const STEP = 1 / 60;
let last = 0, acc = 0, startTime = performance.now();
function frame(now) {
  if (!last) last = now;
  const portrait = isPortrait();
  paused = portrait;
  if (!paused) {
    acc += Math.min(0.25, (now - last) / 1000);
    while (acc >= STEP) { updateFn(STEP); acc -= STEP; }
  }
  last = now;

  // Fill letterbox bars with sky (top half) and ground (bottom half) instead of
  // solid black, so wide-phone pillarbox bars and tall-phone letterbox bars read
  // as a natural extension of the stage rather than a black border.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const midY = Math.floor(canvas.height / 2);
  ctx.fillStyle = lbSky;
  ctx.fillRect(0, 0, canvas.width, midY);
  ctx.fillStyle = lbGround;
  ctx.fillRect(0, midY, canvas.width, canvas.height - midY);

  // Render the game into the centred virtual-stage region.
  ctx.setTransform(viewport.scale, 0, 0, viewport.scale, viewport.offsetX, viewport.offsetY);
  renderFn(ctx);

  // Portrait overlay drawn on top in raw physical pixels.
  if (portrait) {
    renderRotatePrompt(ctx, canvas.width, canvas.height, now - startTime);
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

import { createGame } from './game.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { addTracks } from './usermusic.js';

const audio = createAudio();
const game  = createGame(audio);

// Player's own soundtracks: store picked audio files locally, then refresh the count.
const musicInput = document.getElementById('music-upload');
if (musicInput) {
  musicInput.addEventListener('change', async (e) => {
    const files = e.target.files;
    if (files && files.length) { await addTracks(files); game.refreshMusicCount(); }
    e.target.value = '';   // let the player re-pick the same file later
  });
}

// Play-mode steering (hold-repeat lane slides). Acts only while playing.
const input = createInput(canvas, { onSteer: (d) => game.onSteer(d), onTap: () => audio.unlock() });

// Convert a client point into virtual stage coords, accounting for letterbox offset.
function toVirtual(clientX, clientY) {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  // Physical pixel position within the canvas
  const px = clientX * dpr - viewport.offsetX;
  const py = clientY * dpr - viewport.offsetY;
  return {
    x: px / viewport.scale,
    y: py / viewport.scale
  };
}
function handlePoint(clientX, clientY) {
  if (paused) return;   // ignore taps while portrait overlay is showing
  audio.unlock();
  const p = toVirtual(clientX, clientY);
  game.menuPoint(p.x, p.y);
}
canvas.addEventListener('pointerdown', (e) => handlePoint(e.clientX, e.clientY));
window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') { game.toggleMute(); return; }
  game.menuKey(e.key);
});

setUpdate((dt) => { input.update(dt); game.setThrottle(input.throttle()); game.update(dt); });
setRender((c) => {
  // The setTransform is already applied by the frame loop; just render the game.
  game.render(c);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
