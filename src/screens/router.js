// src/screens/router.js
// Tiny state machine: one named screen is "current" at a time.
export function createRouter(initial = 'hub') {
  let current = initial;
  return {
    get current() { return current; },
    go(name) { current = name; },
    isHub() { return current === 'hub'; }
  };
}
