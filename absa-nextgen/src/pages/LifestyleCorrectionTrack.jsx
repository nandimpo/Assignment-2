import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import SlideIn from "../components/SlideIn";
import FiveYearJourney from "../components/FiveYearJourney";
import SimNudge from "../components/SimNudge";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import {
  RefreshCw, AlertTriangle, BookOpen, ChevronDown, ClipboardCheck, Check,
  Shield, Target, Rocket, Info, ArrowRight, Minus, Scale, TriangleAlert,
} from "lucide-react";
import MonthlySavingsTracker from "../components/MonthlySavingsTracker";

/* ─── Stage Journey ───────────────────────────────────────────────────────── */
const STAGES = [
  {
    key:   "spendingAudit",
    label: "Spending Audit",
    icon:  <AlertTriangle size={16} />,
    hint:  "Print 3 months of statements and categorise every transaction",
    why:   "You can't fix what you haven't measured. Most people underestimate lifestyle spend by 30–40% before doing this.",
  },
  {
    key:   "leaksStopped",
    label: "Leaks Stopped",
    icon:  <Shield size={16} />,
    hint:  "Cancel unused subscriptions, reduce dining out, cut impulse spend",
    why:   "Small recurring leaks (R200–R500/month each) add up to R3 000–R6 000/year. Stopping them is the fastest win.",
  },
  {
    key:   "debtCleared",
    label: "High-Interest Debt Cleared",
    icon:  <Target size={16} />,
    hint:  "Any debt above 15% interest rate eliminated",
    why:   "No budget survives high-interest debt. Clearing it first unlocks the cash flow to actually save.",
  },
  {
    key:   "habitsLocked",
    label: "Habits Locked In",
    icon:  <Rocket size={16} />,
    hint:  "3 consecutive months on budget, savings rate above 20%",
    why:   "Behavioural change takes 90 days to become automatic. Three months of consistency means the correction is real.",
  },
];

/* ─── Trade-offs ─────────────────────────────────────────────────────────── */
const TRADEOFFS = [
  { pro: true,  text: "Breaks the debt and overspend cycle permanently" },
  { pro: true,  text: "Builds lasting financial discipline and habits" },
  { pro: true,  text: "Frees up significant cash flow once habits change" },
  { pro: false, text: "Short-term lifestyle sacrifice is significant" },
  { pro: false, text: "Slow progress on wealth goals during correction phase" },
  { pro: false, text: "Burnout risk if the budget is too restrictive" },
];

/* ─── Warnings ───────────────────────────────────────────────────────────── */
const WARNINGS = [
  "Do not use credit to maintain your lifestyle while correcting — that defeats the entire purpose.",
  "A budget that's too tight will fail. Build in a small 'guilt-free' allowance to make it sustainable.",
  "Emotional spending is the biggest relapse trigger. Identify your triggers before you hit them.",
  "Debt consolidation only works if you stop accumulating new debt simultaneously.",
];

/* ─── Key Concept Explainers ─────────────────────────────────────────────── */
const EXPLAINERS = {
  lifestyleInflation: {
    title: "Lifestyle Inflation",
    text:  "When income rises, spending rises to match it — leaving savings unchanged. A R5 000 raise that turns into R5 000 more in spending is lifestyle inflation. The fix: automate savings before you see the increase.",
  },
  debtSpiral: {
    title: "The Debt Spiral",
    text:  "Using credit to cover normal expenses creates a cycle: debt increases → minimum payments grow → less cash for expenses → more credit needed. Breaking it requires cutting spending below income, even temporarily.",
  },
  budgetedVsActual: {
    title: "Budgeted vs Actual",
    text:  "Most people budget based on intention, not behaviour. Tracking actual spend for 3 months almost always reveals R1 000–R3 000/month in unplanned spending that can be redirected to debt or savings.",
  },
  savingsRate: {
    title: "Savings Rate",
    text:  "The % of take-home pay you save or invest. Below 10% = financial stress risk. 10–20% = adequate. 20–30% = healthy. Above 30% = accelerated wealth building. The correction track targets getting you above 20%.",
  },
  avalancheMethod: {
    title: "Debt Avalanche Method",
    text:  "Pay minimum on all debts, but throw every extra rand at the highest-interest debt first. Mathematically optimal — saves the most money. E.g. destroy a 22% credit card before an 11% car loan.",
  },
};

/* ─── Milestones Checklist ───────────────────────────────────────────────── */
const MILESTONES_DETAIL = [
  { label: "Full spending audit completed",          tip: "Print 3 months of bank statements and categorise every transaction." },
  { label: "Subscriptions & lifestyle leaks cut",    tip: "Cancel anything you didn't use last month. Small leaks sink big ships." },
  { label: "Debt repayment plan written",            tip: "List all debts smallest to largest (snowball) or highest rate first (avalanche)." },
  { label: "First debt fully cleared",               tip: "The psychological win of eliminating one debt fuels everything that follows." },
  { label: "Monthly budget consistently followed",   tip: "Three months in a row counts as a new habit. Stick to it." },
  { label: "Lifestyle expenses below 70% of income", tip: "Below 70% means you have real room to save and invest." },
];

export default function LifestyleCorrectionTrack() {
  const { user } = useUser();

  const [expenseCut, setExpenseCut]   = useState(0);
  const [extraDebt, setExtraDebt]     = useState(0);
  const { progress, percent }         = useProgress();
  const [openCards, setOpenCards]     = useState({ adjuster: false, rationale: false, guide: false, concepts: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));
  const [tooltip, setTooltip]         = useState(null);

  // Stage journey — localStorage
  const [journeyDone, setJourneyDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("correctionJourney") || "null");
      return s && s.length === STAGES.length ? s : new Array(STAGES.length).fill(false);
    } catch { return new Array(STAGES.length).fill(false); }
  });
  const toggleJourney = (i) => setJourneyDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("correctionJourney", JSON.stringify(u));
    return u;
  });

  // Milestone checklist — localStorage
  const [stagesDone, setStagesDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("lifestyleStages") || "null");
      return s && s.length === MILESTONES_DETAIL.length ? s : new Array(MILESTONES_DETAIL.length).fill(false);
    } catch { return new Array(MILESTONES_DETAIL.length).fill(false); }
  });
  const toggleStage = (i) => setStagesDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("lifestyleStages", JSON.stringify(u));
    return u;
  });

  if (!user) return <p>Please complete setup first</p>;

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const debt     = Number(user?.debt) || 0;
  const savings  = income - expenses;
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const corrOverspend    = Number(user?.goalAmount) || 0;
  const corrPlanTarget   = Number(user?.correctionTargetMonths) || 0;
  const corrAnnualSaving = corrOverspend * 12;
  const corrTotalReclaim = corrOverspend * corrPlanTarget;
  const corrOnTrack      = corrPlanTarget >= 12 ? true : corrPlanTarget > 0 ? false : null;

  const baseDebtPayment    = 4000;
  const newExpenses        = expenses - expenseCut;
  const newDebtPayment     = baseDebtPayment + extraDebt;
  const monthsToDebtFree   = Math.ceil(debt / (newDebtPayment || 1));
  const journeyDoneCount   = journeyDone.filter(Boolean).length;
  const journeyPct         = Math.round((journeyDoneCount / STAGES.length) * 100);

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container" style={{ maxWidth: "1100px" }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 28 }}>
          <span style={{ color: "#84a794", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(132,167,148,0.12)", border: "1px solid rgba(132,167,148,0.3)", borderRadius: 6, padding: "3px 10px", display: "inline-block", width: "fit-content" }}>Lifestyle Correction</span>
          <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
          <SlideIn tag="p" className="subtitle" delay={120} style={{ margin: 0 }}
            text={corrOverspend
              ? `Reducing R${corrOverspend.toLocaleString("en-ZA")}/month · ${savingsRate}% savings rate · ${corrPlanTarget ? corrPlanTarget + " month target" : "set a target in Setup"}`
              : `Lifestyle Correction track · ${savingsRate}% savings rate · R${savings.toLocaleString("en-ZA")} monthly surplus`} />
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

        {/* ── TOP 2-COL: YOUR PLAN + STAGE JOURNEY ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24, alignItems:"start" }}>

          {/* YOUR PLAN */}
          {corrOverspend > 0 ? (
            <div className="track-card" style={{ padding:0, overflow:"hidden" }}>
              <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Your Plan</p>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                {[
                  { label:"Monthly Reduction", value:`R${corrOverspend.toLocaleString("en-ZA")}`,                                color:"#ff9898" },
                  { label:"Annual Saving",      value:`R${corrAnnualSaving.toLocaleString("en-ZA")}`,                            color:"#84a794" },
                  { label:"Your Target",        value: corrPlanTarget ? `${corrPlanTarget} mo` : "Not set",                      color:"#4facfe" },
                  { label:"Total Reclaimed",    value: corrTotalReclaim > 0 ? `R${corrTotalReclaim.toLocaleString("en-ZA")}` : "—", color:"#d6a85a" },
                ].map(({ label, value, color }, i) => (
                  <div key={label} style={{ padding:"20px 22px",
                    borderRight:  i % 2 === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    borderBottom: i < 2       ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <p style={{ fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 5px" }}>{label}</p>
                    <p style={{ fontSize:"1.15rem", fontWeight:700, color, margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding:"10px 14px", background: corrOnTrack === true ? "rgba(132,167,148,0.05)" : corrOnTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)",
                borderTop:"1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ margin:0, fontSize:"0.73rem", fontWeight:600,
                  color: corrOnTrack === true ? "#84a794" : corrOnTrack === false ? "#d6a85a" : "#4facfe" }}>
                  {corrOnTrack === true
                    ? `Realistic plan — R${corrTotalReclaim.toLocaleString("en-ZA")} reclaimed over ${corrPlanTarget} months`
                    : corrOnTrack === false
                    ? `${corrPlanTarget} months is too short — behavioural change takes 12+ months`
                    : "Set a correction target in Setup →"}
                </p>
              </div>
            </div>
          ) : (
            <div className="track-card" style={{ display:"flex", flexDirection:"column", gap:10, justifyContent:"center" }}>
              <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Your Plan</p>
              <p style={{ margin:0, fontSize:"0.88rem", color:"#667c74" }}>No correction target set yet.</p>
              <p style={{ margin:0, fontSize:"0.76rem", color:"#556660" }}>Go to Setup → enter your monthly overspend amount to unlock your personalised plan.</p>
            </div>
          )}

          {/* STAGE JOURNEY */}
          <div className="track-card" style={{ padding:"22px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div>
                <p style={{ margin:0, fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Journey</p>
                <p style={{ margin:"2px 0 0", fontSize:"0.88rem", fontWeight:700, color:"#f4f6fc" }}>4 Stages</p>
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
                  <div key={stage.key} onClick={() => toggleJourney(i)}
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
        </div>

        {/* ── VISUAL TIMELINE ── */}
        <div className="track-card" style={{ padding:"22px 24px" }}>
          <p style={{ margin:"0 0 4px", fontSize:"0.6rem", fontWeight:700, color:"#445550", textTransform:"uppercase", letterSpacing:"0.12em" }}>Progress Timeline</p>
          <p style={{ margin:"0 0 20px", fontSize:"0.82rem", color:"#667c74" }}>Your correction journey at a glance — click stages above to advance</p>
          {/* Horizontal timeline */}
          <div style={{ position:"relative", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            {/* Connector line */}
            <div style={{ position:"absolute", top:18, left:"12.5%", right:"12.5%", height:3, background:"#1a2420", borderRadius:3, zIndex:0 }}>
              <div style={{ height:"100%", borderRadius:3, background:"linear-gradient(to right,#84a794,#d6a85a)",
                width: journeyDoneCount === 0 ? "0%" : journeyDoneCount === STAGES.length ? "100%" : `${((journeyDoneCount - 0.5) / (STAGES.length - 1)) * 100}%`,
                transition:"width 0.6s ease" }} />
            </div>
            {STAGES.map((stage, i) => {
              const done    = journeyDone[i];
              const current = !done && (i === 0 || journeyDone[i - 1]);
              const future  = !done && !current;
              return (
                <div key={stage.key} onClick={() => toggleJourney(i)}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1, position:"relative", zIndex:1, cursor:"pointer" }}>
                  {/* Node */}
                  <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                    background: done ? "rgba(132,167,148,0.2)" : current ? "rgba(214,168,90,0.15)" : "#111816",
                    border:`2.5px solid ${done ? "#84a794" : current ? "#d6a85a" : "#2a3530"}`,
                    color: done ? "#84a794" : current ? "#d6a85a" : "#4a5c56",
                    boxShadow: current ? "0 0 16px rgba(214,168,90,0.3)" : done ? "0 0 12px rgba(132,167,148,0.2)" : "none",
                    transition:"all 0.3s ease" }}>
                    {done ? <Check size={15} /> : stage.icon}
                  </div>
                  {/* Stage number */}
                  <p style={{ margin:"6px 0 2px", fontSize:"0.58rem", fontWeight:700, color: done?"#84a794":current?"#d6a85a":"#3a4a44",
                    textTransform:"uppercase", letterSpacing:"0.08em" }}>Stage {i + 1}</p>
                  {/* Label */}
                  <p style={{ margin:0, fontSize:"0.68rem", fontWeight:600, textAlign:"center", lineHeight:1.3, maxWidth:90,
                    color: done?"#84a794":current?"#f4f6fc":future?"#445550":"#445550" }}>{stage.label}</p>
                  {/* Badge */}
                  {done && <span style={{ marginTop:4, fontSize:"0.55rem", fontWeight:700, color:"#84a794", background:"rgba(132,167,148,0.12)", borderRadius:4, padding:"1px 5px" }}>Done</span>}
                  {current && <span style={{ marginTop:4, fontSize:"0.55rem", fontWeight:700, color:"#d6a85a", background:"rgba(214,168,90,0.12)", borderRadius:4, padding:"1px 5px" }}>Now</span>}
                </div>
              );
            })}
          </div>
          {/* Summary row */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:20, padding:"10px 14px",
            background:"rgba(255,255,255,0.02)", borderRadius:9, border:"1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ margin:0, fontSize:"0.72rem", color:"#667c74" }}>
              {journeyDoneCount === 0 && "Start by completing your spending audit →"}
              {journeyDoneCount > 0 && journeyDoneCount < STAGES.length && `${STAGES.length - journeyDoneCount} stage${STAGES.length - journeyDoneCount > 1 ? "s" : ""} remaining — ${STAGES[journeyDoneCount]?.label} is next`}
              {journeyDoneCount === STAGES.length && "All stages complete — your lifestyle correction is locked in!"}
            </p>
            <span style={{ fontSize:"0.72rem", fontWeight:700, color: journeyDoneCount === STAGES.length ? "#84a794" : "#d6a85a",
              background: journeyDoneCount === STAGES.length ? "rgba(132,167,148,0.1)" : "rgba(214,168,90,0.1)",
              borderRadius:6, padding:"3px 9px", whiteSpace:"nowrap", marginLeft:12 }}>
              {journeyPct}%
            </span>
          </div>
        </div>

        {/* ── MONTHLY TRACKER ── */}
        {corrOverspend > 0 && (
          <MonthlySavingsTracker
            logKey="correctionLog"
            monthlyTarget={corrOverspend}
            goalAmount={corrTotalReclaim}
            goalLabel="overspend reduced"
            trackerTitle="Monthly Reduction Tracker"
            verb="reduced"
          />
        )}

        {/* ── 5-YEAR JOURNEY ── */}
        <FiveYearJourney
          trackKey="correction"
          monthlyAmount={savings}
          currentSaved={Number(user?.savings) || 0}
          fiveYearTarget={Number(user?.fiveYearGoal) || 0}
        />

        {/* ── MILESTONE CHECKLIST ── */}
        <div className="track-card">
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

        {/* ── TOOLS & EDUCATION ── */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* WHY THIS TRACK */}
            <div className={`bl-tile${openCards.rationale ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("rationale")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Why This Track?</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.rationale ? " rotated" : ""}`} />
                </div>
                {!openCards.rationale && (<>
                  <p className="bl-tile-summary">The case for correcting · real numbers</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.rationale && (
                <div className="bl-tile-body">
                  <p style={{ fontSize:"0.8rem", color:"#c0ccc8", lineHeight:1.7, margin:"0 0 14px" }}>
                    The Lifestyle Correction track exists because <strong style={{ color:"#f4f6fc" }}>spending habits are the root cause of most financial stagnation</strong> — not income. Most people earning good salaries still feel broke because lifestyle spend expands to absorb every raise.
                  </p>
                  {/* Real example */}
                  <div style={{ background:"rgba(214,168,90,0.06)", border:"1px solid rgba(214,168,90,0.2)", borderRadius:10, padding:"12px 14px", marginBottom:14 }}>
                    <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#d6a85a", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 8px" }}>Real Example — Lesego, 31</p>
                    <p style={{ fontSize:"0.78rem", color:"#c0ccc8", lineHeight:1.7, margin:0 }}>
                      Lesego earned R42 000/month but had R0 in savings at 31. She was spending R9 000/month on dining, subscriptions, and impulse buys.
                      She did a spending audit, cut R5 000/month in lifestyle costs, and redirected it to debt and savings.
                      Within <strong style={{ color:"#f4f6fc" }}>18 months</strong> her debt was cleared. By 34 she had <strong style={{ color:"#84a794" }}>R180 000</strong> saved and moved to the Balanced Lifestyle track.
                    </p>
                  </div>
                  {/* Trade-offs + Warnings */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div style={{ background:"rgba(132,167,148,0.06)", border:"1px solid rgba(132,167,148,0.18)", borderRadius:10, padding:"12px 14px" }}>
                      <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#84a794", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}><Scale size={11} /> Trade-offs</p>
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
                      <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#ff9898", margin:"0 0 8px", display:"flex", alignItems:"center", gap:5 }}><TriangleAlert size={11} /> Watch for</p>
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
                  <p className="bl-tile-summary">Step-by-step correction playbook</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.guide && (
                <div className="bl-tile-body">
                  <p style={{ fontSize:"0.68rem", fontWeight:700, color:"#84a794", textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 10px" }}>Your Correction Playbook</p>
                  {[
                    { n:"1", title:"Do a full spending audit",    body:"Print or export 3 months of bank and credit card statements. Categorise every transaction — no exceptions. Most people find R2 000–R5 000/month of spending they can't account for." },
                    { n:"2", title:"Stop the leaks first",        body:"Subscriptions, dining, impulse buys. These are the easiest to cut and give you the fastest wins. Target R1 000–R3 000/month in cuts before touching anything structural." },
                    { n:"3", title:"Attack high-interest debt",   body:"Use the Avalanche Method — highest interest rate first. Do NOT invest while carrying debt above 15% interest. The maths never works in your favour." },
                    { n:"4", title:"Lock in the new habits",      body:"Three consecutive months on budget means the change is real. After that, automate a savings debit order so you never see the money to spend it." },
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
                </div>
              )}
            </div>

            {/* SPENDING ADJUSTER */}
            <div className={`bl-tile${openCards.adjuster ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("adjuster")}>
                <div className="bl-tile-top">
                  <RefreshCw size={15} color="#4facfe" />
                  <span className="bl-tile-title">Spending Adjuster</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.adjuster ? " rotated" : ""}`} />
                </div>
                {!openCards.adjuster && (<>
                  <p className="bl-tile-summary">See how cuts speed up debt clearance</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.adjuster && (
                <div className="bl-tile-body">
                  <div className="slider-group">
                    <label>Reduce lifestyle spending</label>
                    <input type="range" min="0" max="8000" step="250" value={expenseCut} onChange={(e) => setExpenseCut(Number(e.target.value))} />
                    <span className="slider-hint">-R{expenseCut.toLocaleString("en-ZA")}/month from lifestyle</span>
                  </div>
                  <div className="slider-group">
                    <label>Increase debt repayment</label>
                    <input type="range" min="0" max="8000" step="250" value={extraDebt} onChange={(e) => setExtraDebt(Number(e.target.value))} />
                    <span className="slider-hint">+R{extraDebt.toLocaleString("en-ZA")}/month to debt</span>
                  </div>
                  {debt > 0 && (
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                      <div style={{ background:"rgba(255,152,152,0.06)", border:"1px solid rgba(255,152,152,0.18)", borderRadius:9, padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 3px", fontSize:"0.62rem", color:"#445550", textTransform:"uppercase" }}>New timeline</p>
                        <p style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"#ff9898" }}>{monthsToDebtFree} months</p>
                      </div>
                      <div style={{ background:"rgba(132,167,148,0.06)", border:"1px solid rgba(132,167,148,0.18)", borderRadius:9, padding:"10px 12px" }}>
                        <p style={{ margin:"0 0 3px", fontSize:"0.62rem", color:"#445550", textTransform:"uppercase" }}>Months saved</p>
                        <p style={{ margin:0, fontSize:"0.95rem", fontWeight:700, color:"#84a794" }}>
                          {debt > 0 && baseDebtPayment > 0 ? `−${Math.max(0, Math.ceil(debt / baseDebtPayment) - monthsToDebtFree)}` : "—"}
                        </p>
                      </div>
                    </div>
                  )}
                  {!debt && <p style={{ marginTop:10, fontSize:"0.76rem", color:"#556660" }}>Set your debt amount in Setup to use this simulator.</p>}
                </div>
              )}
            </div>

            {/* KEY CONCEPTS */}
            <div className={`bl-tile${openCards.concepts ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("concepts")}>
                <div className="bl-tile-top">
                  <Info size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Key Concepts</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.concepts ? " rotated" : ""}`} />
                </div>
                {!openCards.concepts && (<>
                  <p className="bl-tile-summary">Lifestyle inflation · debt spiral · savings rate</p>
                  <p className="bl-tile-hint">Tap any term to learn more →</p>
                </>)}
              </button>
              {openCards.concepts && (
                <div className="bl-tile-body">
                  <p style={{ fontSize:"0.72rem", color:"#667c74", margin:"0 0 12px", lineHeight:1.5 }}>
                    Tap any term for a full explanation with real numbers.
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {Object.entries(EXPLAINERS).map(([key, { title, text }]) => (
                      <button key={key} onClick={() => setTooltip(key)}
                        style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                          background:"rgba(255,255,255,0.03)", border:"1px solid rgba(132,167,148,0.1)",
                          borderRadius:9, padding:"10px 14px", cursor:"pointer", textAlign:"left", transition:"all 0.18s ease" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor="rgba(132,167,148,0.3)"}
                        onMouseLeave={e => e.currentTarget.style.borderColor="rgba(132,167,148,0.1)"}>
                        <div>
                          <p style={{ margin:"0 0 2px", fontSize:"0.78rem", fontWeight:600, color:"#c0ccc8" }}>{title}</p>
                          <p style={{ margin:0, fontSize:"0.7rem", color:"#556660", lineHeight:1.4 }}>{text.slice(0, 55)}…</p>
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

        <SimNudge track="correction" />

      </div>
    </div>
  );
}
