import { VIRTUAL, MAX_DPR } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d', { alpha: false });

export const viewport = { width: VIRTUAL.width, height: VIRTUAL.height, scale: 1 };

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const cssW = window.innerWidth, cssH = window.innerHeight;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  viewport.scale = Math.min(canvas.width / VIRTUAL.width, canvas.height / VIRTUAL.height);
  viewport.width = canvas.width;
  viewport.height = canvas.height;
}
window.addEventListener('resize', resize);
resize();

let updateFn = (dt) => {};
let renderFn = (ctx) => {
  ctx.fillStyle = '#0e1a12';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
export function setUpdate(fn) { updateFn = fn; }
export function setRender(fn) { renderFn = fn; }

const STEP = 1 / 60;
let last = 0, acc = 0;
function frame(now) {
  if (!last) last = now;
  acc += Math.min(0.25, (now - last) / 1000);
  last = now;
  while (acc >= STEP) { updateFn(STEP); acc -= STEP; }
  renderFn(ctx);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

import { createGame } from './game.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';

const audio = createAudio();
const game = createGame(audio);

// Play-mode steering (hold-repeat lane slides). Acts only while playing.
const input = createInput(canvas, { onSteer: (d) => game.onSteer(d), onTap: () => audio.unlock() });

// Convert a client point into virtual stage coords (uniform 16:9 letterbox).
function toVirtual(clientX, clientY) {
  return { x: clientX / window.innerWidth * VIRTUAL.width, y: clientY / window.innerHeight * VIRTUAL.height };
}
function handlePoint(clientX, clientY) {
  audio.unlock();
  const p = toVirtual(clientX, clientY);
  game.menuPoint(p.x, p.y);
}
canvas.addEventListener('pointerdown', (e) => handlePoint(e.clientX, e.clientY));
window.addEventListener('keydown', (e) => {
  if (e.key === 'm' || e.key === 'M') { game.toggleMute(); return; }
  game.menuKey(e.key);
});

setUpdate((dt) => { input.update(dt); game.update(dt); });
setRender((c) => {
  c.setTransform(viewport.scale, 0, 0, viewport.scale, 0, 0);
  game.render(c);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
