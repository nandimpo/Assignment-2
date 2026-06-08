import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart2, Cpu, HelpCircle } from "lucide-react";
import SlideIn from "../components/SlideIn";
import "../styles/simulation.css";
import "../styles/fiveyear.css";
import AppNav from "../components/AppNav";
import ExplainerPanel from "../components/ExplainerPanel";
import YearFiveCallout from "../components/YearFiveCallout";
import { useUser } from "../context/UserContext";

/* ── DEFAULTS ── */
const DEFAULTS = {
  salary: 45000,
  rent: 12000,
  price: 1800000,
  interest: 11,
  years: 5,
};

const BAR_MAX_PX = 128; // pixel ceiling for bars

export default function SimulationLab() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [salary, setSalary] = useState(
    user?.netSalary || user?.salary || DEFAULTS.salary,
  );
  const [rent, setRent] = useState(user?.expenses || DEFAULTS.rent);
  const [price, setPrice] = useState(DEFAULTS.price);
  const [interest, setInterest] = useState(DEFAULTS.interest);
  const [years, setYears] = useState(DEFAULTS.years);

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);
  const [resetting, setResetting] = useState(false);

  /* ── RESET ── */
  const handleReset = () => {
    setResetting(true);
    setSalary(DEFAULTS.salary);
    setRent(DEFAULTS.rent);
    setPrice(DEFAULTS.price);
    setInterest(DEFAULTS.interest);
    setYears(DEFAULTS.years);
    setShowPanel(false);
    setContent(null);
    setTimeout(() => setResetting(false), 600);
  };

  /* ── CALCULATIONS ── */
  const rentTotal = rent * 12 * years;

  const r = interest / 100 / 12;
  const n = years * 12;
  const bondMonthly =
    r > 0
      ? Math.round(
          (price * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1),
        )
      : Math.round(price / n);

  const buyTotal = bondMonthly * 12 * years;
  const difference = rentTotal - buyTotal;

  /* Bar heights — always at least 8 px so bars are visible */
  const maxValue = Math.max(rentTotal, buyTotal, 1);
  const rentBarPx = Math.max(
    8,
    Math.round((rentTotal / maxValue) * BAR_MAX_PX),
  );
  const buyBarPx = Math.max(8, Math.round((buyTotal / maxValue) * BAR_MAX_PX));

  /* ── VERDICT ── */
  let verdict, tone;
  if (difference > 0) {
    verdict = `Based on your current inputs, renting is the more cost-efficient option, saving approximately R${Math.abs(difference).toLocaleString()} over ${years} years.`;
    tone = "positive";
  } else if (difference < 0) {
    verdict = `Buying results in a higher short-term cost of approximately R${Math.abs(difference).toLocaleString()}, however it contributes toward long-term asset ownership and equity growth.`;
    tone = "neutral";
  } else {
    verdict = `Both renting and buying result in a similar financial outcome over ${years} years, suggesting that non-financial factors should guide your decision.`;
    tone = "neutral";
  }

  /* ── INSIGHTS ── */
  const insights = [];
  if (interest > 13)
    insights.push(
      "High interest rates are significantly increasing the cost of ownership. Consider delaying purchase or increasing your deposit.",
    );
  if (years <= 3)
    insights.push(
      "Short ownership periods reduce the financial benefit of buying due to upfront costs and interest exposure.",
    );
  if (rent > salary * 0.4)
    insights.push(
      "Your rental cost exceeds 40% of your income, which may limit your ability to save effectively.",
    );
  if (salary > 60000 && difference < 0)
    insights.push(
      "Your income level suggests you may be well-positioned to absorb higher bond costs and transition into ownership.",
    );
  if (insights.length === 0)
    insights.push(
      "Your current scenario is relatively balanced. Optimising either savings or loan terms could improve your outcome.",
    );

  /* ── EXPLAINERS ── */
  const explainerText = `
This simulation compares the total cost of renting versus buying over a selected time horizon.

Renting provides flexibility and lower upfront costs, while buying introduces interest expenses but enables long-term asset accumulation.

The outcome is highly sensitive to interest rates, time horizon, and your income-to-expense ratio.
  `.trim();

  const explainers = {
    verdict: { title: "AI Financial Verdict", text: verdict },
    concept: { title: "Understanding the Model", text: explainerText },
  };

  return (
    <div className="sim-page">
      <AppNav />

      <div className="sim-container">
        <p className="sim-eyebrow">Simulation Lab · 5-Year Journey</p>
        <SlideIn tag="h1" text="Property vs Renting Studio" />
        <SlideIn
          tag="p"
          className="subtitle"
          delay={120}
          text="See the full 5-year cost of renting vs buying before you decide"
        />

        {/* ── TOP GRID: inputs | graph ── */}
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
                <div className="bar rent" style={{ height: `${rentBarPx}px` }}>
                  <span className="bar-tooltip">
                    R{rentTotal.toLocaleString()}
                  </span>
                </div>
                <span>Rent</span>
              </div>

              <div className="bar-container">
                <div className="bar buy" style={{ height: `${buyBarPx}px` }}>
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

        {/* ── YEAR 5 CALLOUT ── */}
        <YearFiveCallout
          label="At the end of your first 5 years"
          items={[
            {
              name: "Total rent paid",
              value: `R${(rent * 12 * 5).toLocaleString("en-ZA")}`,
            },
            {
              name: "Total bond paid",
              value: `R${(bondMonthly * 12 * 5).toLocaleString("en-ZA")}`,
            },
            {
              name: "5-Year difference",
              value: `R${Math.abs(difference).toLocaleString("en-ZA")} ${difference > 0 ? "saved renting" : "extra buying"}`,
              highlight: true,
            },
          ]}
          note={
            difference < 0
              ? "Buying costs more short-term, but builds equity. Your bond balance is reducing every month."
              : "Renting is cheaper over 5 years — but you build no asset."
          }
        />

        {/* ── BOTTOM ── */}
        <div className="sim-bottom">
          {/* VERDICT */}
          <div
            className="sim-card clickable verdict-card"
            onClick={() => {
              setContent(explainers.verdict);
              setShowPanel(true);
            }}
          >
            <div className="hover-preview large">
              <h4 className="sim-section-title">
                <BarChart2 size={14} /> AI Financial Verdict
              </h4>
              <p>{verdict}</p>
              <span>Click to explore in full →</span>
            </div>
            <h3 className="sim-section-title">
              <BarChart2 size={16} /> AI Financial Verdict
            </h3>
            <p>{verdict}</p>
          </div>

          {/* INSIGHTS */}
          <div className="sim-card">
            <h3 className="sim-section-title">
              <Cpu size={16} /> Smart Insights
            </h3>
            {insights.map((item, i) => (
              <div key={i} className="insight">
                <p>{item}</p>
              </div>
            ))}
          </div>

          {/* EXPLAINER */}
          <div
            className="sim-card explainer-aside clickable"
            onClick={() => {
              setContent(explainers.concept);
              setShowPanel(true);
            }}
          >
            <div className="hover-preview large">
              <h4 className="sim-section-title">
                <HelpCircle size={14} /> Understanding the Model
              </h4>
              <p>
                This simulation compares the total cost of renting versus buying
                over a selected time horizon. The outcome is highly sensitive to
                interest rates, time horizon, and your income-to-expense ratio.
              </p>
              <span>Click to read full breakdown →</span>
            </div>
            <h3 className="sim-section-title">
              <HelpCircle size={16} /> How this works
            </h3>
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

/* ── SLIDER ── */
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
