import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import "../styles/money.css";
import ExplainerPanel from "../components/ExplainerPanel";
import useProgress from "../hooks/useProgress";
import Tour from "../components/Tour";
import { useUser } from "../context/UserContext";

export default function MoneySnapshot() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [income, setIncome] = useState(Number(user?.salary) || 50000);
  const [expenses, setExpenses] = useState(Number(user?.expenses) || 20000);
  const [savings, setSavings] = useState(Number(user?.savings) || 12000);

  // Sync state when user context loads/changes
  useEffect(() => {
    if (user?.salary)   setIncome(Number(user.salary));
    if (user?.expenses) setExpenses(Number(user.expenses));
    if (user?.savings)  setSavings(Number(user.savings));
  }, [user?.salary, user?.expenses, user?.savings]);

  const goal = user?.depositAmount || user?.goalAmount || 1000000;

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const net = income - expenses;
  const safeIncome = income > 0 ? income : 1;
  const savingsRate = Math.round((savings / safeIncome) * 100);
  const progress = Math.min(100, Math.round((savings / goal) * 100));
  const monthsToGoal =
    savings >= goal ? 0 : Math.ceil((goal - savings) / (savings || 1));

  const [breakdownEdit, setBreakdownEdit] = useState({
    housing: user?.breakdown?.housing ?? Math.round(expenses * 0.4),
    mobility: user?.breakdown?.mobility ?? Math.round(expenses * 0.2),
    lifestyle: user?.breakdown?.lifestyle ?? Math.round(expenses * 0.25),
    debt: user?.breakdown?.debt ?? Math.round(expenses * 0.15),
  });

  const breakdown = { ...breakdownEdit, savings };

  const handleBreakdownChange = (e) => {
    setBreakdownEdit({
      ...breakdownEdit,
      [e.target.name]: Number(e.target.value),
    });
  };

  const debtToIncome =
    income > 0 ? Math.round((breakdown.debt / income) * 100) : 0;
  const disposableIncome = income - expenses;

  const generateNarrative = () => {
    let message = "";
    if (savingsRate > 50)
      message += "You're saving more than most people in your income band. ";
    else if (savingsRate < 15) message += "Your savings rate is quite low. ";
    if (debtToIncome > 40)
      message += "Your debt levels are high relative to your income. ";
    if (disposableIncome < 0) message += "You are currently overspending. ";
    return message || "Your financial position is stable.";
  };
  const narrative = generateNarrative();

  const handleSavingsRateChange = (e) => {
    const rate = Number(e.target.value);
    if (rate >= 0 && rate <= 100) setSavings(Math.round(income * (rate / 100)));
  };

  const handleDisposableIncomeChange = (e) => {
    const val = Number(e.target.value);
    const newExpenses = income - val;
    if (newExpenses >= 0) setExpenses(newExpenses);
  };

  // ── SNAPSHOT TOUR STEPS ──
  const snapshotSteps = [
    {
      text: "This is your financial snapshot — everything updates live.",
      target: "header",
    },
    {
      text: "Track your financial journey through milestones.",
      target: "milestones",
    },
    { text: "These are your key financial metrics.", target: "metrics" },
    { text: "Edit your income and expenses here.", target: "stats" },
    {
      text: "This shows your progress toward your deposit goal.",
      target: "deposit",
    },
    {
      text: "These AI insights help you improve your finances.",
      target: "insights",
    },
  ];

  // ── COACH STEPS (dynamic, based on current financial state) ──
  const getCoachSteps = () => {
    const steps = [];

    if (net < 0) {
      steps.push({
        text: "You're currently spending more than you earn. Let's fix that first.",
        target: "stats",
        action: () => setExpenses(expenses - 1000),
        actionLabel: "Reduce expenses by R1,000",
      });
    } else if (savingsRate < 15) {
      steps.push({
        text: `You're only saving ${savingsRate}% — increasing this will significantly improve your future.`,
        target: "metrics",
        action: () => setSavings(Math.round(income * 0.2)),
        actionLabel: "Boost to 20%",
      });
    } else if (savingsRate < 30) {
      steps.push({
        text: `You're saving ${savingsRate}% — you're on track, but optimisation will accelerate your goals.`,
        target: "metrics",
        action: () => setSavings(Math.round(income * 0.3)),
        actionLabel: "Optimise to 30%",
      });
    } else {
      steps.push({
        text: `You're saving ${savingsRate}% — strong position. Now focus on growth.`,
        target: "insights",
      });
    }

    steps.push({
      text: `You are ${progress}% toward your deposit goal.`,
      target: "deposit",
    });

    steps.push({
      text: "These insights are personalised to help you improve faster.",
      target: "insights",
    });

    return steps;
  };

  // Combine onboarding + coach steps — passed to Tour component
  const allTourSteps = [...snapshotSteps, ...getCoachSteps()];

  // ── PERSIST VIA CONTEXT ──
  useEffect(() => {
    const currentBreakdown = { ...breakdownEdit, savings };
    updateUser({
      salary: income,
      expenses,
      savings,
      monthsToGoal,
      breakdown: currentBreakdown,
    });
  }, [income, expenses, savings, breakdownEdit]);

  // ── AI INSIGHT ENGINE ──
  const generateInsights = () => {
    const insights = [];

    if (savingsRate >= 30) {
      insights.push({
        text: "Your savings rate is strong and positions you well for accelerated goal achievement.",
        action: null,
      });
    } else if (savingsRate >= 15) {
      insights.push({
        text: "You are maintaining a moderate savings rate. Increasing this slightly would significantly improve your financial trajectory.",
        action: () => setSavings(Math.round(income * 0.3)),
        actionLabel: "Optimise to 30%",
      });
    } else {
      insights.push({
        text: "Your current savings rate is below recommended levels. Adjusting spending or increasing income should be prioritised.",
        action: () => setExpenses(expenses - 1000),
        actionLabel: "Reduce expenses",
      });
    }

    if (expenses / safeIncome > 0.7) {
      insights.push({
        text: "A high proportion of your income is allocated to expenses, limiting your ability to build wealth.",
        action: () => setExpenses(expenses - 500),
        actionLabel: "Trim expenses",
      });
    }

    if (progress > 50) {
      insights.push({
        text: "You are ahead of your expected savings timeline, indicating strong financial discipline.",
      });
    } else if (progress < 20) {
      insights.push({
        text: "Your progress toward your deposit goal is still early. Consistency in saving will be key.",
      });
    }

    if (net < 0) {
      insights.push({
        text: "Your expenses currently exceed your income. Immediate adjustments are required to stabilise your finances.",
      });
    }

    return insights;
  };

  const aiInsights = generateInsights();

  // ── EXPLAINERS ──
  const explainers = {
    net: {
      title: "Net Position",
      text: "Your net position represents the difference between income and expenses. A positive value indicates surplus funds available for saving or investing.",
    },
    savings: {
      title: "Savings Rate",
      text: "Your savings rate reflects the percentage of income retained after expenses. A rate above 20% is generally considered strong for long-term financial growth.",
    },
    property: {
      title: "Deposit Goal",
      text: "This represents your target savings required for a property deposit. Increasing contributions reduces the time required to reach this milestone.",
    },
  };

  const { progress: milestoneProgress, toggle, percent } = useProgress();

  let nextAction = "";
  if (!milestoneProgress.emergencyFund)
    nextAction = "Build your emergency fund (3–6 months expenses)";
  else if (!milestoneProgress.deposit)
    nextAction = "Start saving aggressively for your deposit";
  else if (!milestoneProgress.purchase)
    nextAction = "Prepare for property purchase (bond, costs)";
  else nextAction = "Optimise your finances post-purchase";

  let track = "Foundation";
  if (user?.debt > income * 1.5) track = "Lifestyle Correction";
  else if (!milestoneProgress.emergencyFund) track = "Foundation";
  else if (!milestoneProgress.deposit) track = "Balanced";
  else track = "Property";

  return (
    <div className="money">
      <AppNav />

      <div className="money-container">
        {/* HEADER */}
        <section className="header" id="header">
          <h2>
            Financial Snapshot —{" "}
            <span className="accent">{user?.name || "User"}</span>
          </h2>
          <p>
            You are currently following the{" "}
            <span className="accent">{user?.strategy}</span> strategy
          </p>
        </section>

        {/* MILESTONES */}
        <div className="card" id="milestones">
          <h3>Milestones</h3>
          <div className="stepper">
            {["emergencyFund", "deposit", "purchase"].map((step, index) => {
              const labels = {
                emergencyFund: "Emergency Fund",
                deposit: "Deposit",
                purchase: "Purchase",
              };
              const steps = ["emergencyFund", "deposit", "purchase"];
              const isCompleted = milestoneProgress[step];
              const isCurrent =
                !milestoneProgress[step] &&
                (index === 0 || milestoneProgress[steps[index - 1]]);
              const isLocked =
                (step === "deposit" && !milestoneProgress.emergencyFund) ||
                (step === "purchase" && !milestoneProgress.deposit);

              return (
                <div key={step} className="step-wrapper">
                  <div
                    className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => !isLocked && toggle(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{labels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${milestoneProgress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p className="muted">{percent}% complete</p>
        </div>

        {/* TRACK */}
        <div className="card" id="track">
          <h3>📍 Your Track</h3>
          <p className="accent">{track}</p>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="card">
          <h3>Financial Summary</h3>
          <p>{narrative}</p>
        </div>

        {/* NEXT ACTION */}
        <div className="card">
          <h3>🎯 Next Best Action</h3>
          <p className="accent">{nextAction}</p>
        </div>

        {/* KEY METRICS */}
        <div className="card" id="metrics">
          <h3>Key Financial Metrics</h3>

          <label>Debt-to-Income (%)</label>
          <input
            type="number"
            value={debtToIncome}
            readOnly
            style={{ opacity: 0.6, cursor: "not-allowed" }}
            title="Calculated automatically from your debt and income"
          />

          <label>Disposable Income</label>
          <input
            type="number"
            value={disposableIncome}
            onChange={handleDisposableIncomeChange}
            title="Adjusts your expenses to match this value"
          />

          <label>Savings Rate (%)</label>
          <input
            type="number"
            value={savingsRate}
            onChange={handleSavingsRateChange}
            title="Adjusts your savings amount to match this rate"
          />
        </div>

        {/* STATS */}
        <section className="stats" id="stats">
          <div className="stat-card">
            <p className="label">Monthly Income</p>
            <div className="value-input">
              <span className="currency">R</span>
              <input
                className="input-number"
                type="number"
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="stat-card">
            <p className="label">Fixed Expenses</p>
            <div className="value-input">
              <span className="currency">R</span>
              <input
                className="input-number"
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="stat-card highlight">
            <p className="label">
              Net Position
              <span
                className="info-icon"
                onMouseEnter={() => setActiveTooltip("net")}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => {
                  setContent(explainers.net);
                  setShowPanel(true);
                }}
              >
                ⓘ
              </span>
            </p>
            {activeTooltip === "net" && (
              <div className="tooltip-advanced">
                <h4>{explainers.net.title}</h4>
                <p>{explainers.net.text}</p>
                <span className="tooltip-hint">Click to learn more →</span>
              </div>
            )}
            <h3 className="big-number">R{net.toLocaleString("en-ZA")}</h3>
            <span className="small">
              {savingsRate}% of income allocated to savings
            </span>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">
          <div className="left">
            {/* DEPOSIT */}
            <div className="card" id="deposit">
              <h3>
                Deposit Progress
                <span
                  className="info-icon"
                  onMouseEnter={() => setActiveTooltip("property")}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => {
                    setContent(explainers.property);
                    setShowPanel(true);
                  }}
                >
                  ⓘ
                </span>
              </h3>
              {activeTooltip === "property" && (
                <div className="tooltip-advanced">
                  <h4>{explainers.property.title}</h4>
                  <p>{explainers.property.text}</p>
                  <span className="tooltip-hint">Click to explore →</span>
                </div>
              )}
              <div className="progress">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
              <p className="small">
                R{savings.toLocaleString("en-ZA")} saved of R
                {goal.toLocaleString("en-ZA")} target
              </p>
              <p className="small">{monthsToGoal} months to reach goal</p>
              <button
                className="pill"
                onClick={() => setSavings(Math.round(income * 0.25))}
              >
                Optimise to 25% savings rate
              </button>
            </div>

            {/* AI INSIGHTS */}
            <div className="card" id="insights">
              <h3>AI Financial Insights</h3>
              {aiInsights.map((insight, i) => (
                <div className="insight" key={i}>
                  <p>{insight.text}</p>
                  {insight.action && (
                    <button onClick={insight.action}>
                      {insight.actionLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* BREAKDOWN */}
            <div className="card" id="breakdown">
              <h3>Spending Breakdown</h3>
              <div className="breakdown-grid">
                <div className="breakdown-item">
                  <p>Housing</p>
                  <input
                    className="input-number"
                    type="number"
                    name="housing"
                    value={breakdownEdit.housing}
                    onChange={handleBreakdownChange}
                  />
                </div>
                <div className="breakdown-item">
                  <p>Mobility</p>
                  <input
                    className="input-number"
                    type="number"
                    name="mobility"
                    value={breakdownEdit.mobility}
                    onChange={handleBreakdownChange}
                  />
                </div>
                <div className="breakdown-item">
                  <p>Lifestyle</p>
                  <input
                    className="input-number"
                    type="number"
                    name="lifestyle"
                    value={breakdownEdit.lifestyle}
                    onChange={handleBreakdownChange}
                  />
                </div>
                <div className="breakdown-item">
                  <p>Debt</p>
                  <input
                    className="input-number"
                    type="number"
                    name="debt"
                    value={breakdownEdit.debt}
                    onChange={handleBreakdownChange}
                  />
                </div>
                <div className="breakdown-item">
                  <p>Savings</p>
                  <strong>R{breakdown.savings.toLocaleString("en-ZA")}</strong>
                </div>
              </div>
              <button
                className="pill"
                style={{ marginTop: "12px" }}
                onClick={() =>
                  setBreakdownEdit({
                    housing: Math.round(expenses * 0.4),
                    mobility: Math.round(expenses * 0.2),
                    lifestyle: Math.round(expenses * 0.25),
                    debt: Math.round(expenses * 0.15),
                  })
                }
              >
                Reset to auto
              </button>
            </div>

            {/* LEARN */}
            <div
              className="card clickable"
              onMouseEnter={() => setActiveTooltip("savings")}
              onMouseLeave={() => setActiveTooltip(null)}
              onClick={() => {
                setContent(explainers.savings);
                setShowPanel(true);
              }}
            >
              <h3>Financial Knowledge</h3>
              <p>Understand how your savings rate impacts long-term wealth.</p>
              {activeTooltip === "savings" && (
                <div className="tooltip-advanced">
                  <h4>{explainers.savings.title}</h4>
                  <p>{explainers.savings.text}</p>
                  <span className="tooltip-hint">Click to dive deeper →</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="card">
              <h3>Spending Distribution</h3>
              <div
                className="chart"
                style={{
                  background: `conic-gradient(
                    #84a794 0% ${(savings / safeIncome) * 100}%,
                    #6faad3 ${(savings / safeIncome) * 100}% ${((savings + expenses) / safeIncome) * 100}%,
                    #d6a85a ${((savings + expenses) / safeIncome) * 100}% 100%
                  )`,
                }}
              />
              <div className="legend">
                <p>Savings — R{savings.toLocaleString("en-ZA")}</p>
                <p>Expenses — R{expenses.toLocaleString("en-ZA")}</p>
                <p>Remaining — R{net.toLocaleString("en-ZA")}</p>
              </div>
              <button
                className="pill full"
                onClick={() => navigate("/simulation")}
              >
                Explore financial scenarios →
              </button>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/simulation")}
            >
              <h3>Simulation Lab</h3>
              <p>
                Model different financial decisions including saving strategies,
                rent vs buy, and long-term growth.
              </p>
              <span className="link-arrow">Open simulation →</span>
            </div>
          </div>
        </section>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 32px 48px" }}>
        <button className="primary-btn" onClick={() => navigate("/strategy")}>
          Continue →
        </button>
      </div>

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={content}
      />

      <div
        className="finance-orb"
        onClick={() => navigate("/learn")}
        title="Go to Finance School"
      >
        🎓
      </div>

      {/* Single Tour — allTourSteps includes both onboarding + coach steps */}
      <Tour steps={allTourSteps} storageKey="snapshotTour" />
    </div>
  );
}
