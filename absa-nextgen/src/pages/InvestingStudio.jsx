import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Cpu, HelpCircle, GraduationCap } from "lucide-react";
import growthImg from "../assets/growth.png.gif";
import AppNav from "../components/AppNav";
import FlipCard from "../components/FlipCard";
import Typewriter from "../components/Typewriter";
import SlideIn from "../components/SlideIn";
import YearFiveCallout from "../components/YearFiveCallout";
import ExplainerPanel from "../components/ExplainerPanel";
import { useUser } from "../context/UserContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../styles/simulation.css";
import "../styles/fiveyear.css";

const DEFAULTS = {
  monthly:      5000,
  localSplit:   60,
  localReturn:  9,
  globalReturn: 12,
  years:        5,
};

export default function InvestingStudio() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [monthly,      setMonthly]      = useState(Number(user?.monthlyInvest) || DEFAULTS.monthly);
  const [localSplit,   setLocalSplit]   = useState(DEFAULTS.localSplit);
  const [localReturn,  setLocalReturn]  = useState(DEFAULTS.localReturn);
  const [globalReturn, setGlobalReturn] = useState(DEFAULTS.globalReturn);
  const [years,        setYears]        = useState(DEFAULTS.years);

  const [showPanel, setShowPanel] = useState(false);
  const [content,   setContent]   = useState(null);
  const [resetting, setResetting] = useState(false);

  const globalSplit = 100 - localSplit;

  /* ── CALCULATIONS ─────────────────────────────── */

  const localRate  = localReturn  / 100 / 12;
  const globalRate = globalReturn / 100 / 12;

  const data = [];
  let localValue  = 0;
  let globalValue = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      localValue  = (localValue  + monthly * (localSplit  / 100)) * (1 + localRate);
      globalValue = (globalValue + monthly * (globalSplit / 100)) * (1 + globalRate);
    }
    data.push({
      year:     `Year ${y}`,
      local:    Math.round(localValue),
      global:   Math.round(globalValue),
      combined: Math.round(localValue + globalValue),
    });
  }

  const y5 = data[Math.min(4, data.length - 1)];
  const finalLocal    = y5.local;
  const finalGlobal   = y5.global;
  const finalCombined = y5.combined;
  const diff          = finalGlobal - finalLocal;

  // Total invested (no returns) for context
  const totalInvested = monthly * years * 12;

  /* ── CGT NOTE ─────────────────────────────────── */
  // SA CGT: 40% inclusion rate × marginal rate (max ~18% effective for top bracket)
  // Applied only on gains above annual exclusion (R40 000). Shown as context note.
  const gains          = Math.max(0, finalCombined - totalInvested);
  const cgtEstimate    = Math.round(gains * 0.40 * 0.18); // simplified top-bracket estimate
  const afterTaxCombined = finalCombined - cgtEstimate;

  /* ── VERDICT ──────────────────────────────────── */

  let verdict = "";

  if (diff > 100000) {
    verdict = `Offshore investing outperforms local by R${diff.toLocaleString("en-ZA")} at Year ${years}. The global portfolio benefits from rand-hedge exposure and stronger underlying growth rates in this scenario.`;
  } else if (diff > 30000) {
    verdict = `Offshore has a R${diff.toLocaleString("en-ZA")} edge, but a ${localSplit}/${globalSplit} blended portfolio reduces currency risk while still growing meaningfully.`;
  } else if (diff > 0) {
    verdict = `The ${localSplit}/${globalSplit} split is fairly balanced — offshore leads by R${diff.toLocaleString("en-ZA")}. Local JSE exposure provides stability and avoids offshore transfer limits.`;
  } else {
    verdict = `Local investing outperforms offshore by R${Math.abs(diff).toLocaleString("en-ZA")} at these return rates. Reducing offshore allocation improves this result, but diversification remains valuable.`;
  }

  /* ── INSIGHTS ─────────────────────────────────── */

  const insights = [];

  if (globalReturn - localReturn > 4) {
    insights.push(
      `A ${globalReturn - localReturn}% return gap is large. Global returns are not guaranteed — consider that rand depreciation (which inflates offshore returns in ZAR) can reverse.`,
    );
  }

  if (localSplit < 20) {
    insights.push(
      "South African residents may only externalise up to R10 million per year via the single discretionary and foreign investment allowance. Heavily offshore portfolios may require prior SARB approval.",
    );
  }

  if (monthly < 1000) {
    insights.push(
      "At this contribution level, consider a Tax-Free Savings Account (TFSA) first — the full R36,000/year annual allowance can be invested tax-free, with no CGT on growth.",
    );
  }

  if (localSplit > 80) {
    insights.push(
      "High local concentration exposes you to SA-specific risk (load shedding, political risk, rand volatility). A minimum 20–40% offshore allocation is commonly recommended by SA financial planners.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      `Your ${localSplit}/${globalSplit} split invests R${Math.round(monthly * localSplit / 100).toLocaleString("en-ZA")} locally and R${Math.round(monthly * globalSplit / 100).toLocaleString("en-ZA")} offshore each month.`,
    );
  }

  /* ── EXPLAINER ────────────────────────────────── */

  const explainerText = `
This simulation compares two portions of your monthly investment — a local JSE-tracking component and a global (offshore) component — over your chosen time horizon.

Assumptions:
• Returns are annualised and compounded monthly.
• Local returns (8–12%) reflect South African equity market long-run averages.
• Global returns (10–15%) reflect USD-denominated global indices, partially amplified for ZAR investors due to rand depreciation trends.
• No platform fees, advisor costs, or transaction costs are modelled.

Tax context (SA):
• Capital Gains Tax applies at a 40% inclusion rate, taxed at your marginal rate. At the top bracket (45%), the effective CGT rate is 18%.
• The annual CGT exclusion is R40,000 for individuals.
• Tax-Free Savings Accounts (TFSA) allow up to R36,000/year (R500,000 lifetime) — all growth and withdrawals are tax-free.
• Retirement Annuities (RA) allow up to 27.5% of taxable income as a tax deduction.

The after-tax estimate shown assumes a simplified top-bracket CGT rate and does not account for TFSA or RA wrappers.
`;

  const explainers = {
    verdict: { title: "AI Financial Verdict",    text: verdict },
    concept: { title: "Understanding the Model", text: explainerText },
  };

  /* ── RESET ────────────────────────────────────── */

  const handleReset = () => {
    setResetting(true);
    setMonthly(DEFAULTS.monthly);
    setLocalSplit(DEFAULTS.localSplit);
    setLocalReturn(DEFAULTS.localReturn);
    setGlobalReturn(DEFAULTS.globalReturn);
    setYears(DEFAULTS.years);
    setShowPanel(false);
    setContent(null);
    setTimeout(() => setResetting(false), 600);
  };

  /* ── RENDER ───────────────────────────────────── */

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <p className="sim-eyebrow">Simulation Lab · 5-Year Journey</p>
        <SlideIn tag="h1" text="Local vs Offshore Investing Studio" />
        <SlideIn tag="p" className="subtitle" delay={120}
          text="Which allocation builds more wealth over your first 5 years? Model JSE vs global returns with SA tax context." />

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <Slider label="Monthly Investment"   value={monthly}      set={setMonthly}      min={500}   max={30000} step={500} prefix="R" />

            <div className="input-group">
              <div className="input-header">
                <span>Local (JSE) allocation</span>
                <strong>{localSplit}%</strong>
              </div>
              <input
                type="range" min={0} max={100} value={localSplit}
                onChange={(e) => setLocalSplit(Number(e.target.value))}
              />
              <p style={{ fontSize: "0.75rem", color: "#8a9a96", margin: "4px 0 0" }}>
                Offshore: <strong style={{ color: "#84a794" }}>{globalSplit}%</strong> · automatically linked
              </p>
            </div>

            <Slider label="SA (JSE) Annual Return"    value={localReturn}  set={setLocalReturn}  min={4} max={16} suffix="%" />
            <Slider label="Global Annual Return"      value={globalReturn} set={setGlobalReturn} min={5} max={20} suffix="%" />
            <Slider label="Time Horizon"              value={years}        set={setYears}        min={1} max={10} suffix=" years" />

            <div style={{ marginTop: 12, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "0.78rem", color: "#8a9a96", margin: "0 0 4px" }}>
                Total invested: <strong style={{ color: "#c0ccc8" }}>R{totalInvested.toLocaleString("en-ZA")}</strong>
              </p>
              <p style={{ fontSize: "0.78rem", color: "#8a9a96", margin: 0 }}>
                Est. after-tax (top bracket): <strong style={{ color: "#d6a85a" }}>R{afterTaxCombined.toLocaleString("en-ZA")}</strong>
              </p>
            </div>
          </div>

          {/* CHART */}
          <div className="sim-card graph-card">
            <h3 className="graph-title">Portfolio Growth Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <XAxis dataKey="year" tick={{ fill: "#8a9a96", fontSize: 12 }} />
                <YAxis tick={{ fill: "#8a9a96", fontSize: 11 }}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v, name) => [
                    `R${Number(v).toLocaleString("en-ZA")}`,
                    name === "local" ? "Local (JSE)" : name === "global" ? "Offshore" : "Combined",
                  ]}
                  contentStyle={{ background: "#121616", border: "1px solid #2a3a35", color: "white" }}
                />
                <Legend
                  formatter={(v) => v === "local" ? "Local (JSE)" : v === "global" ? "Offshore" : "Combined"}
                  wrapperStyle={{ fontSize: "0.78rem", color: "#8a9a96" }}
                />
                <Line type="monotone" dataKey="local"    stroke="#d6a85a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="global"   stroke="#84a794" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="combined" stroke="#ffffff" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
            <p className="graph-impact">{verdict}</p>
          </div>
        </div>

        {/* YEAR 5 CALLOUT */}
        <YearFiveCallout
          label="Your portfolio after 5 years of investing"
          items={[
            { name: `Local JSE (${localSplit}%)`,   value: `R${finalLocal.toLocaleString("en-ZA")}` },
            { name: `Offshore (${globalSplit}%)`,   value: `R${finalGlobal.toLocaleString("en-ZA")}` },
            { name: "Combined portfolio",           value: `R${finalCombined.toLocaleString("en-ZA")}`, highlight: true },
          ]}
          note={`R${monthly.toLocaleString("en-ZA")}/month · est. after-tax (top bracket): R${afterTaxCombined.toLocaleString("en-ZA")} · R${totalInvested.toLocaleString("en-ZA")} total invested`}
        />

        {/* BOTTOM */}
        <div className="sim-bottom">
          {/* VERDICT */}
          <FlipCard
            className="sim-card-flip verdict-flip"
            front={
              <div className="sim-card verdict-card">
                <h3 className="sim-section-title"><BarChart2 size={16} /> AI Financial Verdict</h3>
                <p>{verdict}</p>
              </div>
            }
            back={
              <>
                <span className="flip-back-label">AI Financial Verdict</span>
                <span className="flip-back-count">Verdict</span>
                <span className="flip-back-sub">Open the full reasoning behind this investment split.</span>
                <button
                  className="pill flip-back-action"
                  onClick={() => { setContent(explainers.verdict); setShowPanel(true); }}
                >
                  Open full verdict
                </button>
              </>
            }
          />

          {/* INSIGHTS */}
          <FlipCard
            className="sim-card-flip"
            front={
              <div className="sim-card">
                <h3 className="sim-section-title"><Cpu size={16} /> Smart Insights</h3>
                {insights.map((item, i) => (
                  <div key={i} className="insight"><Typewriter text={item} speed={14} delay={i * 180} /></div>
                ))}
              </div>
            }
            back={
              <>
                <span className="flip-back-label">Smart Insights</span>
                <span className="flip-back-count">{insights.length}</span>
                <span className="flip-back-sub">AI-generated insights on your investment split</span>
              </>
            }
          />

          {/* EXPLAINER */}
          <div
            className="sim-card explainer-aside clickable"
            onClick={() => { setContent(explainers.concept); setShowPanel(true); }}
          >
            <img src={growthImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.07, pointerEvents: "none", zIndex: 0, borderRadius: 22 }} />
            <div className="hover-preview large">
              <h4 className="sim-section-title"><HelpCircle size={14} /> Understanding the Model</h4>
              <p>SA tax treatment, TFSA limits, CGT rates, and offshore transfer rules explained.</p>
              <span>Click to read full breakdown →</span>
            </div>
            <h3 className="sim-section-title"><HelpCircle size={16} /> How this works</h3>
            <p className="explainer-text">
              SA CGT, TFSA limits, rand-hedge returns, and SARB externalisation rules explained.
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

      <div
        className="finance-orb"
        onClick={() => navigate("/learn")}
        title="Go to Finance School"
      >
        <GraduationCap size={24} />
      </div>
    </div>
  );
}

function Slider({ label, value, set, min, max, step = 1, prefix = "", suffix = "" }) {
  return (
    <div className="input-group">
      <div className="input-header">
        <span>{label}</span>
        <strong>{prefix}{value.toLocaleString()}{suffix}</strong>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );
}
