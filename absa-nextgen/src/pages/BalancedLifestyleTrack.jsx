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

  /* ================= PROGRESS CALCULATIONS ================= */
  const completed = Object.values(progress).filter(Boolean).length;
  const totalSteps = Object.keys(progress).length;
  const progressPercent = Math.round((completed / totalSteps) * 100);

  /* ================= HANDLERS ================= */
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

  const steps = ["emergencyFund", "deposit", "purchase"];
  const stepLabels = {
    emergencyFund: "Emergency Fund",
    deposit: "Deposit",
    purchase: "Purchase",
  };
  const timelineLabels = {
    emergencyFund: "Emergency Fund",
    deposit: "Build Deposit",
    purchase: "Purchase Property",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <h1>Balanced Lifestyle &amp; Investing Track</h1>
        <p className="subtitle">
          Enjoy your life while building long-term wealth
        </p>

        {/* ================= SNAPSHOT ================= */}
        <div className="track-card">
          <h2>Financial Balance Snapshot</h2>

          <div className="grid-2" style={{ marginBottom: "16px" }}>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Wallet size={20} /> Savings: R{monthlySaved.toLocaleString()}
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={20} /> Expenses: R{expenses.toLocaleString()}
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <PiggyBank size={20} /> Investing: R{investing.toLocaleString()}
            </p>
          </div>

          {/* SEGMENTED PROGRESS BAR */}
          <div
            className="progress-bar"
            style={{ display: "flex", overflow: "hidden" }}
          >
            <div
              style={{
                width: `${spendingPct}%`,
                height: "100%",
                background: "#d6a85a",
              }}
            />
            <div
              style={{
                width: `${investingPct}%`,
                height: "100%",
                background: "#4facfe",
              }}
            />
            <div
              style={{
                width: `${savingPct}%`,
                height: "100%",
                background: "#84a794",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span className="small">Spending</span>
            <span className="small">Investing</span>
            <span className="small">Saving</span>
          </div>
        </div>

        {/* ================= MILESTONES STEPPER ================= */}
        <div className="track-card">
          <h2>Milestones</h2>

          <div className="stepper">
            {steps.map((step, index) => {
              const isCompleted = progress[step];
              const isCurrent =
                !progress[step] && (index === 0 || progress[steps[index - 1]]);
              const isLocked = index > 0 && !progress[steps[index - 1]];

              return (
                <div key={step} className="step-wrapper">
                  <div
                    className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                    onClick={() => !isLocked && toggleMilestone(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{stepLabels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${progress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="small" style={{ marginTop: "12px" }}>
            {progressPercent}% complete
          </p>

          <p className="insight neutral">
            {progressPercent === 0 && "Start by building your emergency fund."}
            {progressPercent > 0 &&
              progressPercent < 50 &&
              "Great start — now focus on your deposit."}
            {progressPercent >= 50 &&
              progressPercent < 100 &&
              "You're close — prepare for purchase."}
            {progressPercent === 100 &&
              "🎉 You've completed your property journey."}
          </p>
        </div>

        {/* ================= 5-YEAR JOURNEY ================= */}
        <div className="track-card">
          <h2>5-Year Financial Journey</h2>

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
                width: `${progressPercent}%`,
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
                    onClick={() => !isLocked && toggleMilestone(step)}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{timelineLabels[step]}</span>
                </div>
              );
            })}
          </div>

          <p className="small">{progressPercent}% complete</p>

          <p className="insight neutral">
            {progressPercent < 25 && "Strong start — build your foundation."}
            {progressPercent >= 25 &&
              progressPercent < 50 &&
              "You're gaining momentum."}
            {progressPercent >= 50 &&
              progressPercent < 75 &&
              "Halfway there — stay consistent."}
            {progressPercent >= 75 &&
              progressPercent < 100 &&
              "Almost there — final push."}
            {progressPercent === 100 &&
              "🎉 Goal achieved — financial milestone complete."}
          </p>
        </div>

        {/* ================= PORTFOLIO ================= */}
        <div className="track-card">
          <h2>Portfolio Mix</h2>

          <div className="grid-2">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: `conic-gradient(#84a794 0% ${portfolio.local}%, #d6a85a ${portfolio.local}% 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#0c1110",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                  }}
                >
                  {portfolio.local}%
                </div>
              </div>
            </div>

            <div>
              <p>• Local (JSE): {portfolio.local}%</p>
              <p>• Offshore: {portfolio.offshore}%</p>
              <button className="pill outline" style={{ marginTop: "12px" }}>
                Open Investment Studio →
              </button>
            </div>
          </div>
        </div>

        {/* ================= STRATEGY GUIDE ================= */}
        <div className="track-card">
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

        {/* ================= ADJUST + INSIGHTS ================= */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Adjust Balance</h3>

            <p className="small">Lifestyle vs Investment</p>

            <div className="slider-group">
              <label>Investment Allocation: {investmentPct}%</label>
              <input
                type="range"
                min="20"
                max="80"
                value={investmentPct}
                onChange={(e) => setInvestmentPct(Number(e.target.value))}
              />
              <span className="slider-hint">
                Adjust how much of your savings go into investments.
              </span>
            </div>
          </div>

          <div className="track-card">
            <h3>AI Financial Insights</h3>
            <div className="insight-block">
              <div className="insight">💡 {insight1}</div>
              <div className="insight">🔔 {insight2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
