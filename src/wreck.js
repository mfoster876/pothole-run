export function createCondition(max = 100) {
  return { value: max, max };
}
export function applyDamage(cond, amount) {
  return { ...cond, value: Math.max(0, cond.value - amount) };
}
export function repair(cond, amount) {
  return { ...cond, value: Math.min(cond.max, cond.value + amount) };
}
export function isWrecked(cond) {
  return cond.value <= 0;
}
export function conditionTier(cond) {
  const ratio = cond.value / cond.max;
  if (ratio > 0.6) return 'good';
  if (ratio > 0.3) return 'warn';
  return 'critical';
}
