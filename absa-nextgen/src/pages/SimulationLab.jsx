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
  /* CALCULATIONS (SIMPLE BUT CONSISTENT) */
  /* ========================= */

  const rentTotal = rent * 12 * years;

  const bondMonthly = price * 0.01; // simplified bond estimate
  const buyTotal = bondMonthly * 12 * years;

  const difference = rentTotal - buyTotal;

  /* ========================= */
  /* VERDICT */
  /* ========================= */

  const verdict =
    difference > 0
      ? `Renting could save you ~R${Math.abs(difference).toLocaleString()} over ${years} years.`
      : `Buying builds equity but costs ~R${Math.abs(difference).toLocaleString()} more short-term.`;

  /* ========================= */
  /* EXPLAINERS */
  /* ========================= */

  const explainers = {
    verdict: {
      title: "Studio Verdict",
      text: "This compares total cost of renting vs buying over time. Renting may allow investing the difference, while buying builds equity.",
    },
    concept: {
      title: "Bond vs Rent",
      text: "Buying includes interest and upfront costs. Renting is cheaper short-term but does not build ownership.",
    },
  };

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <h1>Property vs Renting Studio</h1>
        <p className="subtitle">What happens if I buy vs rent?</p>

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <label>Monthly Salary</label>
            <input
              type="range"
              min="20000"
              max="100000"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <p>R{salary.toLocaleString()}</p>

            <label>Monthly Rent</label>
            <input
              type="range"
              min="5000"
              max="30000"
              value={rent}
              onChange={(e) => setRent(Number(e.target.value))}
            />
            <p>R{rent.toLocaleString()}</p>

            <label>Property Price</label>
            <input
              type="range"
              min="500000"
              max="3000000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <p>R{price.toLocaleString()}</p>

            <label>Interest Rate</label>
            <input
              type="range"
              min="8"
              max="15"
              value={interest}
              onChange={(e) => setInterest(Number(e.target.value))}
            />
            <p>{interest}%</p>

            <label>Time</label>
            <input
              type="range"
              min="1"
              max="10"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <p>{years} years</p>
          </div>

          {/* OUTPUT GRAPH (SIMPLE VISUAL) */}
          <div className="sim-card center">
            <h3>Cost Comparison</h3>

            <div className="bars">
              <div
                className="bar rent"
                style={{ height: `${rentTotal / 10000}px` }}
              >
                Rent
              </div>

              <div
                className="bar buy"
                style={{ height: `${buyTotal / 10000}px` }}
              >
                Buy
              </div>
            </div>

            <p className="small">
              Rent: R{rentTotal.toLocaleString()} | Buy: R
              {buyTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* VERDICT */}
        <div
          className="sim-card clickable"
          onClick={() => {
            setContent(explainers.verdict);
            setShowPanel(true);
          }}
        >
          <h3>📊 Studio Verdict</h3>
          <p>{verdict}</p>
        </div>

        {/* EXPLAINER */}
        <div
          className="sim-card clickable"
          onClick={() => {
            setContent(explainers.concept);
            setShowPanel(true);
          }}
        >
          <h3>💡 Explainer (Mandatory)</h3>
          <p>Property has high upfront costs and interest in early years.</p>
          <button className="pill">Learn more</button>
        </div>

        {/* ACTIONS */}
        <div className="sim-actions">
          <button
            className="pill"
            onClick={() => alert("Applied to your strategy")}
          >
            Apply to Strategy Track
          </button>

          <button className="pill outline">Adjust Inputs</button>
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
