// src/coords.js — pure client→virtual-stage coordinate mapping, isolated so it's unit-testable.
//
// Maps a pointer's client (CSS) coordinates into the 960×540 virtual stage using the
// canvas element's ACTUAL rendered rect and pixel size. Deriving the scale from the real
// rect (instead of assuming a devicePixelRatio) makes hit-testing correct regardless of
// the Fast-graphics DPR cap, a Retina display, or Safari page zoom — the cause of clicks
// landing in the wrong place.
export function clientToVirtual(clientX, clientY, rect, canvasW, canvasH, viewport) {
  // Fraction across the rendered element → physical canvas pixels.
  const px = rect.width  ? (clientX - rect.left) / rect.width  * canvasW : 0;
  const py = rect.height ? (clientY - rect.top)  / rect.height * canvasH : 0;
  // Physical pixels → virtual stage (undo the letterbox offset + fit scale).
  const scale = viewport.scale || 1;
  return {
    x: (px - viewport.offsetX) / scale,
    y: (py - viewport.offsetY) / scale,
  };
}
