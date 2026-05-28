import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import { getTrackProgression } from "../utils/trackProgression";

export default function LifestyleCorrectionTrack() {
  // ================= USER MOCK =================
  const income = 46000;
  const expenses = 42000;
  const debt = 85000;
  const savings = 2000;

  // FIX 1: `user` was undefined — now passing the actual user data object
  const progression = getTrackProgression({ income, expenses, debt, savings });

  // ================= CORE CALCULATIONS =================
  const disposableIncome = income - expenses;
  const savingsRate = ((savings / income) * 100).toFixed(0);
  const baseDebtPayment = 4000;

  // ================= SLIDERS =================
  const [expenseCut, setExpenseCut] = useState(0);
  const [extraDebt, setExtraDebt] = useState(0);

  const newExpenses = expenses - expenseCut;
  const newDebtPayment = baseDebtPayment + extraDebt;
  const monthsToDebtFree = Math.ceil(debt / (newDebtPayment || 1));

  // ================= RECOVERY STATUS =================
  let status = "Critical";
  if (savingsRate > 20) status = "Recovering";
  if (savingsRate > 35) status = "Stable";

  // ================= STAGE DETECTION =================
  let currentStage = "";
  let nextStep = "";

  if (debt > income * 2) {
    currentStage = "Stage 1: Financial Stress";
    nextStep = "Cut spending immediately and stop increasing debt.";
  } else if (debt > 0) {
    currentStage = "Stage 2: Debt Reduction";
    nextStep = "Focus on paying off high-interest debt aggressively.";
  } else if (savings < expenses * 3) {
    currentStage = "Stage 3: Rebuilding Stability";
    nextStep = "Start building your emergency fund.";
  } else {
    currentStage = "Stage 4: Ready to Grow";
    nextStep = "You can now move into investing or property strategies.";
  }

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Lifestyle Correction Track</h1>
        <p className="muted">
          Rebalance your finances by reducing debt and controlling spending.
        </p>
        {/* ================= FINANCIAL PATH ================= */}
        <div className="card">
          <h3>📍 Your Financial Path</h3>

          <p>
            Current Track: <strong>{progression?.track}</strong>
          </p>

          <p className="muted">{progression?.message}</p>

          {progression?.next && (
            <div className="next-step-box">
              <h4>Next Stage</h4>
              <p>
                Once ready, you will move to <strong>{progression.next}</strong>
              </p>
            </div>
          )}
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
        {/* ================= FINANCIAL STATUS ================= */}
        <div className="card">
          <h3>Financial Recovery Status</h3>

          <div className="stat-row">
            <p>Income</p>
            <p>R{income.toLocaleString()}</p>
          </div>

          <div className="stat-row">
            <p>Expenses</p>
            <p>R{expenses.toLocaleString()}</p>
          </div>

          <div className="stat-row">
            <p>Debt</p>
            <p>R{debt.toLocaleString()}</p>
          </div>

          <div className="stat-row">
            <p>Status</p>
            <p className={`status ${status.toLowerCase()}`}>{status}</p>
          </div>
        </div>
        {/* ================= SPENDING BREAKDOWN ================= */}
        <div className="card">
          <h3>Spending Breakdown</h3>

          <ul className="list">
            <li>Housing & Bills: 45%</li>
            <li>Lifestyle: 30%</li>
            <li>Debt Repayment: 20%</li>
            <li>Savings: 5%</li>
          </ul>

          <p className="muted">
            Your lifestyle spending is currently too high relative to your
            income.
          </p>
        </div>
        {/* ================= DEBT PROGRESS ================= */}
        <div className="card">
          <h3>Debt Payoff Plan</h3>

          <div className="progress-bar">
            <div
              className="progress-fill warning"
              style={{
                width: `${Math.min((baseDebtPayment / debt) * 100, 100)}%`,
              }}
            ></div>
          </div>

          <p className="muted">
            Current pace: {Math.ceil(debt / baseDebtPayment)} months to clear
            debt
          </p>
        </div>
        <div className="progression-flow">
          <span>Correction</span>
          <span>→</span>
          <span>Foundation</span>
          <span>→</span>
          <span>Balanced</span>
          <span>→</span>
          <span>Property</span>
        </div>
        {/* ================= ADJUSTMENT ENGINE ================= */}
        <div className="card">
          <h3>Spending Adjustment Tool</h3>

          <div className="slider-group">
            <label>Reduce Lifestyle Spending</label>
            <input
              type="range"
              min="0"
              max="8000"
              value={expenseCut}
              onChange={(e) => setExpenseCut(Number(e.target.value))}
            />
            <p>-R{expenseCut}</p>
          </div>

          <div className="slider-group">
            <label>Increase Debt Repayment</label>
            <input
              type="range"
              min="0"
              max="8000"
              value={extraDebt}
              onChange={(e) => setExtraDebt(Number(e.target.value))}
            />
            <p>+R{extraDebt}</p>
          </div>

          <div className="result">
            <p>
              New Expenses: <strong>R{newExpenses.toLocaleString()}</strong>
            </p>
            <p>
              Debt-Free In: <strong>{monthsToDebtFree} months</strong>
            </p>
          </div>
        </div>
        {/* ================= 5 YEAR RECOVERY ================= */}
        <div className="card">
          <h3>Your Recovery Journey</h3>

          <div className="timeline">
            <span>Stage 1</span>
            <span>Stage 2</span>
            <span>Stage 3</span>
            <span>Stage 4</span>
            <span>Stage 5</span>
          </div>

          <div className="milestones">
            <span>Reduce overspending</span>
            <span>Control and stabilise expenses</span>
            <span>Become debt-free</span>
            <span>Build emergency fund</span>
            <span>Transition to property / investing</span>
          </div>
        </div>{" "}
        {/* FIX 2: Added missing closing </div> for Recovery Journey card */}
        {/* ================= BEHAVIOURAL INSIGHTS ================= */}
        <div className="card">
          <h3>Behavioural Insights</h3>

          <div className="insight">
            <p>
              Overspending is often driven by habits, not income. Track your
              behaviour.
            </p>
          </div>

          <div className="insight">
            <p>
              Reducing lifestyle expenses by R3000/month could cut your debt
              timeline by years.
            </p>
          </div>

          <div className="insight">
            <p>
              Focus on consistency — small changes compound into major financial
              recovery.
            </p>
          </div>
        </div>
        {/* ================= STRATEGY GUIDE ================= */}
        <div className="card">
          <h3>Lifestyle Correction Strategy Guide</h3>

          <div className="grid-2">
            <div>
              <h4>📌 What You Should Do</h4>
              <ul className="list">
                <li>Cut non-essential lifestyle spending aggressively</li>
                <li>Prioritise paying off high-interest debt first</li>
                <li>Create a strict monthly budget and stick to it</li>
                <li>Avoid taking on new debt while recovering</li>
              </ul>
            </div>

            <div>
              <h4>⚠️ Risks to Watch</h4>
              <ul className="list">
                <li>Falling back into old spending habits</li>
                <li>Using credit to maintain lifestyle</li>
                <li>Emotional or impulsive spending</li>
                <li>Burnout from overly strict budgeting</li>
              </ul>
            </div>
          </div>

          <div className="explanation-box">
            <h4>🧠 Real Explanation</h4>
            <p>
              This phase is about correcting behaviour, not just numbers. Many
              financial problems come from spending habits rather than income
              levels.
            </p>

            <p>
              The goal is to reduce pressure by eliminating debt and regaining
              control. Once your expenses are stable and debt is cleared, you
              can move into saving, investing, or property ownership.
            </p>
          </div>
        </div>
        {/* ================= AI INSIGHTS ================= */}
        <div className="card">
          <h3>AI Financial Insights</h3>

          {disposableIncome < 0 && (
            <div className="insight warning">
              <p>
                You are currently overspending. Immediate adjustments are
                required.
              </p>
            </div>
          )}

          {savingsRate < 10 && (
            <div className="insight">
              <p>
                Your savings rate is critically low. Focus on reducing expenses
                first.
              </p>
            </div>
          )}

          <div className="insight positive">
            <p>
              With discipline, you can become debt-free within{" "}
              <strong>{monthsToDebtFree}</strong> months.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
