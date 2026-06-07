import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import ExplainerPanel from "../components/ExplainerPanel";
import SlideIn from "../components/SlideIn";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import {
  Target, TrendingUp, AlertTriangle, BookOpen, Lightbulb,
  FileText, GraduationCap, Check, ChevronDown, Home, Shield,
  Info, Key, ClipboardCheck, CheckCircle, XCircle, Circle,
} from "lucide-react";
import FiveYearJourney from "../components/FiveYearJourney";

// ─── Track static data ────────────────────────────────────────────────────────

const STAGES = [
  {
    key:   "emergencyFund",
    label: "Emergency Fund",
    icon:  <Shield size={16} />,
    hint:  "3–6 months of expenses in a separate money-market account",
    why:   "Protects your deposit savings from being raided when something unexpected hits.",
  },
  {
    key:   "deposit",
    label: "10% Deposit Saved",
    icon:  <Target size={16} />,
    hint:  "Save your target deposit amount (usually 10% of property value)",
    why:   "Most banks require a 10% deposit. Larger deposits unlock better interest rates.",
  },
  {
    key:   "preApproval",
    label: "Pre-Approval Ready",
    icon:  <ClipboardCheck size={16} />,
    hint:  "Formal bond pre-approval from a bank",
    why:   "Pre-approval tells you exactly how much you can borrow and makes sellers take you seriously.",
  },
  {
    key:   "purchase",
    label: "Keys in Hand",
    icon:  <Key size={16} />,
    hint:  "Transfer duties paid, property registered in your name",
    why:   "The finish line — you now own an appreciating asset and are building equity.",
  },
];

const TRADEOFFS = [
  { pro: true,  text: "Forces disciplined, goal-oriented saving habits" },
  { pro: true,  text: "Property is a tangible, appreciating asset" },
  { pro: true,  text: "Clear end milestone — keys in hand" },
  { pro: false, text: "High opportunity cost vs. stock market investing" },
  { pro: false, text: "Lifestyle is constrained for 3–5 years" },
  { pro: false, text: "Interest rate rises can move the goalpost" },
];

const WARNINGS = [
  "Transfer duty and legal fees add 3–5% on top of the property price — budget for these separately.",
  "Pre-approval is not a guarantee. Avoid new debt, job changes, or large purchases between pre-approval and signing.",
  "A 1% interest rate increase on a R1.5M bond = ~R1,500 more per month. Model this scenario before committing.",
];

const MILESTONES_DETAIL = [
  { label: "Emergency fund (3× expenses) in place",  tip: "Do this before saving the deposit — it prevents you from raiding savings." },
  { label: "Deposit target amount calculated",        tip: "Usually 10% of the property price. 20% gets you better bond rates." },
  { label: "Monthly savings automated",              tip: "Automate on payday so discipline isn't required every month." },
  { label: "Bond pre-approval obtained",             tip: "Apply 3–6 months before you plan to buy. Gives you real numbers." },
  { label: "Transfer costs budgeted for",            tip: "Transfer duty, conveyancing fees and bond registration costs." },
  { label: "Property purchased and registered",      tip: "Congratulations — your equity starts building from day one." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyTrack() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [showPanel, setShowPanel]           = useState(false);
  const [content, setContent]               = useState(null);
  const [savingFocus, setSavingFocus]       = useState(50);
  const [lifestyle, setLifestyle]           = useState(50);
  const [growth, setGrowth]                 = useState(50);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [openCards, setOpenCards]           = useState({ simulator: false, nextSteps: false, rationale: false, guide: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Monthly tracker state ──────────────────────────────────────────────────
  const [partialAmount, setPartialAmount] = useState("");
  const [showRecovery, setShowRecovery]   = useState(false);

  const log          = user?.savingsLog || [];
  const now          = new Date();
  const thisMonth    = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisEntry    = log.find(e => e.month === thisMonth);
  const alreadyLogged = !!thisEntry;
  const savedMonths  = log.filter(e => !e.missed).length;
  const missedMonths = log.filter(e => e.missed).length;

  const formatMonth = (str) => {
    const [y, m] = str.split("-");
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1]} ${y}`;
  };

  const confirmSaved = (amount) => {
    if (alreadyLogged) return;
    const amt    = amount ?? savings;
    const newLog = [...log, { month: thisMonth, amount: Number(amt), missed: false }];
    updateUser({ savingsLog: newLog });
    setShowRecovery(false);
  };

  const confirmMissed = () => {
    if (alreadyLogged) return;
    const newLog = [...log, { month: thisMonth, amount: 0, missed: true }];
    updateUser({ savingsLog: newLog });
    setShowRecovery(true);
  };

  const removeEntry = (month) => {
    const newLog = log.filter(e => e.month !== month);
    updateUser({ savingsLog: newLog });
    if (month === thisMonth) setShowRecovery(false);
  };

  // ── Per-stage manual progress — persists in localStorage ──────────────────
  const [stagesDone, setStagesDone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("propertyStages") || "null");
      return saved && saved.length === STAGES.length ? saved : new Array(STAGES.length).fill(false);
    } catch { return new Array(STAGES.length).fill(false); }
  });

  const toggleStage = (i) => {
    setStagesDone(prev => {
      const updated = prev.map((v, idx) => idx === i ? !v : v);
      localStorage.setItem("propertyStages", JSON.stringify(updated));
      return updated;
    });
  };

  const stagesDoneCount = stagesDone.filter(Boolean).length;
  const stagesPct       = Math.round((stagesDoneCount / STAGES.length) * 100);

  // ── Financial calculations ─────────────────────────────────────────────────
  const { progress, milestoneStatus, percent } = useProgress();

  const income      = Number(user?.netSalary || user?.salary) || 0;
  const expenses    = Number(user?.expenses) || 0;
  const savings     = Math.max(income - expenses, 0);
  const housePrice  = Number(user?.housePrice) || 1000000;
  const goal        = Number(user?.depositAmount) || Number(user?.depositGoal) || Math.round(housePrice * 0.1);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const savingsMultiplier = 1 + (savingFocus - 50) / 100 - (lifestyle - 50) / 120;
  const adjustedSavings   = Math.max(0, Math.round(savings * savingsMultiplier));
  const remainingAmount   = Math.max(goal - savings, 0);
  const monthsToGoal      = adjustedSavings > 0 ? Math.ceil(remainingAmount / adjustedSavings) : null;
  const yearsToGoal       = monthsToGoal !== null ? (monthsToGoal / 12).toFixed(1) : null;

  // Deposit progress uses savingsLogTotal from user
  const savingsLogTotal = (user?.savingsLog || [])
    .filter(e => e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const depositProgress = goal > 0 ? Math.min(100, Math.round((savingsLogTotal / goal) * 100)) : 0;

  // ── Plan logic from Setup ─────────────────────────────────────────────────
  const planTarget     = Number(user?.propertyTargetMonths) || 0;
  const actualMonths   = savings > 0 && goal > 0 ? Math.ceil(goal / savings) : null;
  const planOnTrack    = actualMonths !== null && planTarget > 0 ? actualMonths <= planTarget : null;
  const planRequired   = planTarget > 0 && goal > 0 ? Math.ceil(goal / planTarget) : null;
  const planShortfall  = planRequired && savings ? Math.max(0, planRequired - savings) : 0;
  const planAhead      = planOnTrack === true && planTarget > 0 ? planTarget - actualMonths : 0;

  const insights = [];
  if (planOnTrack === false)                   insights.push(`You need R${planShortfall.toLocaleString("en-ZA")} more per month to reach your deposit in ${planTarget} months. Consider reducing expenses.`);
  if (planOnTrack === true)                    insights.push(`You're ${planAhead} months ahead of your ${planTarget}-month target. Keep your savings rate consistent.`);
  if (savingsRate < 15)                        insights.push("Your savings rate is below 15%. Increasing it by even 5% noticeably accelerates your deposit timeline.");
  if (depositProgress < 20)                   insights.push("You are in the early stage. Consistency matters more than large once-off contributions at this point.");
  if (income > 60000 && savingsRate > 25)     insights.push("Your income and savings rate position you strongly for early property acquisition.");
  if (expenses > income * 0.5)                insights.push("High fixed expenses are limiting your ability to build your deposit efficiently.");
  if (insights.length === 0)                  insights.push("Your financial position is stable. Small optimisations can improve your timeline further.");

  const getSuggestedTrack = () => {
    if (savingFocus > 70 && lifestyle < 40)    return { title: "Property Track", insight: "You are prioritising rapid deposit accumulation with reduced lifestyle flexibility." };
    if (growth > 70)                            return { title: "Investing Track", insight: "Your preferences indicate a focus on long-term wealth growth over immediate property ownership." };
    return { title: "Balanced Lifestyle Track", insight: "You are balancing lifestyle spending with steady progress toward property ownership." };
  };
  const suggestedTrack = getSuggestedTrack();

  const explainers = {
    bond:     { title: "Bond Pre-Approval",  text: "A bank assessment confirming how much you can borrow before purchasing property. Valid for 90 days. Apply 3–6 months before you plan to buy." },
    transfer: { title: "Transfer Duty",       text: "A government tax applied when purchasing property over R1,100,000. On a R1.5M property: R14,500. On R2M: R50,000. Always budget for this separately." },
  };

  const milestones = [
    { key: "emergencyFund", label: milestoneStatus?.emergencyFund?.label || "Emergency Fund", hint: milestoneStatus?.emergencyFund?.hint },
    { key: "deposit",       label: milestoneStatus?.deposit?.label       || "Deposit Saved",  hint: milestoneStatus?.deposit?.hint },
    { key: "purchase",      label: milestoneStatus?.purchase?.label      || "Property Bought",hint: milestoneStatus?.purchase?.hint },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* ── HEADER ── */}
        <span style={{ color: "#84a794", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(132,167,148,0.12)", border: "1px solid rgba(132,167,148,0.3)", borderRadius: 6, padding: "3px 10px", display: "inline-block", width: "fit-content" }}>Property Track</span>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
        <SlideIn tag="p" className="subtitle" delay={120}
          text={`Property path · ${savingsRate}% savings rate · R${savings.toLocaleString("en-ZA")} monthly surplus`} />

        {/* ── YOUR PLAN ── driven by Setup inputs */}
        {goal > 0 && (
          <div className="track-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Deposit Target",   value: `R${goal.toLocaleString("en-ZA")}`,                              color: "#d6a85a" },
                { label: "Monthly Surplus",  value: `R${savings.toLocaleString("en-ZA")}`,                           color: "#84a794" },
                { label: "Months to Goal",   value: actualMonths ? `${actualMonths} mo` : "—",                       color: "#4facfe" },
                { label: "Your Target",      value: planTarget ? `${planTarget} mo` : "Not set",                     color: planOnTrack === true ? "#84a794" : planOnTrack === false ? "#ff9898" : "#445550" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{ padding: "14px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px 14px", display: "flex", gap: 10, alignItems: "flex-start",
              background: planOnTrack === true ? "rgba(132,167,148,0.05)" : planOnTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{planOnTrack === true ? "🎯" : planOnTrack === false ? "⚡" : "💡"}</span>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700,
                  color: planOnTrack === true ? "#84a794" : planOnTrack === false ? "#d6a85a" : "#4facfe" }}>
                  {planOnTrack === true ? `On track — ${planAhead} months ahead of your target!`
                    : planOnTrack === false ? `Shortfall: need R${planShortfall.toLocaleString("en-ZA")} more/month to hit ${planTarget}-month target`
                    : planTarget === 0 ? "Set a deposit target in Setup to track your progress"
                    : `At R${savings.toLocaleString("en-ZA")}/month you'll reach your deposit in ${actualMonths} months`}
                </p>
                {planOnTrack === false && planRequired && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {[["Saving now", `R${savings.toLocaleString("en-ZA")}/mo`, "#d6a85a"], ["Need", `R${planRequired.toLocaleString("en-ZA")}/mo`, "#4facfe"], ["Gap", `R${planShortfall.toLocaleString("en-ZA")}/mo`, "#ff9898"]].map(([l, v, c]) => (
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

        {/* 1 ── 5-YEAR JOURNEY ── hero visual at the top */}
        <FiveYearJourney
          trackKey="property"
          monthlyAmount={savings}
          currentSaved={savingsLogTotal}
          fiveYearTarget={Number(user?.fiveYearGoal) || Number(user?.depositAmount) || 0}
        />

        {/* 2 ── STAGE TIMELINE ── most important: where you are in the journey */}
        <div className="track-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>Property Journey — 4 Stages</h3>
            <span style={{ fontSize: "0.75rem", color: "#84a794", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>{stagesDoneCount}/{STAGES.length} complete</span>
          </div>
          <p style={{ fontSize: "0.74rem", color: "#667c74", margin: "0 0 20px" }}>Click a stage to mark it complete. Progress is saved automatically.</p>

          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", paddingTop: 8, paddingBottom: 8 }}>
            <div style={{ position: "absolute", top: 30, left: 24, right: 24, height: 3, background: "#1a1f1e", borderRadius: 2 }} />
            <div style={{
              position: "absolute", top: 30, left: 24, height: 3, borderRadius: 2,
              background: "linear-gradient(to right, #d6a85a, #84a794)",
              width: STAGES.length > 1 ? `${(stagesDoneCount / (STAGES.length - 1)) * 84}%` : "0%",
              transition: "width 0.5s ease",
            }} />
            {STAGES.map((stage, i) => {
              const done    = stagesDone[i];
              const current = !done && (i === 0 || stagesDone[i - 1]);
              return (
                <div key={stage.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 8, zIndex: 2, cursor: "pointer" }}
                  onClick={() => toggleStage(i)} title={stage.hint}>
                  <div style={{
                    width: current ? 44 : 38, height: current ? 44 : 38, borderRadius: "50%",
                    background: done ? "rgba(132,167,148,0.18)" : current ? "rgba(214,168,90,0.15)" : "#111816",
                    border: `2.5px solid ${done ? "#84a794" : current ? "#d6a85a" : "#2a3530"}`,
                    color: done ? "#84a794" : current ? "#d6a85a" : "#4a5c56",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.25s", boxShadow: current ? "0 0 14px rgba(214,168,90,0.2)" : "none",
                  }}>
                    {done ? <Check size={16} /> : stage.icon}
                  </div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, textAlign: "center", margin: 0, color: done ? "#84a794" : current ? "#f4f6fc" : "#445550", maxWidth: 72, lineHeight: 1.3 }}>
                    {stage.label}
                  </p>
                  {current && <span style={{ fontSize: "0.62rem", color: "#d6a85a", fontWeight: 600, background: "rgba(214,168,90,0.1)", borderRadius: 4, padding: "2px 6px" }}>Current</span>}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 18, height: 6, background: "#1a1f1e", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#d6a85a", width: `${stagesPct}%`, borderRadius: 3, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.71rem", color: "#667c74" }}>
            <span>{stagesPct}% of journey complete</span>
            <span>Next: {STAGES[Math.min(stagesDoneCount, STAGES.length - 1)]?.label}</span>
          </div>

          {stagesDoneCount < STAGES.length && (
            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.18)", borderRadius: 10, padding: "10px 14px" }}>
              <Info size={14} color="#d6a85a" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#d6a85a", fontSize: "0.78rem" }}>{STAGES[stagesDoneCount]?.label}</p>
                <p style={{ margin: "3px 0 0", fontSize: "0.73rem", color: "#c0ccc8", lineHeight: 1.5 }}>{STAGES[stagesDoneCount]?.hint}</p>
                <p style={{ margin: "3px 0 0", fontSize: "0.71rem", color: "#8a9a96", lineHeight: 1.5 }}>Why: {STAGES[stagesDoneCount]?.why}</p>
              </div>
            </div>
          )}
        </div>

        {/* 2+3 ── DEPOSIT DASHBOARD ── progress + timeline + monthly tracker merged */}
        <div className="track-card" style={{ padding: 0, overflow: "hidden" }}>

          {/* ── TOP: stats strip ── */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {[
              { label: "Saved",       value: `R${savingsLogTotal.toLocaleString("en-ZA")}`, color: "#84a794" },
              { label: "Target",      value: `R${goal.toLocaleString("en-ZA")}`,            color: "#c0ccc8" },
              { label: "Monthly",     value: `R${savings.toLocaleString("en-ZA")}`,         color: "#d6a85a" },
              { label: "Timeline",    value: monthsToGoal ? `${monthsToGoal} mo` : "—",     color: "#4facfe" },
            ].map(({ label, value, color }, i) => (
              <div key={label} style={{
                padding: "16px 20px",
                borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>{label}</p>
                <p style={{ fontSize: "1.05rem", fontWeight: 700, color, margin: 0, letterSpacing: "-0.01em" }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── PROGRESS BAR ── */}
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <p style={{ fontSize: "0.72rem", color: "#667c74", margin: 0 }}>
                Deposit progress · R{(goal - savingsLogTotal).toLocaleString("en-ZA")} remaining
              </p>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d6a85a", margin: 0 }}>{depositProgress}%</p>
            </div>
            {/* segmented bar */}
            <div style={{ height: 8, background: "#0e1512", borderRadius: 6, overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%", borderRadius: 6,
                background: "linear-gradient(to right, #d6a85a, #84a794)",
                width: `${depositProgress}%`, transition: "width 0.6s ease",
              }} />
            </div>
            {/* micro milestone ticks */}
            <div style={{ position: "relative", height: 6, marginTop: 2 }}>
              {[25, 50, 75].map(pct => (
                <div key={pct} style={{
                  position: "absolute", left: `${pct}%`, top: 0,
                  width: 1, height: 6, background: "rgba(255,255,255,0.1)",
                  transform: "translateX(-50%)",
                }} />
              ))}
            </div>
            {/* streak pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 14 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.68rem", fontWeight: 600, color: "#84a794", background: "rgba(132,167,148,0.1)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 20, padding: "3px 10px" }}>
                <CheckCircle size={11} /> {savedMonths} saved
              </span>
              {missedMonths > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.68rem", fontWeight: 600, color: "#d6a85a", background: "rgba(214,168,90,0.08)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 20, padding: "3px 10px" }}>
                  <XCircle size={11} /> {missedMonths} missed
                </span>
              )}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 20px" }} />

          {/* ── MONTHLY CHECK-IN ── */}
          <div style={{ padding: "14px 20px" }}>
            <p style={{ fontSize: "0.66rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
              Monthly Check-in
            </p>

            {!alreadyLogged ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "12px 14px" }}>
                <Circle size={18} color="#667c74" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#c0ccc8" }}>
                    {formatMonth(thisMonth)} — did you save R{savings.toLocaleString("en-ZA")}?
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#556660" }}>Track honestly — missed months help you recover faster</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => confirmSaved()}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(132,167,148,0.35)", background: "rgba(132,167,148,0.1)", color: "#84a794", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                    <CheckCircle size={13} /> Yes
                  </button>
                  <button onClick={confirmMissed}
                    style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(214,168,90,0.3)", background: "rgba(214,168,90,0.07)", color: "#d6a85a", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                    <XCircle size={13} /> No
                  </button>
                </div>
              </div>
            ) : thisEntry?.missed ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                <XCircle size={18} color="#d6a85a" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#d6a85a" }}>Missed {formatMonth(thisMonth)}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#8a7a60" }}>Review the recovery tips below</p>
                </div>
                <button onClick={() => removeEntry(thisMonth)} style={{ fontSize: "0.72rem", color: "#667c74", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Undo</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(132,167,148,0.06)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                <CheckCircle size={18} color="#84a794" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: "#84a794" }}>Saved in {formatMonth(thisMonth)}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#556660" }}>R{thisEntry?.amount?.toLocaleString("en-ZA")} logged — great work!</p>
                </div>
                <button onClick={() => removeEntry(thisMonth)} style={{ fontSize: "0.72rem", color: "#667c74", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Undo</button>
              </div>
            )}

            {/* Recovery panel */}
            {showRecovery && (
              <div style={{ marginTop: 12, background: "rgba(214,168,90,0.05)", border: "1px solid rgba(214,168,90,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d6a85a", margin: "0 0 10px" }}>Recovery plan</p>
                <p style={{ fontSize: "0.76rem", color: "#c0ccc8", margin: "0 0 10px", lineHeight: 1.5 }}>
                  Save <strong>R{Math.round(savings * 1.5).toLocaleString("en-ZA")}</strong> next month to stay on track (your normal + 50% catch-up).
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="number"
                    placeholder={`Partial amount saved...`}
                    value={partialAmount}
                    onChange={e => setPartialAmount(e.target.value)}
                    style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", color: "#c0ccc8", fontSize: "0.78rem" }}
                  />
                  <button
                    onClick={() => {
                      const amt = Math.min(Number(partialAmount), savings);
                      if (!amt || amt <= 0) return;
                      const newLog = [...log.filter(e => e.month !== thisMonth), { month: thisMonth, amount: amt, missed: false }];
                      updateUser({ savingsLog: newLog });
                      setPartialAmount(""); setShowRecovery(false);
                    }}
                    disabled={!partialAmount || Number(partialAmount) <= 0}
                    style={{ padding: "8px 14px", borderRadius: 8, background: "rgba(214,168,90,0.15)", border: "1px solid rgba(214,168,90,0.3)", color: "#d6a85a", fontWeight: 600, fontSize: "0.76rem", cursor: "pointer" }}>
                    Log partial
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── HISTORY ── */}
          {log.length > 0 && (
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "12px 20px 16px" }}>
              <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
                History · {log.length} month{log.length !== 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[...log].reverse().map(entry => (
                  <div key={entry.month} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "6px 10px", borderRadius: 8,
                    background: entry.missed ? "rgba(214,168,90,0.04)" : "rgba(132,167,148,0.04)",
                  }}>
                    {entry.missed
                      ? <XCircle size={13} color="#d6a85a" />
                      : <CheckCircle size={13} color="#84a794" />}
                    <span style={{ fontSize: "0.76rem", color: "#8a9a96", flex: 1 }}>{formatMonth(entry.month)}</span>
                    <span style={{ fontSize: "0.76rem", fontWeight: 600, color: entry.missed ? "#d6a85a" : "#84a794" }}>
                      {entry.missed ? "Missed" : `+R${entry.amount.toLocaleString("en-ZA")}`}
                    </span>
                    <button onClick={() => removeEntry(entry.month)}
                      style={{ width: 18, height: 18, borderRadius: 4, background: "none", border: "none", color: "#445550", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4 ── MILESTONES + AI INSIGHTS ── compact 2-col row */}
        <div className="pt-row">
          <div className="track-card" id="milestones" style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: "0.9rem" }}>Milestones</h3>
              <span style={{ fontSize: "0.7rem", color: "#84a794", fontWeight: 600 }}>{percent}% complete</span>
            </div>
            <div className="ms-track">
              {milestones.map(({ key, label, hint }, index) => {
                const isCompleted = progress[key];
                const isPrevDone  = index === 0 || progress[milestones[index - 1].key];
                const isLocked    = !isPrevDone;
                const isCurrent   = !isCompleted && isPrevDone;
                return (
                  <div key={key} className="ms-step-col">
                    <div className="ms-circle-row">
                      {index > 0 && <div className={`ms-line ${progress[milestones[index - 1].key] ? "filled" : ""}`} />}
                      <div className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                        title={isCompleted ? "Achieved" : isLocked ? "Complete previous milestone first" : hint}>
                        {isCompleted ? <Check size={14} /> : index + 1}
                      </div>
                      {index < milestones.length - 1 && <div className={`ms-line ${isCompleted ? "filled" : ""}`} />}
                    </div>
                    <div className="ms-label">
                      <span className="step-label">{label}</span>
                      {isCurrent && hint && <span className="ms-hint" onClick={() => navigate("/money")}>{hint}</span>}
                      {isLocked && <span className="step-locked-label">Locked</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="track-card" id="insights" style={{ flex: 1 }}>
            <h3 style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <Lightbulb size={15} /> AI Insights
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {insights.map((item, i) => (
                <div key={i} className="insight" style={{ padding: "8px 12px" }}><p style={{ fontSize: "0.77rem" }}>{item}</p></div>
              ))}
            </div>
          </div>
        </div>

        {/* 5 ── MILESTONE CHECKLIST ── standalone main card */}
        <div className="track-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <ClipboardCheck size={17} color="#84a794" /> Milestone Checklist
            </h3>
            <span style={{ fontSize: "0.72rem", color: "#84a794", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>
              {stagesDone.filter(Boolean).length}/{STAGES.length} done
            </span>
          </div>
          <p style={{ fontSize: "0.73rem", color: "#667c74", margin: "0 0 14px", lineHeight: 1.5 }}>
            Tick off each milestone as you complete it — progress saves automatically.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {MILESTONES_DETAIL.map((m, i) => {
              const stageIdx = Math.min(i, STAGES.length - 1);
              const done = stagesDone[stageIdx];
              return (
                <div key={i} onClick={() => toggleStage(stageIdx)}
                  style={{
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                    background: done ? "rgba(132,167,148,0.07)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${done ? "rgba(132,167,148,0.22)" : "rgba(255,255,255,0.06)"}`,
                    transition: "background 0.2s, border-color 0.2s",
                  }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "rgba(132,167,148,0.22)" : "#0e1512",
                    border: `2px solid ${done ? "#84a794" : "#2a3530"}`,
                    transition: "all 0.2s",
                  }}>
                    {done && <Check size={11} color="#84a794" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 600, color: done ? "#84a794" : "#c0ccc8", textDecoration: done ? "line-through" : "none" }}>{m.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#556660", lineHeight: 1.4 }}>{m.tip}</p>
                  </div>
                  {done && <Check size={14} color="#84a794" style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── TOOLS & EDUCATION ── (reference + deep-dive content lives here) */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* DEPOSIT SIMULATOR */}
            <div className={`bl-tile${openCards.simulator ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("simulator")}>
                <div className="bl-tile-top">
                  <Target size={15} color="#4facfe" />
                  <span className="bl-tile-title">Deposit Simulator</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.simulator ? " rotated" : ""}`} />
                </div>
                {!openCards.simulator && (<>
                  <p className="bl-tile-summary">Adjust strategy · see timeline impact</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.simulator && (
                <div className="bl-tile-body">
                  {[
                    { label: "Saving Priority",        value: savingFocus, set: setSavingFocus, hint: "Higher = faster deposit timeline" },
                    { label: "Lifestyle Flexibility",  value: lifestyle,   set: setLifestyle,   hint: "Higher = more discretionary spending" },
                    { label: "Wealth Growth Focus",    value: growth,      set: setGrowth,      hint: "Higher = long-term investing focus" },
                  ].map(({ label, value, set, hint }) => (
                    <div className="slider-group" key={label}>
                      <label>{label}</label>
                      <input type="range" min="0" max="100" value={value} onChange={(e) => set(Number(e.target.value))} />
                      <span className="slider-hint">{hint}</span>
                    </div>
                  ))}
                  <button className="pill outline" style={{ marginTop: 10 }} onClick={() => setShowSuggestion(true)}>
                    Generate Recommendation
                  </button>
                  {showSuggestion && (
                    <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(132,167,148,0.08)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 10 }}>
                      <p style={{ fontWeight: 600, color: "#84a794", marginBottom: 4 }}>{suggestedTrack.title}</p>
                      <p style={{ fontSize: "0.78rem", color: "#c0ccc8", lineHeight: 1.5 }}>{suggestedTrack.insight}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SMART NEXT STEPS */}
            <div className={`bl-tile${openCards.nextSteps ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("nextSteps")}>
                <div className="bl-tile-top">
                  <Lightbulb size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Smart Next Steps</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.nextSteps ? " rotated" : ""}`} />
                </div>
                {!openCards.nextSteps && (<>
                  <p className="bl-tile-summary">Bond pre-approval · transfer costs</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.nextSteps && (
                <div className="bl-tile-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div className="nudge available" onClick={() => { setContent(explainers.bond); setShowPanel(true); }}>
                    <Lightbulb size={14} style={{ flexShrink: 0 }} /> Secure bond pre-approval
                    <div className="tooltip-box">{explainers.bond.text}</div>
                  </div>
                  <div className="nudge available" onClick={() => { setContent(explainers.transfer); setShowPanel(true); }}>
                    <FileText size={14} style={{ flexShrink: 0 }} /> Estimate transfer costs
                    <div className="tooltip-box">{explainers.transfer.text}</div>
                  </div>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <p className="small">Monthly savings: <strong className="accent">R{savings.toLocaleString("en-ZA")}</strong></p>
                    <p className="small" style={{ color: depositProgress > 40 ? "#84a794" : "#8fa3a0" }}>
                      {depositProgress > 40 ? "You are ahead of your projected timeline." : "Maintaining consistency will improve your position."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* TRACK RATIONALE — why + tradeoffs + numbers + warnings */}
            <div className={`bl-tile${openCards.rationale ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("rationale")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Track Rationale</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.rationale ? " rotated" : ""}`} />
                </div>
                {!openCards.rationale && (<>
                  <p className="bl-tile-summary">Why property · trade-offs · numbers</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.rationale && (
                <div className="bl-tile-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Why this track */}
                  <div>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#d6a85a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Why property?</p>
                    <p style={{ fontSize: "0.78rem", color: "#c0ccc8", lineHeight: 1.6, margin: 0 }}>
                      Property removes rent risk, builds equity over time, and appreciates 5–8%/year historically.
                      The discipline of saving a deposit creates lifelong financial habits.
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      {[["Time horizon","3–5 yrs"],["Difficulty","Medium"],["Savings target","20–30%"]].map(([l,v]) => (
                        <span key={l} style={{ fontSize: "0.68rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 6, padding: "3px 8px", color: "#8a9a96" }}>
                          <strong style={{ color: "#c0ccc8" }}>{l}:</strong> {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Trade-offs */}
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div style={{ background: "rgba(214,168,90,0.05)", border: "1px solid rgba(214,168,90,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#d6a85a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>⚖ Trade-offs</p>
                      {TRADEOFFS.map(({ pro, text }, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
                          <span style={{ color: pro ? "#84a794" : "#d6a85a", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>{pro ? "✓" : "✗"}</span>
                          <p style={{ margin: 0, fontSize: "0.74rem", color: "#c0ccc8", lineHeight: 1.4 }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(79,172,254,0.05)", border: "1px solid rgba(79,172,254,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4facfe", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>📐 Numbers</p>
                      {[
                        ["10% deposit on R1.8M","R180,000",true],
                        ["At R15k/month","12 months",false],
                        ["Transfer duty","≈ R22,000",false],
                        ["1% rate rise","+R1,500/mo",false],
                      ].map(([l,r,hi],i) => (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                          <p style={{ margin:0, fontSize:"0.7rem", color:"#667c74" }}>{l}</p>
                          <p style={{ margin:0, fontSize:"0.72rem", fontWeight:700, color: hi?"#4facfe":"#c0ccc8" }}>{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Warnings */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#ff9898", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>⚠ Warnings</p>
                    {WARNINGS.map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                        <AlertTriangle size={12} color="#ff9898" style={{ flexShrink: 0, marginTop: 2 }} />
                        <p style={{ margin: 0, fontSize: "0.74rem", color: "#c0ccc8", lineHeight: 1.4 }}>{w}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STRATEGY GUIDE — what to do + example + checklist */}
            <div className={`bl-tile${openCards.guide ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("guide")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Strategy Guide</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.guide ? " rotated" : ""}`} />
                </div>
                {!openCards.guide && (<>
                  <p className="bl-tile-summary">What to do · real example · checklist</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.guide && (
                <div className="bl-tile-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div className="grid-2">
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 6, fontSize: "0.8rem", display:"flex", alignItems:"center", gap:5 }}><BookOpen size={12}/> What to do</p>
                      <ul className="list">
                        <li>Save 20–30% of income every month</li>
                        <li>Automate savings on payday</li>
                        <li>Avoid any new debt while saving</li>
                        <li>Use a money-market account</li>
                        <li>Get pre-approval 3–6 months early</li>
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 6, fontSize: "0.8rem", display:"flex", alignItems:"center", gap:5 }}><AlertTriangle size={12}/> Risks to watch</p>
                      <ul className="list">
                        <li>Burnout — build in small rewards</li>
                        <li>Transfer duty + legal fees (~5%)</li>
                        <li>Rate increases on affordability</li>
                        <li>Pre-approval expires in 90 days</li>
                      </ul>
                    </div>
                  </div>
                  {/* Real example */}
                  <div style={{ background: "rgba(79,172,254,0.05)", border: "1px solid rgba(79,172,254,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#4facfe", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>📊 Real example — Thabo</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[["Monthly saving","R12,000","#84a794"],["Deposit target","R150,000","#d6a85a"],["Timeline","~13 months","#4facfe"],["Total incl. fees","R186,250","#c084fc"]].map(([l,v,c]) => (
                        <div key={l} style={{ background:"rgba(255,255,255,0.03)", borderRadius:7, padding:"6px 10px", minWidth:100 }}>
                          <p style={{ margin:0, fontSize:"0.6rem", color:"#556660", textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</p>
                          <p style={{ margin:0, fontSize:"0.82rem", fontWeight:700, color:c }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: "0.71rem", color: "#8a9a96", margin: "8px 0 0", lineHeight: 1.5 }}>
                      The deposit is only part of the cost — always budget 3–5% extra for transfer duty and legal fees.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      <ExplainerPanel show={showPanel} onClose={() => setShowPanel(false)} content={content} />

      <div className="finance-orb" onClick={() => navigate("/learn")} title="Finance School">
        <GraduationCap size={22} color="#0a1210" />
      </div>
    </div>
  );
}
