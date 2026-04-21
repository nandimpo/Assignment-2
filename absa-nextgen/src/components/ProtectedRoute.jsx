import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  /* ========================= */
  /* SAFE USER (NO CRASH) */
  /* ========================= */
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  /* ========================= */
  /* EXISTING DATA (UNCHANGED) */
  /* ========================= */
  const income = user?.salary || 55000;
  const expenses = user?.expenses || 29000;
  const net = income - expenses;
  const savingsRate = Math.round((net / income) * 100);

  /* ========================= */
  /* SMART NEXT STEP */
  /* ========================= */
  let nextStep = "Move closer to your 5-year goal";

  if (!user?.strategy) {
    nextStep = "Choose your financial strategy";
  } else if (!user?.salary) {
    nextStep = "Add your income details";
  } else if (!user?.expenses) {
    nextStep = "Track your monthly expenses";
  }

  /* ========================= */
  /* NUDGE */
  /* ========================= */
  const [nudgeType, setNudgeType] = useState("positive");

  useEffect(() => {
    if (savingsRate < 20) setNudgeType("warning");
    else setNudgeType("positive");
  }, [savingsRate]);

  /* ========================= */
  /* UI (UNCHANGED) */
  /* ========================= */
  return (
    <div className="home">
      <AppNav />

      {/* ================= HEADER ================= */}
      <section className="home-header fade-in">
        <h2>{user?.name ? `Welcome back, ${user.name}` : "Welcome"}</h2>

        <p>
          You are on the{" "}
          <span className="accent">{user?.strategy || "Property"}</span> track
        </p>
      </section>

      {/* ================= NEXT STEP ================= */}
      <section className="next-step glass fade-in">
        <div>
          <p className="label">Next Step</p>
          <h3>{nextStep}</h3>
        </div>

        <button className="primary-btn glow" onClick={() => navigate("/track")}>
          Continue →
        </button>
      </section>

      {/* ================= FINANCIAL HEALTH ================= */}
      <section className="health-card glass fade-in">
        <div className="score-ring glow-ring">100</div>

        <div>
          <h3>
            Financial Health
            <span className="info-hover">
              ⓘ
              <div className="tooltip">
                Based on savings rate, spending behaviour and setup progress.
              </div>
            </span>
          </h3>
          <p className="muted">Excellent</p>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="stats fade-in">
        <div className="stat card-hover">
          <p>Monthly income</p>
          <h3>R{income.toLocaleString()}</h3>
        </div>

        <div className="stat card-hover">
          <p>Fixed Costs</p>
          <h3>R{expenses.toLocaleString()}</h3>
        </div>

        <div
          className="stat highlight clickable card-hover"
          onClick={() => navigate("/money")}
        >
          <p>Net Position</p>
          <h3>R{net.toLocaleString()}</h3>
          <span className="view-link">View breakdown →</span>
        </div>
      </section>

      {/* ================= NUDGE ================= */}
      <section className={`nudge ${nudgeType} fade-in`}>
        {nudgeType === "positive" ? (
          <p>You're saving {savingsRate}% — ahead of most people your age</p>
        ) : (
          <p>Your savings rate is low — consider reducing expenses</p>
        )}
      </section>

      {/* ================= HERO ================= */}
      <section className="hero-row fade-in">
        <div className="hero-text">
          <h2>Take control of your financial future</h2>
          <p className="muted">
            Track your money, simulate decisions, and move forward with clarity.
          </p>
        </div>

        <button className="primary-btn glow" onClick={() => navigate("/money")}>
          View Money Snapshot →
        </button>
      </section>

      {/* ================= SIMULATIONS ================= */}
      <section className="simulation-box fade-in">
        <h3>Your Simulations</h3>

        {user?.simulations?.length > 0 ? (
          user.simulations.map((sim, i) => (
            <div key={i} className="sim-item">
              {sim}
            </div>
          ))
        ) : (
          <p className="empty">
            No simulations yet — start exploring scenarios
          </p>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="feature-row fade-in">
        <div
          className="feature-card card-hover"
          onClick={() => navigate("/money")}
        >
          <h3>Money Snapshot</h3>
          <p>See your income, expenses, and net position</p>
        </div>

        <div
          className="feature-card card-hover"
          onClick={() => navigate("/track")}
        >
          <h3>Strategy Track</h3>
          <p>Set and monitor financial goals</p>
        </div>

        <div
          className="feature-card card-hover"
          onClick={() => navigate("/simulation")}
        >
          <h3>Simulation Lab</h3>
          <p>Test “what-if” scenarios</p>
        </div>
      </section>
    </div>
  );
}
