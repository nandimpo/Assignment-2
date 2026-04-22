import { useState } from "react";
import "../styles/simulation.css";
import AppNav from "../components/AppNav";
import ExplainerPanel from "../components/ExplainerPanel";

export default function SimulationLab() {
  const [salary, setSalary] = useState(45000);
  const [rent, setRent] = useState(12000);
  const [price, setPrice] = useState(1800000);
  const [interest, setInterest] = useState(11);
  const [years, setYears] = useState(5);

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);

  /* ========================= */
  /* CALCULATIONS */
  /* ========================= */
  const rentTotal = rent * 12 * years;
  const bondMonthly = (price * (interest / 100)) / 12;
  const buyTotal = bondMonthly * 12 * years;
  const difference = rentTotal - buyTotal;

  /* ✅ FIX: MOVE THIS HERE (NOT inside JSX) */
  const maxValue = Math.max(rentTotal, buyTotal);

  /* ========================= */
  /* VERDICT */
  /* ========================= */
  let verdict = "";
  if (difference > 0) {
    verdict = `Renting could save you ~R${Math.abs(difference).toLocaleString()} over ${years} years.`;
  } else if (difference < 0) {
    verdict = `Buying builds equity but costs ~R${Math.abs(difference).toLocaleString()} more short-term.`;
  } else {
    verdict = `Renting and buying cost roughly the same over ${years} years.`;
  }

  /* ========================= */
  /* EXPLAINER */
  /* ========================= */
  let explainerText = "";

  if (interest > 13) {
    explainerText =
      "High interest rates increase the cost of buying significantly.";
  } else if (years <= 3) {
    explainerText = "Buying short-term is expensive due to upfront costs.";
  } else if (rent > salary * 0.4) {
    explainerText =
      "High rent relative to income reduces your ability to save.";
  } else {
    explainerText =
      "Buying includes interest and upfront costs, while renting offers flexibility.";
  }

  const explainers = {
    verdict: { title: "Studio Verdict", text: verdict },
    concept: { title: "Bond vs Rent", text: explainerText },
  };

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <h1>Property vs Renting Studio</h1>
        <p className="subtitle">What happens if I buy vs rent?</p>

        {/* ========================= */}
        {/* GRID */}
        {/* ========================= */}
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
              label="Time"
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
              {/* RENT */}
              <div className="bar-container">
                <div
                  className="bar rent"
                  style={{
                    height: `${(rentTotal / maxValue) * 140}px`,
                  }}
                >
                  <span className="bar-tooltip">
                    R{rentTotal.toLocaleString()}
                  </span>
                </div>
                <span>Rent</span>
              </div>

              {/* BUY */}
              <div className="bar-container">
                <div
                  className="bar buy"
                  style={{
                    height: `${(buyTotal / maxValue) * 140}px`,
                  }}
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

            <p className="graph-impact">
              {difference < 0
                ? `You spend ~R${Math.abs(difference).toLocaleString()} more by buying`
                : `You save ~R${Math.abs(difference).toLocaleString()} by renting`}
            </p>
          </div>
        </div>

        {/* ========================= */}
        {/* BOTTOM */}
        {/* ========================= */}
        <div className="sim-bottom">
          {/* VERDICT */}
          <div
            className="sim-card clickable verdict-card"
            onClick={() => {
              setContent(explainers.verdict);
              setShowPanel(true);
            }}
          >
            <h3>📊 Studio Verdict</h3>
            <p>{verdict}</p>
          </div>

          {/* EXPLAINER */}
          <div className="sim-card explainer-aside clickable">
            <h3>💡 Explainer (Mandatory)</h3>

            <p className="explainer-text">{explainerText}</p>

            <span className="learn-link">Learn more</span>

            <div className="tooltip-box">{explainerText}</div>
          </div>

          {/* ACTIONS */}
          <div className="sim-actions">
            <button className="pill">Apply to Strategy Track</button>
            <button className="pill outline">Adjust Inputs</button>
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
