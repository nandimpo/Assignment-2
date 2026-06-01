import { useState } from "react";
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

export default function InvestingStudio() {
  /* ================= STATE ================= */
  const [monthly, setMonthly] = useState(5000);
  const [localSplit, setLocalSplit] = useState(60);
  const [globalSplit, setGlobalSplit] = useState(40);
  const [localReturn, setLocalReturn] = useState(8);
  const [globalReturn, setGlobalReturn] = useState(10);
  const [years, setYears] = useState(5);

  /* ================= CALCULATIONS ================= */

  const months = years * 12;
  const localRate = localReturn / 100 / 12;
  const globalRate = globalReturn / 100 / 12;

  let localValue = 0;
  let globalValue = 0;

  const data = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      localValue =
        (localValue + monthly * (localSplit / 100)) * (1 + localRate);

      globalValue =
        (globalValue + monthly * (globalSplit / 100)) * (1 + globalRate);
    }

    data.push({
      year: `Year ${y}`,
      local: Math.round(localValue),
      global: Math.round(globalValue),
      combined: Math.round(localValue + globalValue),
    });
  }

  const finalLocal = data[data.length - 1].local;
  const finalGlobal = data[data.length - 1].global;
  const finalCombined = data[data.length - 1].combined;

  /* ================= VERDICT ================= */

  const diff = finalGlobal - finalLocal;

  let verdict =
    diff > 80000
      ? "🌍 Offshore investing significantly outperforms local."
      : diff > 20000
        ? "⚖️ Offshore has an edge, but balance is strong."
        : "🏠 Local investing performs similarly — lower risk.";

  /* ================= UI ================= */

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <h1>Local vs Offshore Investing Studio</h1>
        <p>Should you invest locally or globally?</p>

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <div className="input-group">
              <span>Monthly Investment</span>
              <strong>R{monthly.toLocaleString()}</strong>
              <input
                type="range"
                min="1000"
                max="20000"
                step="500"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <span>Local Allocation</span>
              <strong>{localSplit}%</strong>
              <input
                type="range"
                min="0"
                max="100"
                value={localSplit}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLocalSplit(val);
                  setGlobalSplit(100 - val);
                }}
              />
            </div>

            <p>Global Allocation: {globalSplit}%</p>

            <div className="input-group">
              <span>SA Return</span>
              <strong>{localReturn}%</strong>
              <input
                type="range"
                min="4"
                max="15"
                value={localReturn}
                onChange={(e) => setLocalReturn(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <span>Global Return</span>
              <strong>{globalReturn}%</strong>
              <input
                type="range"
                min="5"
                max="18"
                value={globalReturn}
                onChange={(e) => setGlobalReturn(Number(e.target.value))}
              />
            </div>

            <div className="input-group">
              <span>Time Horizon</span>
              <strong>{years} years</strong>
              <input
                type="range"
                min="1"
                max="10"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>

          {/* GRAPH */}
          <div className="sim-card">
            <h3>Portfolio Growth</h3>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="local"
                  stroke="#d6a85a"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="global"
                  stroke="#84a794"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="combined"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

            <p>
              Final after {years} years:
              <br />
              Local: R{finalLocal.toLocaleString()} <br />
              Offshore: R{finalGlobal.toLocaleString()} <br />
              Combined: R{finalCombined.toLocaleString()}
            </p>
          </div>
        </div>

        {/* VERDICT */}
        <div className="sim-card">
          <h3>Studio Verdict</h3>
          <p>
            Offshore investing could outperform local by{" "}
            <strong>R{diff.toLocaleString()}</strong>, but a balanced portfolio
            reduces risk.
          </p>
          <p>{verdict}</p>
        </div>

        {/* EXPLAINER */}
        <div className="sim-card">
          <h3>Explainer</h3>
          <p>
            Global markets provide diversification and exposure to stronger
            currencies, while local investments offer familiarity and
            accessibility.
          </p>
        </div>

        {/* NUDGE */}
        <div className="sim-card">
          <h3>Smart Nudge</h3>
          <p>
            Increasing offshore exposure could improve long-term returns and
            reduce risk from local economic volatility.
          </p>

          <button
            className="pill"
            onClick={() => {
              setLocalSplit(60);
              setGlobalSplit(40);
            }}
          >
            Apply 60/40 Split
          </button>
        </div>

        {/* ACTIONS */}
        <div className="sim-actions">
          <button
            className="primary-btn"
            onClick={() => {
              localStorage.setItem(
                "portfolioSplit",
                JSON.stringify({ localSplit, globalSplit }),
              );
              alert("Saved to strategy track");
            }}
          >
            Apply Allocation to Strategy Track
          </button>

          <button className="pill">Adjust Inputs</button>
        </div>
      </div>
    </div>
  );
}
