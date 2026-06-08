import { useState } from "react";
import rootsImg from "../assets/roots.png";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import AppNav from "../components/AppNav";
import SimNudge from "../components/SimNudge";
import ExplainerPanel from "../components/ExplainerPanel";
import "../styles/track.css";
import "../styles/money.css";
import { Wallet, TrendingUp, PiggyBank, BookOpen, AlertTriangle, ChevronDown, ClipboardCheck, Check } from "lucide-react";

const MILESTONES_DETAIL = [
  { label: "Emergency fund (3× expenses) built",       tip: "Your safety net before anything else — prevents pulling from investments." },
  { label: "Monthly investment contribution automated", tip: "Set up a debit order on payday so it happens before you can spend it." },
  { label: "Investment account opened (TFSA/RA/ETF)",  tip: "A Tax-Free Savings Account shelters your first R36k/year from tax." },
  { label: "Lifestyle inflation kept below income growth", tip: "Every raise you don't spend accelerates your timeline significantly." },
  { label: "Portfolio reviewed and rebalanced",         tip: "Check your asset split every 6–12 months and rebalance if needed." },
  { label: "R500k portfolio milestone reached",         tip: "The compounding effect kicks in meaningfully above this threshold." },
];
import MonthlySavingsTracker from "../components/MonthlySavingsTracker";
import FiveYearJourney from "../components/FiveYearJourney";
import SlideIn from "../components/SlideIn";
import { getTrackMonthlyAmount } from "../utils/trackAmounts";

// ── All explainer content for this track ──
const EXPLAINERS = {
  allocationExplorer: {
    title: "Allocation Explorer",
    text: "This tool lets you see in real time how shifting the percentage of your monthly surplus between investing and liquid savings changes both your monthly split and your Year 5 portfolio. Drag the slider to explore 'what if I invested more?' scenarios. Your actual Setup target is shown as the baseline — the difference is highlighted so you can see the cost or benefit of each choice.",
  },
  liquidSavings: {
    title: "Liquid Savings",
    text: "Liquid savings are funds you can access immediately — a cash buffer in your bank account or money market fund. Unlike investments, they don't grow significantly but provide a safety net for unexpected expenses. The recommended minimum is 3–6 months of living expenses. Anything above that is better deployed in investments.",
  },
  surplus: {
    title: "Monthly Surplus",
    text: "Your surplus is your take-home pay minus your fixed monthly expenses. This is the pool of money you allocate between investing and liquid savings each month. Growing your surplus — either by increasing income or cutting expenses — is the most direct lever for accelerating wealth-building.",
  },
  compoundGrowth: {
    title: "Compound Growth (10% p.a.)",
    text: "The Year 5 projections use a 10% annual compound return — a reasonable long-term average for a diversified equity portfolio on the JSE and offshore. Compound growth means you earn returns on your returns: R1,000/month growing at 10% becomes R77,437 after 5 years, not R60,000. The longer and more consistently you invest, the more powerful this effect becomes.",
  },
  milestones: {
    title: "Track Milestones",
    text: "Milestones mark the key stages of your Balanced Lifestyle journey. Step 1 is building an emergency fund so unexpected costs don't derail your investments. Step 2 is establishing consistent investing habits. Step 3 is scaling toward financial independence — where your portfolio generates meaningful passive income. Each step must be completed in order.",
  },
  portfolioMix: {
    title: "Portfolio Mix",
    text: "A balanced portfolio typically holds a mix of local (JSE-listed) and offshore assets. Local assets give you rand-denominated growth tied to the South African economy. Offshore assets protect against rand depreciation and expose you to global growth. A common starting split is 60% local, 40% offshore — adjust based on your risk appetite and rand outlook.",
  },
  savingsTracker: {
    title: "Monthly Savings Tracker",
    text: "Consistency is the single most important factor in wealth-building. This tracker holds you accountable by logging whether you invested your target amount each month. Missing months is inevitable — the tracker shows you how to recover. Every month logged builds the habit; every missed month logged honestly keeps your timeline accurate.",
  },
  strategyGuide: {
    title: "Balanced Lifestyle Strategy",
    text: "The Balanced Lifestyle strategy is built on one core principle: you don't have to sacrifice living well to build wealth. The key is paying yourself first — investing before discretionary spending — and keeping lifestyle inflation below income growth. Over 5 years, consistent monthly contributions at even moderate returns compound into life-changing sums.",
  },
};

export default function BalancedLifestyleTrack() {
  const { user } = useUser();
  const { progress, milestoneStatus, percent: progressPercent } = useProgress();

  // ── Collapsible cards (4–7 start closed) ──
  const [openCards, setOpenCards] = useState({ allocation: false, portfolio: false, rationale: false, guide: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));

  const [stagesDone, setStagesDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("balancedStages") || "null");
      return s && s.length === MILESTONES_DETAIL.length ? s : new Array(MILESTONES_DETAIL.length).fill(false);
    } catch { return new Array(MILESTONES_DETAIL.length).fill(false); }
  });
  const toggleStage = (i) => setStagesDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("balancedStages", JSON.stringify(u));
    return u;
  });

  // ── Explainer panel state ──
  const [showPanel, setShowPanel]     = useState(false);
  const [panelContent, setPanelContent] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 });

  const openPanel = (key) => { setPanelContent(EXPLAINERS[key]); setShowPanel(true); };
  const showTip   = (key, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + 8 });
    setActiveTooltip(key);
  };
  const hideTip = () => setActiveTooltip(null);

  // Helper — renders the ⓘ icon wired to both tooltip and panel
  const Info = ({ id }) => (
    <span
      className="info-icon"
      onMouseEnter={(e) => showTip(id, e)}
      onMouseLeave={hideTip}
      onClick={() => openPanel(id)}
    >ⓘ</span>
  );

  // ── Financials ──
  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const surplus  = Math.max(0, income - expenses);

  const goalMonthly = getTrackMonthlyAmount(user, "balanced");

  const setupPct = surplus > 0 ? Math.round((goalMonthly / surplus) * 100) : 20;
  const [investmentPct, setInvestmentPct] = useState(Math.min(90, Math.max(10, setupPct)));

  const scenarioInvesting = Math.round((investmentPct / 100) * surplus);
  const scenarioSaved     = surplus - scenarioInvesting;
  const isAboveSetup      = scenarioInvesting > goalMonthly;
  const isBelowSetup      = scenarioInvesting < goalMonthly;

  const totalFlow    = expenses + scenarioInvesting + scenarioSaved || 1;
  const spendingPct  = (expenses          / totalFlow) * 100;
  const investingPct = (scenarioInvesting / totalFlow) * 100;
  const savingPct    = (scenarioSaved     / totalFlow) * 100;

  function compoundFV(pmt, rate, years) {
    const r = rate / 12;
    return Math.round(pmt * ((Math.pow(1 + r, years * 12) - 1) / r));
  }
  const scenarioY5 = compoundFV(scenarioInvesting, 0.10, 5);
  const setupY5    = compoundFV(goalMonthly, 0.10, 5);

  // ── Plan logic from Setup ────────────────────────────────────────────────────
  const balPlanGoal   = Number(user?.fiveYearGoal) || 0;
  const balOnTrack    = balPlanGoal > 0 ? setupY5 >= balPlanGoal : null;
  const balSurplusAmt = balPlanGoal > 0 ? setupY5 - balPlanGoal : 0;
  const r5            = 0.10 / 12;
  const balRequired   = balPlanGoal > 0 ? Math.ceil(balPlanGoal / ((Math.pow(1 + r5, 60) - 1) / r5)) : null;
  const balShortfall  = balRequired && goalMonthly ? Math.max(0, balRequired - goalMonthly) : 0;

  const portfolio = { local: user?.localPct || 60, offshore: user?.offshorePct || 40 };
  const steps = ["emergencyFund", "deposit", "purchase"];
  const stepLabels = { emergencyFund: "Emergency Fund", deposit: "Consistent Investing", purchase: "Financial Independence" };

  let insight1 = "", insight2 = "";
  if (investmentPct >= 60) {
    insight1 = "Strong allocation toward investing — you're building wealth aggressively.";
    insight2 = "Make sure you still have a liquid buffer for emergencies.";
  } else if (investmentPct >= 30) {
    insight1 = "Balanced split — good mix of investing and liquid savings.";
    insight2 = "Pushing above 40% toward investing could significantly accelerate your portfolio.";
  } else {
    insight1 = "Low investing allocation — most of your surplus stays liquid.";
    insight2 = "Consider increasing your investing percentage to build long-term wealth faster.";
  }

  const milestoneInsight =
    progressPercent === 0  ? "Start by building your emergency fund." :
    progressPercent < 50   ? "Great start — now focus on consistent investing." :
    progressPercent < 100  ? "You're close — scale up toward financial independence." :
                             "All milestones complete.";

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* HEADER */}
        <span style={{ color: "#84a794", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(132,167,148,0.12)", border: "1px solid rgba(132,167,148,0.3)", borderRadius: 6, padding: "3px 10px", display: "inline-block", width: "fit-content" }}>Balanced Lifestyle</span>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
        <SlideIn tag="p" className="subtitle" delay={120} text="You are on the Balanced Lifestyle track · enjoy life while building wealth" />

        {/* ── YOUR PLAN ── driven by Setup inputs */}
        {goalMonthly > 0 && (
          <div className="track-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Monthly Invest",  value: `R${goalMonthly.toLocaleString("en-ZA")}`,                                      color: "#4facfe" },
                { label: "Year 5 (10% p.a.)", value: `R${setupY5.toLocaleString("en-ZA")}`,                                       color: "#84a794" },
                { label: "5-Year Goal",     value: balPlanGoal > 0 ? `R${balPlanGoal.toLocaleString("en-ZA")}` : "Not set",       color: "#d6a85a" },
                { label: "Status",          value: balOnTrack === true ? "On Track ✓" : balOnTrack === false ? "Behind" : "—",     color: balOnTrack === true ? "#84a794" : balOnTrack === false ? "#ff9898" : "#445550" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{ padding: "14px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px 14px", display: "flex", gap: 10, alignItems: "flex-start",
              background: balOnTrack === true ? "rgba(132,167,148,0.05)" : balOnTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{balOnTrack === true ? "📈" : balOnTrack === false ? "⚡" : "💡"}</span>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700,
                  color: balOnTrack === true ? "#84a794" : balOnTrack === false ? "#d6a85a" : "#4facfe" }}>
                  {balOnTrack === true
                    ? `On track — R${balSurplusAmt.toLocaleString("en-ZA")} above your 5-year goal!`
                    : balOnTrack === false
                    ? `Invest R${balShortfall.toLocaleString("en-ZA")} more/month to hit your R${balPlanGoal.toLocaleString("en-ZA")} goal`
                    : "Set a 5-year goal in Setup to track your investment progress"}
                </p>
                {balOnTrack === false && balRequired && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {[["Investing now", `R${goalMonthly.toLocaleString("en-ZA")}/mo`, "#d6a85a"], ["Need", `R${balRequired.toLocaleString("en-ZA")}/mo`, "#4facfe"], ["Yr 5 projection", `R${setupY5.toLocaleString("en-ZA")}`, "#84a794"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 7, padding: "4px 10px" }}>
                        <p style={{ margin: 0, fontSize: "0.6rem", color: "#445550", textTransform: "uppercase" }}>{l}</p>
                        <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 700, color: c }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── 1. 5-YEAR JOURNEY — big picture, where you're headed ── */}
        <FiveYearJourney
          trackKey="balanced"
          monthlyAmount={goalMonthly}
          currentSaved={Number(user?.savings) || 0}
          fiveYearTarget={Number(user?.fiveYearGoal) || 0}
        />

        {/* ── 2. MONTHLY SAVINGS TRACKER — primary action ── */}
        <div className="track-card" style={{ padding: 0, overflow: "visible" }}>
          <div style={{ padding: "18px 20px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <h3 style={{ margin: 0 }}>Monthly Savings Tracker</h3>
            <Info id="savingsTracker" />
          </div>
          <MonthlySavingsTracker
            monthlyTarget={goalMonthly}
            goalAmount={Number(user?.fiveYearGoal) || goalMonthly * 60 || 1000000}
            goalLabel="investment goal"
          />
        </div>

        {/* ── 3. MILESTONES — where you are on the journey ── */}
        <div className="track-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h3>Milestones <Info id="milestones" /></h3>
            <span className="milestones-hint">Track your progress</span>
          </div>

          <div className="bl-stepper">
            {steps.map((step, index) => {
              const isCompleted = progress[step];
              const isCurrent   = !progress[step] && (index === 0 || progress[steps[index - 1]]);
              const isLocked    = index > 0 && !progress[steps[index - 1]];
              return (
                <div key={step} className="bl-step-item">
                  <div className="bl-step-col">
                    <div
                      className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                      title={isCompleted ? "Achieved" : isLocked ? "Complete previous milestone first" : "Not yet reached — update your savings"}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>
                    {index < steps.length - 1 && <div className={`bl-vline ${progress[step] ? "filled" : ""}`} />}
                  </div>
                  <div className="bl-step-text">
                    <span className="step-label">{milestoneStatus?.[step]?.label || stepLabels[step]}</span>
                    {isCurrent && <span className="step-cta" style={{ fontSize: 10, color: "#84a794" }}>{milestoneStatus?.[step]?.hint || "Update your savings →"}</span>}
                    {isLocked  && <span className="step-locked-label">Locked</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="muted" style={{ marginTop: 12 }}>{progressPercent}% complete</p>
          <p className="small" style={{ marginTop: 4, color: "#c8d8d4" }}>{milestoneInsight}</p>
        </div>

        {/* ── 4–7. TOOLS & EDUCATION — 2×2 grid, each tile expands full-width ── */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* ALLOCATION EXPLORER */}
            <div className={`bl-tile${openCards.allocation ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("allocation")}>
                <div className="bl-tile-top">
                  <TrendingUp size={15} color="#4facfe" />
                  <span className="bl-tile-title">Allocation Explorer</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.allocation ? " rotated" : ""}`} />
                </div>
                {!openCards.allocation && (<>
                  <p className="bl-tile-summary">R{scenarioInvesting.toLocaleString()} investing · R{scenarioY5.toLocaleString()} yr 5</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.allocation && (
                <div className="bl-tile-body">
                  <div className="bl-stats">
                    <div className="bl-stat">
                      <TrendingUp size={15} />
                      <span className="bl-stat-label">Investing <Info id="compoundGrowth" /></span>
                      <strong style={{ color: isAboveSetup ? "#84a794" : isBelowSetup ? "#d6a85a" : "#f4f6fc" }}>R{scenarioInvesting.toLocaleString()}</strong>
                    </div>
                    <div className="bl-stat">
                      <Wallet size={15} />
                      <span className="bl-stat-label">Liquid savings <Info id="liquidSavings" /></span>
                      <strong>R{scenarioSaved.toLocaleString()}</strong>
                    </div>
                    <div className="bl-stat">
                      <PiggyBank size={15} />
                      <span className="bl-stat-label">Expenses</span>
                      <strong>R{expenses.toLocaleString()}</strong>
                    </div>
                  </div>
                  <div className="bl-bar" style={{ marginTop: 14 }}>
                    <div style={{ width: `${spendingPct}%`, background: "#d6a85a", transition: "width 0.3s" }} />
                    <div style={{ width: `${investingPct}%`, background: "#4facfe", transition: "width 0.3s" }} />
                    <div style={{ width: `${savingPct}%`, background: "#84a794", transition: "width 0.3s" }} />
                  </div>
                  <div className="bl-bar-labels"><span>Spending</span><span>Investing</span><span>Saving</span></div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <label className="bl-slider-label">% of surplus <Info id="surplus" /> to invest</label>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4facfe" }}>{investmentPct}%</span>
                    </div>
                    <input type="range" min="10" max="90" value={investmentPct} onChange={(e) => setInvestmentPct(Number(e.target.value))} style={{ width: "100%", accentColor: "#4facfe" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#4a5c56", marginTop: 4 }}>
                      <span>10% — Conservative</span><span>90% — Aggressive</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.74rem", color: "#8a9a96" }}>Setup target</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#c0ccc8" }}>R{goalMonthly.toLocaleString()}/month</span>
                    </div>
                    {scenarioInvesting !== goalMonthly && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.74rem", color: "#8a9a96" }}>This scenario</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: isAboveSetup ? "#84a794" : "#d6a85a" }}>
                          {isAboveSetup ? "+" : ""}R{(scenarioInvesting - goalMonthly).toLocaleString()}/month
                        </span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
                      <span style={{ fontSize: "0.74rem", color: "#8a9a96" }}>Year 5 portfolio <Info id="compoundGrowth" /></span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#4facfe" }}>R{scenarioY5.toLocaleString()}</span>
                    </div>
                    {scenarioInvesting !== goalMonthly && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.74rem", color: "#8a9a96" }}>vs setup Year 5</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: scenarioY5 > setupY5 ? "#84a794" : "#d6a85a" }}>
                          {scenarioY5 > setupY5 ? "+" : ""}R{(scenarioY5 - setupY5).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PORTFOLIO & INSIGHTS */}
            <div className={`bl-tile${openCards.portfolio ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("portfolio")}>
                <div className="bl-tile-top">
                  <PiggyBank size={15} color="#84a794" />
                  <span className="bl-tile-title">Portfolio &amp; Insights</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.portfolio ? " rotated" : ""}`} />
                </div>
                {!openCards.portfolio && (<>
                  <p className="bl-tile-summary">{portfolio.local}% local · {portfolio.offshore}% offshore</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.portfolio && (
                <div className="bl-tile-body bl-row">
                  <div>
                    <p className="bl-tile-section-label">Portfolio Mix <Info id="portfolioMix" /></p>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", flexShrink: 0, background: `conic-gradient(#84a794 0% ${portfolio.local}%, #d6a85a ${portfolio.local}% 100%)`, display: "flex", alignItems: "center", justifyContent: "center", animation: "pie-spin 12s linear infinite" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0c1110", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{portfolio.local}%</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        <p className="small" style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#84a794", display: "inline-block" }} />Local: {portfolio.local}%</p>
                        <p className="small" style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d6a85a", display: "inline-block" }} />Offshore: {portfolio.offshore}%</p>
                        <button className="pill outline" style={{ marginTop: 4, fontSize: "0.68rem" }}>Studio →</button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="bl-tile-section-label">AI Insights</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      <div className="insight"><p>{insight1}</p></div>
                      <div className="insight"><p>{insight2}</p></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TRACK RATIONALE */}
            <div className={`bl-tile${openCards.rationale ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("rationale")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Track Rationale</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.rationale ? " rotated" : ""}`} />
                </div>
                {!openCards.rationale && (<>
                  <p className="bl-tile-summary">Trade-offs · numbers · warnings</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.rationale && (
                <div className="bl-tile-body">
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div style={{ background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d6a85a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>⚖ Trade-offs</p>
                      {[
                        { pro: true,  text: "Enjoy life now while building wealth" },
                        { pro: true,  text: "Lower stress than aggressive tracks" },
                        { pro: true,  text: "Sustainable over a lifetime" },
                        { pro: false, text: "Slower than Catch-Up track" },
                        { pro: false, text: "Requires consistent discipline" },
                        { pro: false, text: "Major goals take longer" },
                      ].map(({ pro, text }, i) => (
                        <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 5 }}>
                          <span style={{ color: pro ? "#84a794" : "#d6a85a", fontWeight: 700, fontSize: "0.82rem", flexShrink: 0 }}>{pro ? "✓" : "✗"}</span>
                          <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.4 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(79,172,254,0.06)", border: "1px solid rgba(79,172,254,0.18)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#4facfe", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>📐 By the numbers</p>
                      {[
                        { label: "R5k/month × 5 yrs", result: "R776k at 10% p.a.", highlight: false },
                        { label: "R10k/month × 5 yrs", result: "R1,552k at 10% p.a.", highlight: true },
                        { label: "R10k in savings acct", result: "≈ R620k (no compound)", highlight: false },
                        { label: "Lifestyle creep +R2k", result: "−R310k after 5 yrs", highlight: false },
                      ].map(({ label, result, highlight }, i) => (
                        <div key={i} style={{ borderLeft: `2px solid ${highlight ? "#4facfe" : "#1a2a24"}`, paddingLeft: 8, marginBottom: 8 }}>
                          <p style={{ margin: 0, fontSize: "0.68rem", color: "#667c74" }}>{label}</p>
                          <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: highlight ? "#4facfe" : "#c0ccc8" }}>{result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>⚠ Watch out for</p>
                    {[
                      { title: "Lifestyle creep", body: "Every R1,000 increase in monthly spending costs you R155,000 in Year 5." },
                      { title: "Investment inertia", body: "Not increasing contributions as income grows is the #1 mistake on this track." },
                      { title: "Over-diversification", body: "Start with 1–2 core products and expand as the portfolio grows." },
                    ].map(({ title, body }, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 8, padding: "9px 11px" }}>
                        <AlertTriangle size={13} color="#ff9898" style={{ flexShrink: 0, marginTop: 1 }} />
                        <div>
                          <p style={{ margin: 0, fontSize: "0.76rem", fontWeight: 600, color: "#ff9898" }}>{title}</p>
                          <p style={{ margin: "2px 0 0", fontSize: "0.72rem", color: "#c0ccc8", lineHeight: 1.4 }}>{body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STRATEGY GUIDE */}
            <div className={`bl-tile${openCards.guide ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("guide")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Strategy Guide <Info id="strategyGuide" /></span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.guide ? " rotated" : ""}`} />
                </div>
                {!openCards.guide && (<>
                  <p className="bl-tile-summary">What to do · risks to watch</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.guide && (
                <div className="bl-tile-body">
                  <div className="grid-2">
                    <div>
                      <p style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}><BookOpen size={13} /> What to do</p>
                      <ul className="list">
                        <li>Invest consistently every month</li>
                        <li>Keep lifestyle inflation under control</li>
                        <li>Diversify local and offshore</li>
                        <li>Increase contributions as income grows</li>
                      </ul>
                    </div>
                    <div>
                      <p style={{ display: "flex", alignItems: "center", gap: 5, fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}><AlertTriangle size={13} /> Risks to watch</p>
                      <ul className="list">
                        <li>Lifestyle creep as income grows</li>
                        <li>Investing too little to matter</li>
                        <li>Overconfidence in market growth</li>
                        <li>Not adjusting strategy over time</li>
                      </ul>
                    </div>
                  </div>
                  <div className="explanation-box" style={{ marginTop: 10 }}>
                    <p style={{ lineHeight: 1.6, fontSize: "0.8rem" }}>
                      The key is consistency — not intensity. Small, regular investments compound into meaningful wealth. The biggest risk is lifestyle creep: spending rising faster than investing.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MILESTONE CHECKLIST */}
        <div className="track-card" style={{ position:"relative", overflow:"hidden" }}>
          <img src={rootsImg} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 60%", opacity:0.07, pointerEvents:"none", zIndex:0 }} />
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <h3 style={{ margin:0, display:"flex", alignItems:"center", gap:8 }}>
              <ClipboardCheck size={17} color="#84a794" /> Milestone Checklist
            </h3>
            <span style={{ fontSize:"0.72rem", color:"#84a794", fontWeight:600, whiteSpace:"nowrap", marginLeft:12 }}>
              {stagesDone.filter(Boolean).length}/{MILESTONES_DETAIL.length} done
            </span>
          </div>
          <p style={{ fontSize:"0.73rem", color:"#667c74", margin:"0 0 14px", lineHeight:1.5 }}>
            Tick off each milestone as you complete it — progress saves automatically.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {MILESTONES_DETAIL.map((m, i) => {
              const done = stagesDone[i];
              return (
                <div key={i} onClick={() => toggleStage(i)}
                  style={{ display:"flex", gap:12, alignItems:"center", padding:"10px 14px", borderRadius:10, cursor:"pointer",
                    background: done ? "rgba(132,167,148,0.07)" : "rgba(255,255,255,0.02)",
                    border:`1px solid ${done ? "rgba(132,167,148,0.22)" : "rgba(255,255,255,0.06)"}`,
                    transition:"background 0.2s, border-color 0.2s" }}>
                  <div style={{ width:20, height:20, borderRadius:5, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                    background: done ? "rgba(132,167,148,0.22)" : "#0e1512",
                    border:`2px solid ${done ? "#84a794" : "#2a3530"}`, transition:"all 0.2s" }}>
                    {done && <Check size={11} color="#84a794" />}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontSize:"0.8rem", fontWeight:600, color: done?"#84a794":"#c0ccc8", textDecoration: done?"line-through":"none" }}>{m.label}</p>
                    <p style={{ margin:"2px 0 0", fontSize:"0.7rem", color:"#556660", lineHeight:1.4 }}>{m.tip}</p>
                  </div>
                  {done && <Check size={14} color="#84a794" style={{ flexShrink:0 }} />}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* EXPLAINER PANEL */}
      <SimNudge track="balanced" />

      <ExplainerPanel
        show={showPanel}
        onClose={() => setShowPanel(false)}
        content={panelContent}
      />

      {/* FLOATING TOOLTIP */}
      {activeTooltip && EXPLAINERS[activeTooltip] && (
        <div
          className="tooltip-advanced"
          style={{ position: "fixed", top: tooltipPos.y, left: tooltipPos.x, zIndex: 9999 }}
        >
          <h4>{EXPLAINERS[activeTooltip].title}</h4>
          <p>{EXPLAINERS[activeTooltip].text.slice(0, 120)}…</p>
          <span className="tooltip-hint">Click to read more →</span>
        </div>
      )}
    </div>
  );
}
