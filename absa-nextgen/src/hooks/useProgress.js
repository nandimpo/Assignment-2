import { useUser } from "../context/UserContext";

const TRACK_ROUTES = {
  property:   "/property",
  balanced:   "/balanced",
  catchup:    "/catchup",
  correction: "/correction",
};

/**
 * Calculates whether each milestone has been financially achieved
 * based on the user's actual saved amounts.
 */
function calcMilestoneStatus(user) {
  const savings  = Number(user?.savings)  || 0;
  const expenses = Number(user?.expenses) || 0;
  const goal     = Number(user?.depositAmount || user?.goalAmount) || 1000000;
  const debt     = Number(user?.breakdown?.debt) * 12 || 0; // annualised

  const strategy = user?.strategy || "property";

  switch (strategy) {
    case "property":
    case "balanced":
      return {
        emergencyFund: {
          achieved: savings >= expenses * 3,
          target:   expenses * 3,
          label:    "Emergency Fund (3× expenses)",
          hint:     `Save R${(Math.max(0, expenses * 3 - savings)).toLocaleString("en-ZA")} more in your Snapshot`,
        },
        deposit: {
          achieved: savings >= goal,
          target:   goal,
          label:    strategy === "balanced" ? "Investing Started" : "Deposit Saved",
          hint:     `Save R${(Math.max(0, goal - savings)).toLocaleString("en-ZA")} more toward your goal`,
        },
        purchase: {
          achieved: savings >= goal * 1.1,
          target:   goal * 1.1,
          label:    strategy === "balanced" ? "Financial Independence" : "Property Bought",
          hint:     "Complete your deposit milestone first, then confirm purchase",
        },
      };

    case "catchup":
      return {
        emergencyFund: {
          achieved: debt === 0 || savings > debt,
          target:   debt,
          label:    "Debt Cleared",
          hint:     "Reduce your debt repayments to zero in your Snapshot breakdown",
        },
        deposit: {
          achieved: savings >= expenses * 3,
          target:   expenses * 3,
          label:    "Emergency Fund",
          hint:     `Save R${(Math.max(0, expenses * 3 - savings)).toLocaleString("en-ZA")} more`,
        },
        purchase: {
          achieved: savings >= goal,
          target:   goal,
          label:    "Wealth Building",
          hint:     `Save R${(Math.max(0, goal - savings)).toLocaleString("en-ZA")} more toward your target`,
        },
      };

    case "correction":
      return {
        emergencyFund: {
          achieved: (Number(user?.netSalary || user?.salary) || 0) > (Number(user?.expenses) || 0),
          target:   null,
          label:    "Budget Balanced",
          hint:     "Update your income and expenses in the Snapshot so income exceeds expenses",
        },
        deposit: {
          achieved: savings >= expenses * 2,
          target:   expenses * 2,
          label:    "Debt Reducing",
          hint:     `Save R${(Math.max(0, expenses * 2 - savings)).toLocaleString("en-ZA")} more while reducing debt`,
        },
        purchase: {
          achieved: savings >= expenses * 6,
          target:   expenses * 6,
          label:    "Debt Free",
          hint:     `Save R${(Math.max(0, expenses * 6 - savings)).toLocaleString("en-ZA")} more to reach debt-free status`,
        },
      };

    default:
      return {
        emergencyFund: { achieved: false, target: expenses * 3, label: "Emergency Fund", hint: "Update your savings in the Snapshot" },
        deposit:       { achieved: false, target: goal,          label: "Goal Reached",   hint: "Update your savings in the Snapshot" },
        purchase:      { achieved: false, target: goal * 1.1,    label: "Complete",        hint: "Complete previous milestones first" },
      };
  }
}

export default function useProgress() {
  const { user, updateUser } = useUser();

  const milestoneStatus = calcMilestoneStatus(user);
  const manualMilestones = user?.manualMilestones || {};

  // Milestones become complete only when the user checks them off. Financially achieved
  // milestones are surfaced as "ready" nudges so users confirm the step themselves.
  const rawProgress = {
    emergencyFund: Boolean(manualMilestones.emergencyFund),
    deposit:       Boolean(manualMilestones.deposit),
    purchase:      Boolean(manualMilestones.purchase),
  };

  const progress = {
    emergencyFund: rawProgress.emergencyFund,
    deposit:       Boolean(rawProgress.emergencyFund && rawProgress.deposit),
    purchase:      Boolean(rawProgress.emergencyFund && rawProgress.deposit && rawProgress.purchase),
  };

  const milestoneKeys = ["emergencyFund", "deposit", "purchase"];
  const visibleMilestoneStatus = milestoneKeys.reduce((acc, key, index) => {
    const prevComplete = index === 0 || progress[milestoneKeys[index - 1]];
    const readyToCheck = Boolean(prevComplete && milestoneStatus[key]?.achieved && !progress[key]);
    acc[key] = {
      ...milestoneStatus[key],
      readyToCheck,
      hint: readyToCheck
        ? "Ready - tap to check this off"
        : milestoneStatus[key]?.hint,
    };
    return acc;
  }, {});

  // Persist to user context so snapshot + tracks stay in sync
  const currentStored = JSON.stringify(user?.milestones);
  const computed      = JSON.stringify(progress);
  if (currentStored !== computed) {
    // Update asynchronously to avoid render-time state updates
    setTimeout(() => updateUser({ milestones: progress }), 0);
  }

  const trackRoute = TRACK_ROUTES[user?.strategy] || "/strategy";
  const trackName  = {
    property:   "Property Track",
    balanced:   "Balanced Track",
    catchup:    "Catch-Up Track",
    correction: "Lifestyle Correction Track",
  }[user?.strategy] || "your track";

  const completed = Object.values(progress).filter(Boolean).length;
  const total     = Object.keys(progress).length;
  const percent   = Math.round((completed / total) * 100);

  const toggleMilestone = (key) => {
    if (!key) return;
    updateUser({
      manualMilestones: {
        ...manualMilestones,
        [key]: !manualMilestones[key],
      },
    });
  };

  return { progress, milestoneStatus: visibleMilestoneStatus, trackRoute, trackName, percent, toggleMilestone };
}
