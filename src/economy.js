// src/economy.js
// Two counters: lifetimeEarned is a monotonic odometer (drives ranks); wallet is
// spendable. A completed run always banks at least MIN_EARN so a wreck still inches
// you forward — no hard soft-lock.
export const MIN_EARN = 250;

export function bankRun(save, runCoins) {
  const earned = Math.max(runCoins, MIN_EARN);
  save.lifetimeEarned += earned;
  save.wallet += earned;
  return earned;
}
export function canAfford(save, price) {
  return save.wallet >= price;
}
export function spend(save, price) {
  if (save.wallet < price) return false;
  save.wallet -= price;
  return true;
}
