export function getCompletedLogMonths(log = []) {
  return log.filter(entry => !entry?.missed && entry?.status !== "missed").length;
}

export function getLogPaidTotal(log = []) {
  return log
    .filter(entry => !entry?.missed && entry?.status !== "missed")
    .reduce((sum, entry) => sum + (Number(entry?.amount) || 0), 0);
}

export function getCatchupDebtRemaining(user = {}) {
  const totalDebt = Number(user?.debt || user?.goalAmount) || 0;
  const paid = getLogPaidTotal(user?.catchupLog || []);
  return Math.max(0, totalDebt - paid);
}

export function projectLinearFixedWindow({
  monthly = 0,
  currentSaved = 0,
  elapsedMonths = 0,
  totalMonths = 60,
} = {}) {
  const monthlyAmount = Number(monthly) || 0;
  const savedAmount = Number(currentSaved) || 0;
  const expectedLogged = monthlyAmount * Math.max(0, Number(elapsedMonths) || 0);
  const actualVariance = savedAmount - expectedLogged;
  return Math.round((monthlyAmount * totalMonths) + actualVariance);
}

export function projectCompoundFixedWindow({
  monthly = 0,
  currentSaved = 0,
  elapsedMonths = 0,
  totalMonths = 60,
  annualRate = 0.1,
} = {}) {
  const months = Math.max(0, totalMonths - elapsedMonths);
  const monthlyAmount = Number(monthly) || 0;
  const savedAmount = Number(currentSaved) || 0;
  const elapsed = Math.max(0, Number(elapsedMonths) || 0);
  const r = annualRate / 12;
  const fullPlanValue = r > 0
    ? monthlyAmount * ((Math.pow(1 + r, totalMonths) - 1) / r)
    : monthlyAmount * totalMonths;
  const expectedLogged = monthlyAmount * elapsed;
  const actualVariance = savedAmount - expectedLogged;
  const varianceValue = r > 0 ? actualVariance * Math.pow(1 + r, months) : actualVariance;
  return Math.round(fullPlanValue + varianceValue);
}
