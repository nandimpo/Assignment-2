export function getCompletedLogMonths(log = []) {
  return log.filter(entry => !entry?.missed && entry?.status !== "missed").length;
}

export function projectLinearFixedWindow({
  monthly = 0,
  currentSaved = 0,
  elapsedMonths = 0,
  totalMonths = 60,
} = {}) {
  const remainingMonths = Math.max(0, totalMonths - elapsedMonths);
  return Math.round((Number(currentSaved) || 0) + (Number(monthly) || 0) * remainingMonths);
}

export function projectCompoundFixedWindow({
  monthly = 0,
  currentSaved = 0,
  elapsedMonths = 0,
  totalMonths = 60,
  annualRate = 0.1,
} = {}) {
  const months = Math.max(0, totalMonths - elapsedMonths);
  const r = annualRate / 12;
  if (months === 0) return Math.round(Number(currentSaved) || 0);
  const futureContributions = r > 0
    ? (Number(monthly) || 0) * ((Math.pow(1 + r, months) - 1) / r)
    : (Number(monthly) || 0) * months;
  return Math.round((Number(currentSaved) || 0) + futureContributions);
}
