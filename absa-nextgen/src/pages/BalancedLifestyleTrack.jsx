import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import { Wallet, TrendingUp, PiggyBank, BookOpen, AlertTriangle } from "lucide-react";
import MonthlySavingsTracker from "../components/MonthlySavingsTracker";
import TypewriterHeading from "../components/TypewriterHeading";

export default function BalancedLifestyleTrack() {
  const { user } = useUser();

  const [investmentPct, setInvestmentPct] = useState(60);
  const { progress, milestoneStatus, percent: progressPercent } = useProgress();

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings  = income - expenses;
  const investing    = Math.round((savings * investmentPct) / 100);
  const monthlySaved = savings - investing;


  const totalFlow    = expenses + investing + monthlySaved || 1;
  const spendingPct  = (expenses     / totalFlow) * 100;
  const investingPct = (investing    / totalFlow) * 100;
  const savingPct    = (monthlySaved / totalFlow) * 100;

  const portfolio = { local: user?.localPct || 60, offshore: user?.offshorePct || 40 };

  const steps = ["emergencyFund", "deposit", "purchase"];
  const stepLabels = { emergencyFund: "Emergency Fund", deposit: "Deposit", purchase: "Purchase" };

  let insight1 = "", insight2 = "";
  if (investmentPct >= 60) {
    insight1 = "Strong balance between spending and investing.";
    insight2 = "Increasing your investment slightly could significantly grow long-term wealth.";
  } else if (investmentPct >= 40) {
    insight1 = "Moderate balance — increasing investing could improve outcomes.";
    insight2 = "Try shifting more towards investments to accelerate portfolio growth.";
  } else {
    insight1 = "You're prioritising spending over investing — consider rebalancing.";
    insight2 = "Reducing lifestyle costs could free up more for investments.";
  }

  const milestoneInsight =
    progressPercent === 0  ? "Start by building your emergency fund." :
    progressPercent < 50   ? "Great start — now focus on your deposit." :
    progressPercent < 100  ? "You're close — prepare for purchase." :
                             "All milestones complete.";

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* HEADER */}
        <p className="tracks-eyebrow">Balanced Lifestyle</p>
        <TypewriterHeading tag="h1" text="Balanced Lifestyle & Investing Track" speed={50} />
        <p className="subtitle">Enjoy your life while building long-term wealth</p>

        {/* ROW 1: SNAPSHOT + MILESTONES */}
        <div className="bl-row">

          {/* FINANCIAL SNAPSHOT */}
          <div className="track-card">
            <h3>Financial Snapshot</h3>
            <div className="bl-stats">
              <div className="bl-stat">
                <Wallet size={15} />
                <span className="bl-stat-label">Monthly Savings</span>
                <strong>R{monthlySaved.toLocaleString()}</strong>
              </div>
              <div className="bl-stat">
                <TrendingUp size={15} />
                <span className="bl-stat-label">Investing</span>
                <strong>R{investing.toLocaleString()}</strong>
              </div>
              <div className="bl-stat">
                <PiggyBank size={15} />
                <span className="bl-stat-label">Expenses</span>
                <strong>R{expenses.toLocaleString()}</strong>
              </div>
            </div>

            {/* SEGMENTED BAR */}
            <div className="bl-bar" style={{ marginTop: 14 }}>
              <div style={{ width: `${spendingPct}%`,  background: "#d6a85a" }} />
              <div style={{ width: `${investingPct}%`, background: "#4facfe" }} />
              <div style={{ width: `${savingPct}%`,    background: "#84a794" }} />
            </div>
            <div className="bl-bar-labels">
              <span>Spending</span>
              <span>Investing</span>
              <span>Saving</span>
            </div>

            {/* ALLOCATION SLIDER */}
            <div style={{ marginTop: 16 }}>
              <label className="bl-slider-label">Investment allocation: {investmentPct}%</label>
              <input
                type="range" min="20" max="80" value={investmentPct}
                onChange={(e) => setInvestmentPct(Number(e.target.value))}
                style={{ width: "100%", marginTop: 6 }}
              />
            </div>
          </div>

          {/* MILESTONES */}
          <div className="track-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <h3>Milestones</h3>
              <span className="milestones-hint">Tap to mark done</span>
            </div>

            <div className="bl-stepper">
              {steps.map((step, index) => {
                const isCompleted = progress[step];
                const isCurrent   = !progress[step] && (index === 0 || progress[steps[index - 1]]);
                const isLocked    = index > 0 && !progress[steps[index - 1]];
                return (
                  <div key={step} className="bl-step-item">
                    <div className="bl-step-col">
                      <div
                        className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                        title={isCompleted ? "Achieved" : isLocked ? "Complete previous milestone first" : "Not yet reached — update your savings"}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      {index < steps.length - 1 && <div className={`bl-vline ${progress[step] ? "filled" : ""}`} />}
                    </div>
                    <div className="bl-step-text">
                      <span className="step-label">{milestoneStatus?.[step]?.label || stepLabels[step]}</span>
                      {isCurrent && <span className="step-cta" style={{ fontSize: 10, color: "#84a794" }}>{milestoneStatus?.[step]?.hint || "Update your savings →"}</span>}
                      {isLocked  && <span className="step-locked-label">Locked</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="muted" style={{ marginTop: 12 }}>{progressPercent}% complete</p>
            <p className="small" style={{ marginTop: 4, color: "#c8d8d4" }}>{milestoneInsight}</p>
          </div>
        </div>

        {/* MONTHLY SAVINGS TRACKER */}
        <MonthlySavingsTracker
          monthlyTarget={monthlySaved}
          goalAmount={Number(user?.goalAmount) || 1000000}
          goalLabel="investment goal"
        />

        {/* ROW 2: PORTFOLIO + INSIGHTS */}
        <div className="bl-row">

          {/* PORTFOLIO MIX */}
          <div className="track-card">
            <h3>Portfolio Mix</h3>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginTop: 12 }}>
              <div style={{
                width: 90, height: 90, borderRadius: "50%", flexShrink: 0,
                background: `conic-gradient(#84a794 0% ${portfolio.local}%, #d6a85a ${portfolio.local}% 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#0c1110", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                  {portfolio.local}%
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <p className="small" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#84a794", display: "inline-block" }} />
                  Local (JSE): {portfolio.local}%
                </p>
                <p className="small" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#d6a85a", display: "inline-block" }} />
                  Offshore: {portfolio.offshore}%
                </p>
                <button className="pill outline" style={{ marginTop: 8 }}>Open Investment Studio →</button>
              </div>
            </div>
          </div>

          {/* AI INSIGHTS */}
          <div className="track-card">
            <h3>AI Insights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              <div className="insight"><p>{insight1}</p></div>
              <div className="insight"><p>{insight2}</p></div>
            </div>
          </div>
        </div>

        {/* ROW 3: STRATEGY GUIDE */}
        <div className="track-card">
          <h3>Strategy Guide</h3>
          <div className="grid-2" style={{ marginTop: 14 }}>
            <div>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 8 }}>
                <BookOpen size={14} /> What to do
              </p>
              <ul className="list">
                <li>Invest consistently every month (even small amounts)</li>
                <li>Keep lifestyle inflation under control</li>
                <li>Diversify between local and offshore investments</li>
                <li>Increase contributions when income grows</li>
              </ul>
            </div>
            <div>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 8 }}>
                <AlertTriangle size={14} /> Risks to watch
              </p>
              <ul className="list">
                <li>Spending increases as income grows (lifestyle creep)</li>
                <li>Investing too little to make meaningful progress</li>
                <li>Overconfidence in market growth</li>
                <li>Not adjusting strategy over time</li>
              </ul>
            </div>
          </div>
          <div className="explanation-box" style={{ marginTop: 14 }}>
            <p style={{ lineHeight: 1.7 }}>
              This strategy works because it balances enjoying life today while investing for the future.
              The key is consistency — not intensity. Small, regular investments compound into meaningful wealth over time.
              The biggest risk is lifestyle creep: if your spending keeps rising, wealth-building slows significantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
