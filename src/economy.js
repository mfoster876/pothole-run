// src/economy.js
// Two counters: lifetimeEarned is a monotonic odometer (drives ranks); wallet is
// spendable. A PROFITABLE run banks at least MIN_EARN so a wreck still inches you
// forward. But a run can end in the RED — heavy fines/repairs beyond your earnings push
// the wallet DOWN, even negative (debt). The odometer/rank never decreases.
export const MIN_EARN = 250;

export function bankRun(save, runCoins) {
  // A net-positive run floors at MIN_EARN; a net-negative run banks the actual loss.
  const earned = runCoins >= 0 ? Math.max(runCoins, MIN_EARN) : runCoins;
  save.lifetimeEarned += Math.max(0, earned);  // rank odometer only ever climbs
  save.wallet += earned;                        // wallet CAN go negative — that's debt
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
