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
