import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";

export default function LifestyleCorrectionTrack() {
  // ================= USER MOCK =================
  const income = 46000;
  const expenses = 42000;
  const debt = 85000;
  const savings = 2000;

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

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Lifestyle Correction Track</h1>
        <p className="muted">
          Rebalance your finances by reducing debt and controlling spending.
        </p>

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
            <span>Year 1</span>
            <span>Year 2</span>
            <span>Year 3</span>
            <span>Year 4</span>
            <span>Year 5</span>
          </div>

          <div className="milestones">
            <span>Debt Control</span>
            <span>Debt Free</span>
            <span>Emergency Fund</span>
            <span>Start Investing</span>
            <span>Stability</span>
          </div>
        </div>

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

        {/* ================= EDUCATION ================= */}
        <div className="card">
          <h3>Financial Knowledge</h3>

          <p>
            High-interest debt (like credit cards or personal loans) can
            significantly slow down wealth building.
          </p>

          <ul className="list">
            <li>Prioritise paying high-interest debt first</li>
            <li>Avoid lifestyle inflation</li>
            <li>Build habits before investing</li>
          </ul>

          <p className="muted">
            In South Africa, many individuals face debt pressure due to rising
            living costs and interest rates.
          </p>
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
