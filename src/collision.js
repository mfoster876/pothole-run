// Lane overlap test. The actual hit timing lives in run.js (crossing-based: an
// entity connects the frame its z crosses the cart plane). This is the only shared
// collision primitive.
export function laneOverlap(playerX, playerHalf, entityX, entityHalf) {
  return Math.abs(playerX - entityX) < (playerHalf + entityHalf);
}
