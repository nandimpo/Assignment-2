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
  const savingsRate = Math.round((savings / income) * 100);
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

  const explainers = {
    net: {
      title: "Net Position",
      text: "Income minus expenses. This is what you keep.",
    },
    savings: {
      title: "Savings Rate",
      text: "Aim for 20–30% to reach goals faster.",
    },
    property: {
      title: "Deposit Goal",
      text: "This is your target deposit for buying your home.",
    },
  };

  return (
    <div className="money">
      <AppNav />

      {/* ✅ NEW CONTAINER (FIX WIDTH) */}
      <div className="money-container">
        {/* HEADER */}
        <section className="header">
          <h2>
            Here’s your snapshot,{" "}
            <span className="accent">{user?.name || "User"}</span>
          </h2>
          <p>
            You're on the <span className="accent">{user?.strategy}</span> track
          </p>
        </section>

        {/* STATS */}
        <section className="stats">
          {/* INCOME */}
          <div className="stat-card">
            <p className="label">Monthly income</p>
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

          {/* EXPENSES */}
          <div className="stat-card">
            <p className="label">Fixed Costs</p>
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

          {/* NET */}
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
              <div className="tooltip-box">{explainers.net.text}</div>
            )}

            <h3 className="big-number">R{net.toLocaleString()}</h3>
            <span className="small">{savingsRate}% saved</span>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="grid">
          <div className="left">
            {/* DEPOSIT */}
            <div className="card">
              <h3>
                Deposit Goal
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
                <div className="tooltip-box">{explainers.property.text}</div>
              )}

              <div className="progress">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>

              <p className="small">
                R{savings.toLocaleString()} / R{goal.toLocaleString()}
              </p>

              <button
                className="pill"
                onClick={() => setSavings(Math.round(income * 0.25))}
              >
                Auto balance to 25%
              </button>
            </div>

            {/* INSIGHTS */}
            <div className="card">
              <h3>Smart insights</h3>

              <div className="insight">
                <p>Good progress — keep consistency.</p>
              </div>

              <div className="insight">
                <p>Reduce spending by R500</p>
                <button onClick={() => setExpenses(expenses - 500)}>
                  Adjust →
                </button>
              </div>

              <div className="insight">
                <p>Increase savings by R1000</p>
                <button onClick={() => setSavings(savings + 1000)}>
                  Boost →
                </button>
              </div>
            </div>

            {/* LEARN */}
            <div
              className="card clickable"
              onClick={() => {
                setContent(explainers.savings);
                setShowPanel(true);
              }}
            >
              <h3>Want to know more?</h3>
              <p>What is a good savings rate?</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right">
            <div className="card">
              <h3>Spending Breakdown</h3>

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
                Manage finances →
              </button>
            </div>

            <div
              className="card clickable"
              onClick={() => navigate("/simulation")}
            >
              <h3>Simulation Lab</h3>
              <p>Test rent vs buy, savings growth, and more</p>
              <span className="link-arrow">Explore →</span>
            </div>
          </div>
        </section>
      </div>

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={content}
      />
    </div>
  );
}
