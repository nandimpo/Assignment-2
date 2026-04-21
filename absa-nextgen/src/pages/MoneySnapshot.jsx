import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/money.css";
import ExplainerPanel from "../components/ExplainerPanel";

export default function MoneySnapshot() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);

  const [income, setIncome] = useState(user.salary || 50000);
  const [expenses, setExpenses] = useState(user.expenses || 20000);
  const [savings, setSavings] = useState(12000);

  const goal = user.depositGoal || 1000000;

  const net = income - expenses;
  const savingsRate = Math.round((savings / income) * 100);
  const progress = Math.min(100, Math.round((savings / goal) * 100));

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
      text: "Saving for your first property deposit.",
    },
  };

  return (
    <div className="money">
      <AppNav />

      {/* HEADER */}
      <section className="header">
        <h2>Welcome back, {user?.name || "User"}</h2>
        <p>
          You're on the <span className="accent">{user?.strategy}</span> track
        </p>
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="stat-card">
          <p>Monthly income</p>
          <div className="value-input">
            <span>R</span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <input
            type="range"
            min="0"
            max="150000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
        </div>

        <div className="stat-card">
          <p>Fixed Costs</p>
          <div className="value-input">
            <span>R</span>
            <input
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
            />
          </div>
          <input
            type="range"
            min="0"
            max="80000"
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
          />
        </div>

        <div className="stat-card highlight">
          <p>
            Net Position
            <span
              className="info-icon"
              onClick={() => {
                setContent(explainers.net);
                setShowPanel(true);
              }}
            >
              💡
            </span>
          </p>
          <h3>R{net.toLocaleString()}</h3>
          <span className="small">{savingsRate}% saved</span>
        </div>
      </section>

      {/* GRID */}
      <section className="grid">
        {/* LEFT */}
        <div className="left">
          <div className="card">
            <h3>Deposit Goal 💡</h3>

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

          {/* LEARN TILE */}
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
          {/* PIE CHART */}
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
            ></div>

            <div className="legend">
              <p>🟢 Savings — R{savings.toLocaleString()}</p>
              <p>🔵 Expenses — R{expenses.toLocaleString()}</p>
              <p>🟡 Remaining — R{net.toLocaleString()}</p>
            </div>

            <button
              className="pill full"
              onClick={() => navigate("/simulation")}
            >
              Manage finances →
            </button>
          </div>

          {/* SIMULATION */}
          <div
            className="card center clickable"
            onClick={() => navigate("/simulation")}
          >
            <h3>Simulation Lab</h3>
            <p>Test rent vs buy, savings growth, and more</p>
            <span className="link-arrow">Explore →</span>
          </div>
        </div>
      </section>

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={content}
      />
    </div>
  );
}
