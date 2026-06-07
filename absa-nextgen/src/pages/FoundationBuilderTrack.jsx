import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";
import SlideIn from "../components/SlideIn";
import FiveYearJourney from "../components/FiveYearJourney";
import SimNudge from "../components/SimNudge";
import { Shield, AlertTriangle, BookOpen, ChevronDown, ClipboardCheck, Check } from "lucide-react";

const MILESTONES_DETAIL = [
  { label: "Budget written down and tracked",           tip: "You can't fix what you don't measure — start with a simple spreadsheet." },
  { label: "1 month of expenses saved",                 tip: "Your first mini emergency fund. Small but powerful — it breaks the paycheck-to-paycheck cycle." },
  { label: "All high-interest debt identified",         tip: "List every debt with its rate. Highest rate = highest priority." },
  { label: "3× emergency fund reached",                 tip: "3 months of expenses in a separate savings account you don't touch." },
  { label: "First recurring savings contribution set",  tip: "Even R500/month automated is a foundation. Increase as expenses reduce." },
  { label: "Net income > net expenses consistently",    tip: "When income reliably exceeds expenses, you're out of survival mode." },
];

export default function FoundationBuilderTrack() {
  // ================= USER CONTEXT =================
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const { progress: milestoneProgress, milestoneStatus, percent } = useProgress();

  const [expenseAdjust, setExpenseAdjust] = useState(0);
  const [savingsAdjust, setSavingsAdjust] = useState(0);
  const [openCards, setOpenCards] = useState({ budget: false, allocation: false, insights: false, guide: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));

  const [stagesDone, setStagesDone] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("foundationStages") || "null");
      return s && s.length === MILESTONES_DETAIL.length ? s : new Array(MILESTONES_DETAIL.length).fill(false);
    } catch { return new Array(MILESTONES_DETAIL.length).fill(false); }
  });
  const toggleStage = (i) => setStagesDone(prev => {
    const u = prev.map((v, idx) => idx === i ? !v : v);
    localStorage.setItem("foundationStages", JSON.stringify(u));
    return u;
  });

  // ================= CALCULATIONS (after all hooks) =================
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = income - expenses;

  // ================= FOUNDATION LOGIC =================
  const emergencyTarget = expenses * 3;
  const currentSaved = savings * 2;

  // FIX: toFixed returns a string — use Number() so comparisons work correctly
  const fundProgress = Number(
    Math.min((currentSaved / emergencyTarget) * 100, 100).toFixed(0),
  );

  // ✅ useEffect after all hooks, before any derived logic
  // milestone completion is now auto-calculated by useProgress

  const overallProgress = Math.round((fundProgress + percent) / 2);

  // ── Plan logic from Setup ────────────────────────────────────────────────────
  const foundGoal5yr    = Number(user?.fiveYearGoal) || 0;
  const foundMonthly    = savings;
  const foundActualMo   = foundMonthly > 0 && emergencyTarget > 0 ? Math.ceil(emergencyTarget / foundMonthly) : null;
  const foundY5Savings  = foundMonthly * 60;
  const foundOnTrack    = foundGoal5yr > 0 ? foundY5Savings >= foundGoal5yr : null;
  const foundShortfall  = foundGoal5yr > 0 ? Math.max(0, foundGoal5yr - foundY5Savings) : 0;

  // ================= MILESTONE INSIGHTS =================
  const milestoneInsights = [];

  if (!milestoneProgress.emergencyFund) {
    milestoneInsights.push(
      "Build your emergency fund first — this protects you from setbacks.",
    );
  }

  if (milestoneProgress.emergencyFund && !milestoneProgress.deposit) {
    milestoneInsights.push(
      "Great — your foundation is set. Now focus on saving for your deposit.",
    );
  }

  if (milestoneProgress.deposit && !milestoneProgress.purchase) {
    milestoneInsights.push(
      "You're close. Start preparing for bond approval and purchase costs.",
    );
  }

  if (milestoneProgress.purchase) {
    milestoneInsights.push(
      "🎉 You've completed your property journey — time to optimise ownership.",
    );
  }

  // ================= STAGE DETECTION =================
  let currentStage = "";
  let nextStep = "";

  if (fundProgress < 30) {
    currentStage = "Stage 1: Starting Emergency Fund";
    nextStep = "Focus on saving your first 1–2 months of expenses.";
  } else if (fundProgress < 60) {
    currentStage = "Stage 2: Building Stability";
    nextStep = "Increase consistency and reach 3–6 months of savings.";
  } else if (fundProgress < 100) {
    currentStage = "Stage 3: Securing Foundation";
    nextStep = "Maintain discipline and fully complete your emergency fund.";
  } else {
    currentStage = "Stage 4: Ready to Grow";
    nextStep =
      "You can now start investing and move to wealth-building strategies.";
  }

  // ================= SLIDER CALCULATIONS =================
  const adjustedSavings = savings + savingsAdjust;
  const remaining = Math.max(emergencyTarget - currentSaved, 0);
  const monthsToGoal =
    adjustedSavings > 0 ? Math.ceil(remaining / adjustedSavings) : null;

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Emergency Fund",
    deposit: "Save Deposit",
    purchase: "Purchase",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <span style={{ color: "#84a794", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(132,167,148,0.12)", border: "1px solid rgba(132,167,148,0.3)", borderRadius: 6, padding: "3px 10px", display: "inline-block", width: "fit-content" }}>Foundation Builder</span>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
        <SlideIn tag="p" className="subtitle" delay={120} text="You are on the Foundation track · build your financial base from the ground up" />

        {/* ── YOUR PLAN ── driven by Setup inputs */}
        {emergencyTarget > 0 && (
          <div className="track-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Emergency Target", value: `R${emergencyTarget.toLocaleString("en-ZA")}`,                          color: "#d6a85a" },
                { label: "Monthly Surplus",  value: `R${foundMonthly.toLocaleString("en-ZA")}`,                             color: "#84a794" },
                { label: "Months to Fund",   value: foundActualMo ? `${foundActualMo} mo` : "—",                            color: "#4facfe" },
                { label: "5-Yr Projection",  value: `R${foundY5Savings.toLocaleString("en-ZA")}`,                           color: foundOnTrack === true ? "#84a794" : foundOnTrack === false ? "#ff9898" : "#c0ccc8" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{ padding: "14px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px 14px", display: "flex", gap: 10, alignItems: "flex-start",
              background: foundOnTrack === true ? "rgba(132,167,148,0.05)" : foundOnTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{foundOnTrack === true ? "🛡️" : foundOnTrack === false ? "⚡" : "💡"}</span>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700,
                  color: foundOnTrack === true ? "#84a794" : foundOnTrack === false ? "#d6a85a" : "#4facfe" }}>
                  {foundOnTrack === true
                    ? `On track — saving R${foundMonthly.toLocaleString("en-ZA")}/month builds R${foundY5Savings.toLocaleString("en-ZA")} in 5 years, above your R${foundGoal5yr.toLocaleString("en-ZA")} goal`
                    : foundOnTrack === false
                    ? `Saving R${foundMonthly.toLocaleString("en-ZA")}/month gives R${foundY5Savings.toLocaleString("en-ZA")} in 5 years — R${foundShortfall.toLocaleString("en-ZA")} short of your R${foundGoal5yr.toLocaleString("en-ZA")} goal`
                    : foundActualMo
                    ? `At R${foundMonthly.toLocaleString("en-ZA")}/month you'll build your emergency fund in ${foundActualMo} months. Set a 5-year goal in Setup.`
                    : "Add your salary and expenses in Setup to see your personalised plan"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5-YEAR JOURNEY ================= */}
        <FiveYearJourney
          trackKey="foundation"
          monthlyAmount={savings}
          currentSaved={currentSaved}
          fiveYearTarget={Number(user?.fiveYearGoal) || 0}
        />

        {/* ================= EMERGENCY FUND STATUS ================= */}
        <div className="track-card">
          <h3>Emergency Fund Progress</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <p>Target</p>
            <p>R{emergencyTarget.toLocaleString()}</p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <p>Current Saved</p>
            <p>R{currentSaved.toLocaleString()}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${fundProgress}%` }}
            >
              <span className="progress-text">{fundProgress}%</span>
            </div>
          </div>

          <p className="small">{fundProgress}% complete</p>
        </div>

        {/* ================= CURRENT STAGE ================= */}
        <div className="track-card">
          <h3>📍 Your Current Stage</h3>

          <p className="accent">{currentStage}</p>

          <div className="next-step-box">
            <h4>Next Step</h4>
            <p>{nextStep}</p>
          </div>
        </div>

        {/* ================= MILESTONE INSIGHTS ================= */}
        <div className="track-card">
          <div className="insight-block">
            <h4>Milestone Insights</h4>
            {milestoneInsights.map((item, i) => (
              <div key={i} className="insight">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ================= ESSENTIAL ALLOCATION ================= */}
        <div className="track-card">
          <h3>Essential Allocation</h3>

          <ul className="list">
            <li>Needs (Rent, Food): 60%</li>
            <li>Savings (Emergency Fund): 25%</li>
            <li>Support (Black Tax / Family): 15%</li>
          </ul>

          <p className="small">
            This reflects a realistic South African financial structure.
          </p>
        </div>

        <div className="track-card" style={{ display: "none" }}>
          <h3>5-Year Financial Journey (legacy)</h3>

          {/* HORIZONTAL TIMELINE */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "30px",
              paddingBottom: "20px",
            }}
          >
            {/* BACKGROUND LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                right: "0",
                height: "3px",
                background: "#1a1f1e",
                zIndex: 0,
              }}
            />
            {/* FILLED LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                height: "3px",
                width: `${percent}%`,
                background: "linear-gradient(to right, #d6a85a, #84a794)",
                zIndex: 1,
                transition: "width 0.4s ease",
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = milestoneProgress[step];
              const isCurrent =
                !milestoneProgress[step] &&
                (index === 0 || milestoneProgress[steps[index - 1]]);
              const isLocked =
                index > 0 && !milestoneProgress[steps[index - 1]];

              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    zIndex: 2,
                  }}
                >
                  <div
                    className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{milestoneStatus?.[step]?.label || timelineLabels[step]}</span>
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 && "Strong start — build your foundation."}
            {percent >= 25 && percent < 50 && "You're gaining momentum."}
            {percent >= 50 &&
              percent < 75 &&
              "Halfway there — stay consistent."}
            {percent >= 75 && percent < 100 && "Almost there — final push."}
            {percent === 100 &&
              "🎉 Goal achieved — financial milestone complete."}
          </p>
        </div>

        {/* ================= OVERALL PROGRESS ================= */}
        <div className="track-card">
          <h3>Overall Progress</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <p className="small">{overallProgress}% complete</p>
        </div>

        {/* ── TOOLS & EDUCATION ── */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* BUDGET ADJUSTMENT TOOL */}
            <div className={`bl-tile${openCards.budget ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("budget")}>
                <div className="bl-tile-top">
                  <Shield size={15} color="#4facfe" />
                  <span className="bl-tile-title">Budget Adjustment Tool</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.budget ? " rotated" : ""}`} />
                </div>
                {!openCards.budget && (<>
                  <p className="bl-tile-summary">Reduce expenses · see fund timeline</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.budget && (
                <div className="bl-tile-body">
                  <div className="slider-group">
                    <label>Reduce Expenses</label>
                    <input type="range" min="0" max="5000" value={expenseAdjust} onChange={(e) => setExpenseAdjust(Number(e.target.value))} />
                    <span className="slider-hint">-R{expenseAdjust}</span>
                  </div>
                  <div className="slider-group">
                    <label>Increase Savings</label>
                    <input type="range" min="0" max="5000" value={savingsAdjust} onChange={(e) => setSavingsAdjust(Number(e.target.value))} />
                    <span className="slider-hint">+R{savingsAdjust}</span>
                  </div>
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="small">Adjusted savings: <strong>R{adjustedSavings.toLocaleString()}</strong></p>
                    {monthsToGoal ? <p className="small" style={{ marginTop: 4, color: "#84a794" }}>Emergency fund in <strong>{monthsToGoal} months</strong></p>
                      : <p className="small warning-text" style={{ marginTop: 4 }}>Increase savings or reduce expenses to start</p>}
                  </div>
                </div>
              )}
            </div>

            {/* ESSENTIAL ALLOCATION */}
            <div className={`bl-tile${openCards.allocation ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("allocation")}>
                <div className="bl-tile-top">
                  <Shield size={15} color="#84a794" />
                  <span className="bl-tile-title">Essential Allocation</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.allocation ? " rotated" : ""}`} />
                </div>
                {!openCards.allocation && (<>
                  <p className="bl-tile-summary">Needs 60% · Savings 25% · Support 15%</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.allocation && (
                <div className="bl-tile-body">
                  <ul className="list">
                    <li>Needs (Rent, Food): 60%</li>
                    <li>Savings (Emergency Fund): 25%</li>
                    <li>Support (Black Tax / Family): 15%</li>
                  </ul>
                  <p className="small" style={{ marginTop: 10 }}>This reflects a realistic South African financial structure for this stage.</p>
                  <div className="insight-block" style={{ marginTop: 12 }}>
                    <div className="insight">Focus on building stability before pursuing aggressive growth.</div>
                    <div className="insight">Reducing expenses by R2,000 could reach your emergency fund 5–6 months faster.</div>
                    <div className="insight">Consistency matters more than amount — even small savings build long-term security.</div>
                  </div>
                </div>
              )}
            </div>

            {/* TRACK RATIONALE */}
            <div className={`bl-tile${openCards.insights ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("insights")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Track Rationale</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.insights ? " rotated" : ""}`} />
                </div>
                {!openCards.insights && (<>
                  <p className="bl-tile-summary">Why stability before growth</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.insights && (
                <div className="bl-tile-body">
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div style={{ background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d6a85a", margin: "0 0 8px" }}>⚖ Trade-offs</p>
                      {[
                        { pro: true, text: "Protects against financial shocks" },
                        { pro: true, text: "Low-stress, sustainable pace" },
                        { pro: false, text: "Slower progress toward big goals" },
                        { pro: false, text: "No investing until fund is built" },
                      ].map(({ pro, text }, i) => (
                        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                          <span style={{ color: pro ? "#84a794" : "#d6a85a", fontWeight: 700, flexShrink: 0 }}>{pro ? "✓" : "✗"}</span>
                          <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", margin: "0 0 8px" }}>⚠ Watch for</p>
                      {["Living paycheck to paycheck", "Skipping the emergency fund", "Taking on debt without a buffer", "Delaying this stage indefinitely"].map((t, i) => (
                        <p key={i} style={{ margin: "0 0 5px", fontSize: "0.76rem", color: "#c0ccc8" }}>· {t}</p>
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
                  <BookOpen size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Strategy Guide</span>
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
                      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}>📌 What to do</p>
                      <ul className="list">
                        <li>Build emergency fund (3–6 months expenses)</li>
                        <li>Track every expense to understand cash flow</li>
                        <li>Reduce inconsistent or unnecessary spending</li>
                        <li>Stabilise income before investing</li>
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}>⚠️ Risks to watch</p>
                      <ul className="list">
                        <li>Running out of cash in emergencies</li>
                        <li>Living paycheck to paycheck</li>
                        <li>Taking on debt due to lack of savings</li>
                        <li>Delaying this stage and never progressing</li>
                      </ul>
                    </div>
                  </div>
                  <div className="explanation-box" style={{ marginTop: 10 }}>
                    <p style={{ lineHeight: 1.6, fontSize: "0.8rem" }}>
                      This stage is about survival and stability. Without a safety net, one unexpected expense resets all your progress. Build the foundation first — then build wealth.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MILESTONE CHECKLIST */}
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

        <SimNudge track="foundation" />

      </div>
    </div>
  );
}
