import { useState } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";

export default function BalancedLifestyleTrack() {
  const { user } = useUser();

  /* ================= USER DATA ================= */
  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;

  const savings = income - expenses;

  /* ================= BALANCED LOGIC ================= */
  const [investmentPct, setInvestmentPct] = useState(60);

  const investing = Math.round((savings * investmentPct) / 100);
  const saved = savings - investing;

  const total = expenses + investing + saved;

  const spendingPct = total ? (expenses / total) * 100 : 0;
  const investingPct = total ? (investing / total) * 100 : 0;
  const savingPct = total ? (saved / total) * 100 : 0;

  /* ================= PORTFOLIO ================= */
  const portfolio = {
    local: 60,
    offshore: 40,
  };

  /* ================= INSIGHTS ================= */
  let insight1 = "";
  let insight2 = "";

  if (investmentPct >= 60) {
    insight1 =
      "You are maintaining a strong balance between spending and investing.";
    insight2 =
      "Increasing your investment slightly could significantly grow long-term wealth.";
  } else if (investmentPct >= 40) {
    insight1 =
      "You have a moderate balance. Increasing investing could improve outcomes.";
    insight2 =
      "Try shifting more towards investments to accelerate portfolio growth.";
  } else {
    insight1 =
      "You are prioritising spending over investing — consider rebalancing.";
    insight2 = "Reducing lifestyle costs could free up more for investments.";
  }

  /* ================= MILESTONES ================= */
  const milestones = [
    "Emergency fund",
    "Consistent investing",
    "Portfolio growth",
    "Asset diversification",
    "Wealth stability",
  ];

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Balanced Lifestyle & Investing Track</h1>
        <p className="muted">Enjoy your life while building long-term wealth</p>

        {/* ================= SNAPSHOT ================= */}
        <div className="card">
          <h2>Financial Balance Snapshot</h2>

          <div className="snapshot-list">
            <p>💰 Savings: R{saved.toLocaleString()}</p>
            <p>🏠 Expenses: R{expenses.toLocaleString()}</p>
            <p>📈 Investing: R{investing.toLocaleString()}</p>
          </div>

          {/* ================= PROGRESS BAR ================= */}
          <div className="progress-bar">
            <div
              className="progress spending"
              style={{ width: `${spendingPct}%` }}
            />
            <div
              className="progress investing"
              style={{ width: `${investingPct}%` }}
            />
            <div
              className="progress saving"
              style={{ width: `${savingPct}%` }}
            />
          </div>

          <div className="progress-labels">
            <span>Spending</span>
            <span>Investing</span>
            <span>Saving</span>
          </div>
        </div>

        {/* ================= JOURNEY ================= */}
        <div className="card">
          <h2>Your 5-Year Journey</h2>

          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <span>Year {i + 1}</span>
                <div className="milestone">{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= PORTFOLIO ================= */}
        <div className="card">
          <h2>Portfolio Mix</h2>

          <div className="portfolio">
            <div className="pie">
              <div className="pie-inner">
                <span>{portfolio.local}%</span>
              </div>
            </div>

            <div className="portfolio-details">
              <p>• Local (JSE): {portfolio.local}%</p>
              <p>• Offshore: {portfolio.offshore}%</p>

              <button className="secondary-btn">
                Open Investment Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ================= ADJUST ================= */}
        <div className="grid">
          <div className="card">
            <h3>Adjust Balance</h3>

            <p>Lifestyle vs Investment</p>

            <input
              type="range"
              min="20"
              max="80"
              value={investmentPct}
              onChange={(e) => setInvestmentPct(Number(e.target.value))}
            />

            <p>Investment Allocation: {investmentPct}%</p>

            <small>Adjust how much of your savings go into investments.</small>
          </div>

          {/* ================= INSIGHTS ================= */}
          <div className="card">
            <h3>AI Financial Insights</h3>

            <div className="insight">💡 {insight1}</div>

            <div className="insight">🔔 {insight2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
