import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import "../styles/simulation.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getTourStep,
  setTourStep,
  completeTour,
  isTourDone,
} from "../utils/tour";

export default function CarStudio() {
  /* ================= STATE ================= */
  const [carPrice, setCarPrice] = useState(600000);
  const [returnRate, setReturnRate] = useState(8);
  const [years, setYears] = useState(5);
  const [mode, setMode] = useState("expensive");

  const [tourStepState, setTourStepState] = useState(getTourStep());
  const [showTour, setShowTour] = useState(!isTourDone());

  const tourSteps = [
    { text: "Adjust your scenario using these sliders.", target: "inputs" },
    {
      text: "This graph shows how your decision impacts your future.",
      target: "graph",
    },
    {
      text: "Here's your financial verdict based on your choices.",
      target: "verdict",
    },
  ];

  useEffect(() => {
    setTourStepState(getTourStep());
  }, []);

  useEffect(() => {
    const step = tourSteps[tourStepState];
    if (!step) return;
    const el = document.getElementById(step.target);
    if (el) {
      el.classList.add("highlight");
      return () => el.classList.remove("highlight");
    }
  }, [tourStepState]);

  /* ================= SCENARIO MODE ================= */
  const scenarios = {
    expensive: 10000,
    balanced: 7000,
    cheap: 4000,
  };

  const monthlyPayment = scenarios[mode];

  /* ================= CALCULATIONS ================= */
  const totalCarCost = monthlyPayment * 12 * years;
  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;

  let investment = 0;
  for (let i = 0; i < months; i++) {
    investment = (investment + monthlyPayment) * (1 + monthlyRate);
  }

  const missedValue = Math.round(investment - totalCarCost);

  /* ================= CHART DATA ================= */
  const data = [];
  let carTotal = 0;
  let chartInvestment = 0;

  for (let year = 1; year <= years; year++) {
    for (let m = 0; m < 12; m++) {
      carTotal += monthlyPayment;
      chartInvestment = (chartInvestment + monthlyPayment) * (1 + monthlyRate);
    }
    data.push({
      year: `Year ${year}`,
      car: Math.round(carTotal),
      investment: Math.round(chartInvestment),
    });
  }

  /* ================= VERDICT ================= */
  const verdict =
    missedValue > 200000
      ? "⚠️ This decision is financially expensive."
      : missedValue > 100000
        ? "⚡ Consider a cheaper alternative."
        : "✅ This is a balanced decision.";

  /* ================= UI ================= */
  return (
    <div className="sim-page">
      <AppNav />

      <div className="scenario-toggle">
        <button onClick={() => setMode("cheap")}>Cheap</button>
        <button onClick={() => setMode("balanced")}>Balanced</button>
        <button onClick={() => setMode("expensive")}>Expensive</button>
      </div>

      <div className="sim-container">
        <h1>Car vs Invest Studio</h1>
        <p>What is the real cost of your car?</p>

        <div className="sim-grid">
          {/* INPUT PANEL */}
          <div id="inputs" className="sim-card">
            <div className="input-group">
              <div className="input-header">
                <span>Car Price</span>
                <strong>R{carPrice.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="50000"
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <div className="input-header">
                <span>Monthly Payment</span>
                <strong>R{monthlyPayment.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min="2000"
                max="20000"
                step="500"
                value={monthlyPayment}
                onChange={() => {
                  // controlled by mode, slider is display only
                }}
              />
            </div>

            <div className="input-group">
              <div className="input-header">
                <span>Investment Return</span>
                <strong>{returnRate}%</strong>
              </div>
              <input
                type="range"
                min="4"
                max="15"
                step="1"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <div className="input-header">
                <span>Loan Term</span>
                <strong>{years} years</strong>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>

            <p className="nudge">
              Choosing a {mode} car could save you{" "}
              <strong>R{Math.round(missedValue * 0.6).toLocaleString()}</strong>
            </p>

            <button
              className="primary-btn"
              onClick={() => {
                localStorage.setItem("carDecision", mode);
                alert("Decision saved to your strategy track");
              }}
            >
              Apply to My Plan
            </button>
          </div>

          {/* GRAPH */}
          <div id="graph" className="sim-card graph-card">
            <h3>Car vs Investment Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="car"
                  stroke="#d6a85a"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="investment"
                  stroke="#84a794"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="graph-caption">
              The longer your time horizon, the greater the opportunity cost.
            </p>
            <div className="graph-values">
              Missed investment value: R{missedValue.toLocaleString()}
            </div>
            <div className="graph-impact">
              This decision impacts your future wealth significantly
            </div>
          </div>
        </div>

        {/* VERDICT */}
        <div id="verdict" className="sim-card">
          <h3>Studio Verdict</h3>
          <p className="verdict">{verdict}</p>
          <p>
            Buying this car could cost you{" "}
            <strong>R{missedValue.toLocaleString()}</strong> in missed
            investment growth.
          </p>
        </div>

        {/* EXPLAINER */}
        <div className="sim-card">
          <h3>Explainer (Mandatory)</h3>
          <p>Cars depreciate quickly while investments compound over time.</p>
        </div>

        {/* NUDGE */}
        <div className="sim-card">
          <h3>Behavioral Nudge</h3>
          <p>
            Choosing a cheaper car could save you{" "}
            <strong>R{Math.round(missedValue * 0.6).toLocaleString()}</strong>{" "}
            over {years} years.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="sim-actions">
          <button className="pill">Adjust Scenario</button>
          <button className="pill">Save Decision</button>
          {showTour && (
            <button
              className="primary-btn"
              onClick={() => {
                completeTour();
                setShowTour(false);
              }}
            >
              Finish Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
