import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import { getTrackProgression } from "../utils/trackProgression";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";

export default function LifestyleCorrectionTrack() {
  // ================= USER MOCK =================
  const { user } = useUser();

  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const debt = Number(user?.debt) || 0;

  const savings = income - expenses;

  if (!user) {
    return <p>Please complete setup first</p>;
  }

  // FIX 1: `user` was undefined — now passing the actual user data object
  const progression = getTrackProgression(user);

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
  const { progress, toggle, percent } = useProgress();

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

  const milestoneInsights = [];

  if (!progress.emergencyFund) {
    milestoneInsights.push(
      "Focus on stabilising your finances and building an emergency fund.",
    );
  }

  if (progress.emergencyFund && !progress.deposit) {
    milestoneInsights.push(
      "Great — you've stabilised. Now shift toward saving for a deposit.",
    );
  }

  if (progress.deposit && !progress.purchase) {
    milestoneInsights.push(
      "You're progressing well. Start preparing for property or investing.",
    );
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
          <h3>Milestones</h3>

          <div className="stepper">
            {["emergencyFund", "deposit", "purchase"].map((step, index) => {
              const labels = {
                emergencyFund: "Emergency Fund",
                deposit: "Deposit",
                purchase: "Purchase",
              };

              const steps = ["emergencyFund", "deposit", "purchase"];

              const isCompleted = progress[step];
              const isCurrent =
                !progress[step] && (index === 0 || progress[steps[index - 1]]);
              const isLocked =
                (step === "deposit" && !progress.emergencyFund) ||
                (step === "purchase" && !progress.deposit);

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
                      className={`step-line ${progress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="muted">{percent}% complete</p>
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
          <div className="card">
            <h3>Milestone Insights</h3>

            {milestoneInsights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>

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
