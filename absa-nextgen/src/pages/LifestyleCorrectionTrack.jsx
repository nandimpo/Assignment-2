import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import SlideIn from "../components/SlideIn";
import { getTrackProgression } from "../utils/trackProgression";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";

export default function LifestyleCorrectionTrack() {
  // ================= USER CONTEXT =================
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST — early return moved to after hooks
  const [expenseCut, setExpenseCut] = useState(0);
  const [extraDebt, setExtraDebt] = useState(0);
  const { progress, milestoneStatus, percent } = useProgress();

  // ================= EARLY RETURN (after all hooks) =================
  if (!user) {
    return <p>Please complete setup first</p>;
  }

  // ================= USER DATA =================
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const debt = Number(user?.debt) || 0;
  const savings = income - expenses;

  const progression = getTrackProgression(user);

  // ================= CORE CALCULATIONS =================
  const disposableIncome = income - expenses;
  const savingsRate = ((savings / income) * 100).toFixed(0);
  const baseDebtPayment = 4000;

  // ================= SLIDER CALCULATIONS =================
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

  // ================= MILESTONE INSIGHTS =================
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

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Stabilise (Emergency Fund)",
    deposit: "Rebuild (Save Deposit)",
    purchase: "Recover & Grow",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <p className="tracks-eyebrow">Lifestyle Correction</p>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} />
        <SlideIn tag="p" className="subtitle" delay={120} text="You are on the Lifestyle Correction track · reduce debt and rebalance your spending" />

        {/* ================= FINANCIAL PATH ================= */}
        <div className="track-card">
          <h3>📍 Your Financial Path</h3>

          <p>
            Current Track: <strong>{progression?.track}</strong>
          </p>

          <p className="small">{progression?.message}</p>

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
        <div className="track-card">
          <h3>📍 Your Current Stage</h3>

          <p className="accent">{currentStage}</p>

          <div className="next-step-box">
            <h4>Next Step</h4>
            <p>{nextStep}</p>
          </div>
        </div>

        {/* ================= FINANCIAL STATUS ================= */}
        <div className="track-card">
          <h3>Financial Recovery Status</h3>

          {[
            { label: "Income", value: `R${income.toLocaleString()}` },
            { label: "Expenses", value: `R${expenses.toLocaleString()}` },
            { label: "Debt", value: `R${debt.toLocaleString()}` },
            { label: "Status", value: status },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>

        {/* ================= SPENDING BREAKDOWN ================= */}
        <div className="track-card">
          <h3>Spending Breakdown</h3>

          <ul className="list">
            <li>Housing &amp; Bills: 45%</li>
            <li>Lifestyle: 30%</li>
            <li>Debt Repayment: 20%</li>
            <li>Savings: 5%</li>
          </ul>

          <p className="small">
            Your lifestyle spending is currently too high relative to your
            income.
          </p>
        </div>

        {/* ================= DEBT PROGRESS ================= */}
        <div className="track-card">
          <h3>Debt Payoff Plan</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((baseDebtPayment / (debt || 1)) * 100, 100)}%`,
                background: "#d6a85a",
              }}
            />
          </div>

          <p className="small">
            Current pace: {Math.ceil(debt / baseDebtPayment)} months to clear
            debt
          </p>
        </div>

        {/* ================= PROGRESSION FLOW ================= */}
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
        <div className="track-card">
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
            <span className="slider-hint">-R{expenseCut}</span>
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
            <span className="slider-hint">+R{extraDebt}</span>
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
              New Expenses: <strong>R{newExpenses.toLocaleString()}</strong>
            </p>
            <p>
              Debt-Free In: <strong>{monthsToDebtFree} months</strong>
            </p>
          </div>
        </div>

        {/* ================= 5-YEAR RECOVERY TIMELINE ================= */}
        <div className="track-card">
          <h3>5-Year Recovery Journey</h3>

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
              const isCompleted = progress[step];
              const isCurrent =
                !progress[step] && (index === 0 || progress[steps[index - 1]]);
              const isLocked = index > 0 && !progress[steps[index - 1]];

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
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{timelineLabels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${progress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 &&
              "You're stabilising — focus on cutting expenses and debt."}
            {percent >= 25 &&
              percent < 50 &&
              "Recovery has started — stay disciplined."}
            {percent >= 50 &&
              percent < 75 &&
              "Momentum building — you're regaining control."}
            {percent >= 75 &&
              percent < 100 &&
              "Almost recovered — prepare for growth."}
            {percent === 100 && "🎉 Fully recovered — ready to build wealth."}
          </p>
        </div>

        {/* ================= STRATEGY GUIDE ================= */}
        <div className="track-card">
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
        <div className="track-card">
          <h3>AI Financial Insights</h3>

          <div className="insight-block">
            {disposableIncome < 0 && (
              <div className="insight warning">
                You are currently overspending. Immediate adjustments are
                required.
              </div>
            )}

            {savingsRate < 10 && (
              <div className="insight">
                Your savings rate is critically low. Focus on reducing expenses
                first.
              </div>
            )}

            <div className="insight positive">
              With discipline, you can become debt-free within{" "}
              <strong>{monthsToDebtFree}</strong> months.
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
