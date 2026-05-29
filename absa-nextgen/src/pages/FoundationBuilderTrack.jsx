// FIX 1: Removed duplicate useState import — only one import statement needed
// FIX 2: Added useEffect to the import (was used but never imported)
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";

export default function FoundationBuilderTrack() {
  // ================= USER CONTEXT =================
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST (moved sliders up before calculations)
  // FIX 3: useProgress needs a key + default state to match the other tracks
  const {
    progress: milestoneProgress,
    toggle,
    percent,
  } = useProgress("foundationProgress", {
    emergencyFund: false,
    deposit: false,
    purchase: false,
  });

  // FIX 4: slider useState hooks moved above calculations (hooks must come before any logic)
  const [expenseAdjust, setExpenseAdjust] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);

  // ================= CALCULATIONS (after all hooks) =================
  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = income - expenses;

  // ================= FOUNDATION LOGIC =================
  const emergencyTarget = expenses * 3; // 3 months rule
  const currentSaved = savings * 2;
  const fundProgress = Math.min(
    (currentSaved / emergencyTarget) * 100,
    100,
  ).toFixed(0);

  // FIX 5: useEffect must come after all useState/useProgress hooks but before returns
  useEffect(() => {
    if (Number(fundProgress) >= 100 && !milestoneProgress.emergencyFund) {
      toggle("emergencyFund");
    }
  }, [fundProgress]);

  // FIX 6: isLocked used undefined 'step' at top scope — removed from here,
  // moved inline inside the stepper map below (same fix applied in PropertyTrack)
  const overallProgress = Math.round((Number(fundProgress) + percent) / 2);

  // FIX 7: milestone insights used 'progress' which doesn't exist — renamed to milestoneProgress
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
  const adjustedExpenses = expenses - expenseAdjust;
  const adjustedSavings = savings + savingsAdjust;

  const remaining = Math.max(emergencyTarget - currentSaved, 0);

  const monthsToGoal =
    adjustedSavings > 0 ? Math.ceil(remaining / adjustedSavings) : null;

  return (
    <div className="track-page">
      <AppNav />
      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Foundation Builder Track</h1>
        <p className="muted">
          Build your financial base before investing and long-term growth.
        </p>

        {/* ================= EMERGENCY FUND STATUS ================= */}
        <div className="card">
          <h3>Emergency Fund Progress</h3>

          <div className="stat-row">
            <p>Target</p>
            <p>R{emergencyTarget.toLocaleString()}</p>
          </div>

          <div className="stat-row">
            <p>Current Saved</p>
            <p>R{currentSaved.toLocaleString()}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${fundProgress}%` }}
            >
              <p className="muted">{fundProgress}% complete</p>
            </div>
          </div>

          {/* FIX 8: milestoneProgress is an object, not a number — use percent here */}
          <p className="muted">{percent}% complete</p>
        </div>

        {/* ================= CURRENT STAGE ================= */}
        <div className="card">
          <h3>📍 Your Current Stage</h3>

          <p className="accent">{currentStage}</p>

          <div className="next-step-box">
            <h4>Next Step</h4>
            <p>{nextStep}</p>
          </div>
        </div>

        <div className="insight-block">
          <h4>Milestone Insights</h4>
          {milestoneInsights.map((item, i) => (
            <div key={i} className="insight">
              {item}
            </div>
          ))}
        </div>

        {/* ================= ESSENTIAL ALLOCATION ================= */}
        <div className="card">
          <h3>Essential Allocation</h3>

          <ul className="list">
            <li>Needs (Rent, Food): 60%</li>
            <li>Savings (Emergency Fund): 25%</li>
            <li>Support (Black Tax / Family): 15%</li>
          </ul>

          <p className="muted">
            This reflects a realistic South African financial structure.
          </p>
        </div>

        {/* ================= 5 YEAR JOURNEY ================= */}
        <div className="card">
          <h3>Milestones</h3>

          <div className="stepper">
            {["emergencyFund", "deposit", "purchase"].map((step, index) => {
              const labels = {
                emergencyFund: "Emergency Fund",
                deposit: "Deposit",
                purchase: "Purchase",
              };

              const steps = ["emergencyFund", "deposit", "purchase"];

              const isCompleted = milestoneProgress[step];
              const isCurrent =
                !milestoneProgress[step] &&
                (index === 0 || milestoneProgress[steps[index - 1]]);
              // FIX 9: isLocked now correctly scoped inside the map using step variable
              const isLocked =
                index > 0 && !milestoneProgress[steps[index - 1]];

              return (
                <div key={step} className="step-wrapper">
                  <div
                    className={`step 
              ${isCompleted ? "completed" : ""} 
              ${isCurrent ? "current" : ""} 
              ${isLocked ? "locked" : ""}
            `}
                    onClick={() => !isLocked && toggle(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  <span className="step-label">{labels[step]}</span>

                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${
                        milestoneProgress[step] ? "filled" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <h3>Overall Progress</h3>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p>{overallProgress}% complete</p>
          <p className="muted">{percent}% complete</p>
        </div>

        {/* ================= ADJUSTMENT ENGINE ================= */}
        <div className="card">
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
            <p>-R{expenseAdjust}</p>
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
            <p>+R{savingsAdjust}</p>
          </div>

          <div className="result">
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
        <div className="card">
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
        <div className="card">
          <h3>AI Financial Insights</h3>

          <div className="insight">
            <p>
              You are still in the foundation phase. Focus on building stability
              before pursuing aggressive growth.
            </p>
          </div>

          <div className="insight">
            <p>
              Reducing expenses by R2000 could help you reach your emergency
              fund 5–6 months faster.
            </p>
          </div>

          <div className="insight">
            <p>
              Consistency matters more than amount — even small savings build
              long-term security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
