export function getPropertyFeasibility({
  strategy = "property",
  housePrice = 0,
  monthlyContribution = 0,
  currentSaved = 0,
  elapsedMonths = 0,
  months = 60,
} = {}) {
  const targetPrice = Number(housePrice) || 0;
  const monthly = Number(monthlyContribution) || 0;
  const saved = Number(currentSaved) || 0;
  const remainingMonths = Math.max(0, months - (Number(elapsedMonths) || 0));
  const projection = Math.max(0, Math.round(saved + monthly * remainingMonths));
  const remaining = Math.max(0, targetPrice - saved);
  const requiredMonthly = targetPrice > 0 ? Math.ceil(remaining / months) : 0;
  const monthlyShortfall = Math.max(0, requiredMonthly - monthly);
  const isReachable = targetPrice > 0 && projection >= targetPrice;

  return {
    active: strategy === "property" && targetPrice > 0,
    isReachable,
    shouldWarn: strategy === "property" && targetPrice > 0 && !isReachable,
    targetPrice,
    projection,
    requiredMonthly,
    monthlyShortfall,
    months,
  };
}
