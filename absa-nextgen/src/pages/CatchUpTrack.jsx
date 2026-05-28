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

  const remaining = Math.max(targetWealth - currentWealth, 0);

  const yearsToGoal =
    yearlySaving > 0 ? Math.ceil(remaining / yearlySaving) : null;

  // FIX: guard against null before subtracting
  const improvedYears =
    yearsToGoal !== null ? Math.max(yearsToGoal - 2, 1) : null;

  /* ================= SCORE SYSTEM ================= */
  let score = 0;

  // Savings strength (max 40)
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  score += Math.min(savingsRate * 1.5, 40);

  // Progress toward goal (max 40)
  score += Math.min(progress * 0.4, 40);

  // Time efficiency (max 20)
  if (yearsToGoal !== null) {
    if (yearsToGoal < 5) score += 20;
    else if (yearsToGoal < 10) score += 10;
    else score += 5;
  }

  score = Math.round(score);
  let scoreStatus = "";
  let scoreColor = "";

  if (score < 40) {
    scoreStatus = "Behind";
    scoreColor = "#ff6b6b";
  } else if (score < 70) {
    scoreStatus = "Improving";
    scoreColor = "#f4a261";
  } else {
    scoreStatus = "Strong";
    scoreColor = "#2a9d8f";
  }

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

          <p>
            Current pace:{" "}
            {yearsToGoal !== null ? `${yearsToGoal} years` : "N/A"}
          </p>
          <p>
            Optimised pace:{" "}
            {improvedYears !== null ? `${improvedYears} years` : "N/A"}
          </p>
        </div>
        {/* ================= SCORE ================= */}
        <div className="card">
          <h2>📊 Financial Score</h2>

          <div className="score-box">
            <h1 style={{ color: scoreColor }}>{score}/100</h1>
            <p className="muted">{scoreStatus}</p>
          </div>

          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${score}%`,
                background: scoreColor,
              }}
            />
          </div>

          <p className="small">
            Your score reflects your savings rate, progress, and time to goal.
          </p>
        </div>
        {/* ================= JOURNEY ================= */}
        <div className="card">
          <h2>Your 5 Year Journey</h2>

          <div className="timeline">
            <div className="timeline-item">
              <span>Stage 1</span>
              <div className="milestone">Emergency fund</div>
            </div>

            <div className="timeline-item">
              <span>Stage 2</span>
              <div className="milestone">Debt reduction</div>
            </div>

            <div className="timeline-item">
              <span>Stage 3</span>
              <div className="milestone">Accelerated saving</div>
            </div>

            <div className="timeline-item">
              <span>Stage 4</span>
              <div className="milestone">Deposit / asset goal</div>
            </div>

            <div className="timeline-item">
              <span>Stage 5</span>
              <div className="milestone">Financial stability</div>
            </div>
          </div>
        </div>{" "}
        {/* FIX: closed journey card here */}
        {/* ================= STRATEGY GUIDE ================= */}
        <div className="card">
          <h2>Catch-Up Strategy Guide</h2>

          <div className="grid-2">
            <div>
              <h3>📌 What You Should Do</h3>
              <ul className="list">
                <li>Increase your savings rate aggressively (20–40%)</li>
                <li>Cut unnecessary lifestyle expenses</li>
                <li>Prioritise paying off high-interest debt</li>
                <li>Invest consistently once stable</li>
              </ul>
            </div>

            <div>
              <h3>⚠️ Risks to Watch</h3>
              <ul className="list">
                <li>Burnout from saving too aggressively</li>
                <li>Unrealistic expectations about "catching up fast"</li>
                <li>Neglecting emergency savings</li>
                <li>Taking high-risk investments to compensate</li>
              </ul>
            </div>
          </div>

          <div className="explanation-box">
            <h3>🧠 Real Explanation</h3>
            <p>
              This track is for users who feel behind financially and want to
              accelerate their progress. The focus is not just saving more, but
              making smarter financial decisions.
            </p>

            <p>
              Catching up requires discipline — increasing income, reducing
              expenses, and staying consistent. The biggest mistake is trying to
              rush with risky decisions instead of building a strong foundation
              first.
            </p>
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

          {/* FIX: moved score hint inside grid, inside its own card */}
          <div className="card">
            <p className="small">
              {score < 40 &&
                "⚠️ You are falling behind — increase savings urgently"}
              {score >= 40 &&
                score < 70 &&
                "📈 You are improving — stay consistent"}
              {score >= 70 && "🚀 You are on track — maintain your strategy"}
            </p>
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
