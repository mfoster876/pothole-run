export function createInput(target, { onSteer, onTap }) {
  const held = { left: false, right: false };
  let repeatTimer = 0;
  const REPEAT = 0.18;

  function press(side) {
    if (side === 'left' && !held.left) { held.left = true; onSteer(-1); repeatTimer = REPEAT; }
    if (side === 'right' && !held.right) { held.right = true; onSteer(+1); repeatTimer = REPEAT; }
  }
  function release(side) { held[side] = false; }
  function sideFromX(clientX) { return clientX < window.innerWidth / 2 ? 'left' : 'right'; }

  target.addEventListener('touchstart', (e) => {
    onTap && onTap();
    for (const t of e.changedTouches) press(sideFromX(t.clientX));
    e.preventDefault();
  }, { passive: false });
  target.addEventListener('touchend', (e) => {
    held.left = held.right = false;
    for (const t of e.touches) held[sideFromX(t.clientX)] = true;
    e.preventDefault();
  }, { passive: false });
  target.addEventListener('mousedown', (e) => { onTap && onTap(); press(sideFromX(e.clientX)); });
  window.addEventListener('mouseup', () => { release('left'); release('right'); });
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.key === 'ArrowLeft' || e.key === 'a') { onTap && onTap(); press('left'); }
    if (e.key === 'ArrowRight' || e.key === 'd') { onTap && onTap(); press('right'); }
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') release('left');
    if (e.key === 'ArrowRight' || e.key === 'd') release('right');
  });

  return {
    update(dt) {
      if (held.left || held.right) {
        repeatTimer -= dt;
        if (repeatTimer <= 0) { onSteer(held.left ? -1 : +1); repeatTimer = REPEAT; }
      }
    }
  };
}
