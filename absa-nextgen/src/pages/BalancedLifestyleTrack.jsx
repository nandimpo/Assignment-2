import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import { Wallet, TrendingUp, PiggyBank } from "lucide-react";

export default function BalancedLifestyleTrack() {
  const { user } = useUser();

  // ✅ ALL useState HOOKS FIRST
  const [investmentPct, setInvestmentPct] = useState(60);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("balancedProgress");
    return saved
      ? JSON.parse(saved)
      : {
          emergencyFund: false,
          deposit: false,
          purchase: false,
        };
  });

  // ✅ ALL useEffect HOOKS NEXT
  useEffect(() => {
    localStorage.setItem("balancedProgress", JSON.stringify(progress));
  }, [progress]);

  // FIX 1: Moved calculations above the useEffect that depends on them,
  // but since hooks must stay at top, we derive these values before the effect
  // by computing them inline here for the effect's dependency check.
  // The actual named consts are declared below as before.
  const _income = Number(user?.salary) || 0;
  const _expenses = Number(user?.expenses) || 0;
  const _savings = _income - _expenses;
  const _investing = Math.round((_savings * investmentPct) / 100);
  const _monthlySaved = _savings - _investing;

  useEffect(() => {
    if (_monthlySaved >= _expenses * 3) {
      setProgress((prev) => ({ ...prev, emergencyFund: true }));
    }
  }, [_monthlySaved, _expenses]);

  // ✅ ALL CALCULATIONS AFTER HOOKS

  /* ================= USER DATA ================= */
  const income = _income;
  const expenses = _expenses;
  const savings = _savings;

  /* ================= BALANCED LOGIC ================= */
  const investing = _investing;
  const monthlySaved = _monthlySaved;

  const totalFlow = expenses + investing + monthlySaved;

  const spendingPct = totalFlow ? (expenses / totalFlow) * 100 : 0;
  const investingPct = totalFlow ? (investing / totalFlow) * 100 : 0;
  const savingPct = totalFlow ? (monthlySaved / totalFlow) * 100 : 0;

  /* ================= PORTFOLIO ================= */
  const portfolio = {
    local: user?.localPct || 60,
    offshore: user?.offshorePct || 40,
  };

  /* ================= MILESTONES ================= */
  const milestones = [
    "Build emergency fund (3–6 months expenses)",
    "Start consistent monthly investing",
    "Grow portfolio to meaningful size",
    "Diversify across assets & regions",
    "Achieve long-term financial stability",
  ];

  /* ================= PROGRESS CALCULATIONS ================= */
  const completed = Object.values(progress).filter(Boolean).length;
  const totalSteps = Object.keys(progress).length;
  // FIX 2: renamed to progressPercent and used consistently (was 'percent' in JSX)
  const progressPercent = Math.round((completed / totalSteps) * 100);

  /* ================= HANDLERS ================= */
  // FIX 3: renamed to toggleMilestone — was called as toggle() in JSX
  const toggleMilestone = (key) => {
    setProgress((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ================= INSIGHTS ================= */
  let insight1 = "";
  let insight2 = "";

  if (investmentPct >= 60) {
    insight1 =
      "You are maintaining a strong balance between spending and investing.";
    insight2 =
      "Increasing your investment slightly could significantly grow long-term wealth.";
  } else if (investmentPct >= 40) {
    insight1 =
      "You have a moderate balance. Increasing investing could improve outcomes.";
    insight2 =
      "Try shifting more towards investments to accelerate portfolio growth.";
  } else {
    insight1 =
      "You are prioritising spending over investing — consider rebalancing.";
    insight2 = "Reducing lifestyle costs could free up more for investments.";
  }

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        {/* ================= HEADER ================= */}
        <h1>Balanced Lifestyle & Investing Track</h1>
        <p className="muted">Enjoy your life while building long-term wealth</p>

        {/* ================= SNAPSHOT ================= */}
        <div className="card">
          <h2>Financial Balance Snapshot</h2>

          <div className="snapshot-list">
            <p className="title-icon">
              <Wallet size={20} /> Savings: R{monthlySaved.toLocaleString()}
            </p>
            <p className="title-icon">
              <TrendingUp size={20} /> Expenses: R{expenses.toLocaleString()}
            </p>
            <p className="title-icon">
              <PiggyBank size={20} /> Investing: R{investing.toLocaleString()}
            </p>
          </div>

          {/* ================= PROGRESS BAR ================= */}
          <div className="progress-bar">
            <div
              className="progress spending"
              style={{ width: `${spendingPct}%` }}
            />
            <div
              className="progress investing"
              style={{ width: `${investingPct}%` }}
            />
            <div
              className="progress saving"
              style={{ width: `${savingPct}%` }}
            />
          </div>

          <div className="progress-labels">
            <span>Spending</span>
            <span>Investing</span>
            <span>Saving</span>
          </div>
        </div>

        {/* ================= JOURNEY ================= */}
        <div className="card">
          <h2>Milestones</h2>

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
              const isLocked = index > 0 && !progress[steps[index - 1]];

              return (
                <div key={step} className="step-wrapper">
                  {/* STEP */}
                  <div
                    className={`step 
                      ${isCompleted ? "completed" : ""} 
                      ${isCurrent ? "current" : ""} 
                      ${isLocked ? "locked" : ""}
                    `}
                    // FIX 4: toggle → toggleMilestone
                    onClick={() => !isLocked && toggleMilestone(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>

                  {/* LABEL */}
                  <span className="step-label">{labels[step]}</span>

                  {/* LINE */}
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${progress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* FIX 5: percent → progressPercent */}
          <p className="muted">{progressPercent}% complete</p>

          <p className="insight">
            {progressPercent === 0 && "Start by building your emergency fund."}
            {progressPercent === 33 &&
              "Great start — now focus on your deposit."}
            {progressPercent === 66 && "You're close — prepare for purchase."}
            {progressPercent === 100 &&
              "🎉 You've completed your property journey."}
          </p>
        </div>
        {/* FIX 6: closed the Journey card here (was missing, causing Portfolio & Strategy to nest inside it) */}

        {/* ================= PORTFOLIO ================= */}
        <div className="card">
          <h2>Portfolio Mix</h2>

          <div className="portfolio">
            <div className="pie">
              <div className="pie-inner">
                <span>{portfolio.local}%</span>
              </div>
            </div>

            <div className="portfolio-details">
              <p>• Local (JSE): {portfolio.local}%</p>
              <p>• Offshore: {portfolio.offshore}%</p>

              <button className="secondary-btn">
                Open Investment Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ================= STRATEGY GUIDE ================= */}
        <div className="card">
          <h2>Strategy Guide</h2>

          <div className="grid-2">
            <div>
              <h3>📌 What You Should Do</h3>
              <ul className="list">
                <li>Invest consistently every month (even small amounts)</li>
                <li>Keep lifestyle inflation under control</li>
                <li>Diversify between local and offshore investments</li>
                <li>Increase contributions when income grows</li>
              </ul>
            </div>

            <div>
              <h3>⚠️ Risks to Watch</h3>
              <ul className="list">
                <li>Spending increases as income grows (lifestyle creep)</li>
                <li>Investing too little to make meaningful progress</li>
                <li>Overconfidence in market growth</li>
                <li>Not adjusting strategy over time</li>
              </ul>
            </div>
          </div>

          <div className="explanation-box">
            <h3>🧠 Real Explanation</h3>
            <p>
              This strategy works because it balances enjoying your life today
              while still investing for the future. The key is consistency — not
              intensity. Small, regular investments over time compound into
              meaningful wealth.
            </p>
            <p>
              The biggest risk is becoming too comfortable. If your lifestyle
              keeps increasing, your ability to build wealth slows down
              significantly.
            </p>
          </div>
        </div>

        {/* ================= ADJUST ================= */}
        <div className="grid">
          <div className="card">
            <h3>Adjust Balance</h3>

            <p>Lifestyle vs Investment</p>

            <input
              type="range"
              min="20"
              max="80"
              value={investmentPct}
              onChange={(e) => setInvestmentPct(Number(e.target.value))}
            />

            <p>Investment Allocation: {investmentPct}%</p>

            <small>Adjust how much of your savings go into investments.</small>
          </div>

          {/* ================= INSIGHTS ================= */}
          <div className="card">
            <h3>AI Financial Insights</h3>

            <div className="insight">💡 {insight1}</div>

            <div className="insight">🔔 {insight2}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
