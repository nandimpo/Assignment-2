import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";

export default function FoundationBuilderTrack() {
  // ================= USER MOCK (connect to context later) =================
  const income = 37000;
  const expenses = 25000;
  const savings = 6000;

  // ================= FOUNDATION LOGIC =================
  const emergencyTarget = expenses * 3; // 3 months rule
  const currentSaved = savings * 2;
  const progress = Math.min(
    (currentSaved / emergencyTarget) * 100,
    100,
  ).toFixed(0);

  // 🧠 STAGE DETECTION
  let currentStage = "";
  let nextStep = "";

  if (progress < 30) {
    currentStage = "Stage 1: Starting Emergency Fund";
    nextStep = "Focus on saving your first 1–2 months of expenses.";
  } else if (progress < 60) {
    currentStage = "Stage 2: Building Stability";
    nextStep = "Increase consistency and reach 3–6 months of savings.";
  } else if (progress < 100) {
    currentStage = "Stage 3: Securing Foundation";
    nextStep = "Maintain discipline and fully complete your emergency fund.";
  } else {
    currentStage = "Stage 4: Ready to Grow";
    nextStep =
      "You can now start investing and move to wealth-building strategies.";
  }

  // ================= SLIDERS =================
  const [expenseAdjust, setExpenseAdjust] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);

  const adjustedExpenses = expenses - expenseAdjust;
  const adjustedSavings = savings + savingsAdjust;

  const remaining = Math.max(emergencyTarget - currentSaved, 0);

  // FIX 1: Removed stray "); " that followed this declaration
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
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="muted">{progress}% complete</p>
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
          <h3>Your 5-Year Journey</h3>

          <div className="timeline">
            <span>Stage 1</span>
            <span>Stage 2</span>
            <span>Stage 3</span>
            <span>Stage 4</span>
            <span>Stage 5</span>
          </div>

          <div className="milestones">
            <span>Build emergency fund (1–3 months)</span>
            <span>Reach full emergency fund (3–6 months)</span>
            <span>Stabilise budget &amp; control spending</span>
            <span>Start first investments</span>
            <span>Transition to wealth building</span>
          </div>
        </div>{" "}
        {/* FIX 2: Added missing closing </div> for 5-Year Journey card */}
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
        </div>{" "}
        {/* FIX 3: Added missing closing </div> for Adjustment Engine card */}
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
                {/* FIX 4: Removed stray "const monthsToGoal" text from inside <li> */}
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
      </div>{" "}
      {/* FIX 5: Added missing closing </div> for container */}
    </div>
  );
}
