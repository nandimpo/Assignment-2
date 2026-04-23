import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};

  const income = user?.salary || 55000;
  const expenses = user?.expenses || 29000;
  const net = income - expenses;
  const savingsRate = Math.round((net / income) * 100);

  let nextStep = "Move closer to your 5-year goal";

  if (!user?.strategy) nextStep = "Choose your financial strategy";
  else if (!user?.salary) nextStep = "Add your income details";
  else if (!user?.expenses) nextStep = "Track your monthly expenses";

  const [nudgeType, setNudgeType] = useState("positive");

  useEffect(() => {
    if (savingsRate < 20) setNudgeType("warning");
    else setNudgeType("positive");
  }, [savingsRate]);

  return (
    <div className="home">
      <AppNav />

      <div className="container">
        {/* HEADER */}
        <section className="home-header fade-in">
          <h2>{user?.name ? `Welcome back, ${user.name}` : "Welcome"}</h2>
          <p>
            You are on the{" "}
            <span className="accent">{user?.strategy || "Property"}</span> track
          </p>
        </section>

        {/* NEXT STEP */}
        <section className="next-step fade-in">
          <div>
            <p className="label">Next Step</p>
            <h3>{nextStep}</h3>
          </div>

          <button className="primary-btn" onClick={() => navigate("/track")}>
            Continue →
          </button>
        </section>

        {/* HEALTH */}
        <section className="health-card fade-in">
          <div className="score-ring">100</div>

          <div>
            <h3>
              Financial Health
              <span className="info-hover">
                ⓘ
                <div className="tooltip">
                  Based on:
                  <br />• Savings rate
                  <br />• Spending behaviour
                  <br />• Setup progress
                </div>
              </span>
            </h3>
            <p className="muted">Excellent</p>
          </div>
        </section>

        {/* STATS */}
        <section className="stats fade-in">
          <div className="stat">
            <p>Monthly income</p>
            <h3>R{income.toLocaleString()}</h3>
          </div>

          <div className="stat">
            <p>Fixed Costs</p>
            <h3>R{expenses.toLocaleString()}</h3>
          </div>

          <div
            className="stat highlight clickable"
            onClick={() => navigate("/money")}
          >
            <p>Net Position</p>
            <h3>R{net.toLocaleString()}</h3>
            <span>View breakdown →</span>
          </div>
        </section>

        <section className="goal-card fade-in">
          <p className="muted">Your Deposit Plan</p>

          <h3>R{user?.depositAmount?.toLocaleString()}</h3>

          <span className="muted">{user?.depositPercent}% of home value</span>

          <br />

          <span className="muted">{user?.monthsToGoal} months to reach</span>
        </section>

        {/* NUDGE */}
        <section className={`nudge ${nudgeType} fade-in`}>
          <p>
            {nudgeType === "positive"
              ? `You're saving ${savingsRate}% — strong position`
              : "Your savings rate is low — consider reducing expenses"}
          </p>
        </section>

        {/* HERO */}
        <section className="hero-row fade-in">
          <div>
            <h2>Take control of your financial future</h2>
            <p className="muted">
              Track, simulate, and move forward with clarity.
            </p>
          </div>

          <button className="primary-btn" onClick={() => navigate("/money")}>
            View Money →
          </button>
        </section>

        {/* SIMULATIONS */}
        <section className="simulation-box fade-in">
          <h3>Your Simulations</h3>
          <p className="empty">No simulations yet — start exploring</p>
        </section>

        {/* FEATURES */}
        <section className="feature-row fade-in">
          <div className="feature-card" onClick={() => navigate("/money")}>
            <h3>Money Snapshot</h3>
            <p>See your financial position</p>
          </div>

          <div className="feature-card" onClick={() => navigate("/track")}>
            <h3>Strategy Track</h3>
            <p>Plan your next 5 years</p>
          </div>

          <div className="feature-card" onClick={() => navigate("/simulation")}>
            <h3>Simulation Lab</h3>
            <p>Test decisions</p>
          </div>
        </section>

        {/* ── STRATEGY TRACKS PREVIEW ── */}
        <section className="preview-section fade-in">
          <div className="preview-header">
            <div>
              <h3>Strategy Tracks</h3>
              <p className="muted">
                Pathways built around your goals & life stage
              </p>
            </div>
            <button className="primary-btn" onClick={() => navigate("/track")}>
              View Tracks →
            </button>
          </div>

          <div className="preview-grid">
            {/* AVAILABLE */}
            <div
              className="preview-card available"
              onClick={() => navigate("/track")}
            >
              <div className="preview-card-icon">🏠</div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">First Property Path</span>
                  <span className="badge available-badge">Active</span>
                </div>
                <p className="preview-card-sub">
                  Save for a home deposit in 3–5 years
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Saving &amp; Stability
                </p>
              </div>
            </div>

            {/* COMING SOON */}
            <div className="preview-card coming-soon">
              <div className="preview-card-icon muted-icon">⚖️</div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">
                    Balanced Lifestyle &amp; Investing
                  </span>
                  <span className="badge soon-badge">Coming Soon</span>
                </div>
                <p className="preview-card-sub">
                  Maintain your lifestyle while building wealth
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Flexibility &amp;
                  Investing
                </p>
              </div>
            </div>

            <div className="preview-card coming-soon">
              <div className="preview-card-icon muted-icon">🛡️</div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">Foundation Builder</span>
                  <span className="badge soon-badge">Coming Soon</span>
                </div>
                <p className="preview-card-sub">
                  Build financial stability from scratch
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Emergency Funds &amp;
                  Basics
                </p>
              </div>
            </div>

            <div className="preview-card coming-soon">
              <div className="preview-card-icon muted-icon">🔄</div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">
                    Lifestyle Correction
                  </span>
                  <span className="badge soon-badge">Coming Soon</span>
                </div>
                <p className="preview-card-sub">
                  Rebalance spending and reduce debt
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Behavioural Change
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SIMULATIONS PREVIEW ── */}
        <section className="preview-section fade-in">
          <div className="preview-header">
            <div>
              <h3>Simulation Lab</h3>
              <p className="muted">
                Test financial decisions before you make them
              </p>
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate("/simulation")}
            >
              Open Lab →
            </button>
          </div>

          <div className="sim-preview-grid">
            {/* AVAILABLE */}
            <div
              className="sim-card available"
              onClick={() => navigate("/simulation")}
            >
              <div className="sim-card-top">
                <span className="sim-icon">🏘️</span>
                <span className="badge available-badge">Available</span>
              </div>
              <h4>Buy vs Rent</h4>
              <p className="muted">
                Compare the true long-term cost of buying a home vs renting
              </p>
            </div>

            {/* COMING SOON × 3 */}
            <div className="sim-card coming-soon">
              <div className="sim-card-top">
                <span className="sim-icon muted-icon">📈</span>
                <span className="badge soon-badge">Coming Soon</span>
              </div>
              <h4>Investment Growth</h4>
              <p className="muted">
                Project returns across different asset classes over time
              </p>
            </div>

            <div className="sim-card coming-soon">
              <div className="sim-card-top">
                <span className="sim-icon muted-icon">💳</span>
                <span className="badge soon-badge">Coming Soon</span>
              </div>
              <h4>Debt Payoff Planner</h4>
              <p className="muted">Find the fastest path to being debt-free</p>
            </div>

            <div className="sim-card coming-soon">
              <div className="sim-card-top">
                <span className="sim-icon muted-icon">🎯</span>
                <span className="badge soon-badge">Coming Soon</span>
              </div>
              <h4>Retirement Readiness</h4>
              <p className="muted">
                See if you're on track for the retirement you want
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 🔥 FINANCE SCHOOL ORB */}
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
