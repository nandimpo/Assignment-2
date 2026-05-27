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

  // ================= SLIDERS =================
  const [expenseAdjust, setExpenseAdjust] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);

  const adjustedExpenses = expenses - expenseAdjust;
  const adjustedSavings = savings + savingsAdjust;

  const monthsToGoal = Math.ceil(
    (emergencyTarget - currentSaved) / (adjustedSavings || 1),
  );

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
            <span>Year 1</span>
            <span>Year 2</span>
            <span>Year 3</span>
            <span>Year 4</span>
            <span>Year 5</span>
          </div>

          <div className="milestones">
            <span>Emergency Fund</span>
            <span>Budget Discipline</span>
            <span>First Investment</span>
            <span>Stability</span>
            <span>Growth</span>
          </div>
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
            <p>
              Time to Goal: <strong>{monthsToGoal} months</strong>
            </p>
          </div>
        </div>

        {/* ================= EDUCATION PANEL ================= */}
        <div className="card">
          <h3>Financial Knowledge</h3>

          <p>
            An emergency fund covers 3–6 months of living expenses. It protects
            you from unexpected events such as job loss, medical emergencies, or
            economic shocks.
          </p>

          <ul className="list">
            <li>Start with small, consistent savings</li>
            <li>Prioritise stability before investing</li>
            <li>Account for family obligations (black tax)</li>
          </ul>
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
