export function createInput(target, { onSteer, onTap }) {
  // left/right = lane steer (held, auto-repeat); up/down = throttle (held, polled via
  // throttle()). Throttle is keyboard-only (↑/↓ or W/S) — touch keeps the steer-only layout.
  const held = { left: false, right: false, up: false, down: false };
  let repeatTimer = 0;
  const REPEAT = 0.18;

  function press(side) {
    if (side === 'left' && !held.left) { held.left = true; onSteer(-1); repeatTimer = REPEAT; }
    if (side === 'right' && !held.right) { held.right = true; onSteer(+1); repeatTimer = REPEAT; }
  }
  function release(side) { held[side] = false; }
  // Which lane-steer a touch implies — or null for the top strip, which is reserved for
  // the on-screen pause button (so tapping ❚❚ never also slings the cart sideways).
  function steerSide(clientX, clientY) {
    if (clientY < window.innerHeight * 0.12) return null;
    return clientX < window.innerWidth / 2 ? 'left' : 'right';
  }

  target.addEventListener('touchstart', (e) => {
    onTap && onTap();
    for (const t of e.changedTouches) press(steerSide(t.clientX, t.clientY));
    e.preventDefault();
  }, { passive: false });
  target.addEventListener('touchend', (e) => {
    held.left = held.right = false;
    for (const t of e.touches) { const s = steerSide(t.clientX, t.clientY); if (s) held[s] = true; }
    repeatTimer = REPEAT; // don't fire an immediate step from a freshly-implied hold
    e.preventDefault();
  }, { passive: false });
  target.addEventListener('mousedown', (e) => { onTap && onTap(); press(steerSide(e.clientX, e.clientY)); });
  window.addEventListener('mouseup', () => { release('left'); release('right'); });
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') { onTap && onTap(); press('left'); }
    if (e.key === 'ArrowRight' || e.key === 'd') { onTap && onTap(); press('right'); }
    if (e.key === 'ArrowUp' || e.key === 'w') { onTap && onTap(); held.up = true; }
    if (e.key === 'ArrowDown' || e.key === 's') { onTap && onTap(); held.down = true; }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') release('left');
    if (e.key === 'ArrowRight' || e.key === 'd') release('right');
    if (e.key === 'ArrowUp' || e.key === 'w') held.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') held.down = false;
  });

  return {
    update(dt) {
      if (held.left || held.right) {
        repeatTimer -= dt;
        if (repeatTimer <= 0) { onSteer(held.left ? -1 : +1); repeatTimer = REPEAT; }
      }
    },
    // Current throttle from the held accelerate/brake keys: +1 accelerate, −1 brake, 0 coast.
    throttle() { return (held.up ? 1 : 0) - (held.down ? 1 : 0); }
  };
}
