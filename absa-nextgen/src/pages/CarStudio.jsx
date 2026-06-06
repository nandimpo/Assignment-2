import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import SlideIn from "../components/SlideIn";
import YearFiveCallout from "../components/YearFiveCallout";
import "../styles/simulation.css";
import "../styles/fiveyear.css";
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
  const [monthlyOverride, setMonthlyOverride] = useState(null);
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

  const monthlyPayment = monthlyOverride ?? scenarios[mode];

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
      ? "This decision is financially expensive."
      : missedValue > 100000
        ? "Consider a cheaper alternative."
        : "This is a balanced decision.";

  /* ================= UI ================= */
  return (
    <div className="sim-page">
      <AppNav />

      <div className="scenario-toggle">
        <button onClick={() => { setMode("cheap"); setMonthlyOverride(null); }}>Cheap</button>
        <button onClick={() => { setMode("balanced"); setMonthlyOverride(null); }}>Balanced</button>
        <button onClick={() => { setMode("expensive"); setMonthlyOverride(null); }}>Expensive</button>
      </div>

      <div className="sim-container">
        <p className="sim-eyebrow">Simulation Lab · 5-Year Journey</p>
        <SlideIn tag="h1" text="Car vs Invest Studio" />
        <SlideIn tag="p" className="subtitle" delay={120} text="What does your car choice cost your 5-year wealth?" />

        <div className="sim-grid">
          {/* INPUT PANEL */}
          <div id="inputs" className="sim-card">
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
                onChange={(e) => setMonthlyOverride(Number(e.target.value))}
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

        {/* YEAR 5 CALLOUT */}
        <YearFiveCallout
          label="If you invested instead of buying this car"
          items={[
            { name: "Total car cost (5 yrs)", value: `R${(monthlyPayment * 12 * 5).toLocaleString("en-ZA")}` },
            { name: "Investment value (5 yrs)", value: `R${Math.round(data[Math.min(4, data.length - 1)]?.investment || 0).toLocaleString("en-ZA")}` },
            { name: "Opportunity cost", value: `R${missedValue.toLocaleString("en-ZA")}`, highlight: true },
          ]}
          note="Opportunity cost is what your car payment would have grown to as an investment by Year 5."
        />

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
