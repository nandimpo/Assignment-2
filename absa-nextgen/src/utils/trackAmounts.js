export function getMonthlySurplus(user) {
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  return Math.max(0, income - expenses);
}

export function getTrackMonthlyAmount(user, trackKey = user?.strategy) {
  const surplus = getMonthlySurplus(user);

  switch (trackKey) {
    case "property":
      return Number(user?.monthlyContribution) || surplus;
    case "balanced":
      return Number(user?.goalAmount) || Math.round(surplus * 0.2);
    case "catchup":
      return Number(user?.catchupMonthly) || surplus;
    case "correction":
      return Number(user?.goalAmount) || surplus;
    case "foundation":
      return Number(user?.monthlyContribution) || surplus;
    default:
      return surplus;
  }
}
