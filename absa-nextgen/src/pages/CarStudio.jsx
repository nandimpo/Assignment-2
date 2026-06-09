import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Cpu, HelpCircle } from "lucide-react";
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
  carPrice:   350000,
  deposit:    50000,
  loanRate:   13,
  investRate: 10,
  years:      5,
};

export default function CarStudio() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [carPrice,   setCarPrice]   = useState(DEFAULTS.carPrice);
  const [deposit,    setDeposit]    = useState(DEFAULTS.deposit);
  const [loanRate,   setLoanRate]   = useState(DEFAULTS.loanRate);
  const [investRate, setInvestRate] = useState(DEFAULTS.investRate);
  const [years,      setYears]      = useState(DEFAULTS.years);

  const [showPanel, setShowPanel] = useState(false);
  const [content,   setContent]   = useState(null);
  const [resetting, setResetting] = useState(false);

  /* ── CALCULATIONS ─────────────────────────────── */

  const loanAmount   = Math.max(0, carPrice - deposit);
  const months       = years * 12;
  const monthlyRate  = loanRate / 100 / 12;

  // Amortising monthly bond/loan repayment (standard SA vehicle finance formula)
  const monthlyPayment = loanAmount > 0 && monthlyRate > 0
    ? Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1))
    : Math.round(loanAmount / months);

  const totalCarCost   = deposit + monthlyPayment * months;
  const totalInterest  = totalCarCost - carPrice;

  // Depreciation: SA cars typically lose ~15% yr1, ~10%/yr after
  let carValue = carPrice;
  for (let y = 0; y < years; y++) {
    carValue = Math.round(carValue * (y === 0 ? 0.85 : 0.90));
  }
  const equityAtEnd = Math.max(0, carValue);

  // Investment scenario: same deposit + monthly payment invested instead
  const investRate12 = investRate / 100 / 12;
  let portfolio = deposit; // lump sum at month 0
  for (let m = 0; m < months; m++) {
    portfolio = (portfolio + monthlyPayment) * (1 + investRate12);
  }
  portfolio = Math.round(portfolio);

  const opportunityCost = portfolio - equityAtEnd;

  /* ── CHART DATA ───────────────────────────────── */

  const data = [];
  let chartPortfolio = deposit;
  let outstanding    = loanAmount;

  for (let y = 1; y <= years; y++) {
    // car equity at this year
    let cv = carPrice;
    for (let i = 0; i < y; i++) cv = Math.round(cv * (i === 0 ? 0.85 : 0.90));
    const carEquity = Math.max(0, cv - outstanding);

    for (let m = 0; m < 12; m++) {
      chartPortfolio = (chartPortfolio + monthlyPayment) * (1 + investRate12);
      const interest = outstanding * monthlyRate;
      outstanding = Math.max(0, outstanding + interest - monthlyPayment);
    }

    data.push({
      year:      `Year ${y}`,
      invest:    Math.round(chartPortfolio),
      carEquity: Math.max(0, cv - outstanding),
    });
  }

  /* ── VERDICT ──────────────────────────────────── */

  let verdict = "";

  if (loanRate > investRate) {
    verdict = `Your car loan rate (${loanRate}%) exceeds your expected investment return (${investRate}%). The finance cost is destroying potential wealth — consider a smaller loan or larger deposit.`;
  } else if (opportunityCost > 300000) {
    verdict = `Choosing this car over investing costs you approximately R${opportunityCost.toLocaleString("en-ZA")} in lost portfolio value by Year ${years}. A more affordable vehicle or cash purchase would significantly close this gap.`;
  } else if (opportunityCost > 100000) {
    verdict = `There's a meaningful R${opportunityCost.toLocaleString("en-ZA")} opportunity cost over ${years} years. If transport is a necessity, this may be acceptable — but consider a smaller model or used vehicle.`;
  } else {
    verdict = `The opportunity cost is moderate at R${opportunityCost.toLocaleString("en-ZA")}. With a solid deposit and competitive interest rate, this is a manageable financial decision.`;
  }

  /* ── INSIGHTS ─────────────────────────────────── */

  const insights = [];

  if (deposit < carPrice * 0.1) {
    insights.push(
      "Your deposit is below 10% of the vehicle price. SA banks typically require at least 10% — a larger deposit also reduces your monthly payment and total interest paid.",
    );
  }

  if (loanRate > 14) {
    insights.push(
      `At ${loanRate}% you'll pay R${totalInterest.toLocaleString("en-ZA")} in interest alone over ${years} years. Shopping for a lower rate or reducing the loan term saves thousands.`,
    );
  }

  if (carPrice > 500000) {
    insights.push(
      "Vehicles above R500,000 depreciate faster in rand terms. Luxury cars typically lose 40–50% of value in 5 years.",
    );
  }

  if (insights.length === 0) {
    insights.push(
      `With a ${Math.round((deposit / carPrice) * 100)}% deposit and ${loanRate}% rate, your monthly payment is R${monthlyPayment.toLocaleString("en-ZA")}. Total interest over the term: R${totalInterest.toLocaleString("en-ZA")}.`,
    );
  }

  /* ── EXPLAINER ────────────────────────────────── */

  const explainerText = `
This simulation models two mutually exclusive uses of your money:

Option A (Buy the car): You put down a deposit, finance the remainder at your chosen interest rate, and drive away. The car depreciates at roughly 15% in Year 1, then 10% per year thereafter — standard SA used-car market rates.

Option B (Invest instead): You invest the same deposit as a lump sum and redirect each monthly payment into a portfolio earning your selected annual return.

The opportunity cost is the difference between your investment portfolio value and your car's residual equity at the same point in time.

SA context: Vehicle finance rates in South Africa are typically prime + 1–3% (prime was 11.75% in early 2025). A larger deposit — or buying cash — removes interest costs entirely. Transfer/registration fees are not modelled here.
`;

  const explainers = {
    verdict: { title: "AI Financial Verdict",    text: verdict },
    concept: { title: "Understanding the Model", text: explainerText },
  };

  /* ── RESET ────────────────────────────────────── */

  const handleReset = () => {
    setResetting(true);
    setCarPrice(DEFAULTS.carPrice);
    setDeposit(DEFAULTS.deposit);
    setLoanRate(DEFAULTS.loanRate);
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
        <SlideIn tag="h1" text="Car vs Invest Studio" />
        <SlideIn tag="p" className="subtitle" delay={120}
          text="Model the true cost of vehicle finance vs investing the same money — see the Year 5 wealth gap." />

        <div className="sim-grid">
          {/* INPUTS */}
          <div className="sim-card">
            <Slider label="Vehicle Price"         value={carPrice}   set={setCarPrice}   min={80000}  max={1000000} step={10000} prefix="R" />
            <Slider label="Deposit"               value={deposit}    set={setDeposit}    min={0}      max={300000}  step={5000}  prefix="R" />
            <Slider label="Finance Interest Rate" value={loanRate}   set={setLoanRate}   min={8}      max={22}      suffix="%" />
            <Slider label="Investment Return"     value={investRate} set={setInvestRate} min={4}      max={18}      suffix="%" />
            <Slider label="Time Horizon"          value={years}      set={setYears}      min={1}      max={7}       suffix=" years" />

            <div className="sim-derived" style={{ marginTop: 12, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize: "0.78rem", color: "#8a9a96", margin: "0 0 6px" }}>
                Monthly payment: <strong style={{ color: "#c0ccc8" }}>R{monthlyPayment.toLocaleString("en-ZA")}</strong>
              </p>
              <p style={{ fontSize: "0.78rem", color: "#8a9a96", margin: 0 }}>
                Total interest: <strong style={{ color: "#d6a85a" }}>R{totalInterest.toLocaleString("en-ZA")}</strong>
              </p>
            </div>
          </div>

          {/* CHART */}
          <div className="sim-card graph-card">
            <h3 className="graph-title">Investment Portfolio vs Car Equity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <XAxis dataKey="year" tick={{ fill: "#8a9a96", fontSize: 12 }} />
                <YAxis tick={{ fill: "#8a9a96", fontSize: 11 }}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v, name) => [
                    `R${Number(v).toLocaleString("en-ZA")}`,
                    name === "invest" ? "Investment portfolio" : "Car equity",
                  ]}
                  contentStyle={{ background: "#121616", border: "1px solid #2a3a35", color: "white" }}
                />
                <Legend
                  formatter={(v) => v === "invest" ? "Investment portfolio" : "Car equity"}
                  wrapperStyle={{ fontSize: "0.78rem", color: "#8a9a96" }}
                />
                <Line type="monotone" dataKey="invest"    stroke="#84a794" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="carEquity" stroke="#d6a85a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="graph-impact">{verdict}</p>
          </div>
        </div>

        {/* YEAR 5 CALLOUT */}
        <YearFiveCallout
          label="At the end of your finance term"
          items={[
            { name: "Car residual value",   value: `R${equityAtEnd.toLocaleString("en-ZA")}` },
            { name: "Investment portfolio", value: `R${portfolio.toLocaleString("en-ZA")}` },
            { name: "Opportunity cost",     value: `R${opportunityCost.toLocaleString("en-ZA")}`, highlight: true },
          ]}
          note={`R${deposit.toLocaleString("en-ZA")} deposit + R${monthlyPayment.toLocaleString("en-ZA")}/month over ${years} years · ${loanRate}% finance vs ${investRate}% invest`}
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
                <span className="flip-back-sub">Open the full reasoning behind this car finance decision.</span>
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
                <span className="flip-back-sub">AI-generated insights on your car finance decision</span>
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
              <p>How SA vehicle finance, depreciation, and compound investing interact over 5 years.</p>
              <span>Click to read full breakdown →</span>
            </div>
            <h3 className="sim-section-title"><HelpCircle size={16} /> How this works</h3>
            <p className="explainer-text">
              SA vehicle depreciation, amortising finance, and compound investing compared side by side.
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
