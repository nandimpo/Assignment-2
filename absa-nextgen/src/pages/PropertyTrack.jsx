import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import ExplainerPanel from "../components/ExplainerPanel";

export default function PropertyTrack() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user")) || {};

  const income = Number(user.salary) || 0;
  const expenses = Number(user.expenses) || 0;
  const savings = Number(user.savings) || Math.max(income - expenses, 0);

  const goal =
    Number(user.depositAmount) ||
    Number(user.depositGoal) ||
    Math.round((Number(user.housePrice) || 1000000) * 0.1);

  const progress =
    goal > 0 ? Math.min(100, Math.round((savings / goal) * 100)) : 0;

  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);

  const [savingFocus, setSavingFocus] = useState(50);
  const [lifestyle, setLifestyle] = useState(50);
  const [growth, setGrowth] = useState(50);
  const [showSuggestion, setShowSuggestion] = useState(false);

  /* 🔥 AI INSIGHT ENGINE */

  const insights = [];

  if (savingsRate < 15) {
    insights.push(
      "Your savings rate is below optimal. Increasing savings will significantly accelerate your deposit timeline.",
    );
  }

  if (progress < 20) {
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

  /*  TRACK LOGIC */

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
        <h1>Property Strategy Path</h1>

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
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <span className="progress-text">{progress}%</span>
            </div>
          </div>

          <p className="small">
            Estimated monthly contribution: R
            {(income - expenses).toLocaleString()}
          </p>

          {/* AI INSIGHTS */}
          <div className="insight-block">
            <h4>🤖 AI Insights</h4>
            {insights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>

          {/* TIMELINE */}
          <div className="timeline-box">
            <div className="timeline-step active">
              <h4>Stage 1</h4>
              <p>Build emergency buffer</p>
            </div>
            <div className="timeline-step">
              <h4>Stage 2</h4>
              <p>Increase savings rate</p>
            </div>
            <div className="timeline-step">
              <h4>Stage 3</h4>
              <p>Reach deposit goal</p>
            </div>
            <div className="timeline-step">
              <h4>Stage 4</h4>
              <p>Secure financing</p>
            </div>
            <div className="timeline-step">
              <h4>Stage 5</h4>
              <p>Purchase property</p>
            </div>
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
                {progress > 40
                  ? "You are ahead of your projected timeline."
                  : "Maintaining consistency will improve your position."}
              </span>
            </div>
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
