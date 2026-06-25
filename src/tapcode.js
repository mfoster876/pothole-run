// Pure reducer for the title-screen corner tap secret code.
// A player taps the four corners of the hub screen in sequence to unlock
// the gold handcart skin. This module has no side effects.

// The secret sequence: Top-Left, Top-Left, Top-Right, Bottom-Left, Bottom-Right.
export const CODE = ['TL', 'TL', 'TR', 'BL', 'BR'];

// Returns a fresh, zeroed state object.
export function emptyState() {
  return { progress: 0 };
}

// Feed one corner token into the reducer.
// Returns { state, matched } where:
//   state   — new progress state
//   matched — true if this tap just completed the full CODE sequence
export function feedTap(state, token) {
  const next = state.progress + 1;
  if (token === CODE[state.progress]) {
    // Correct next token in the sequence
    if (next === CODE.length) {
      // Sequence complete
      return { state: emptyState(), matched: true };
    }
    return { state: { progress: next }, matched: false };
  }
  // Wrong token — reset, but if the wrong token equals CODE[0] start at 1
  if (token === CODE[0]) {
    return { state: { progress: 1 }, matched: false };
  }
  return { state: emptyState(), matched: false };
}
