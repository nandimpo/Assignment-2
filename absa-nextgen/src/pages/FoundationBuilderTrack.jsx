import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";

export default function FoundationBuilderTrack() {
  // ================= USER CONTEXT =================
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const {
    progress: milestoneProgress,
    toggle,
    percent,
  } = useProgress("foundationProgress", {
    emergencyFund: false,
    deposit: false,
    purchase: false,
  });

  const [expenseAdjust, setExpenseAdjust] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);

  // ================= CALCULATIONS (after all hooks) =================
  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = income - expenses;

  // ================= FOUNDATION LOGIC =================
  const emergencyTarget = expenses * 3;
  const currentSaved = savings * 2;

  // FIX: toFixed returns a string — use Number() so comparisons work correctly
  const fundProgress = Number(
    Math.min((currentSaved / emergencyTarget) * 100, 100).toFixed(0),
  );

  // ✅ useEffect after all hooks, before any derived logic
  useEffect(() => {
    if (fundProgress >= 100 && !milestoneProgress.emergencyFund) {
      toggle("emergencyFund");
    }
  }, [fundProgress]);

  const overallProgress = Math.round((fundProgress + percent) / 2);

  // ================= MILESTONE INSIGHTS =================
  const milestoneInsights = [];

  if (!milestoneProgress.emergencyFund) {
    milestoneInsights.push(
      "Build your emergency fund first — this protects you from setbacks.",
    );
  }

  if (milestoneProgress.emergencyFund && !milestoneProgress.deposit) {
    milestoneInsights.push(
      "Great — your foundation is set. Now focus on saving for your deposit.",
    );
  }

  if (milestoneProgress.deposit && !milestoneProgress.purchase) {
    milestoneInsights.push(
      "You're close. Start preparing for bond approval and purchase costs.",
    );
  }

  if (milestoneProgress.purchase) {
    milestoneInsights.push(
      "🎉 You've completed your property journey — time to optimise ownership.",
    );
  }

  // ================= STAGE DETECTION =================
  let currentStage = "";
  let nextStep = "";

  if (fundProgress < 30) {
    currentStage = "Stage 1: Starting Emergency Fund";
    nextStep = "Focus on saving your first 1–2 months of expenses.";
  } else if (fundProgress < 60) {
    currentStage = "Stage 2: Building Stability";
    nextStep = "Increase consistency and reach 3–6 months of savings.";
  } else if (fundProgress < 100) {
    currentStage = "Stage 3: Securing Foundation";
    nextStep = "Maintain discipline and fully complete your emergency fund.";
  } else {
    currentStage = "Stage 4: Ready to Grow";
    nextStep =
      "You can now start investing and move to wealth-building strategies.";
  }

  // ================= SLIDER CALCULATIONS =================
  const adjustedSavings = savings + savingsAdjust;
  const remaining = Math.max(emergencyTarget - currentSaved, 0);
  const monthsToGoal =
    adjustedSavings > 0 ? Math.ceil(remaining / adjustedSavings) : null;

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Emergency Fund",
    deposit: "Save Deposit",
    purchase: "Purchase",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <h1>Foundation Builder Track</h1>
        <p className="subtitle">
          Build your financial base before investing and long-term growth.
        </p>

        {/* ================= EMERGENCY FUND STATUS ================= */}
        <div className="track-card">
          <h3>Emergency Fund Progress</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <p>Target</p>
            <p>R{emergencyTarget.toLocaleString()}</p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <p>Current Saved</p>
            <p>R{currentSaved.toLocaleString()}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${fundProgress}%` }}
            >
              <span className="progress-text">{fundProgress}%</span>
            </div>
          </div>

          <p className="small">{fundProgress}% complete</p>
        </div>

        {/* ================= CURRENT STAGE ================= */}
        <div className="track-card">
          <h3>📍 Your Current Stage</h3>

          <p className="accent">{currentStage}</p>

          <div className="next-step-box">
            <h4>Next Step</h4>
            <p>{nextStep}</p>
          </div>
        </div>

        {/* ================= MILESTONE INSIGHTS ================= */}
        <div className="track-card">
          <div className="insight-block">
            <h4>Milestone Insights</h4>
            {milestoneInsights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ================= ESSENTIAL ALLOCATION ================= */}
        <div className="track-card">
          <h3>Essential Allocation</h3>

          <ul className="list">
            <li>Needs (Rent, Food): 60%</li>
            <li>Savings (Emergency Fund): 25%</li>
            <li>Support (Black Tax / Family): 15%</li>
          </ul>

          <p className="small">
            This reflects a realistic South African financial structure.
          </p>
        </div>

        {/* ================= VISUAL TIMELINE ================= */}
        <div className="track-card">
          <h3>5-Year Financial Journey</h3>

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
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 && "Strong start — build your foundation."}
            {percent >= 25 && percent < 50 && "You're gaining momentum."}
            {percent >= 50 &&
              percent < 75 &&
              "Halfway there — stay consistent."}
            {percent >= 75 && percent < 100 && "Almost there — final push."}
            {percent === 100 &&
              "🎉 Goal achieved — financial milestone complete."}
          </p>
        </div>

        {/* ================= OVERALL PROGRESS ================= */}
        <div className="track-card">
          <h3>Overall Progress</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <p className="small">{overallProgress}% complete</p>
        </div>

        {/* ================= ADJUSTMENT ENGINE ================= */}
        <div className="track-card">
          <h3>Budget Adjustment Tool</h3>

          <div className="slider-group">
            <label>Reduce Expenses</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={expenseAdjust}
              onChange={(e) => setExpenseAdjust(Number(e.target.value))}
            />
            <span className="slider-hint">-R{expenseAdjust}</span>
          </div>

          <div className="slider-group">
            <label>Increase Savings</label>
            <input
              type="range"
              min="0"
              max="5000"
              value={savingsAdjust}
              onChange={(e) => setSavingsAdjust(Number(e.target.value))}
            />
            <span className="slider-hint">+R{savingsAdjust}</span>
          </div>

          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#14161b",
              borderRadius: "10px",
              border: "1px solid #222",
            }}
          >
            <p>
              Adjusted Savings:{" "}
              <strong>R{adjustedSavings.toLocaleString()}</strong>
            </p>

            {monthsToGoal ? (
              <p>
                You can reach your emergency fund in{" "}
                <strong>{monthsToGoal} months</strong>
              </p>
            ) : (
              <p className="warning-text">
                Increase savings or reduce expenses to start progress
              </p>
            )}
          </div>
        </div>

        {/* ================= STRATEGY GUIDE ================= */}
        <div className="track-card">
          <h3>Foundation Strategy Guide</h3>

          <div className="grid-2">
            <div>
              <h4>📌 What You Should Do</h4>
              <ul className="list">
                <li>Build an emergency fund (3–6 months expenses)</li>
                <li>Track every expense to understand your cash flow</li>
                <li>Reduce unnecessary or inconsistent spending</li>
                <li>Stabilise income before investing</li>
              </ul>
            </div>

            <div>
              <h4>⚠️ Risks to Watch</h4>
              <ul className="list">
                <li>Running out of cash during emergencies</li>
                <li>Living paycheck to paycheck</li>
                <li>Taking on debt due to lack of savings</li>
                <li>Delaying this stage too long and never progressing</li>
              </ul>
            </div>
          </div>

          <div className="explanation-box">
            <h4>🧠 Real Explanation</h4>
            <p>
              This stage is about survival and stability. Before you can invest
              or grow wealth, you need a financial safety net. Without it, one
              unexpected expense can reset all your progress.
            </p>
            <p>
              Many people skip this step and go straight to investing — but
              without stability, they end up withdrawing investments or going
              into debt. This phase protects your future progress.
            </p>
          </div>
        </div>

        {/* ================= AI INSIGHTS ================= */}
        <div className="track-card">
          <h3>AI Financial Insights</h3>

          <div className="insight-block">
            <div className="insight">
              You are still in the foundation phase. Focus on building stability
              before pursuing aggressive growth.
            </div>
            <div className="insight">
              Reducing expenses by R2000 could help you reach your emergency
              fund 5–6 months faster.
            </div>
            <div className="insight">
              Consistency matters more than amount — even small savings build
              long-term security.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
