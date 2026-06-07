import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Cpu, HelpCircle } from "lucide-react";
import AppNav from "../components/AppNav";
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
  ResponsiveContainer,
  Legend,
} from "recharts";
import "../styles/simulation.css";
import "../styles/fiveyear.css";

const DEFAULTS = {
  surplus:    8000,
  debt:       80000,
  debtRate:   20,
  investRate: 10,
  years:      5,
};

export default function DebtStudio() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [surplus,    setSurplus]    = useState(Number(user?.surplus)    || DEFAULTS.surplus);
  const [debt,       setDebt]       = useState(DEFAULTS.debt);
  const [debtRate,   setDebtRate]   = useState(DEFAULTS.debtRate);
  const [investRate, setInvestRate] = useState(DEFAULTS.investRate);
  const [years,      setYears]      = useState(DEFAULTS.years);

  const [showPanel, setShowPanel] = useState(false);
  const [content,   setContent]   = useState(null);
  const [resetting, setResetting] = useState(false);

  /* ── CALCULATIONS ─────────────────────────────── */

  const data = [];

  let debtA = debt;
  let portfolioA = 0;
  let debtB = debt;
  let portfolioB = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      // SCENARIO A — pay debt fully first, then invest
      if (debtA > 0) {
        const interest = debtA * (debtRate / 100 / 12);
        const payment  = Math.min(surplus, debtA + interest);
        debtA = Math.max(0, debtA + interest - payment);
      } else {
        portfolioA = (portfolioA + surplus) * (1 + investRate / 100 / 12);
      }

      // SCENARIO B — pay interest-only minimum, invest the rest
      const monthlyInterest = debtB * (debtRate / 100 / 12);
      const minPayment      = Math.min(debtB + monthlyInterest, Math.max(monthlyInterest, surplus * 0.25));
      const investAmount    = Math.max(0, surplus - minPayment);
      debtB       = Math.max(0, debtB + monthlyInterest - minPayment);
      portfolioB  = (portfolioB + investAmount) * (1 + investRate / 100 / 12);
    }

    data.push({
      year:      `Year ${y}`,
      payFirst:  Math.round(portfolioA - debtA),
      investNow: Math.round(portfolioB - debtB),
    });
  }

  const y5A = data[Math.min(4, data.length - 1)].payFirst;
  const y5B = data[Math.min(4, data.length - 1)].investNow;
  const diff = y5A - y5B;

  /* ── VERDICT ──────────────────────────────────── */

  let verdict = "";
  let tone    = "";

  if (diff > 50000) {
    verdict = `Clearing your debt first puts you R${diff.toLocaleString("en-ZA")} ahead by Year 5. High-interest debt destroys the gains investing would have made.`;
    tone = "positive";
  } else if (diff > 0) {
    verdict = `Paying debt first gives a modest R${diff.toLocaleString("en-ZA")} advantage by Year 5. The right call depends on your emotional comfort with carrying debt.`;
    tone = "neutral";
  } else {
    verdict = `Investing while servicing debt builds R${Math.abs(diff).toLocaleString("en-ZA")} more by Year 5. Your investment return outpaces your debt interest in this scenario.`;
    tone = "positive";
  }

  /* ── INSIGHTS ─────────────────────────────────── */

  const insights = [];

  if (debtRate > investRate) {
    insights.push(
      `Your debt rate (${debtRate}%) exceeds your expected investment return (${investRate}%). Paying debt first is mathematically guaranteed to win.`,
    );
  } else {
    insights.push(
      `Your investment return (${investRate}%) beats your debt rate (${debtRate}%). Investing now may generate more wealth, but carry risk.`,
    );
  }

  if (debt > surplus * 18) {
    insights.push(
      "Your debt is large relative to your surplus — it will take over 18 months to clear. Consider whether investing even a small amount during that period maintains momentum.",
    );
  }

  if (surplus < 3000) {
    insights.push(
      "With a small monthly surplus, building an emergency fund first may be more urgent than either strategy — one unexpected expense could force you to accumulate more debt.",
    );
  }

  if (debtRate >= 18) {
    insights.push(
      "At 18%+ interest this is likely a credit card or personal loan. Paying it off is one of the highest guaranteed returns available to you.",
    );
  }

  /* ── EXPLAINER ────────────────────────────────── */

  const explainerText = `
This simulation compares two strategies for your monthly surplus:

Scenario A (Pay Debt First) — every rand of your surplus goes toward the debt until it's cleared, then the full surplus goes into an investment portfolio.

Scenario B (Invest Now) — you make minimum payments on the debt (interest only) and invest the remainder immediately.

Net worth = portfolio value minus remaining debt at each point in time. The winning strategy depends on the gap between your debt interest rate and your investment return.
`;

  const explainers = {
    verdict: { title: "AI Financial Verdict", text: verdict },
    concept: { title: "Understanding the Model",  text: explainerText },
  };

  /* ── RESET ────────────────────────────────────── */

  const handleReset = () => {
    setResetting(true);
    setSurplus(DEFAULTS.surplus);
    setDebt(DEFAULTS.debt);
    setDebtRate(DEFAULTS.debtRate);
    setInvestRate(DEFAULTS.investRate);
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
        <SlideIn tag="h1" text="Debt Payoff vs Invest Studio" />
        <SlideIn tag="p" className="subtitle" delay={120}
          text="Should you clear your debt first, or start investing now? See the 5-year net worth gap." />

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <Slider label="Monthly Surplus"      value={surplus}    set={setSurplus}    min={1000}  max={30000}  prefix="R" />
            <Slider label="Debt Balance"          value={debt}       set={setDebt}       min={0}     max={300000} prefix="R" />
            <Slider label="Debt Interest Rate"    value={debtRate}   set={setDebtRate}   min={5}     max={30}     suffix="%" />
            <Slider label="Expected Invest Return" value={investRate} set={setInvestRate} min={4}     max={18}     suffix="%" />
            <Slider label="Time Horizon"           value={years}      set={setYears}      min={1}     max={10}     suffix=" years" />
          </div>

          {/* CHART */}
          <div className="sim-card graph-card">
            <h3 className="graph-title">Net Worth Over Time</h3>
            <p style={{ fontSize: "0.78rem", color: "#8a9a96", marginBottom: "1rem" }}>
              Portfolio value minus remaining debt
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <XAxis dataKey="year" tick={{ fill: "#8a9a96", fontSize: 12 }} />
                <YAxis tick={{ fill: "#8a9a96", fontSize: 11 }}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v, name) => [
                    `R${Number(v).toLocaleString("en-ZA")}`,
                    name === "payFirst" ? "Pay Debt First" : "Invest Now",
                  ]}
                  contentStyle={{ background: "#121616", border: "1px solid #2a3a35", color: "white" }}
                />
                <Legend
                  formatter={(v) => v === "payFirst" ? "Pay Debt First" : "Invest Now"}
                  wrapperStyle={{ fontSize: "0.78rem", color: "#8a9a96" }}
                />
                <Line type="monotone" dataKey="payFirst"  stroke="#d6a85a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="investNow" stroke="#84a794" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>

            <p className="graph-impact">{verdict}</p>
          </div>
        </div>

        {/* YEAR 5 CALLOUT */}
        <YearFiveCallout
          label="Your net worth after 5 years"
          items={[
            { name: "Pay Debt First",  value: `R${y5A.toLocaleString("en-ZA")}` },
            { name: "Invest Now",      value: `R${y5B.toLocaleString("en-ZA")}` },
            {
              name: "Difference",
              value: `R${Math.abs(diff).toLocaleString("en-ZA")} ${diff >= 0 ? "ahead paying debt" : "ahead investing"}`,
              highlight: true,
            },
          ]}
          note={`At R${surplus.toLocaleString("en-ZA")}/month surplus · ${debtRate}% debt vs ${investRate}% invest`}
        />

        {/* BOTTOM */}
        <div className="sim-bottom">
          {/* VERDICT */}
          <div
            className="sim-card clickable verdict-card"
            onClick={() => { setContent(explainers.verdict); setShowPanel(true); }}
          >
            <div className="hover-preview large">
              <h4 className="sim-section-title"><BarChart2 size={14} /> AI Financial Verdict</h4>
              <p>{verdict}</p>
              <span>Click to explore in full →</span>
            </div>
            <h3 className="sim-section-title"><BarChart2 size={16} /> AI Financial Verdict</h3>
            <p>{verdict}</p>
          </div>

          {/* INSIGHTS */}
          <div className="sim-card">
            <h3 className="sim-section-title"><Cpu size={16} /> Smart Insights</h3>
            {insights.map((item, i) => (
              <div key={i} className="insight"><p>{item}</p></div>
            ))}
          </div>

          {/* EXPLAINER */}
          <div
            className="sim-card explainer-aside clickable"
            onClick={() => { setContent(explainers.concept); setShowPanel(true); }}
          >
            <div className="hover-preview large">
              <h4 className="sim-section-title"><HelpCircle size={14} /> Understanding the Model</h4>
              <p>Two strategies, one surplus. See how debt rate vs investment return determines your Year 5 winner.</p>
              <span>Click to read full breakdown →</span>
            </div>
            <h3 className="sim-section-title"><HelpCircle size={16} /> How this works</h3>
            <p className="explainer-text">
              Understand how debt rate vs investment return shapes your 5-year net worth.
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
        🎓
      </div>
    </div>
  );
}

function Slider({ label, value, set, min, max, prefix = "", suffix = "" }) {
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
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );
}
