export function laneOverlap(playerX, playerHalf, entityX, entityHalf) {
  return Math.abs(playerX - entityX) < (playerHalf + entityHalf);
}
export function inHitZone(z, depth) {
  return z <= 0 && z > -depth;
}
export function isHit(player, entity) {
  return inHitZone(entity.z, entity.depth)
    && laneOverlap(player.x, player.halfWidth, entity.x, entity.halfWidth);
}
