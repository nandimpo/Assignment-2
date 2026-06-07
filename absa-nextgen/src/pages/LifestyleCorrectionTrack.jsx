import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import SlideIn from "../components/SlideIn";
import FiveYearJourney from "../components/FiveYearJourney";
import { getTrackProgression } from "../utils/trackProgression";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import { RefreshCw, AlertTriangle, BookOpen, ChevronDown, ClipboardCheck, Check } from "lucide-react";

const MILESTONES_DETAIL = [
  { label: "Full spending audit completed",             tip: "Print 3 months of bank statements and categorise every transaction." },
  { label: "Subscriptions & lifestyle leaks cut",       tip: "Cancel anything you didn't use last month. Small leaks sink big ships." },
  { label: "Debt repayment plan written",               tip: "List all debts smallest to largest (snowball) or highest rate first (avalanche)." },
  { label: "First debt fully cleared",                  tip: "The psychological win of eliminating one debt fuels everything that follows." },
  { label: "Monthly budget consistently followed",      tip: "Three months in a row counts as a new habit. Stick to it." },
  { label: "Lifestyle expenses below 70% of income",    tip: "Below 70% means you have real room to save and invest." },
];

export default function LifestyleCorrectionTrack() {
  // ================= USER CONTEXT =================
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST — early return moved to after hooks
  const [expenseCut, setExpenseCut] = useState(0);
  const [extraDebt, setExtraDebt] = useState(0);
  const { progress, milestoneStatus, percent } = useProgress();
  const [openCards, setOpenCards] = useState({ adjuster: false, breakdown: false, rationale: false, guide: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));

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

  // ================= EARLY RETURN (after all hooks) =================
  if (!user) {
    return <p>Please complete setup first</p>;
  }

  // ================= USER DATA =================
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const debt = Number(user?.debt) || 0;
  const savings = income - expenses;

  const progression = getTrackProgression(user);

  // ================= CORE CALCULATIONS =================
  const disposableIncome = income - expenses;
  const savingsRate = ((savings / income) * 100).toFixed(0);
  const baseDebtPayment = 4000;

  // ================= SLIDER CALCULATIONS =================
  const newExpenses = expenses - expenseCut;
  const newDebtPayment = baseDebtPayment + extraDebt;
  const monthsToDebtFree = Math.ceil(debt / (newDebtPayment || 1));

  // ── Plan logic from Setup ──────────────────────────────────────────────────
  const corrOverspend     = Number(user?.goalAmount) || 0;
  const corrPlanTarget    = Number(user?.correctionTargetMonths) || 0;
  const corrAnnualSaving  = corrOverspend * 12;
  const corrTotalReclaim  = corrOverspend * corrPlanTarget;
  const corrOnTrack       = corrPlanTarget >= 12 ? true : corrPlanTarget > 0 ? false : null;

  // ================= RECOVERY STATUS =================
  let status = "Critical";
  if (savingsRate > 20) status = "Recovering";
  if (savingsRate > 35) status = "Stable";

  // ================= STAGE DETECTION =================
  let currentStage = "";
  let nextStep = "";

  if (debt > income * 2) {
    currentStage = "Stage 1: Financial Stress";
    nextStep = "Cut spending immediately and stop increasing debt.";
  } else if (debt > 0) {
    currentStage = "Stage 2: Debt Reduction";
    nextStep = "Focus on paying off high-interest debt aggressively.";
  } else if (savings < expenses * 3) {
    currentStage = "Stage 3: Rebuilding Stability";
    nextStep = "Start building your emergency fund.";
  } else {
    currentStage = "Stage 4: Ready to Grow";
    nextStep = "You can now move into investing or property strategies.";
  }

  // ================= MILESTONE INSIGHTS =================
  const milestoneInsights = [];

  if (!progress.emergencyFund) {
    milestoneInsights.push(
      "Focus on stabilising your finances and building an emergency fund.",
    );
  }

  if (progress.emergencyFund && !progress.deposit) {
    milestoneInsights.push(
      "Great — you've stabilised. Now shift toward saving for a deposit.",
    );
  }

  if (progress.deposit && !progress.purchase) {
    milestoneInsights.push(
      "You're progressing well. Start preparing for property or investing.",
    );
  }

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Stabilise (Emergency Fund)",
    deposit: "Rebuild (Save Deposit)",
    purchase: "Recover & Grow",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <span style={{ color: "#84a794", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(132,167,148,0.12)", border: "1px solid rgba(132,167,148,0.3)", borderRadius: 6, padding: "3px 10px", display: "inline-block", width: "fit-content" }}>Lifestyle Correction</span>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} style={{ margin: 0 }} />
        <SlideIn tag="p" className="subtitle" delay={120} text="You are on the Lifestyle Correction track · reduce debt and rebalance your spending" />

        {/* ── YOUR PLAN ── driven by Setup inputs */}
        {corrOverspend > 0 && (
          <div className="track-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Monthly Reduction", value: `R${corrOverspend.toLocaleString("en-ZA")}`,                           color: "#ff9898" },
                { label: "Annual Saving",      value: `R${corrAnnualSaving.toLocaleString("en-ZA")}`,                       color: "#84a794" },
                { label: "Your Target",        value: corrPlanTarget ? `${corrPlanTarget} months` : "Not set",              color: "#4facfe" },
                { label: "Total Reclaimed",    value: corrTotalReclaim > 0 ? `R${corrTotalReclaim.toLocaleString("en-ZA")}` : "—", color: "#d6a85a" },
              ].map(({ label, value, color }, i) => (
                <div key={label} style={{ padding: "14px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, color: "#445550", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 3px" }}>{label}</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px 14px", display: "flex", gap: 10, alignItems: "flex-start",
              background: corrOnTrack === true ? "rgba(132,167,148,0.05)" : corrOnTrack === false ? "rgba(214,168,90,0.05)" : "rgba(79,172,254,0.04)" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{corrOnTrack === true ? "🔄" : corrOnTrack === false ? "⚠️" : "💡"}</span>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: "0.78rem", fontWeight: 700,
                  color: corrOnTrack === true ? "#84a794" : corrOnTrack === false ? "#d6a85a" : "#4facfe" }}>
                  {corrOnTrack === true
                    ? `Realistic plan — cutting R${corrOverspend.toLocaleString("en-ZA")}/month reclaims R${corrTotalReclaim.toLocaleString("en-ZA")} over ${corrPlanTarget} months`
                    : corrOnTrack === false
                    ? `${corrPlanTarget} months is too short — behavioural change takes 12+ months to stick`
                    : `Cutting R${corrOverspend.toLocaleString("en-ZA")}/month in overspend saves R${corrAnnualSaving.toLocaleString("en-ZA")}/year — set a target in Setup`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5-YEAR JOURNEY ================= */}
        <FiveYearJourney
          trackKey="correction"
          monthlyAmount={savings}
          currentSaved={Number(user?.savings) || 0}
          fiveYearTarget={Number(user?.fiveYearGoal) || 0}
        />

        {/* ================= FINANCIAL PATH ================= */}
        <div className="track-card">
          <h3>📍 Your Financial Path</h3>

          <p>
            Current Track: <strong>{progression?.track}</strong>
          </p>

          <p className="small">{progression?.message}</p>

          {progression?.next && (
            <div className="next-step-box">
              <h4>Next Stage</h4>
              <p>
                Once ready, you will move to <strong>{progression.next}</strong>
              </p>
            </div>
          )}
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

        {/* ================= FINANCIAL STATUS ================= */}
        <div className="track-card">
          <h3>Financial Recovery Status</h3>

          {[
            { label: "Income", value: `R${income.toLocaleString()}` },
            { label: "Expenses", value: `R${expenses.toLocaleString()}` },
            { label: "Debt", value: `R${debt.toLocaleString()}` },
            { label: "Status", value: status },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>

        {/* ================= SPENDING BREAKDOWN ================= */}
        <div className="track-card">
          <h3>Spending Breakdown</h3>

          <ul className="list">
            <li>Housing &amp; Bills: 45%</li>
            <li>Lifestyle: 30%</li>
            <li>Debt Repayment: 20%</li>
            <li>Savings: 5%</li>
          </ul>

          <p className="small">
            Your lifestyle spending is currently too high relative to your
            income.
          </p>
        </div>

        {/* ================= DEBT PROGRESS ================= */}
        <div className="track-card">
          <h3>Debt Payoff Plan</h3>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((baseDebtPayment / (debt || 1)) * 100, 100)}%`,
                background: "#d6a85a",
              }}
            />
          </div>

          <p className="small">
            Current pace: {Math.ceil(debt / baseDebtPayment)} months to clear
            debt
          </p>
        </div>

        {/* ================= PROGRESSION FLOW ================= */}
        <div className="progression-flow">
          <span>Correction</span>
          <span>→</span>
          <span>Foundation</span>
          <span>→</span>
          <span>Balanced</span>
          <span>→</span>
          <span>Property</span>
        </div>

        <div className="track-card" style={{ display: "none" }}>
          <h3>5-Year Recovery Journey (legacy)</h3>

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
              const isCompleted = progress[step];
              const isCurrent =
                !progress[step] && (index === 0 || progress[steps[index - 1]]);
              const isLocked = index > 0 && !progress[steps[index - 1]];

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
                  <span className="step-label">{timelineLabels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${progress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 &&
              "You're stabilising — focus on cutting expenses and debt."}
            {percent >= 25 &&
              percent < 50 &&
              "Recovery has started — stay disciplined."}
            {percent >= 50 &&
              percent < 75 &&
              "Momentum building — you're regaining control."}
            {percent >= 75 &&
              percent < 100 &&
              "Almost recovered — prepare for growth."}
            {percent === 100 && "🎉 Fully recovered — ready to build wealth."}
          </p>
        </div>

        {/* ── TOOLS & EDUCATION ── */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            <div className={`bl-tile${openCards.adjuster ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("adjuster")}>
                <div className="bl-tile-top">
                  <RefreshCw size={15} color="#4facfe" />
                  <span className="bl-tile-title">Spending Adjuster</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.adjuster ? " rotated" : ""}`} />
                </div>
                {!openCards.adjuster && (<>
                  <p className="bl-tile-summary">Cut expenses · speed up debt payoff</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.adjuster && (
                <div className="bl-tile-body">
                  <div className="slider-group">
                    <label>Reduce Lifestyle Spending</label>
                    <input type="range" min="0" max="8000" value={expenseCut} onChange={(e) => setExpenseCut(Number(e.target.value))} />
                    <span className="slider-hint">-R{expenseCut}</span>
                  </div>
                  <div className="slider-group">
                    <label>Increase Debt Repayment</label>
                    <input type="range" min="0" max="8000" value={extraDebt} onChange={(e) => setExtraDebt(Number(e.target.value))} />
                    <span className="slider-hint">+R{extraDebt}</span>
                  </div>
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="small">New Expenses: <strong>R{newExpenses.toLocaleString()}</strong></p>
                    <p className="small" style={{ marginTop: 4, color: "#84a794" }}>Debt-Free In: <strong>{monthsToDebtFree} months</strong></p>
                  </div>
                  <div className="insight-block" style={{ marginTop: 12 }}>
                    {disposableIncome < 0 && <div className="insight warning">Overspending detected — immediate adjustments required.</div>}
                    {savingsRate < 10 && <div className="insight">Savings rate critically low. Reduce expenses first.</div>}
                    <div className="insight positive">With discipline, debt-free in <strong>{monthsToDebtFree}</strong> months.</div>
                    {milestoneInsights.map((item, i) => <div key={i} className="insight">{item}</div>)}
                  </div>
                </div>
              )}
            </div>

            <div className={`bl-tile${openCards.breakdown ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("breakdown")}>
                <div className="bl-tile-top">
                  <RefreshCw size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Spending Breakdown</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.breakdown ? " rotated" : ""}`} />
                </div>
                {!openCards.breakdown && (<>
                  <p className="bl-tile-summary">Housing 45% · Lifestyle 30% · Debt 20%</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.breakdown && (
                <div className="bl-tile-body">
                  {[
                    { label: "Housing & Bills", pct: 45, color: "#4facfe" },
                    { label: "Lifestyle", pct: 30, color: "#d6a85a" },
                    { label: "Debt Repayment", pct: 20, color: "#ff9898" },
                    { label: "Savings", pct: 5, color: "#84a794" },
                  ].map(({ label, pct, color }) => (
                    <div key={label} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: "0.76rem", color: "#c0ccc8" }}>{label}</span>
                        <span style={{ fontSize: "0.76rem", fontWeight: 600, color }}>{pct}%</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: color }} />
                      </div>
                    </div>
                  ))}
                  <p className="small" style={{ marginTop: 8 }}>Lifestyle spending is too high relative to income — the goal is to shift more toward savings.</p>
                </div>
              )}
            </div>

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
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d6a85a", margin: "0 0 8px" }}>⚖ Trade-offs</p>
                      {[{ pro: true, text: "Breaks the debt cycle permanently" }, { pro: true, text: "Builds lasting behavioural change" }, { pro: false, text: "Short-term lifestyle sacrifice" }, { pro: false, text: "Slow progress on wealth goals" }].map(({ pro, text }, i) => (
                        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                          <span style={{ color: pro ? "#84a794" : "#d6a85a", fontWeight: 700, flexShrink: 0 }}>{pro ? "✓" : "✗"}</span>
                          <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", margin: "0 0 8px" }}>⚠ Watch for</p>
                      {["Falling back into old habits", "Using credit to maintain lifestyle", "Emotional or impulsive spending", "Burnout from strict budgeting"].map((t, i) => (
                        <p key={i} style={{ margin: "0 0 5px", fontSize: "0.76rem", color: "#c0ccc8" }}>· {t}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                        <li>Cut non-essential spending aggressively</li>
                        <li>Pay high-interest debt first</li>
                        <li>Strict budget — no new debt</li>
                        <li>Rebuild habits before investing</li>
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}>⚠️ Risks</p>
                      <ul className="list">
                        <li>Falling back into old habits</li>
                        <li>Using credit to maintain lifestyle</li>
                        <li>Emotional spending</li>
                        <li>Burnout from strict budgeting</li>
                      </ul>
                    </div>
                  </div>
                  <div className="explanation-box" style={{ marginTop: 10 }}>
                    <p style={{ lineHeight: 1.6, fontSize: "0.8rem" }}>Correct behaviour, not just numbers. Eliminate debt, regain control — then move into saving and investing.</p>
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

      </div>
    </div>
  );
}
