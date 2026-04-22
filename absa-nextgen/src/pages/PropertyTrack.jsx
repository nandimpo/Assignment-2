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

  // 🔥 NEW STATE
  const [savingFocus, setSavingFocus] = useState(50);
  const [lifestyle, setLifestyle] = useState(50);
  const [growth, setGrowth] = useState(50);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const explainers = {
    bond: {
      title: "Bond Pre-Approval",
      text: "Bank confirms how much they will lend you before buying.",
    },
    transfer: {
      title: "Transfer Duty",
      text: "Government tax when purchasing property.",
    },
  };

  // 🔥 SIMPLE RULE ENGINE
  const getSuggestedTrack = () => {
    if (savingFocus > 70 && lifestyle < 40) {
      return {
        title: "Property Track",
        points: ["Aggressive saving for deposit", "Lower lifestyle spending"],
        insight: "You're prioritising buying property as quickly as possible.",
      };
    }

    if (growth > 70) {
      return {
        title: "Investing Track",
        points: ["Focus on long-term wealth", "Higher growth potential"],
        insight: "You’re prioritising long-term wealth over immediate goals.",
      };
    }

    return {
      title: "Balanced Lifestyle Track",
      points: ["Moderate savings", "Balanced lifestyle spending"],
      insight: "You’re balancing lifestyle and future goals.",
    };
  };

  const suggestedTrack = getSuggestedTrack();

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        <h1>First Property Path 💡</h1>

        <p className="subtitle">
          Based on your savings rate{" "}
          <span className="accent">{savingsRate}%</span>
        </p>

        {/* MAIN CARD */}
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
            Monthly saving: R{(income - expenses).toLocaleString()}
          </p>

          {/* TIMELINE */}
          <div className="timeline-box">
            <div className="timeline-step active">
              <h4>Year 1</h4>
              <p>Emergency Fund</p>
            </div>
            <div className="timeline-step">
              <h4>Year 2</h4>
              <p>Start Investing</p>
            </div>
            <div className="timeline-step">
              <h4>Year 3</h4>
              <p>Deposit Saved</p>
            </div>
            <div className="timeline-step">
              <h4>Year 4</h4>
              <p>Pay Deposit</p>
            </div>
            <div className="timeline-step">
              <h4>Year 5</h4>
              <p>Purchase Property</p>
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
                💡 Secure your bond pre-approval
                <div className="tooltip-box">{explainers.bond.text}</div>
              </div>

              <div
                className="nudge clickable"
                onClick={() => {
                  setContent(explainers.transfer);
                  setShowPanel(true);
                }}
              >
                📄 Estimate transfer duty
                <div className="tooltip-box">{explainers.transfer.text}</div>
              </div>
            </div>

            <div className="impact">
              <h4>What impacts your goal</h4>
              <p>💰 Savings R{(income - expenses).toLocaleString()}/month</p>
              <p>🏠 Housing affordability based on income</p>
              <p>🧾 Lifestyle affects savings rate</p>

              <span className="success">
                {progress > 40
                  ? "You're ahead of schedule 🚀"
                  : "Keep building consistency"}
              </span>
            </div>
          </div>
        </div>

        {/* COMPARE */}
        <div className="track-card compare-card">
          <h3>Compare Strategy Tracks</h3>

          <p className="compare-sub">
            You're currently on the{" "}
            <span className="accent">Property Track</span>
          </p>

          <div className="compare-grid">
            <div className="compare-column active">
              <h4>Property</h4>
              <p className="tag">Focused on buying a home</p>
              <ul>
                <li>
                  <strong>Saving Focus:</strong> High
                </li>
                <li>
                  <strong>Spending Flexibility:</strong> Low
                </li>
                <li>
                  <strong>Wealth Growth:</strong> Limited
                </li>
              </ul>
              <p className="insight positive">
                Fastest way to afford your deposit, but limits lifestyle and
                long-term growth.
              </p>
            </div>

            <div className="compare-column">
              <h4>Balanced Lifestyle</h4>
              <p className="tag">Mix of saving + lifestyle</p>
              <ul>
                <li>
                  <strong>Saving Focus:</strong> Medium
                </li>
                <li>
                  <strong>Spending Flexibility:</strong> Medium
                </li>
                <li>
                  <strong>Wealth Growth:</strong> Balanced
                </li>
              </ul>
              <p className="insight neutral">
                Slower property timeline, but gives you more lifestyle balance.
              </p>
            </div>

            <div className="compare-column">
              <h4>Investing Track</h4>
              <p className="tag">Grow wealth long-term</p>
              <ul>
                <li>
                  <strong>Saving Focus:</strong> Medium
                </li>
                <li>
                  <strong>Spending Flexibility:</strong> High
                </li>
                <li>
                  <strong>Wealth Growth:</strong> High over time
                </li>
              </ul>
              <p className="insight warning">
                Best for long-term wealth, but delays your property goal the
                most.
              </p>
            </div>
          </div>

          <p className="compare-footer">
            Switching tracks changes how fast you reach your deposit vs how much
            you enjoy your lifestyle now.
          </p>
        </div>

        {/* GRID */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Adjust Your Track</h3>

            <div className="slider-group">
              <label>Saving Focus</label>
              <input
                type="range"
                min="0"
                max="100"
                value={savingFocus}
                onChange={(e) => setSavingFocus(Number(e.target.value))}
              />
              <span className="slider-hint">Higher = faster deposit</span>
            </div>

            <div className="slider-group">
              <label>Spending Flexibility</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lifestyle}
                onChange={(e) => setLifestyle(Number(e.target.value))}
              />
              <span className="slider-hint">
                Higher = more lifestyle freedom
              </span>
            </div>

            <div className="slider-group">
              <label>Wealth Growth</label>
              <input
                type="range"
                min="0"
                max="100"
                value={growth}
                onChange={(e) => setGrowth(Number(e.target.value))}
              />
              <span className="slider-hint">
                Higher = long-term growth focus
              </span>
            </div>

            <button
              className="pill outline"
              onClick={() => setShowSuggestion(true)}
            >
              Switch Track
            </button>
          </div>

          <div
            className={`track-card suggested ${showSuggestion ? "active" : ""}`}
          >
            <h3>Suggested Track</h3>

            {!showSuggestion ? (
              <p className="placeholder">
                Adjust your track and click <strong>Switch Track</strong> to
                preview.
              </p>
            ) : (
              <>
                <p className="accent">{suggestedTrack.title}</p>

                <ul>
                  {suggestedTrack.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>

                <p className="insight neutral">{suggestedTrack.insight}</p>

                <div className="btn-row">
                  <button className="pill disabled">Coming soon</button>
                  <button className="pill outline disabled">Coming soon</button>
                </div>
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
    </div>
  );
}
