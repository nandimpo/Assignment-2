import { useState } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";

export default function CatchUpTrack() {
  const { user } = useUser();

  /* ================= DATA ================= */
  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;

  const savings = income - expenses;

  /* ================= TARGET ================= */
  const targetWealth = 1000000;
  const currentWealth = Math.max(150000, savings * 5);

  const progress = Math.min((currentWealth / targetWealth) * 100, 100);

  /* ================= TIME MODEL ================= */
  const [extraSaving, setExtraSaving] = useState(0);

  const yearlySaving = savings * 12 + extraSaving * 12;

  const yearsToGoal = yearlySaving
    ? Math.ceil((targetWealth - currentWealth) / yearlySaving)
    : 0;

  const improvedYears = Math.max(yearsToGoal - 2, 1);

  /* ================= MILESTONES ================= */
  const milestones = [
    "Emergency fund",
    "Debt Reduction",
    "Accelerated Investing",
    "Wealth Accumulation",
    "Financial Freedom",
  ];

  /* ================= INSIGHTS ================= */
  let insight1 = "";
  let insight2 = "";

  if (progress < 30) {
    insight1 =
      "You are slightly behind, but recovery is achievable with consistency.";
    insight2 =
      "Increasing contributions by 5% could reduce your timeline significantly.";
  } else if (progress < 60) {
    insight1 =
      "You are making steady progress — keep increasing your savings rate.";
    insight2 =
      "Small increases in savings will have a strong long-term impact.";
  } else {
    insight1 = "You are on track — your current pace is strong.";
    insight2 = "Maintain consistency to reach your goal faster.";
  }

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Catch-Up Wealth Track</h1>
        <p className="muted">
          Accelerate your financial progress and close the gap
        </p>

        {/* ================= STATUS ================= */}
        <div className="card">
          <h2>Catch Up Status</h2>

          <div className="snapshot-list">
            <p>🎯 Target Wealth: R{targetWealth.toLocaleString()}</p>
            <p>📊 Current: R{currentWealth.toLocaleString()}</p>
          </div>

          {/* PROGRESS BAR */}
          <div className="progress-bar">
            <div
              className="progress saving"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progress-labels">
            <span>{Math.round(progress)}%</span>
          </div>

          {/* TIME MODEL */}
          <div className="timeline-points">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="dot" />
            ))}
          </div>

          <p>Current pace: {yearsToGoal} years</p>
          <p>Optimised pace: {improvedYears} years</p>
        </div>

        {/* ================= JOURNEY ================= */}
        <div className="card">
          <h2>Your 5 Year Journey</h2>

          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <span>Year {i + 1}</span>
                <div className="milestone">{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid">
          {/* ADJUSTMENT */}
          <div className="card">
            <h3>Allocation Engine</h3>

            <p>Extra Monthly Saving</p>

            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={extraSaving}
              onChange={(e) => setExtraSaving(Number(e.target.value))}
            />

            <p>+R{extraSaving.toLocaleString()} / month</p>

            <small>Increase savings to reduce your time to goal.</small>
          </div>

          {/* INSIGHTS */}
          <div className="card">
            <h3>AI Insights</h3>

            <div className="insight">💡 {insight1}</div>
            <div className="insight">🔔 {insight2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
