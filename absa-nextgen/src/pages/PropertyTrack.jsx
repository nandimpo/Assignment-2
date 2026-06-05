import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import ExplainerPanel from "../components/ExplainerPanel";
import TypewriterHeading from "../components/TypewriterHeading";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";

export default function PropertyTrack() {
  const navigate = useNavigate();
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);
  const [savingFocus, setSavingFocus] = useState(50);
  const [lifestyle, setLifestyle] = useState(50);
  const [growth, setGrowth] = useState(50);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { progress, milestoneStatus, percent } = useProgress();

  // ✅ currentStage moved here — AFTER useProgress so progress is defined
  const currentStage = !progress.emergencyFund
    ? 1
    : !progress.deposit
      ? 2
      : !progress.purchase
        ? 3
        : 4;

  // FIX 1: progress is an object, not a number — use percent to check completion
  // FIX 2: removed isLocked from here (it used undefined 'step') — moved inside the map below
  useEffect(() => {
    if (percent >= 100 && !progress.deposit) {
      
    }
  }, [percent, progress.deposit]);

  // ✅ ALL CALCULATIONS AFTER HOOKS
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = Math.max(income - expenses, 0);

  const housePrice = Number(user?.housePrice) || 1000000;

  const goal =
    Number(user?.depositAmount) ||
    Number(user?.depositGoal) ||
    Math.round(housePrice * 0.1);

  // 🎯 DYNAMIC SAVINGS BASED ON SLIDERS
  const savingsMultiplier =
    1 + (savingFocus - 50) / 100 - (lifestyle - 50) / 120;

  const adjustedSavings = Math.max(0, Math.round(savings * savingsMultiplier));

  // 🧠 TIMELINE CALCULATOR
  const remainingAmount = Math.max(goal - savings, 0);

  const monthsToGoal =
    adjustedSavings > 0 ? Math.ceil(remainingAmount / adjustedSavings) : null;

  const yearsToGoal =
    monthsToGoal !== null ? (monthsToGoal / 12).toFixed(1) : null;

  // renamed from 'progress' to avoid conflict with useProgress hook
  const depositProgress =
    goal > 0 ? Math.min(100, Math.round((savings / goal) * 100)) : 0;

  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  /* 🔥 AI INSIGHT ENGINE */
  const insights = [];

  if (savingsRate < 15) {
    insights.push(
      "Your savings rate is below optimal. Increasing savings will significantly accelerate your deposit timeline.",
    );
  }

  if (depositProgress < 20) {
    insights.push(
      "You are in the early stage of your property journey. Consistency matters more than large once-off contributions.",
    );
  }

  if (income > 60000 && savingsRate > 25) {
    insights.push(
      "Your income and savings rate position you strongly for early property acquisition.",
    );
  }

  if (expenses > income * 0.5) {
    insights.push(
      "High fixed expenses are limiting your ability to build your deposit efficiently.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Your financial position is stable. Small optimisations can improve your timeline further.",
    );
  }

  /* TRACK LOGIC */
  const getSuggestedTrack = () => {
    if (savingFocus > 70 && lifestyle < 40) {
      return {
        title: "Property Track",
        insight:
          "You are prioritising rapid deposit accumulation with reduced lifestyle flexibility.",
      };
    }

    if (growth > 70) {
      return {
        title: "Investing Track",
        insight:
          "Your preferences indicate a focus on long-term wealth growth over immediate property ownership.",
      };
    }

    return {
      title: "Balanced Lifestyle Track",
      insight:
        "You are balancing lifestyle spending with steady progress toward property ownership.",
    };
  };

  const suggestedTrack = getSuggestedTrack();

  /* EXPLAINERS */
  const explainers = {
    bond: {
      title: "Bond Pre-Approval",
      text: "A bank assessment confirming how much you can borrow before purchasing property.",
    },
    transfer: {
      title: "Transfer Duty",
      text: "A government tax applied when purchasing property, based on property value.",
    },
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        <TypewriterHeading tag="h1" text="Property Strategy Path" speed={50} />

        <p className="subtitle">
          Based on your current behaviour, your savings rate is{" "}
          <span className="accent">{savingsRate}%</span>
        </p>

        {/* MAIN */}
        <div className="track-card main">
          <h2>
            R{savings.toLocaleString()} of R{goal.toLocaleString()}
          </h2>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${depositProgress}%` }}
            >
              <span className="progress-text">{depositProgress}%</span>
            </div>
          </div>

          <p className="small">
            Estimated monthly contribution: R{savings.toLocaleString()}
          </p>

          {/* 🧠 TIMELINE OUTPUT */}
          <div className="timeline-estimate">
            {monthsToGoal ? (
              <>
                <h4>📅 Deposit Timeline</h4>
                <p>
                  At your current pace, you could reach your deposit in{" "}
                  <strong>{monthsToGoal} months</strong> (~{yearsToGoal} years).
                </p>
                <p className="small">
                  {adjustedSavings > savings
                    ? "🚀 Your strategy is accelerating your timeline"
                    : adjustedSavings < savings
                      ? "⚠️ Your lifestyle is slowing your progress"
                      : "➖ No change to your timeline"}
                </p>
              </>
            ) : (
              <p className="warning-text">
                You currently have no available savings. Reducing expenses or
                increasing income will unlock your timeline.
              </p>
            )}
          </div>

          {/* AI INSIGHTS */}
          <div className="insight-block">
            <h4>AI Insights</h4>
            {insights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>

          <div className="timeline-box">
            <h4>📍 Milestone Progress ({percent}%)</h4>

            <div className="timeline">
              {/* LINE */}
              <div className="timeline-line" />

              {/* STEP 1 */}
              <div
                className={`timeline-step ${progress.emergencyFund ? "done" : ""}`}
                
              >
                <div className="circle">
                  {progress.emergencyFund ? "✓" : "1"}
                </div>
                <div className="content">
                  <h4>Emergency Fund</h4>
                  <span>
                    {progress.emergencyFund ? "Completed" : "Start here"}
                  </span>
                </div>
              </div>

              {/* STEP 2 */}
              <div
                className={`timeline-step ${progress.deposit ? "done" : ""} ${
                  !progress.emergencyFund ? "locked" : ""
                }`}
              >
                <div className="circle">{progress.deposit ? "✓" : "2"}</div>
                <div className="content">
                  <h4>Deposit</h4>
                  <span>
                    {progress.deposit ? "Completed" : "Build your deposit"}
                  </span>
                </div>
              </div>

              {/* STEP 3 */}
              <div
                className={`timeline-step ${progress.purchase ? "done" : ""} ${
                  !progress.deposit ? "locked" : ""
                }`}
              >
                <div className="circle">{progress.purchase ? "✓" : "3"}</div>
                <div className="content">
                  <h4>Purchase</h4>
                  <span>
                    {progress.purchase ? "Completed" : "Buy your property"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MILESTONE PROGRESS */}
          <div className="timeline-box">
            <h4>📍 Milestone Progress ({percent}%)</h4>

            {/* FIX 3: isLocked moved inside each step's onClick to avoid undefined 'step' at top scope */}
            <div
              className={`timeline-step ${progress.emergencyFund ? "active" : ""}`}
              
            >
              <h4>Stage 1</h4>
              <p>Emergency Fund</p>
              <span>
                {progress.emergencyFund ? "✅ Done" : "⬜ Mark complete"}
              </span>
            </div>

            <div
              className={`timeline-step ${progress.deposit ? "active" : ""}`}
            >
              <h4>Stage 2</h4>
              <p>Deposit</p>
              <span>{progress.deposit ? "✅ Done" : "⬜ Mark complete"}</span>
            </div>

            <div
              className={`timeline-step ${progress.purchase ? "active" : ""}`}
            >
              <h4>Stage 3</h4>
              <p>Purchase</p>
              <span>{progress.purchase ? "✅ Done" : "⬜ Mark complete"}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>

          {/* NUDGES */}
          <div className="nudge-impact">
            <div className="nudge-box">
              <h4>Smart next steps</h4>

              <div
                className="nudge clickable"
                onClick={() => {
                  setContent(explainers.bond);
                  setShowPanel(true);
                }}
              >
                💡 Secure bond pre-approval
                <div className="tooltip-box">{explainers.bond.text}</div>
              </div>

              <div
                className="nudge clickable"
                onClick={() => {
                  setContent(explainers.transfer);
                  setShowPanel(true);
                }}
              >
                📄 Estimate transfer costs
                <div className="tooltip-box">{explainers.transfer.text}</div>
              </div>
            </div>

            <div className="impact">
              <h4>Key drivers</h4>
              <p>💰 Savings: R{(income - expenses).toLocaleString()} / month</p>
              <p>🏠 Affordability linked to income</p>
              <p>🧾 Spending behaviour affects progress</p>

              <span className="success">
                {depositProgress > 40
                  ? "You are ahead of your projected timeline."
                  : "Maintaining consistency will improve your position."}
              </span>
            </div>
          </div>
        </div>

        {/* STRATEGY GUIDE */}
        <div className="track-card">
          <h2>Property Strategy Guide</h2>

          <div className="grid-2">
            <div>
              <h3>📌 What You Should Do</h3>
              <ul className="list">
                <li>Save 20–30% of your income consistently</li>
                <li>Keep expenses stable and predictable</li>
                <li>Avoid taking on new debt</li>
                <li>
                  Use safe, low-risk savings (money market, savings accounts)
                </li>
              </ul>
            </div>

            <div>
              <h3>⚠️ Risks to Watch</h3>
              <ul className="list">
                <li>Burnout from extreme saving</li>
                <li>Unexpected costs (transfer duty, legal fees)</li>
                <li>Interest rate increases affecting affordability</li>
                <li>Delaying investing too long</li>
              </ul>
            </div>
          </div>

          <div className="explanation-box">
            <h3>🧠 Real Explanation</h3>
            <p>
              This strategy works because property requires a large upfront
              deposit. The fastest way to reach that goal is by increasing your
              savings rate and reducing unnecessary spending.
            </p>

            <p>
              However, this comes at a cost — less flexibility and fewer
              lifestyle upgrades in the short term. The key is consistency:
              small monthly contributions compound into a large deposit over
              time.
            </p>
          </div>
        </div>

        {/* COMPARE STRATEGY TRACKS */}
        <div className="track-card compare-card">
          <h3>Compare Strategy Tracks</h3>
          <p className="compare-sub">
            See how the three paths differ at a glance
          </p>

          <div className="compare-grid">
            <div className="compare-column active">
              <p className="tag">First Property Path</p>
              <ul>
                <li>Saving Focus — High</li>
                <li>Lifestyle — Low</li>
                <li>Wealth Growth — Long-term</li>
              </ul>
            </div>
            <div className="compare-column">
              <p className="tag">Balanced Lifestyle</p>
              <ul>
                <li>Saving Focus — Medium</li>
                <li>Lifestyle — High</li>
                <li>Wealth Growth — Medium</li>
              </ul>
            </div>
            <div className="compare-column">
              <p className="tag">Catch-Up Wealth</p>
              <ul>
                <li>Saving Focus — High</li>
                <li>Lifestyle — Low</li>
                <li>Wealth Growth — Accelerated</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TRACK ADJUST */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Adjust Strategy</h3>

            <div className="slider-group">
              <label>Saving Priority</label>
              <input
                type="range"
                min="0"
                max="100"
                value={savingFocus}
                onChange={(e) => setSavingFocus(Number(e.target.value))}
              />
              <span className="slider-hint">
                Higher = faster deposit timeline
              </span>
            </div>

            <div className="slider-group">
              <label>Lifestyle Flexibility</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lifestyle}
                onChange={(e) => setLifestyle(Number(e.target.value))}
              />
              <span className="slider-hint">
                Higher = more discretionary spending
              </span>
            </div>

            <div className="slider-group">
              <label>Wealth Growth Focus</label>
              <input
                type="range"
                min="0"
                max="100"
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
              />
              <span className="slider-hint">
                Higher = long-term investing focus
              </span>
            </div>

            <button
              className="pill outline"
              onClick={() => setShowSuggestion(true)}
            >
              Generate Recommendation
            </button>
          </div>

          {/* SUGGESTED */}
          <div
            className={`track-card suggested ${showSuggestion ? "active" : ""}`}
          >
            <h3>Recommended Strategy</h3>

            {!showSuggestion ? (
              <p className="placeholder">
                Adjust your inputs to generate a recommendation.
              </p>
            ) : (
              <>
                <p className="accent">{suggestedTrack.title}</p>
                <p className="insight neutral">{suggestedTrack.insight}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={content}
      />

      <div
        className="finance-orb"
        onClick={() => navigate("/learn")}
        title="Go to Finance School"
      >
        🎓
      </div>
    </div>
  );
}
