export function getTrackProgression(user) {
  if (!user) return null;

  const income = Number(user.netSalary || user.salary) || 0;
  const expenses = Number(user.expenses) || 0;
  const savings = income - expenses;
  const debt = Number(user.debt) || 0;

  const emergencyFund = savings * 3;

  // 🔴 CORRECTION STAGE
  if (debt > 0) {
    return {
      track: "correction",
      reason: "You still have outstanding debt.",
      next: "balanced",
      message: "Focus on clearing debt before building savings or investing.",
    };
  }

  // 🟡 FOUNDATION STAGE
  if (emergencyFund < expenses * 3) {
    return {
      track: "balanced",
      reason: "You don’t yet have a full emergency fund.",
      next: "balanced",
      message:
        "Build a 3–6 month safety net before moving into growth strategies.",
    };
  }

  // 🟣 PROPERTY GOAL
  if (user.goal === "buy_home") {
    return {
      track: "property",
      reason: "You are focused on buying property.",
      next: "balanced",
      message: "Continue saving for your deposit while maintaining stability.",
    };
  }

  // 🔵 DEFAULT → BALANCED
  return {
    track: "balanced",
    reason: "You are financially stable.",
    next: null,
    message: "You can now focus on growing wealth through investing.",
  };
}
