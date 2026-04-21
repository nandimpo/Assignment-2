import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import ExplainerPanel from "../components/ExplainerPanel";

export default function PropertyTrack() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);

  const savings = Number(localStorage.getItem("savings")) || 12000;
  const goal = user.depositGoal || 550000;

  const progress = Math.min(100, Math.round((savings / goal) * 100));

  /* ========================= */
  /* EXPLAINERS (UPDATED ONLY) */
  /* ========================= */
  const explainers = {
    property: {
      title: "First Property Path",
      text: "A structured plan to help you save and purchase your first home within 3–5 years.",
    },

    /* NEW 👇 */
    bond: {
      title: "Bond Pre-Approval",
      text: "This is when a bank confirms how much they are willing to lend you before you buy a property. It strengthens your offer and shows sellers you're serious.",
    },

    transfer: {
      title: "Transfer Duty",
      text: "A government tax paid when purchasing property. It depends on the property value and can significantly increase your upfront costs.",
    },

    lifestyle: {
      title: "Lifestyle Freedom",
      text: "How much you prioritise spending today vs saving for your future home.",
    },

    growth: {
      title: "Wealth Growth",
      text: "How aggressively you invest to grow your savings.",
    },

    risk: {
      title: "Risk Level",
      text: "Higher risk can grow wealth faster but comes with volatility.",
    },

    switch: {
      title: "Switch Track",
      text: "Switching tracks changes your financial priorities and strategy.",
    },

    apply: {
      title: "Apply Plan",
      text: "This applies smart recommendations to help you reach your goal faster.",
    },
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* HEADER */}
        <h1>
          First Property Path
          <span
            className="info-icon"
            onClick={() => {
              setContent(explainers.property);
              setShowPanel(true);
            }}
          >
            💡
          </span>
        </h1>

        <p className="subtitle">The strategy behind your first home</p>

        {/* MAIN CARD */}
        <div className="track-card main">
          <h2>
            R{savings.toLocaleString()} of R{goal.toLocaleString()}
          </h2>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}>
              <span>{progress}%</span>
            </div>
          </div>

          <p className="small">Time to goal ~ 4.2 years</p>

          {/* TIMELINE */}
          <div className="timeline">
            <div className="step done">
              Year 1<br />
              Emergency Fund
            </div>
            <div className="step active">
              Year 2<br />
              Start Investing
            </div>
            <div className="step">
              Year 3<br />
              Deposit Saved
            </div>
            <div className="step">
              Year 4<br />
              Pay Deposit
            </div>
            <div className="step">
              Year 5<br />
              Purchase Property
            </div>
          </div>

          {/* NUDGES (UPDATED ONLY) */}
          <div className="nudge-box">
            <h4>Smart next steps</h4>

            <div
              className="nudge clickable"
              onClick={() => {
                setContent(explainers.bond);
                setShowPanel(true);
              }}
            >
              💡 You’re getting closer — secure your bond pre-approval
            </div>

            <div
              className="nudge clickable"
              onClick={() => {
                setContent(explainers.transfer);
                setShowPanel(true);
              }}
            >
              📄 Estimate transfer duty to avoid unexpected costs
            </div>
          </div>

          {/* IMPACT */}
          <div className="impact">
            <h4>What impacts your goal</h4>
            <p>💰 Savings +R5,500/month</p>
            <p>🏠 Rent −R14,000/month</p>
            <p>🧾 Lifestyle −R8,000/month</p>

            <span className="success">
              You’re ahead of schedule by 6 months!
            </span>
          </div>
        </div>

        {/* COMPARE (UNCHANGED) */}
        <div className="track-card">
          <h3>Compare Strategy Tracks</h3>

          <div className="compare">
            <div></div>
            <div>Property</div>
            <div>Balanced</div>
            <div>Global</div>

            <div>Saving Focus</div>
            <div>High</div>
            <div>Medium</div>
            <div>Medium</div>

            <div>Lifestyle</div>
            <div>Low</div>
            <div>Medium</div>
            <div>High</div>

            <div>Risk Level</div>
            <div>Low</div>
            <div>Medium</div>
            <div>Long-term</div>
          </div>
        </div>

        {/* GRID (UNCHANGED) */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Adjust Your Track</h3>

            <label>
              Lifestyle Freedom
              <span
                className="info-icon"
                onClick={() => {
                  setContent(explainers.lifestyle);
                  setShowPanel(true);
                }}
              >
                💡
              </span>
            </label>
            <input type="range" />

            <label>
              Wealth Growth
              <span
                className="info-icon"
                onClick={() => {
                  setContent(explainers.growth);
                  setShowPanel(true);
                }}
              >
                💡
              </span>
            </label>
            <input type="range" />

            <label>
              Risk Level
              <span
                className="info-icon"
                onClick={() => {
                  setContent(explainers.risk);
                  setShowPanel(true);
                }}
              >
                💡
              </span>
            </label>
            <input type="range" />

            <button className="pill outline disabled">Switch Track</button>
          </div>

          <div className="track-card">
            <h3>Suggested Track</h3>
            <p className="accent">Balanced Lifestyle Track</p>

            <ul>
              <li>Increase savings by R1,500/month</li>
              <li>Reduce discretionary spending</li>
            </ul>

            <div className="btn-row">
              <button
                className="pill"
                onClick={() => {
                  localStorage.setItem("savingsBoost", "1500");
                  setContent(explainers.apply);
                  setShowPanel(true);
                }}
              >
                Apply this plan
              </button>

              <button
                className="pill outline"
                onClick={() => navigate("/simulation")}
              >
                Run simulation
              </button>
            </div>
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
