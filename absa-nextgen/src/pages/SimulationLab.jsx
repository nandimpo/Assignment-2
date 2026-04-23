import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/simulation.css";
import AppNav from "../components/AppNav";
import ExplainerPanel from "../components/ExplainerPanel";

/* DEFAULT VALUES            */

const DEFAULTS = {
  salary: 45000,
  rent: 12000,
  price: 1800000,
  interest: 11,
  years: 5,
};

export default function SimulationLab() {
  const navigate = useNavigate();

  const [salary, setSalary] = useState(DEFAULTS.salary);
  const [rent, setRent] = useState(DEFAULTS.rent);
  const [price, setPrice] = useState(DEFAULTS.price);
  const [interest, setInterest] = useState(DEFAULTS.interest);
  const [years, setYears] = useState(DEFAULTS.years);

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);

  /* RESET / REBALANCE         */

  const [resetting, setResetting] = useState(false);

  const handleReset = () => {
    setResetting(true);
    setSalary(DEFAULTS.salary);
    setRent(DEFAULTS.rent);
    setPrice(DEFAULTS.price);
    setInterest(DEFAULTS.interest);
    setYears(DEFAULTS.years);
    setShowPanel(false);
    setContent(null);

    // Brief flash state so user sees feedback
    setTimeout(() => setResetting(false), 600);
  };

  /* CALCULATIONS */

  const rentTotal = rent * 12 * years;
  const bondMonthly = (price * (interest / 100)) / 12;
  const buyTotal = bondMonthly * 12 * years;
  const difference = rentTotal - buyTotal;

  const maxValue = Math.max(rentTotal, buyTotal);

  /* AI-STYLE VERDICT */

  let verdict = "";
  let tone = "";

  if (difference > 0) {
    verdict = `Based on your current inputs, renting is the more cost-efficient option, saving approximately R${Math.abs(
      difference,
    ).toLocaleString()} over ${years} years.`;
    tone = "positive";
  } else if (difference < 0) {
    verdict = `Buying results in a higher short-term cost of approximately R${Math.abs(
      difference,
    ).toLocaleString()}, however it contributes toward long-term asset ownership and equity growth.`;
    tone = "neutral";
  } else {
    verdict = `Both renting and buying result in a similar financial outcome over ${years} years, suggesting that non-financial factors should guide your decision.`;
    tone = "neutral";
  }

  /* AI INSIGHTS ENGINE */

  const insights = [];

  if (interest > 13) {
    insights.push(
      "High interest rates are significantly increasing the cost of ownership. Consider delaying purchase or increasing your deposit.",
    );
  }

  if (years <= 3) {
    insights.push(
      "Short ownership periods reduce the financial benefit of buying due to upfront costs and interest exposure.",
    );
  }

  if (rent > salary * 0.4) {
    insights.push(
      "Your rental cost exceeds 40% of your income, which may limit your ability to save effectively.",
    );
  }

  if (salary > 60000 && difference < 0) {
    insights.push(
      "Your income level suggests you may be well-positioned to absorb higher bond costs and transition into ownership.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      "Your current scenario is relatively balanced. Optimising either savings or loan terms could improve your outcome.",
    );
  }

  /* EXPLAINER */

  const explainerText = `
This simulation compares the total cost of renting versus buying over a selected time horizon.

Renting provides flexibility and lower upfront costs, while buying introduces interest expenses but enables long-term asset accumulation.

The outcome is highly sensitive to interest rates, time horizon, and your income-to-expense ratio.
`;

  const explainers = {
    verdict: { title: "AI Financial Verdict", text: verdict },
    concept: { title: "Understanding the Model", text: explainerText },
  };

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <h1>Property vs Renting Studio</h1>
        <p className="subtitle">
          Simulate the financial impact of renting versus buying property
        </p>

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <Slider
              label="Monthly Salary"
              value={salary}
              set={setSalary}
              min={20000}
              max={100000}
              prefix="R"
            />
            <Slider
              label="Monthly Rent"
              value={rent}
              set={setRent}
              min={5000}
              max={30000}
              prefix="R"
            />
            <Slider
              label="Property Price"
              value={price}
              set={setPrice}
              min={500000}
              max={3000000}
              prefix="R"
            />
            <Slider
              label="Interest Rate"
              value={interest}
              set={setInterest}
              min={8}
              max={15}
              suffix="%"
            />
            <Slider
              label="Time Horizon"
              value={years}
              set={setYears}
              min={1}
              max={10}
              suffix=" years"
            />
          </div>

          {/* GRAPH */}
          <div className="sim-card graph-card">
            <h3 className="graph-title">Cost Comparison</h3>

            <div className="bars">
              <div className="bar-container">
                <div
                  className="bar rent"
                  style={{ height: `${(rentTotal / maxValue) * 140}px` }}
                >
                  <span className="bar-tooltip">
                    R{rentTotal.toLocaleString()}
                  </span>
                </div>
                <span>Rent</span>
              </div>

              <div className="bar-container">
                <div
                  className="bar buy"
                  style={{ height: `${(buyTotal / maxValue) * 140}px` }}
                >
                  <span className="bar-tooltip">
                    R{buyTotal.toLocaleString()}
                  </span>
                </div>
                <span>Buy</span>
              </div>
            </div>

            <p className="graph-values">
              Rent: R{rentTotal.toLocaleString()} <span>|</span> Buy: R
              {buyTotal.toLocaleString()}
            </p>

            <p className="graph-impact">{verdict}</p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="sim-bottom">
          {/* VERDICT CARD */}
          <div
            className="sim-card clickable verdict-card"
            onClick={() => {
              setContent(explainers.verdict);
              setShowPanel(true);
            }}
          >
            {/* HOVER PREVIEW */}
            <div className="hover-preview large">
              <h4>📊 AI Financial Verdict</h4>
              <p>{verdict}</p>
              <span>Click to explore in full →</span>
            </div>

            <h3>📊 AI Financial Verdict</h3>
            <p>{verdict}</p>
          </div>

          {/* AI INSIGHTS */}
          <div className="sim-card">
            <h3>🤖 Smart Insights</h3>

            {insights.map((item, index) => (
              <div key={index} className="insight">
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* EXPLAINER ASIDE */}
          <div
            className="sim-card explainer-aside clickable"
            onClick={() => {
              setContent(explainers.concept);
              setShowPanel(true);
            }}
          >
            {/* HOVER PREVIEW */}
            <div className="hover-preview large">
              <h4>💡 Understanding the Model</h4>
              <p>
                This simulation compares the total cost of renting versus buying
                over a selected time horizon. The outcome is highly sensitive to
                interest rates, time horizon, and your income-to-expense ratio.
              </p>
              <span>Click to read full breakdown →</span>
            </div>

            <h3>💡 How this works</h3>
            <p className="explainer-text">
              Understand how rent, interest, and time influence your outcome.
            </p>
            <span className="learn-link">Learn more</span>
          </div>

          {/* ACTIONS */}
          <div className="sim-actions">
            <button className="pill">Apply insights to my strategy</button>
            <button
              className={`pill outline reset-btn${resetting ? " resetting" : ""}`}
              onClick={handleReset}
            >
              {resetting ? "↺ Resetting…" : "↺ Rebalance scenario"}
            </button>
          </div>
        </div>
      </div>

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={content}
      />

      {/* ORB */}
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

/* SLIDER */
function Slider({ label, value, set, min, max, prefix = "", suffix = "" }) {
  return (
    <div className="input-group">
      <div className="input-header">
        <span>{label}</span>
        <strong>
          {prefix}
          {value.toLocaleString()}
          {suffix}
        </strong>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );
}
