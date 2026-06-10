import { useState } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";
import SlideIn from "../components/SlideIn";
import FiveYearJourney from "../components/FiveYearJourney";
import SimNudge from "../components/SimNudge";
import { TrendingUp, AlertTriangle, BookOpen, ChevronDown, Check,
         Shield, Target, RefreshCw, Rocket, Info, CheckCircle2, Zap, Lightbulb,
         Scale, TriangleAlert, ArrowRight, Minus } from "lucide-react";
import MonthlySavingsTracker from "../components/MonthlySavingsTracker";
import { getTrackMonthlyAmount } from "../utils/trackAmounts";
import MilestoneChecklist from "../components/MilestoneChecklist";
import FlipCard from "../components/FlipCard";
import { getCatchupDebtRemaining, getLogPaidTotal } from "../utils/projections";

/* ─── Stage Timeline ──────────────────────────────────────────────────────── */
const STAGES = [
  {
    key:   "debtAudit",
    label: "Debt Audit",
    icon:  <AlertTriangle size={16} />,
    hint:  "List every debt: balance, interest rate, minimum payment",
    why:   "You can't fix what you can't see. A full audit reveals your real net worth and which debts to attack first.",
  },
  {
    key:   "highInterestCleared",
    label: "High-Interest Cleared",
    icon:  <Shield size={16} />,
    hint:  "Any debt above 15% annual interest eliminated",
    why:   "No investment reliably beats a 20% interest rate. Clearing this is a guaranteed 20% return.",
  },
  {
    key:   "emergencyBuffer",
    label: "Emergency Buffer",
    icon:  <RefreshCw size={16} />,
    hint:  "3 months of expenses saved in a money-market account",
    why:   "Without this buffer, every surprise (car repair, medical bill) sends you back into debt — undoing months of progress.",
  },
  {
    key:   "wealthBuilding",
    label: "Wealth Building",
    icon:  <Rocket size={16} />,
    hint:  "Automated monthly investment into TFSA, RA, or ETF",
    why:   "Once debt is cleared and buffer is set, compound interest starts working FOR you instead of against you.",
  },
];

/* ─── Trade-offs ─────────────────────────────────────────────────────────── */
const TRADEOFFS = [
  { pro: true,  text: "Fastest path to closing the wealth gap" },
  { pro: true,  text: "High discipline = disproportionately high reward" },
  { pro: true,  text: "Clearing debt is a guaranteed high return" },
  { pro: false, text: "Lifestyle is heavily restricted during debt phase" },
  { pro: false, text: "Burnout risk if you try to move too fast" },
  { pro: false, text: "Psychological weight of seeing debt before gains" },
];

/* ─── Warnings ───────────────────────────────────────────────────────────── */
const WARNINGS = [
  "Paying minimum instalments only means most of your money goes to interest — not principal.",
  "Do NOT invest before clearing high-interest (>15%) debt. The maths never works in your favour.",
  "Building an emergency fund first prevents relapsing into debt when life surprises you.",
  "Consolidation loans can lower interest — but only work if you stop accumulating new debt.",
];

/* ─── (i) Context Explainers ─────────────────────────────────────────────── */
const EXPLAINERS = {
  compoundInterest: {
    title: "Compound Interest",
    text:  "Interest charged on both your principal AND previously accumulated interest. On a R50 000 credit card at 22%, you pay ~R11 000/year in interest alone — most of your minimum payment vanishes before touching the balance.",
  },
  debtToIncome: {
    title: "Debt-to-Income Ratio (DTI)",
    text:  "Your total monthly debt payments ÷ gross monthly income. Banks want this below 35%. Above 50% = financial stress zone. Example: R15 000 debt payments on R40 000 income = 37.5% DTI.",
  },
  avalancheMethod: {
    title: "Avalanche Method",
    text:  "Pay minimum on all debts, but throw every extra rand at the highest-interest debt first. Mathematically optimal — saves the most money. E.g. if you have a 22% credit card and 11% car loan, destroy the credit card first.",
  },
  snowballMethod: {
    title: "Snowball Method",
    text:  "Pay off the smallest debt first regardless of interest rate. Less mathematically optimal but psychologically powerful — each cleared debt gives momentum. Best if you're struggling to stay motivated.",
  },
  tfsa: {
    title: "Tax-Free Savings Account (TFSA)",
    text:  "R36 000/year contribution limit (R500 000 lifetime). All growth is tax-free — no tax on interest, dividends, or capital gains. Best used once high-interest debt is cleared.",
  },
  minimumPayment: {
    title: "Minimum Payment Trap",
    text:  "On a R50 000 balance at 22%, paying only the minimum (~R1 000/month) takes 9+ years to clear and costs R60 000+ in interest. Paying R3 000/month clears it in 2 years, saving R40 000.",
  },
  catchupPlan: {
    title: "Your Catch-Up Plan",
    text: "This compares your total debt, monthly attack amount, and target timeline. If the monthly attack clears the debt within your target months, you are on track.",
  },
  catchupJourney: {
    title: "Catch-Up Journey",
    text: "These four stages move you from debt clarity to wealth building. Tick each stage when it is actually done so the track reflects your real progress.",
  },
  monthlyTracker: {
    title: "Monthly Payment Tracker",
    text: "Log what you really paid this month. Partial payments should track actual progress, while missed months help you recover faster next month.",
  },
  fiveYearJourney: {
    title: "5-Year Journey",
    text: "This shows where the current monthly attack gets you over time. For Catch-Up, the first goal is eliminating debt, then redirecting that payment into wealth building.",
  },
  milestoneChecklist: {
    title: "Milestone Checklist",
    text: "Use the checklist for practical proof points: high-interest debt cleared, emergency fund built, savings automated, and net worth moving positive.",
  },
};

/* ─── Milestones ─────────────────────────────────────────────────────────── */
const MILESTONES_DETAIL = [
  { label: "High-interest debt cleared (>15% rate)",    tip: "No investment beats a 20% debt — clear it first before saving." },
  { label: "Emergency fund (3× expenses) established",  tip: "Prevents you from falling back into debt when life happens." },
  { label: "Savings rate above 20%",                    tip: "Track your savings rate monthly and push it up by 1–2% each quarter." },
  { label: "Automated investment debit order set up",   tip: "Automation removes willpower from the equation — set and forget." },
  { label: "Catch-up contribution to RA/TFSA started",  tip: "Tax-free or tax-deductible accounts give you extra returns for free." },
  { label: "Net worth back to positive",                tip: "Assets > liabilities. This is the turning point — compound now works for you." },
];

export default function CatchUpTrack() {
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const [extraSaving, setExtraSaving] = useState(0);
  const { progress: milestoneProgress, milestoneStatus, percent } = useProgress();
  const [openCards, setOpenCards] = useState({ engine: false, insights: false, rationale: false, guide: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));
  const [tooltip, setTooltip] = useState(null); // active explainer key
  const InfoHint = ({ id, label = "More info" }) => (
    <button
      type="button"
      className="catchup-info-btn"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        setTooltip(id);
      }}
    >
      <Info size={13} strokeWidth={2.2} />
      <span className="catchup-info-pop">{EXPLAINERS[id]?.text}</span>
    </button>
  );

  // Journey stages (separate from milestones checklist)
  const [journeyDone, setJourneyDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("catchupJourney") || "null");
      return s && s.length === STAGES.length ? s : new Array(STAGES.length).fill(false);
    } catch { return new Array(STAGES.length).fill(false); }
  });
  const toggleJourney = (i) => setJourneyDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("catchupJourney", JSON.stringify(u));
    return u;
  });

  // Milestone checklist
  const [stagesDone, setStagesDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("catchupStages") || "null");
      return s && s.length === MILESTONES_DETAIL.length ? s : new Array(MILESTONES_DETAIL.length).fill(false);
    } catch { return new Array(MILESTONES_DETAIL.length).fill(false); }
  });
  const toggleStage = (i) => setStagesDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("catchupStages", JSON.stringify(u));
    return u;
  });

  const journeyDoneCount = journeyDone.filter(Boolean).length;
  const journeyPct       = Math.round((journeyDoneCount / STAGES.length) * 100);

  /* ================= DATA ================= */
  const income     = Number(user?.netSalary || user?.salary) || 0;
  const expenses   = Number(user?.expenses) || 0;
  const savings    = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const catchDebtTotal = Number(user?.debt || user?.goalAmount) || 0;
  const catchDebt  = getCatchupDebtRemaining(user);
  const catchPaid  = getLogPaidTotal(user?.catchupLog || []);
  const catchMonthly = getTrackMonthlyAmount(user, "catchup");
  const catchLog = user?.catchupLog || [];
  const catchPaidMonths = catchLog.filter(e => !e?.missed && e?.status !== "missed").length;
  const catchMissedMonths = catchLog.filter(e => e?.missed || e?.status === "missed").length;
  const catchTargetMonths = Number(user?.catchupTargetMonths) || 0;
  const catchMonthsToClear = catchMonthly > 0 && catchDebt > 0 ? Math.ceil(catchDebt / catchMonthly) : null;
  const catchRequiredMonthly = catchTargetMonths > 0 && catchDebt > 0 ? Math.ceil(catchDebt / catchTargetMonths) : null;
  const catchMonthlyShortfall = catchRequiredMonthly && catchMonthly ? Math.max(0, catchRequiredMonthly - catchMonthly) : 0;
  const catchOnTrack = catchMonthsToClear !== null && catchTargetMonths > 0 ? catchMonthsToClear <= catchTargetMonths : null;
  const currentJourneyIndex = journeyDone.findIndex(done => !done);
  const nextJourneyStage = STAGES[currentJourneyIndex === -1 ? STAGES.length - 1 : currentJourneyIndex];
  const checklistDoneCount = stagesDone.filter(Boolean).length;
  const catchProgressPct = catchDebtTotal > 0 ? Math.min(100, Math.round((catchPaid / catchDebtTotal) * 100)) : 0;
  const catchupInsights = (() => {
    const items = [];
    const add = (title, text, Icon, tone = "") => items.push({ title, text, Icon, tone });

    if (!catchDebt) {
      add("Debt cleared", "Your debt balance is at zero. Redirect the same monthly attack into emergency savings or investing next.", CheckCircle2, "is-good");
    } else if (!catchMonthly) {
      add("Set the attack amount", "Add a monthly debt payment target in Setup so this track can calculate your recovery timeline.", Target, "is-warning");
    } else if (catchOnTrack === false && catchMonthlyShortfall > 0) {
      add("Timeline pressure", `You need about R${catchMonthlyShortfall.toLocaleString("en-ZA")} more per month to clear the remaining debt in ${catchTargetMonths} months.`, AlertTriangle, "is-warning");
    } else if (catchOnTrack === true) {
      add("Timeline is matched", `At R${catchMonthly.toLocaleString("en-ZA")}/month, the remaining debt clears in ${catchMonthsToClear} months against your ${catchTargetMonths}-month target.`, CheckCircle2, "is-good");
    } else {
      add("Recovery timeline", `At R${catchMonthly.toLocaleString("en-ZA")}/month, the remaining debt clears in about ${catchMonthsToClear || 0} months.`, Target);
    }

    if (catchMissedMonths > 0) {
      add("Missed month logged", `${catchMissedMonths} missed month${catchMissedMonths === 1 ? "" : "s"} logged. Recovery should focus on one extra payment or an expense cut before investing.`, RefreshCw, "is-warning");
    } else if (catchPaidMonths > 0) {
      add("Payment momentum", `${catchPaidMonths} month${catchPaidMonths === 1 ? "" : "s"} paid and R${catchPaid.toLocaleString("en-ZA")} removed from the debt total.`, CheckCircle2, "is-good");
    }

    if (nextJourneyStage && journeyPct < 100) {
      add("Next best move", `${nextJourneyStage.label}: ${nextJourneyStage.hint}.`, Target);
    } else if (journeyPct === 100) {
      add("Journey complete", "All catch-up stages are checked. Keep the payment habit and move the freed cash into wealth building.", Rocket, "is-good");
    }

    if (savingsRate < 20) {
      add("Savings-rate risk", `Your savings rate is ${savingsRate}%. Push toward 20% so debt payoff does not rely on willpower alone.`, AlertTriangle, "is-warning");
    } else if (savingsRate >= 40) {
      add("Strong cash flow", `${savingsRate}% savings rate gives you room to attack debt faster without breaking the plan.`, TrendingUp, "is-good");
    }

    if (checklistDoneCount > 0) {
      add("Proof is building", `${checklistDoneCount}/${MILESTONES_DETAIL.length} checklist items are complete. Keep checking off real-world proof points.`, CheckCircle2, "is-good");
    }

    if (catchProgressPct > 0 && catchProgressPct < 100) {
      add("Debt reduction visible", `${catchProgressPct}% of the starting debt is paid. Keep the tracker updated so Home and Snapshot stay accurate.`, Scale, "is-good");
    }

    return items.slice(0, 3);
  })();

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container" style={{ maxWidth: "1100px" }}>
        {/* ================= HEADER ================= */}
        <div className="catchup-header">
          <span className="catchup-track-badge">Catch-Up Wealth</span>
          <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
          <SlideIn tag="p" className="subtitle" delay={120} style={{ margin: 0 }}
            text={catchDebt
              ? `R${catchDebt.toLocaleString("en-ZA")} debt left · R${catchPaid.toLocaleString("en-ZA")} paid · ${savingsRate}% savings rate`
              : `Catch-Up track · ${savingsRate}% savings rate · R${savings.toLocaleString("en-ZA")} monthly surplus`} />
        </div>

        {/* ── (i) TOOLTIP OVERLAY ── */}
        {tooltip && (
          <div onClick={() => setTooltip(null)}
            style={{ position:"fixed", inset:0, zIndex:999, display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)" }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:"#111b18", border:"1px solid rgba(132,167,148,0.25)", borderRadius:14,
                padding:"22px 24px", maxWidth:400, width:"90%", boxShadow:"0 24px 60px rgba(0,0,0,0.5)" }}>
              <p style={{ fontSize:"0.65rem", fontWeight:700, color:"#84a794", textTransform:"uppercase", letterSpacing:"0.12em", margin:"0 0 6px" }}>Definition</p>
              <p style={{ fontSize:"0.9rem", fontWeight:700, color:"#f4f6fc", margin:"0 0 12px" }}>{EXPLAINERS[tooltip]?.title}</p>
              <p style={{ fontSize:"0.8rem", color:"#c0ccc8", lineHeight:1.7, margin:0 }}>{EXPLAINERS[tooltip]?.text}</p>
              <button onClick={() => setTooltip(null)} style={{ marginTop:16, fontSize:"0.72rem", color:"#667c74", background:"none", border:"none", cursor:"pointer", padding:0 }}>Close ×</button>
            </div>
          </div>
        )}

        {/* ── TOP 2-COL: YOUR PLAN + STAGE TIMELINE ── */}
        {(() => {
          const debt      = getCatchupDebtRemaining(user);
          const monthly   = getTrackMonthlyAmount(user, "catchup");
          const target    = Number(user?.catchupTargetMonths) || 0;
          const actual    = monthly > 0 && debt > 0 ? Math.ceil(debt / monthly) : null;
          const required  = target > 0 && debt > 0 ? Math.ceil(debt / target) : null;
          const shortfall = required && monthly ? Math.max(0, required - monthly) : 0;
          const onTrack   = actual !== null && target > 0 ? actual <= target : null;
          const ahead     = onTrack === true ? target - actual : 0;
          return (
            <div className="catchup-hero-grid">

              {/* ── YOUR PLAN ── */}
              <div className="track-card catchup-plan-card" style={{ padding:0, overflow:"hidden" }}>
                {/* eyebrow */}
                <div className="catchup-card-kicker">
                  <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Your Plan</p>
                  <InfoHint id="catchupPlan" label="Explain your catch-up plan" />
                </div>
                {/* 2×2 stats */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                  {[
                    { label:"Debt Left",       value: debt    ? `R${debt.toLocaleString("en-ZA")}`    : "Cleared", color: debt    ? "#ff9898" : "#84a794" },
                    { label:"Monthly Attack",  value: monthly ? `R${monthly.toLocaleString("en-ZA")}` : "Not set", color: monthly ? "#d6a85a" : "#445550" },
                    { label:"Months to Clear", value: actual  ? `${actual} mo`                        : "—",       color:"#4facfe" },
                    { label:"Your Target",     value: target  ? `${target} mo`                        : "Not set", color: onTrack === true ? "#84a794" : onTrack === false ? "#ff9898" : "#445550" },
                  ].map(({ label, value, color }, i) => (
                    <div key={label} style={{ padding:"20px 22px",
                      borderRight:  i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                      borderBottom: i < 2       ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                      <p style={{ fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 5px" }}>{label}</p>
                      <p style={{ fontSize:"1.15rem", fontWeight:700, color, margin:0 }}>{value}</p>
                    </div>
                  ))}
                </div>
                {/* status row */}
                <div style={{ padding:"10px 14px", display:"flex", gap:8, alignItems:"center",
                  background: onTrack === true ? "rgba(132,167,148,0.05)" : onTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)",
                  borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                  {onTrack === true ? <CheckCircle2 size={14} color="#84a794" />
                    : onTrack === false ? <Zap size={14} color="#d6a85a" />
                    : <Lightbulb size={14} color="#4facfe" />}
                  <p style={{ margin:0, fontSize:"0.73rem", fontWeight:600, lineHeight:1.4,
                    color: onTrack === true ? "#84a794" : onTrack === false ? "#d6a85a" : "#4facfe" }}>
                    {onTrack === true
                      ? `On track — ${ahead} ${ahead === 1 ? "month" : "months"} ahead`
                      : onTrack === false
                      ? `Need R${shortfall.toLocaleString("en-ZA")} more/month`
                      : !monthly || !debt ? "Set up in Settings →"
                      : `Clears in ${actual} months`}
                  </p>
                </div>
                {/* gap pills when behind */}
                {onTrack === false && required && (
                  <div style={{ padding:"0 14px 12px", display:"flex", gap:6, flexWrap:"wrap" }}>
                    {[["Now", `R${monthly.toLocaleString("en-ZA")}`, "#d6a85a"],
                      ["Need", `R${required.toLocaleString("en-ZA")}`, "#4facfe"],
                      ["Gap", `R${shortfall.toLocaleString("en-ZA")}`, "#ff9898"]].map(([l, v, c]) => (
                      <div key={l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"4px 9px" }}>
                        <p style={{ margin:0, fontSize:"0.58rem", color:"#445550", textTransform:"uppercase" }}>{l}</p>
                        <p style={{ margin:0, fontSize:"0.76rem", fontWeight:700, color:c }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── STAGE TIMELINE ── */}
              <div className="track-card catchup-journey-card" style={{ padding:"18px 20px" }}>
                <div className="catchup-journey-head">
                  <div>
                    <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Journey</p>
                    <p className="catchup-title-with-info">4 Stages <InfoHint id="catchupJourney" label="Explain the catch-up journey" /></p>
                  </div>
                  <span style={{ fontSize:"0.7rem", color:"#d6a85a", fontWeight:600, background:"rgba(214,168,90,0.1)", borderRadius:6, padding:"3px 9px" }}>
                    {journeyDoneCount}/{STAGES.length}
                  </span>
                </div>

                {/* Compact stage list */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {STAGES.map((stage, i) => {
                    const done    = journeyDone[i];
                    const current = !done && (i === 0 || journeyDone[i - 1]);
                    return (
                      <div key={stage.key} className="catchup-stage-row" onClick={() => toggleJourney(i)}
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, cursor:"pointer",
                          background: done ? "rgba(132,167,148,0.07)" : current ? "rgba(214,168,90,0.06)" : "rgba(255,255,255,0.02)",
                          border:`1px solid ${done ? "rgba(132,167,148,0.2)" : current ? "rgba(214,168,90,0.25)" : "rgba(255,255,255,0.05)"}`,
                          transition:"all 0.2s" }}>
                        <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                          background: done ? "rgba(132,167,148,0.18)" : current ? "rgba(214,168,90,0.15)" : "#111816",
                          border:`2px solid ${done ? "#84a794" : current ? "#d6a85a" : "#2a3530"}`,
                          color: done ? "#84a794" : current ? "#d6a85a" : "#4a5c56",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow: current ? "0 0 10px rgba(214,168,90,0.2)" : "none" }}>
                          {done ? <Check size={13} /> : stage.icon}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:0, fontSize:"0.76rem", fontWeight:600,
                            color: done ? "#84a794" : current ? "#f4f6fc" : "#667c74",
                            textDecoration: done ? "line-through" : "none" }}>{stage.label}</p>
                          {current && <p style={{ margin:"1px 0 0", fontSize:"0.66rem", color:"#8a9a96", lineHeight:1.3 }}>{stage.hint}</p>}
                          {current && stage.why && <p style={{ margin:"4px 0 0", fontSize:"0.63rem", color:"#d6a85a", lineHeight:1.4, fontStyle:"italic" }}>Why: {stage.why}</p>}
                        </div>
                        {current && <span style={{ fontSize:"0.6rem", color:"#d6a85a", fontWeight:700, background:"rgba(214,168,90,0.12)", borderRadius:4, padding:"2px 6px", flexShrink:0 }}>Now</span>}
                        {done && <Check size={12} color="#84a794" style={{ flexShrink:0 }} />}
                      </div>
                    );
                  })}
                </div>

                {/* progress bar */}
                <div style={{ marginTop:12, height:4, background:"#1a1f1e", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"linear-gradient(to right,#d6a85a,#84a794)", width:`${journeyPct}%`, borderRadius:3, transition:"width 0.5s ease" }} />
                </div>
                <p style={{ margin:"5px 0 0", fontSize:"0.68rem", color:"#556660" }}>{journeyPct}% complete</p>
              </div>

            </div>
          );
        })()}

        <div className="track-overview-grid catchup-overview-grid">
        {/* ================= MONTHLY PAYMENT TRACKER ================= */}
        {(() => {
          const debt    = catchDebtTotal;
          const monthly = getTrackMonthlyAmount(user, "catchup");
          if (!monthly) return null;
          return (
            <div className="catchup-panel-with-info">
              <InfoHint id="monthlyTracker" label="Explain the monthly payment tracker" />
              <MonthlySavingsTracker
                logKey="catchupLog"
                monthlyTarget={monthly}
                goalAmount={debt}
                goalLabel="debt clearance"
                trackerTitle="Monthly Payment Tracker"
                verb="paid"
              />
            </div>
          );
        })()}

        {/* ================= 5-YEAR JOURNEY ================= */}
        {(() => {
          const debt    = getCatchupDebtRemaining(user);
          const monthly = getTrackMonthlyAmount(user, "catchup");
          return (
            <div className="catchup-panel-with-info">
              <InfoHint id="fiveYearJourney" label="Explain the 5-year journey" />
              <FiveYearJourney
                trackKey="catchup"
                monthlyAmount={monthly}
                currentSaved={debt}
                fiveYearTarget={0}
              />
            </div>
          );
        })()}

        </div>

        <div className="catchup-lower-grid">
          <div className="track-card catchup-journey-card catchup-journey-card--lower" style={{ padding:"18px 20px" }}>
            <div className="catchup-journey-head">
              <div>
                <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Journey</p>
                <p className="catchup-title-with-info">4 Stages <InfoHint id="catchupJourney" label="Explain the catch-up journey" /></p>
              </div>
              <span style={{ fontSize:"0.7rem", color:"#d6a85a", fontWeight:600, background:"rgba(214,168,90,0.1)", borderRadius:6, padding:"3px 9px" }}>
                {journeyDoneCount}/{STAGES.length}
              </span>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {STAGES.map((stage, i) => {
                const done    = journeyDone[i];
                const current = !done && (i === 0 || journeyDone[i - 1]);
                return (
                  <div key={stage.key} className="catchup-stage-row" onClick={() => toggleJourney(i)}
                    style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderRadius:10, cursor:"pointer",
                      background: done ? "rgba(132,167,148,0.07)" : current ? "rgba(214,168,90,0.06)" : "rgba(255,255,255,0.02)",
                      border:`1px solid ${done ? "rgba(132,167,148,0.2)" : current ? "rgba(214,168,90,0.25)" : "rgba(255,255,255,0.05)"}`,
                      transition:"all 0.2s" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                      background: done ? "rgba(132,167,148,0.18)" : current ? "rgba(214,168,90,0.15)" : "#111816",
                      border:`2px solid ${done ? "#84a794" : current ? "#d6a85a" : "#2a3530"}`,
                      color: done ? "#84a794" : current ? "#d6a85a" : "#4a5c56",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: current ? "0 0 10px rgba(214,168,90,0.2)" : "none" }}>
                      {done ? <Check size={13} /> : stage.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:0, fontSize:"0.76rem", fontWeight:600,
                        color: done ? "#84a794" : current ? "#f4f6fc" : "#667c74",
                        textDecoration: done ? "line-through" : "none" }}>{stage.label}</p>
                      {current && <p style={{ margin:"1px 0 0", fontSize:"0.66rem", color:"#8a9a96", lineHeight:1.3 }}>{stage.hint}</p>}
                      {current && stage.why && <p style={{ margin:"4px 0 0", fontSize:"0.63rem", color:"#d6a85a", lineHeight:1.4, fontStyle:"italic" }}>Why: {stage.why}</p>}
                    </div>
                    {current && <span style={{ fontSize:"0.6rem", color:"#d6a85a", fontWeight:700, background:"rgba(214,168,90,0.12)", borderRadius:4, padding:"2px 6px", flexShrink:0 }}>Now</span>}
                    {done && <Check size={12} color="#84a794" style={{ flexShrink:0 }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop:12, height:4, background:"#1a1f1e", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"linear-gradient(to right,#d6a85a,#84a794)", width:`${journeyPct}%`, borderRadius:3, transition:"width 0.5s ease" }} />
            </div>
            <p style={{ margin:"5px 0 0", fontSize:"0.68rem", color:"#556660" }}>{journeyPct}% complete</p>
          </div>

          <FlipCard
            className="sim-card-flip catchup-ai-flip"
            front={
              <div className="track-card catchup-ai-card">
                <div className="catchup-ai-head">
                  <div>
                    <p className="catchup-ai-kicker">AI Insights</p>
                    <h3>Recovery signals</h3>
                  </div>
                  <Lightbulb size={18} />
                </div>

                <div className="catchup-ai-list">
                  {catchupInsights.map(({ title, text, Icon, tone }, i) => (
                    <div key={`${title}-${i}`} className={`catchup-ai-item ${tone}`}>
                      <Icon size={16} />
                      <div>
                        <strong>{title}</strong>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
            back={
              <>
                <span className="flip-back-label">AI Insights</span>
                <span className="flip-back-count">{catchupInsights.length}</span>
                <span className="flip-back-sub">recovery signals for your catch-up plan</span>
              </>
            }
          />
        </div>

        {/* ── TOOLS & EDUCATION ── */}
        <div className="catchup-panel-with-info catchup-milestone-wide">
          <InfoHint id="milestoneChecklist" label="Explain the milestone checklist" />
          <MilestoneChecklist
            items={MILESTONES_DETAIL}
            doneItems={stagesDone}
            onToggle={toggleStage}
          />
        </div>

        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* TRACK RATIONALE */}
            <div className={`bl-tile${openCards.rationale ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("rationale")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Why This Track?</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.rationale ? " rotated" : ""}`} />
                </div>
                {!openCards.rationale && (<>
                  <p className="bl-tile-summary">The case for catching up · real numbers</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.rationale && (
                <div className="bl-tile-body">
                  {/* Rationale copy */}
                  <p style={{ fontSize:"0.8rem", color:"#c0ccc8", lineHeight:1.7, margin:"0 0 14px" }}>
                    The Catch-Up track exists because <strong style={{ color:"#f4f6fc" }}>time is the most important variable in wealth building</strong> — and if you've lost years to debt or low savings, the only way to recover is to be deliberately aggressive while you can.
                  </p>
                  {/* Real example */}
                  <div style={{ background:"rgba(214,168,90,0.06)", border:"1px solid rgba(214,168,90,0.2)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
                    <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#d6a85a", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 8px" }}>
                      Real Example — Sipho, 38
                    </p>
                    <p style={{ fontSize:"0.78rem", color:"#c0ccc8", lineHeight:1.7, margin:0 }}>
                      Sipho earned R35 000/month but spent everything. At 38 he had R0 in savings and R120 000 in credit card debt at 22% interest.
                      He cut his lifestyle by 30%, put <strong style={{ color:"#f4f6fc" }}>R8 000/month</strong> into debt repayment and cleared everything in 15 months.
                      He then automated R6 000/month into a TFSA + ETF. By 50 he had <strong style={{ color:"#84a794" }}>R1.1M</strong> — not where he'd be if he'd started at 25, but completely recovered.
                    </p>
                  </div>
                  {/* Key insight boxes */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div style={{ background:"rgba(132,167,148,0.06)", border:"1px solid rgba(132,167,148,0.18)", borderRadius:10, padding:"12px 14px" }}>
                      <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#84a794", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}>
                        <Scale size={11} /> Trade-offs
                      </p>
                      {TRADEOFFS.map(({ pro, text }, i) => (
                        <div key={i} style={{ display:"flex", gap:7, marginBottom:5, alignItems:"flex-start" }}>
                          {pro
                            ? <Check size={12} color="#84a794" style={{ flexShrink:0, marginTop:2 }} />
                            : <Minus size={12} color="#d6a85a" style={{ flexShrink:0, marginTop:2 }} />}
                          <p style={{ margin:0, fontSize:"0.74rem", color:"#c0ccc8" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background:"rgba(255,107,107,0.05)", border:"1px solid rgba(255,107,107,0.15)", borderRadius:10, padding:"12px 14px" }}>
                      <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#ff9898", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}>
                        <TriangleAlert size={11} /> Watch for
                      </p>
                      {WARNINGS.map((t, i) => (
                        <div key={i} style={{ display:"flex", gap:7, marginBottom:6, alignItems:"flex-start" }}>
                          <ArrowRight size={11} color="#ff9898" style={{ flexShrink:0, marginTop:3 }} />
                          <p style={{ margin:0, fontSize:"0.74rem", color:"#c0ccc8", lineHeight:1.5 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STRATEGY GUIDE */}
            <div className={`bl-tile${openCards.guide ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("guide")}>
                <div className="bl-tile-top">
                  <Target size={15} color="#84a794" />
                  <span className="bl-tile-title">Strategy Guide</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.guide ? " rotated" : ""}`} />
                </div>
                {!openCards.guide && (<>
                  <p className="bl-tile-summary">Debt priority order · step-by-step playbook</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.guide && (
                <div className="bl-tile-body">
                  {/* Step-by-step */}
                  <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#84a794", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>
                    Your Catch-Up Playbook
                  </p>
                  {[
                    { n:"1", title:"List every debt",      body:"Write down every debt: balance, rate, minimum payment. Know your exact net worth before you plan anything." },
                    { n:"2", title:"Attack highest rate first", body:`Use the Avalanche Method — destroy your highest-interest debt first. A 22% credit card clears before an 11% car loan.` },
                    { n:"3", title:"Build your buffer",    body:"While attacking debt, keep at least R2 000–R5 000 in a money market. This stops you from sliding back into debt the next time something breaks." },
                    { n:"4", title:"Automate investments", body:"The moment debt clears, redirect that exact payment amount into a TFSA or ETF. Don't give yourself time to spend it." },
                  ].map(({ n, title, body }) => (
                    <div key={n} style={{ display:"flex", gap:12, marginBottom:14, alignItems:"flex-start" }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", background:"rgba(132,167,148,0.12)",
                        border:"1px solid rgba(132,167,148,0.3)", color:"#84a794", fontSize:"0.72rem", fontWeight:700,
                        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{n}</div>
                      <div>
                        <p style={{ margin:"0 0 3px", fontSize:"0.78rem", fontWeight:700, color:"#f4f6fc" }}>{title}</p>
                        <p style={{ margin:0, fontSize:"0.74rem", color:"#8a9a96", lineHeight:1.6 }}>{body}</p>
                      </div>
                    </div>
                  ))}
                  {/* Method comparison */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:4 }}>
                    <button onClick={() => setTooltip("avalancheMethod")}
                      style={{ background:"rgba(132,167,148,0.06)", border:"1px solid rgba(132,167,148,0.2)", borderRadius:10,
                        padding:"10px 12px", cursor:"pointer", textAlign:"left" }}>
                      <p style={{ margin:"0 0 4px", fontSize:"0.7rem", fontWeight:700, color:"#84a794", display:"flex", gap:5, alignItems:"center" }}>
                        Avalanche Method <Info size={11} />
                      </p>
                      <p style={{ margin:0, fontSize:"0.72rem", color:"#8a9a96", lineHeight:1.5 }}>
                        Highest interest first · saves most money
                      </p>
                    </button>
                    <button onClick={() => setTooltip("snowballMethod")}
                      style={{ background:"rgba(214,168,90,0.06)", border:"1px solid rgba(214,168,90,0.2)", borderRadius:10,
                        padding:"10px 12px", cursor:"pointer", textAlign:"left" }}>
                      <p style={{ margin:"0 0 4px", fontSize:"0.7rem", fontWeight:700, color:"#d6a85a", display:"flex", gap:5, alignItems:"center" }}>
                        Snowball Method <Info size={11} />
                      </p>
                      <p style={{ margin:0, fontSize:"0.72rem", color:"#8a9a96", lineHeight:1.5 }}>
                        Smallest balance first · builds momentum
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ALLOCATION ENGINE */}
            <div className={`bl-tile${openCards.engine ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("engine")}>
                <div className="bl-tile-top">
                  <TrendingUp size={15} color="#4facfe" />
                  <span className="bl-tile-title">Payment Simulator</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.engine ? " rotated" : ""}`} />
                </div>
                {!openCards.engine && (<>
                  <p className="bl-tile-summary">See how extra payments cut your timeline</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.engine && (() => {
                const debt    = getCatchupDebtRemaining(user);
                const base    = getTrackMonthlyAmount(user, "catchup");
                const total   = base + extraSaving;
                const months  = total > 0 && debt > 0 ? Math.ceil(debt / total) : null;
                const saving  = base > 0 && debt > 0 ? Math.ceil(debt / base) - (months || 0) : 0;
                return (
                  <div className="bl-tile-body">
                    <div className="slider-group">
                      <label>Extra monthly payment</label>
                      <input type="range" min="0" max="10000" step="250" value={extraSaving}
                        onChange={(e) => setExtraSaving(Number(e.target.value))} />
                      <span className="slider-hint">+R{extraSaving.toLocaleString("en-ZA")}/month on top of your R{base.toLocaleString("en-ZA")}/month</span>
                    </div>
                    {months && (
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                        <div style={{ background:"rgba(79,172,254,0.06)", border:"1px solid rgba(79,172,254,0.18)", borderRadius:9, padding:"10px 12px" }}>
                          <p style={{ margin:"0 0 3px", fontSize:"0.62rem", color:"#445550", textTransform:"uppercase" }}>New timeline</p>
                          <p style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"#4facfe" }}>{months} months</p>
                        </div>
                        <div style={{ background:"rgba(132,167,148,0.06)", border:"1px solid rgba(132,167,148,0.18)", borderRadius:9, padding:"10px 12px" }}>
                          <p style={{ margin:"0 0 3px", fontSize:"0.62rem", color:"#445550", textTransform:"uppercase" }}>Months saved</p>
                          <p style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"#84a794" }}>{saving > 0 ? `−${saving}` : "—"}</p>
                        </div>
                      </div>
                    )}
                    {!debt && <p style={{ marginTop:10, fontSize:"0.76rem", color:"#556660" }}>Set your total debt in Setup to use this simulator.</p>}
                  </div>
                );
              })()}
            </div>

            {/* GLOSSARY / (i) EXPLAINERS */}
            <div className={`bl-tile${openCards.insights ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("insights")}>
                <div className="bl-tile-top">
                  <Info size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Key Concepts</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.insights ? " rotated" : ""}`} />
                </div>
                {!openCards.insights && (<>
                  <p className="bl-tile-summary">Compound interest · DTI · TFSA · debt methods</p>
                  <p className="bl-tile-hint">Tap any term to learn more →</p>
                </>)}
              </button>
              {openCards.insights && (
                <div className="bl-tile-body">
                  <p style={{ fontSize:"0.72rem", color:"#667c74", margin:"0 0 12px", lineHeight:1.5 }}>
                    Tap any term below for a full explanation with real numbers.
                  </p>
                  <div className="concept-grid">
                    {Object.entries(EXPLAINERS).map(([key, { title, text }]) => (
                      <button key={key} onClick={() => setTooltip(key)}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(132,167,148,0.1)",
                          borderRadius:9, padding:"10px 14px", cursor:"pointer", textAlign:"left",
                          transition:"all 0.18s ease" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor="rgba(132,167,148,0.3)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor="rgba(132,167,148,0.1)"}>
                        <div>
                          <p style={{ margin:"0 0 2px", fontSize:"0.78rem", fontWeight:600, color:"#c0ccc8" }}>{title}</p>
                          <p style={{ margin:0, fontSize:"0.7rem", color:"#556660", lineHeight:1.4 }}>
                            {text.slice(0, 55)}…
                          </p>
                        </div>
                        <Info size={14} color="#84a794" style={{ flexShrink:0, marginLeft:8 }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <SimNudge track="catchup" />

      </div>
    </div>
  );
}
