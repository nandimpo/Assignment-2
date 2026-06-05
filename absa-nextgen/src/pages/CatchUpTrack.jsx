import { useState } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";
import TypewriterHeading from "../components/TypewriterHeading";

export default function CatchUpTrack() {
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const [extraSaving, setExtraSaving] = useState(0);
  const {
    progress: milestoneProgress,
    toggle,
    percent,
  } = useProgress("catchUpProgress", {
    emergencyFund: false,
    deposit: false,
    purchase: false,
  });

  /* ================= DATA ================= */
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = income - expenses;

  /* ================= TARGET ================= */
  const targetWealth = 1000000;
  const currentWealth = Math.max(150000, savings * 5);
  const wealthProgress = Math.min((currentWealth / targetWealth) * 100, 100);

  /* ================= TIME MODEL ================= */
  const yearlySaving = savings * 12 + extraSaving * 12;
  const remaining = Math.max(targetWealth - currentWealth, 0);
  const yearsToGoal =
    yearlySaving > 0 ? Math.ceil(remaining / yearlySaving) : null;
  const improvedYears =
    yearsToGoal !== null ? Math.max(yearsToGoal - 2, 1) : null;

  /* ================= SCORE SYSTEM ================= */
  let score = 0;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  score += Math.min(savingsRate * 1.5, 40);
  score += Math.min(wealthProgress * 0.4, 40);
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
  if (wealthProgress < 30) {
    insight1 =
      "You are slightly behind, but recovery is achievable with consistency.";
    insight2 =
      "Increasing contributions by 5% could reduce your timeline significantly.";
  } else if (wealthProgress < 60) {
    insight1 =
      "You are making steady progress — keep increasing your savings rate.";
    insight2 =
      "Small increases in savings will have a strong long-term impact.";
  } else {
    insight1 = "You are on track — your current pace is strong.";
    insight2 = "Maintain consistency to reach your goal faster.";
  }

  /* ================= MILESTONE INSIGHTS ================= */
  const milestoneInsights = [];
  if (!milestoneProgress.emergencyFund) {
    milestoneInsights.push(
      "Stabilise your finances by building an emergency fund first.",
    );
  }
  if (milestoneProgress.emergencyFund && !milestoneProgress.deposit) {
    milestoneInsights.push(
      "Good progress — now shift focus to saving for your deposit.",
    );
  }
  if (milestoneProgress.deposit && !milestoneProgress.purchase) {
    milestoneInsights.push(
      "You're close — prepare for property or investment opportunities.",
    );
  }

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Stabilise",
    deposit: "Accelerate Saving",
    purchase: "Wealth Catch-Up",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <TypewriterHeading tag="h1" text="Catch-Up Wealth Track" speed={50} />
        <p className="subtitle">
          Accelerate your financial progress and close the gap
        </p>

        {/* ================= STATUS ================= */}
        <div className="track-card">
          <h2>Catch Up Status</h2>

          <div style={{ marginBottom: "12px" }}>
            <p>🎯 Target Wealth: R{targetWealth.toLocaleString()}</p>
            <p>📊 Current: R{currentWealth.toLocaleString()}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${wealthProgress}%` }}
            />
          </div>

          <p className="small">{Math.round(wealthProgress)}% of target</p>

          {/* TIME MODEL */}
          <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    i < Math.round((percent / 100) * 5) ? "#84a794" : "#1a1f1e",
                }}
              />
            ))}
          </div>

          <p className="small">
            Current pace:{" "}
            {yearsToGoal !== null ? `${yearsToGoal} years` : "N/A"}
          </p>
          <p className="small">
            Optimised pace:{" "}
            {improvedYears !== null ? `${improvedYears} years` : "N/A"}
          </p>
        </div>

        {/* ================= SCORE ================= */}
        <div className="track-card">
          <h2>📊 Financial Score</h2>

          <div className="score-box">
            <h1 style={{ color: scoreColor }}>{score}/100</h1>
            <p className="small">{scoreStatus}</p>
          </div>

          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${score}%`, background: scoreColor }}
            />
          </div>

          <p className="small">
            Your score reflects your savings rate, progress, and time to goal.
          </p>
        </div>

        {/* ================= 5-YEAR JOURNEY TIMELINE ================= */}
        <div className="track-card">
          <h2>Catch-Up Journey Timeline</h2>

          {/* HORIZONTAL TIMELINE */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "30px",
              paddingBottom: "20px",
            }}
          >
            {/* BACKGROUND LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                right: "0",
                height: "3px",
                background: "#1a1f1e",
                zIndex: 0,
              }}
            />
            {/* FILLED LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                height: "3px",
                width: `${percent}%`,
                background: "linear-gradient(to right, #d6a85a, #84a794)",
                zIndex: 1,
                transition: "width 0.4s ease",
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = milestoneProgress[step];
              const isCurrent =
                !milestoneProgress[step] &&
                (index === 0 || milestoneProgress[steps[index - 1]]);
              const isLocked =
                index > 0 && !milestoneProgress[steps[index - 1]];

              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    zIndex: 2,
                  }}
                >
                  <div
                    className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => !isLocked && toggle(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{timelineLabels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${milestoneProgress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 &&
              "You're behind — focus on stabilising your finances."}
            {percent >= 25 &&
              percent < 50 &&
              "Progress started — increase your savings rate."}
            {percent >= 50 &&
              percent < 75 &&
              "Momentum building — stay disciplined."}
            {percent >= 75 &&
              percent < 100 &&
              "Catch-up almost complete — final push."}
            {percent === 100 &&
              "🚀 You're back on track — wealth growth unlocked."}
          </p>
        </div>

        {/* ================= STRATEGY GUIDE ================= */}
        <div className="track-card">
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

        {/* ================= ADJUSTMENT + INSIGHTS GRID ================= */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Allocation Engine</h3>

            <div className="slider-group">
              <label>Extra Monthly Saving</label>
              <input
                type="range"
                min="0"
                max="10000"
                step="500"
                value={extraSaving}
                onChange={(e) => setExtraSaving(Number(e.target.value))}
              />
              <span className="slider-hint">
                +R{extraSaving.toLocaleString()} / month — reduces time to goal
              </span>
            </div>

            <p className="small">
              {score < 40 &&
                "⚠️ You are falling behind — increase savings urgently"}
              {score >= 40 &&
                score < 70 &&
                "📈 You are improving — stay consistent"}
              {score >= 70 && "🚀 You are on track — maintain your strategy"}
            </p>
          </div>

          <div className="track-card">
            <h3>AI Insights</h3>

            <div className="insight-block">
              <div className="insight">💡 {insight1}</div>
              <div className="insight">🔔 {insight2}</div>
            </div>
          </div>
        </div>

        {/* ================= MILESTONE INSIGHTS ================= */}
        <div className="track-card">
          <h3>Milestone Insights</h3>

          <div className="insight-block">
            {milestoneInsights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
