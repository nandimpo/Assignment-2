import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import { Home, TrendingUp, Shield, Scale, Zap, ArrowRight, AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Info } from "lucide-react";
import SlideIn from "../components/SlideIn";
import { useEffect, useState } from "react";
import { getTrackProgression } from "../utils/trackProgression";
import useProgress from "../hooks/useProgress";

// ─── Static track data ────────────────────────────────────────────────────────

const tracks = {
  property: {
    name: "Property Path",
    explanation: "Designed for users aiming to buy property in the next 3–5 years. Focuses on aggressive saving and financial stability.",
    tradeoffs: "Reduced lifestyle flexibility and stricter budgeting required. Social spending and holidays may need to be cut significantly.",
    who: "Stable income, clear long-term plans, strong goal to own property.",
    recommendations: "Save 20–30% monthly, avoid new debt, use low-risk savings accounts.",
    risks: "Burnout from over-saving and missing investment diversification opportunities.",
    warnings: [
      "Interest rate rises can shift your affordability goalposts overnight.",
      "Transfer duty and legal fees add 3–5% to property costs — budget for them.",
      "Pre-approval ≠ guaranteed approval. Avoid new debt during the process.",
    ],
    focus: "Saving & Stability",
    route: "/property",
    difficulty: "Medium",
    timeHorizon: "3–5 years",
    stages: ["Emergency Fund", "10% Deposit Saved", "Pre-Approval Ready", "Keys in Hand"],
    stageHints: [
      "3–6 months of expenses in a money market account",
      "Save R{deposit} toward your target deposit",
      "Formal bond pre-approval from a bank",
      "Transfer duties paid, property registered",
    ],
    milestoneChecks: [
      "3 months expenses saved in separate account",
      "Deposit target amount determined",
      "Monthly savings automated",
      "Bond pre-approval obtained",
    ],
    example: "Earning R30,000/month, saving 25% = R7,500/month. A R1M property deposit (10%) = R100,000 reached in ~13 months.",
    color: "#d6a85a",
    colorRgb: "214,168,90",
  },
  balanced: {
    name: "Balanced Lifestyle",
    explanation: "Grow wealth steadily while maintaining your lifestyle. The long game — consistent monthly investments compounded over time.",
    tradeoffs: "Slower wealth accumulation than aggressive tracks. Lifestyle creep is the primary risk.",
    who: "People who want balance between enjoying life and building wealth.",
    recommendations: "Invest consistently, save 10–20%, manage spending consciously.",
    risks: "Lifestyle creep and delayed major financial milestones if discipline slips.",
    warnings: [
      "Lifestyle inflation is the #1 killer of this track — every raise should increase your savings rate.",
      "Undiversified portfolios create concentration risk. Spread across asset classes.",
      "Missing even 2–3 months of investing breaks compound momentum significantly.",
    ],
    focus: "Flexibility & Investing",
    route: "/balanced",
    difficulty: "Low",
    timeHorizon: "5–10 years",
    stages: ["Emergency Fund", "Consistent Investing", "Portfolio Growth", "Financial Independence"],
    stageHints: [
      "3 months of expenses set aside as a safety net",
      "Monthly investment habit established and automated",
      "Portfolio generating noticeable compound returns",
      "Passive income covers a meaningful % of expenses",
    ],
    milestoneChecks: [
      "Emergency fund of 3 months expenses in place",
      "Investment account opened (TFSA or unit trust)",
      "Monthly debit order set up",
      "Portfolio reviewed and rebalanced quarterly",
    ],
    example: "R10,000/month invested at 10% p.a. compound = R776,000 after 5 years. The same amount in a savings account = R600,000.",
    color: "#4facfe",
    colorRgb: "79,172,254",
  },
  foundation: {
    name: "Foundation Builder",
    explanation: "Focus on financial basics — saving, budgeting, and building the habits that all other tracks depend on.",
    tradeoffs: "Slower progress toward large goals. Building a foundation takes 12–24 months before you can accelerate.",
    who: "Beginners, inconsistent income, or those with no savings yet.",
    recommendations: "Build emergency fund first, track all spending, stabilise income before investing.",
    risks: "Delaying investing too long and missing years of compound growth.",
    warnings: [
      "Do not start investing until you have at least 1 month's expenses saved — unexpected costs will force you to sell.",
      "Tracking spending without acting on it is wasted effort. Review weekly.",
      "Avoid high-interest debt at all costs. It erases all savings progress.",
    ],
    focus: "Emergency Funds & Basics",
    route: "/foundation",
    difficulty: "Low",
    timeHorizon: "1–2 years",
    stages: ["Track Spending", "First R5,000 Saved", "Emergency Fund", "Begin Investing"],
    stageHints: [
      "Know exactly where every rand goes each month",
      "First meaningful savings milestone built",
      "3–6 months expenses saved and accessible",
      "Open a TFSA or unit trust and make first contribution",
    ],
    milestoneChecks: [
      "All income and expenses tracked for 1 full month",
      "First R5,000 saved in a dedicated account",
      "Full 3-month emergency fund in place",
      "First investment contribution made",
    ],
    example: "Saving just R1,000/month builds a R12,000 emergency fund in 1 year — protecting you from debt when unexpected costs hit.",
    color: "#84a794",
    colorRgb: "132,167,148",
  },
  correction: {
    name: "Lifestyle Correction",
    explanation: "Fix spending habits and reduce debt. A reset phase — the goal is to reach zero overspend and then build from there.",
    tradeoffs: "Requires strict discipline and temporary lifestyle sacrifices.",
    who: "People with debt, overspending patterns, or poor financial habits.",
    recommendations: "Pay off high-interest debt first, cut non-essential expenses, avoid all new credit.",
    risks: "Hard to maintain discipline long-term. Without tracking, old habits return within 3–6 months.",
    warnings: [
      "Do not invest while carrying high-interest debt. The math never works.",
      "Minimum debt repayments are a trap — always pay more than the minimum.",
      "Subscription creep and impulse buying are the two biggest budget killers on this track.",
    ],
    focus: "Behavioural Change",
    route: "/correction",
    difficulty: "High",
    timeHorizon: "1–3 years",
    stages: ["Budget Balanced", "Debt Reducing", "Debt Free", "Saving Begins"],
    stageHints: [
      "Monthly income exceeds monthly expenses",
      "Active debt repayment plan in place",
      "All consumer debt eliminated",
      "Redirect former debt payments into savings",
    ],
    milestoneChecks: [
      "Monthly budget shows income > expenses",
      "All debts listed and prioritised by interest rate",
      "All consumer debt cleared",
      "Former debt repayments now going to savings",
    ],
    example: "R2,000/month in debt repayments freed after clearing debt = R24,000 in year-one savings and R120,000 after 5 years.",
    color: "#ff9898",
    colorRgb: "255,152,152",
  },
  catchup: {
    name: "Catch-Up Wealth",
    explanation: "Aggressive saving and debt elimination for those who need to accelerate. Every rand of surplus is deployed with intention.",
    tradeoffs: "Requires significant lifestyle sacrifice in the short term. Social life and comfort spending must be aggressively reduced.",
    who: "People behind on savings or with high debt loads needing fast recovery.",
    recommendations: "Eliminate all non-essential spending, attack highest-interest debt first, automate all savings.",
    risks: "Burnout and unsustainable habits if the intensity is not managed carefully.",
    warnings: [
      "Burnout is the primary risk — build in small 'pressure valves' monthly to avoid abandoning the plan.",
      "Never sacrifice your emergency fund in pursuit of faster debt repayment.",
      "Catching up requires years of discipline, not weeks. Set realistic timeframes.",
    ],
    focus: "Debt Elimination & Rapid Saving",
    route: "/catchup",
    difficulty: "High",
    timeHorizon: "2–5 years",
    stages: ["Debt Audit", "50% Debt Cleared", "Debt Free", "Wealth Building", "Caught Up"],
    stageHints: [
      "Every debt listed, interest rates ranked, attack plan created",
      "Halfway through debt elimination — momentum building",
      "All high-interest debt cleared",
      "Full surplus redirected to investments",
      "Savings rate matches or exceeds your peer group",
    ],
    milestoneChecks: [
      "Full debt audit completed with ranked interest rates",
      "50% of total debt cleared",
      "All high-interest debt eliminated",
      "Investment account opened and funded",
      "6-month emergency fund in place",
    ],
    example: "R5,000/month surplus entirely to debt: R60,000 cleared in 1 year. Then redirected to investing = R776k portfolio in 5 years.",
    color: "#c084fc",
    colorRgb: "192,132,252",
  },
};

const trackOrder = ["correction", "foundation", "balanced", "property", "catchup"];

const icons = {
  property:   <Home size={20} />,
  balanced:   <TrendingUp size={20} />,
  foundation: <Shield size={20} />,
  correction: <Scale size={20} />,
  catchup:    <Zap size={20} />,
};

const difficultyColor = { Low: "#84a794", Medium: "#d6a85a", High: "#ff9898" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function StrategyTrack() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const { progress: milestoneProgress, percent: milestonePercent } = useProgress();

  const [showPopup, setShowPopup]         = useState(false);
  const [newTrack, setNewTrack]           = useState(null);
  const [showTour, setShowTour]           = useState(false);
  const [tourStep, setTourStep]           = useState(0);
  const [spotlight, setSpotlight]         = useState(null);
  const [expandedTrack, setExpandedTrack] = useState(null);
  const [confirmTrack, setConfirmTrack]   = useState(null); // track key awaiting confirmation
  const [activeTab, setActiveTab]         = useState("browse"); // "browse" | "compare"

  // Per-track stage progress — persists in localStorage
  const [trackStageProgress, setTrackStageProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trackStageProgress") || "{}"); }
    catch { return {}; }
  });

  const toggleStage = (trackKey, stageIdx) => {
    setTrackStageProgress(prev => {
      const current = prev[trackKey] || new Array(tracks[trackKey].stages.length).fill(false);
      const updated = { ...prev, [trackKey]: current.map((v, i) => i === stageIdx ? !v : v) };
      localStorage.setItem("trackStageProgress", JSON.stringify(updated));
      return updated;
    });
  };

  const getStageCount = (trackKey) => {
    const arr = trackStageProgress[trackKey] || [];
    return { done: arr.filter(Boolean).length, total: tracks[trackKey].stages.length };
  };

  const selectedTrack = user?.strategy;

  // ── Recommendation ──────────────────────────────────────────────────────────
  const getRecommendedTrack = () => {
    if (!user) return null;
    if (user.debt > 0)        return { track: "correction", reason: "You currently have debt. Reducing it should be your first priority." };
    if (!user.savings || user.savings < 10000) return { track: "foundation", reason: "You don't yet have a strong financial safety net." };
    if (user.goal === "buy_home") return { track: "property", reason: "You want to buy a home — focusing on a deposit is the smartest move." };
    return { track: "balanced", reason: "You're in a stable position — balancing lifestyle and investing makes sense." };
  };

  const recommendation   = getRecommendedTrack();
  const recommendedTrack = recommendation?.track;

  // ── Analysis ────────────────────────────────────────────────────────────────
  const getTrackAnalysis = () => {
    if (!user) return { confidence: 70, reasons: [], risks: [] };
    let confidence = 70;
    const reasons = [], risks = [];
    if (user.debt > 0)            { reasons.push("You have outstanding debt"); risks.push("Debt slows wealth building"); confidence += 10; }
    if (!user.savings || user.savings < 10000) { reasons.push("Your savings buffer is low"); risks.push("You lack financial protection"); confidence += 10; }
    if (user.goal === "buy_home") { reasons.push("You want to purchase property"); confidence += 10; }
    if (user.savings > 50000 && user.debt === 0) reasons.push("You are financially stable");
    return { confidence: Math.min(confidence, 95), reasons, risks };
  };

  const analysis = getTrackAnalysis();

  // ── Stage progress for CURRENT track ────────────────────────────────────────
  const stageProgress = (() => {
    const stagesCount = tracks[selectedTrack]?.stages?.length || 4;
    const completedCount =
      (milestoneProgress?.emergencyFund ? 1 : 0) +
      (milestoneProgress?.deposit ? 1 : 0) +
      (milestoneProgress?.purchase ? 1 : 0);
    return { completed: completedCount, total: stagesCount };
  })();

  // ── 5-year projections ──────────────────────────────────────────────────────
  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const surplus  = Math.max(0, income - expenses);

  function compoundFV(pmt, rate, years) {
    if (!pmt || pmt <= 0) return 0;
    const r = rate / 12;
    return Math.round(pmt * ((Math.pow(1 + r, years * 12) - 1) / r));
  }

  const y5Projections = {
    balanced:   compoundFV(surplus * 0.5,  0.10, 5),
    property:   Math.round(surplus * 0.7 * 60),
    catchup:    compoundFV(surplus * 0.8,  0.10, 5),
    correction: Math.round(surplus * 0.4 * 60),
    foundation: Math.round(surplus * 0.2 * 60),
  };

  // ── Select track ────────────────────────────────────────────────────────────
  const handleSelectTrack = (key) => {
    if (key === selectedTrack) { navigate(tracks[key].route); return; }
    setConfirmTrack(key);
  };

  const confirmSwitch = () => {
    updateUser({ strategy: confirmTrack });
    setConfirmTrack(null);
    navigate(tracks[confirmTrack].route);
  };

  // ── Tour ────────────────────────────────────────────────────────────────────
  const getFinalSteps = () => {
    const steps = [
      { text: "These are your financial strategy tracks — each path shapes your future differently.", target: "track-header" },
    ];
    if (recommendedTrack) steps.push({ text: `Based on your finances, we recommend the ${tracks[recommendedTrack].name}.`, target: "recommended" });
    steps.push({ text: "Browse all tracks and switch at any time. Check off stages as you complete them.", target: "track-grid" });
    return steps;
  };

  const trackTourSteps = getFinalSteps();
  const endTour  = () => { localStorage.setItem("seenTrackTour", "true"); setShowTour(false); setSpotlight(null); };
  const nextStep = () => { if (tourStep < trackTourSteps.length - 1) setTourStep(s => s + 1); else endTour(); };

  useEffect(() => { if (!localStorage.getItem("seenTrackTour")) setShowTour(true); }, []);
  useEffect(() => { if (showTour) setTourStep(0); }, [user?.salary]);
  useEffect(() => {
    if (!showTour || tourStep >= trackTourSteps.length) return;
    const el = document.getElementById(trackTourSteps[tourStep].target);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 10;
      setSpotlight({ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 });
    }, 520);
  }, [tourStep, showTour]);

  useEffect(() => {
    if (!user) return;
    const progression = getTrackProgression(user);
    if (progression?.track && progression.track !== user.strategy) {
      setNewTrack(progression.track);
      setShowPopup(true);
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* ── HEADER (compact) ── */}
        <div id="track-header" style={{ marginBottom: 12 }}>
          <p className="tracks-eyebrow" style={{ marginBottom: 4 }}>Strategy Tracks</p>
          <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} />
          <SlideIn tag="p" className="subtitle" delay={120}
            text={selectedTrack
              ? `${tracks[selectedTrack]?.name} track · browse all paths or jump straight in`
              : "Browse all five tracks and choose the path that fits your goals"
            } />
        </div>

        {/* ── HERO + TIMELINE — side by side ── */}
        {selectedTrack ? (
          <div style={{ display: "flex", gap: 14, alignItems: "stretch", flexWrap: "wrap" }}>

            {/* LEFT: current track card */}
            <div className="current-track-hero" id="current-track" style={{ flex: "1 1 280px", margin: 0 }}>
              <div className="current-track-left">
                <div className="current-track-icon">{icons[selectedTrack]}</div>
                <div>
                  <p className="current-track-label">Your current track</p>
                  <h2 className="current-track-name">{tracks[selectedTrack]?.name}</h2>
                  <p className="current-track-focus">{tracks[selectedTrack]?.focus}</p>
                </div>
              </div>
              <div className="current-track-right">
                <p className="small" style={{ color: "#c8d8d4", lineHeight: 1.6 }}>{tracks[selectedTrack]?.explanation}</p>
                <div className="confidence-bar" style={{ marginTop: 10 }}>
                  <div className="confidence-fill" style={{ width: `${analysis.confidence}%` }} />
                </div>
                <p className="small" style={{ marginTop: 4 }}>{analysis.confidence}% match for your profile</p>
                <button className="current-track-btn" onClick={() => navigate(tracks[selectedTrack]?.route)}>
                  Open my track <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT: stage progress timeline */}
            {tracks[selectedTrack]?.stages && (
              <div className="track-card" style={{ flex: "1 1 300px", margin: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: "0.9rem" }}>Your Progress</h3>
                  <span style={{ fontSize: "0.73rem", color: "#84a794", fontWeight: 600 }}>
                    {stageProgress.completed}/{stageProgress.total} stages
                  </span>
                </div>

                {/* Stage nodes */}
                <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 14 }}>
                  <div style={{ position: "absolute", top: 31, left: 16, right: 16, height: 2, background: "#1a1f1e", borderRadius: 2 }} />
                  <div style={{
                    position: "absolute", top: 31, left: 16, height: 2, borderRadius: 2,
                    background: `linear-gradient(to right, ${tracks[selectedTrack].color}, #84a794)`,
                    width: `${stageProgress.total > 1 ? (stageProgress.completed / (stageProgress.total - 1)) * (100 - (40 / stageProgress.total)) : 0}%`,
                    transition: "width 0.6s ease",
                  }} />
                  {tracks[selectedTrack].stages.map((stage, i) => {
                    const done    = i < stageProgress.completed;
                    const current = i === stageProgress.completed;
                    const rgb     = tracks[selectedTrack].colorRgb;
                    return (
                      <div key={stage} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 5, zIndex: 2, opacity: done || current ? 1 : 0.4 }}>
                        <div style={{
                          width: current ? 36 : 30, height: current ? 36 : 30, borderRadius: "50%",
                          background: done ? "rgba(132,167,148,0.15)" : current ? `rgba(${rgb},0.15)` : "#1a1f1e",
                          border: `2px solid ${done ? "#84a794" : current ? tracks[selectedTrack].color : "#2a3530"}`,
                          color: done ? "#84a794" : current ? tracks[selectedTrack].color : "#4a5c56",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.75rem", fontWeight: 700,
                          boxShadow: current ? `0 0 10px rgba(${rgb},0.25)` : "none",
                        }}>
                          {done ? "✓" : i + 1}
                        </div>
                        <p style={{ fontSize: "0.65rem", fontWeight: 600, color: done ? "#84a794" : current ? "#f4f6fc" : "#4a5c56", margin: 0, textAlign: "center", lineHeight: 1.2 }}>
                          {stage}
                        </p>
                        {current && <p style={{ fontSize: "0.6rem", color: tracks[selectedTrack].color, margin: 0 }}>▲ now</p>}
                      </div>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 16, height: 5, background: "#1a1f1e", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: tracks[selectedTrack].color, width: `${milestonePercent}%`, transition: "width 0.6s ease", borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: "0.7rem", color: "#667c74" }}>
                  <span>{milestonePercent}% complete</span>
                  <button className="pill outline" style={{ fontSize: "0.68rem", padding: "3px 10px" }} onClick={() => navigate(tracks[selectedTrack].route)}>
                    Continue →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="track-card">
            <h3>No track selected</h3>
            <p>Complete setup or choose a track below to start your financial journey.</p>
            <button className="pill" onClick={() => navigate("/setup")}>Go to Setup →</button>
          </div>
        )}

        {/* ── BROWSE / COMPARE TABS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 18, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={() => setActiveTab("browse")}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "8px 20px",
              fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
              color: activeTab === "browse" ? "#d6a85a" : "#667c74",
              borderBottom: activeTab === "browse" ? "2px solid #d6a85a" : "2px solid transparent",
              marginBottom: -1, transition: "color 0.2s",
            }}
          >
            Browse Tracks
          </button>
          <button
            onClick={() => setActiveTab("compare")}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: "8px 20px",
              fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
              color: activeTab === "compare" ? "#d6a85a" : "#667c74",
              borderBottom: activeTab === "compare" ? "2px solid #d6a85a" : "2px solid transparent",
              marginBottom: -1, transition: "color 0.2s",
            }}
          >
            Compare All
          </button>
        </div>

        {/* ── COMPARE TABLE ── */}
        {activeTab === "compare" && (
          <div className="track-card" style={{ overflowX: "auto", marginTop: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Track Comparison</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Track", "Focus", "Difficulty", "Time Horizon", "Ideal for", "Year-5 Est."].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 10px", color: "#667c74", fontWeight: 700, letterSpacing: "0.06em", fontSize: "0.68rem", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trackOrder.map(key => {
                  const t   = tracks[key];
                  const y5  = y5Projections[key];
                  const isA = selectedTrack === key;
                  return (
                    <tr key={key} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: isA ? "rgba(255,255,255,0.03)" : "transparent", cursor: "pointer" }}
                      onClick={() => handleSelectTrack(key)}>
                      <td style={{ padding: "10px 10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ color: t.color }}>{icons[key]}</span>
                          <span style={{ fontWeight: 600, color: isA ? t.color : "#c0ccc8" }}>{t.name}</span>
                          {isA && <span style={{ fontSize: "0.65rem", background: t.color, color: "#020202", borderRadius: 4, padding: "1px 6px", fontWeight: 700 }}>Active</span>}
                        </div>
                      </td>
                      <td style={{ padding: "10px 10px", color: "#8a9a96" }}>{t.focus}</td>
                      <td style={{ padding: "10px 10px" }}>
                        <span style={{ color: difficultyColor[t.difficulty], fontWeight: 600 }}>{t.difficulty}</span>
                      </td>
                      <td style={{ padding: "10px 10px", color: "#8a9a96" }}>{t.timeHorizon}</td>
                      <td style={{ padding: "10px 10px", color: "#8a9a96", maxWidth: 160 }}>{t.who}</td>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: t.color }}>{y5 > 0 ? `R${y5.toLocaleString("en-ZA")}` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p style={{ fontSize: "0.68rem", color: "#445550", marginTop: 10 }}>Click any row to select that track · Year-5 estimates based on your current income surplus.</p>
          </div>
        )}

        {/* ── BROWSE TRACK GRID ── */}
        {activeTab === "browse" && (
          <>
            {recommendation && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(132,167,148,0.07)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 12, padding: "12px 16px", marginTop: 16 }}>
                <Info size={15} color="#84a794" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "#84a794", fontSize: "0.82rem" }}>Recommended for you: {tracks[recommendation.track]?.name}</p>
                  <p style={{ margin: "3px 0 0", fontSize: "0.76rem", color: "#8a9a96" }}>{recommendation.reason}</p>
                </div>
              </div>
            )}

            <div className="track-grid" id="track-grid" style={{ marginTop: 16 }}>
              {trackOrder.map((key) => {
                const track       = tracks[key];
                const isActive    = selectedTrack === key;
                const isRec       = recommendedTrack === key;
                const isExpanded  = expandedTrack === key;
                const y5          = y5Projections[key];
                const { done: stgDone, total: stgTotal } = getStageCount(key);
                const stgArr      = trackStageProgress[key] || new Array(track.stages.length).fill(false);
                const stgPct      = stgTotal > 0 ? Math.round((stgDone / stgTotal) * 100) : 0;

                return (
                  <div
                    key={key}
                    id={isRec ? "recommended" : undefined}
                    className={`track-card ${isActive ? "active" : ""}`}
                  >
                    {/* Card header */}
                    <div className="track-header">
                      <div className="track-icon" style={{ color: track.color }}>{icons[key]}</div>
                      <div style={{ flex: 1 }}>
                        <h3>{track.name}</h3>
                        <p className="track-focus">{track.focus}</p>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexDirection: "column", alignItems: "flex-end" }}>
                        {isActive && <span className="badge" style={{ background: "#84a794", color: "#020202" }}>Your track</span>}
                        {isRec && !isActive && <span className="badge">Recommended</span>}
                        <span style={{ fontSize: "0.68rem", color: difficultyColor[track.difficulty], fontWeight: 600 }}>{track.difficulty} difficulty</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: "0.82rem", color: "#c0ccc8", lineHeight: 1.6 }}>{track.explanation}</p>

                    {/* Educational rationale */}
                    <div className="explanation-box">
                      <p><strong>Who it's for:</strong> {track.who}</p>
                      <p style={{ marginTop: 6 }}><strong>What to do:</strong> {track.recommendations}</p>
                      <p style={{ marginTop: 6, color: "#8a9a96" }}><strong>Time horizon:</strong> {track.timeHorizon}</p>
                    </div>

                    {/* ── MINI STAGE TIMELINE ── */}
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#667c74", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                          Stage Progress
                        </p>
                        <p style={{ fontSize: "0.68rem", color: "#667c74", margin: 0 }}>{stgDone}/{stgTotal} complete</p>
                      </div>
                      {/* Timeline line + nodes */}
                      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 4 }}>
                        <div style={{ position: "absolute", top: "50%", left: 10, right: 10, height: 2, background: "#1a1f1e", borderRadius: 1, transform: "translateY(-50%)" }} />
                        <div style={{
                          position: "absolute", top: "50%", left: 10, height: 2, borderRadius: 1,
                          background: track.color, transform: "translateY(-50%)",
                          width: stgTotal > 1 ? `${(stgDone / (stgTotal - 1)) * 85}%` : "0%",
                          transition: "width 0.4s ease",
                        }} />
                        {track.stages.map((stage, i) => {
                          const checked = stgArr[i] || false;
                          return (
                            <button
                              key={stage}
                              title={`${stage}: ${track.stageHints[i]}`}
                              onClick={() => toggleStage(key, i)}
                              style={{
                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0, zIndex: 2,
                                background: checked ? `rgba(${track.colorRgb},0.2)` : "#111816",
                                border: `2px solid ${checked ? track.color : "#2a3530"}`,
                                color: checked ? track.color : "#4a5c56",
                                fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s",
                              }}
                            >
                              {checked ? "✓" : i + 1}
                            </button>
                          );
                        })}
                      </div>
                      {/* Stage labels under nodes */}
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        {track.stages.map((stage, i) => (
                          <p key={stage} style={{ fontSize: "0.6rem", color: (stgArr[i] || false) ? track.color : "#445550", margin: 0, textAlign: "center", flex: 1, lineHeight: 1.2 }}>
                            {stage}
                          </p>
                        ))}
                      </div>
                      {/* Progress bar */}
                      <div style={{ marginTop: 8, height: 3, background: "#1a1f1e", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", background: track.color, width: `${stgPct}%`, borderRadius: 2, transition: "width 0.4s ease" }} />
                      </div>
                      <p style={{ fontSize: "0.64rem", color: "#445550", marginTop: 4 }}>Click a stage node to mark it complete</p>
                    </div>

                    {/* Trade-off */}
                    <div style={{ background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.15)", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
                      <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d6a85a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>⚖ Trade-off</p>
                      <p style={{ fontSize: "0.8rem", color: "#c0ccc8", margin: 0, lineHeight: 1.5 }}>{track.tradeoffs}</p>
                    </div>

                    {/* Risk warning */}
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
                      <AlertTriangle size={14} color="#ff9898" style={{ flexShrink: 0, marginTop: 2 }} />
                      <p style={{ fontSize: "0.8rem", color: "#ff9898", margin: 0, lineHeight: 1.5 }}>{track.risks}</p>
                    </div>

                    {/* Expandable: stages + milestones + example + warnings */}
                    {isExpanded && (
                      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>

                        {/* Milestone checklist */}
                        <div>
                          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#84a794", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
                            Key Milestones
                          </p>
                          {track.milestoneChecks.map((mc, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 7 }}>
                              <button
                                onClick={() => toggleStage(key, i < track.stages.length ? i : track.stages.length - 1)}
                                style={{
                                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                                  background: (stgArr[i] || false) ? `rgba(${track.colorRgb},0.2)` : "#111816",
                                  border: `1.5px solid ${(stgArr[i] || false) ? track.color : "#2a3530"}`,
                                  color: track.color, cursor: "pointer", marginTop: 1,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "0.65rem",
                                }}
                              >
                                {(stgArr[i] || false) ? "✓" : ""}
                              </button>
                              <p style={{ margin: 0, fontSize: "0.78rem", color: (stgArr[i] || false) ? "#84a794" : "#c0ccc8", lineHeight: 1.4 }}>{mc}</p>
                            </div>
                          ))}
                        </div>

                        {/* Warnings */}
                        <div style={{ background: "rgba(255,152,152,0.06)", border: "1px solid rgba(255,152,152,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>⚠ Warnings</p>
                          {track.warnings.map((w, i) => (
                            <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
                              <AlertTriangle size={12} color="#ff9898" style={{ flexShrink: 0, marginTop: 2 }} />
                              <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.4 }}>{w}</p>
                            </div>
                          ))}
                        </div>

                        {/* Real-world example */}
                        <div style={{ background: "rgba(79,172,254,0.06)", border: "1px solid rgba(79,172,254,0.15)", borderRadius: 10, padding: "10px 14px" }}>
                          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4facfe", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>📊 Real example</p>
                          <p style={{ fontSize: "0.8rem", color: "#c0ccc8", margin: 0, lineHeight: 1.5 }}>{track.example}</p>
                        </div>

                        {/* Educational rationale */}
                        <div style={{ background: "rgba(132,167,148,0.06)", border: "1px solid rgba(132,167,148,0.18)", borderRadius: 10, padding: "12px 14px" }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#84a794", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>💡 Why this track?</p>
                          <p style={{ fontSize: "0.78rem", color: "#c0ccc8", margin: 0, lineHeight: 1.6 }}>
                            {key === "property" && "Property is the most tangible form of wealth for many South Africans. Owning your home removes rent risk and builds equity over time. The discipline required to save a deposit transfers into lifelong financial habits."}
                            {key === "balanced" && "Compound interest is the world's most powerful financial force. A consistent monthly investment at even 10% p.a. over 20 years grows to 6× your total contributions. The balanced track makes you rich slowly — which is the only reliable way to do it."}
                            {key === "foundation" && "Most financial advice skips the foundation phase. But without tracking, budgeting and an emergency fund, every other strategy collapses the first time an unexpected cost hits. Foundation work is boring — and essential."}
                            {key === "correction" && "Behavioural change is harder than financial change. The correction track is about rewiring habits — identifying the emotional triggers for overspending and replacing them with systems. Once the habits change, the numbers follow automatically."}
                            {key === "catchup" && "The catch-up track is for those who know they're behind and want to fix it fast. Intensity is the strategy. Every rand freed from debt repayment becomes fuel for wealth building. The math compounds in your favour once debt is gone."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Year-5 + action buttons */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
                      {y5 > 0 && (
                        <div>
                          <p style={{ fontSize: "0.65rem", color: "#667c74", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Est. Year 5</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: track.color, margin: 0 }}>R{y5.toLocaleString("en-ZA")}</p>
                        </div>
                      )}
                      <div className="btn-row" style={{ marginTop: 0 }}>
                        <button
                          className="pill outline"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => setExpandedTrack(isExpanded ? null : key)}
                        >
                          {isExpanded ? "Less ↑" : "Details ↓"}
                        </button>
                        {isActive ? (
                          <button className="pill" onClick={() => navigate(track.route)}>
                            Open track →
                          </button>
                        ) : (
                          <button
                            className="pill outline"
                            style={{ borderColor: track.color, color: track.color }}
                            onClick={() => handleSelectTrack(key)}
                          >
                            Select track →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* ── SWITCH CONFIRMATION MODAL ── */}
      {confirmTrack && (
        <div className="popup-overlay">
          <div className="popup">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ color: tracks[confirmTrack].color }}>{icons[confirmTrack]}</span>
              <h3 style={{ margin: 0 }}>Switch to {tracks[confirmTrack]?.name}?</h3>
            </div>
            <p style={{ lineHeight: 1.6, color: "#c0ccc8", fontSize: "0.84rem" }}>
              {tracks[confirmTrack]?.explanation}
            </p>
            <div style={{ background: "rgba(214,168,90,0.07)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 10, padding: "10px 14px", margin: "12px 0" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#d6a85a", margin: "0 0 4px" }}>Trade-off to know</p>
              <p style={{ fontSize: "0.78rem", color: "#c0ccc8", margin: 0 }}>{tracks[confirmTrack]?.tradeoffs}</p>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button className="pill outline" onClick={() => setConfirmTrack(null)}>Cancel</button>
              <button
                className="pill"
                style={{ background: tracks[confirmTrack].color, color: "#020202" }}
                onClick={confirmSwitch}
              >
                Switch &amp; open track →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROGRESS POPUP ── */}
      {showPopup && newTrack && (
        <div className="popup-overlay">
          <div className="popup">
            <CheckCircle size={28} color="#84a794" style={{ marginBottom: 10 }} />
            <h3>You've outgrown your track</h3>
            <p>Based on your progress, you may be ready for the <strong>{tracks[newTrack]?.name}</strong> track.</p>
            <p className="small" style={{ marginTop: 8, color: "#8a9a96" }}>Your current track stays the same — this is just a suggestion.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="pill outline" onClick={() => setShowPopup(false)}>Stay on current</button>
              <button className="pill" onClick={() => { updateUser({ strategy: newTrack }); setShowPopup(false); navigate(tracks[newTrack].route); }}>
                Switch to {tracks[newTrack]?.name} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOUR ── */}
      {showTour && spotlight && (
        <>
          <div className="tour-mask-top"    style={{ top: 0, left: 0, right: 0, height: spotlight.top }} />
          <div className="tour-mask-bottom" style={{ top: spotlight.top + spotlight.height, left: 0, right: 0, bottom: 0 }} />
          <div className="tour-mask-left"   style={{ top: spotlight.top, left: 0, width: spotlight.left, height: spotlight.height }} />
          <div className="tour-mask-right"  style={{ top: spotlight.top, left: spotlight.left + spotlight.width, right: 0, height: spotlight.height }} />
          <div className="tour-cutout"      style={{ top: spotlight.top, left: spotlight.left, width: spotlight.width, height: spotlight.height }} />
          <div className="tour-box">
            <p className="tour-counter">Step {tourStep + 1} of {trackTourSteps.length}</p>
            <p className="tour-text">{trackTourSteps[tourStep]?.text}</p>
            <div className="tour-actions">
              <button className="pill outline" onClick={endTour}>Skip</button>
              <button className="pill" onClick={nextStep}>{tourStep === trackTourSteps.length - 1 ? "Done" : "Next →"}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
