import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import "../styles/money.css";
import ExplainerPanel from "../components/ExplainerPanel";

export default function MoneySnapshot() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(sessionStorage.getItem("user")) || {};
  const [user, setUser] = useState(storedUser);

  const [income, setIncome] = useState(user.salary || 50000);
  const [expenses, setExpenses] = useState(user.expenses || 20000);
  const [savings, setSavings] = useState(user.savings || 12000);

  const goal = user.depositAmount || 1000000;

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const net = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const progress = Math.min(100, Math.round((savings / goal) * 100));

  useEffect(() => {
    const updatedUser = {
      ...user,
      salary: income,
      expenses: expenses,
      savings: savings,
    };

    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  }, [income, expenses, savings]);

  /*  AI INSIGHT ENGINE */

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

    if (expenses / income > 0.7) {
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

  /* EXPLAINERS */

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

  return (
    <div className="money">
      <AppNav />

      <div className="money-container">
        {/* HEADER */}
        <section className="header">
          <h2>
            Financial Snapshot —{" "}
            <span className="accent">{user?.name || "User"}</span>
          </h2>
          <p>
            You are currently following the{" "}
            <span className="accent">{user?.strategy}</span> strategy
          </p>
        </section>

        {/* STATS */}
        <section className="stats">
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

            <h3 className="big-number">R{net.toLocaleString()}</h3>
            <span className="small">
              {savingsRate}% of income allocated to savings
            </span>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">
          {/* LEFT */}
          <div className="left">
            {/* DEPOSIT */}
            <div className="card">
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
                R{savings.toLocaleString()} saved of R{goal.toLocaleString()}{" "}
                target
              </p>

              <button
                className="pill"
                onClick={() => setSavings(Math.round(income * 0.25))}
              >
                Optimise to 25% savings rate
              </button>
            </div>

            {/* AI INSIGHTS */}
            <div className="card">
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
                    #84a794 0% ${(savings / income) * 100}%,
                    #6faad3 ${(savings / income) * 100}% ${
                      ((savings + expenses) / income) * 100
                    }%,
                    #d6a85a ${((savings + expenses) / income) * 100}% 100%
                  )`,
                }}
              />

              <div className="legend">
                <p>Savings — R{savings.toLocaleString()}</p>
                <p>Expenses — R{expenses.toLocaleString()}</p>
                <p>Remaining — R{net.toLocaleString()}</p>
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
    </div>
  );
}
