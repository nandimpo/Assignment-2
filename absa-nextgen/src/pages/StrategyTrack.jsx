import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import { Home, TrendingUp, Scale, Zap, ArrowRight, AlertTriangle, CheckCircle, Info, BarChart3 } from "lucide-react";
import "../styles/simulation.css";
import SlideIn from "../components/SlideIn";
import { useEffect, useRef, useState } from "react";
import { getTrackProgression } from "../utils/trackProgression";
import useProgress from "../hooks/useProgress";
import growthImg from "../assets/growth.png.gif";
import rootsImg from "../assets/roots.png";

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

const trackOrder = ["correction", "balanced", "property", "catchup"];

const icons = {
  property:   <Home size={20} />,
  balanced:   <TrendingUp size={20} />,
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

  const selectedTrack = tracks[user?.strategy] ? user.strategy : null;

  // ── Recommendation ──────────────────────────────────────────────────────────
  const getRecommendedTrack = () => {
    if (!user) return null;
    if (user.debt > 0)        return { track: "correction", reason: "You currently have debt. Reducing it should be your first priority." };
    if (!user.savings || user.savings < 10000) return { track: "balanced", reason: "You don't yet have a strong financial safety net, so start with a balanced savings plan." };
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
  const endTour  = () => { localStorage.setItem("seenTrackTour", "true"); setShowTour(false); setSpotlight(null); window.scrollTo({ top: 0, behavior: "smooth" }); };
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
      const dismissedKey = `dismissedUpgrade_${progression.track}`;
      if (!localStorage.getItem(dismissedKey)) {
        setNewTrack(progression.track);
        setShowPopup(true);
      }
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
            <div className="current-track-hero" id="current-track" style={{ flex: "1 1 280px", margin: 0, position: "relative", overflow: "hidden" }}>
              <img src={growthImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.16, pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "relative", zIndex: 1, display: "contents" }}>
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
            </div>

            {/* RIGHT: stage progress timeline */}
            {tracks[selectedTrack]?.stages && (
              <div className="track-card strategy-progress-card" style={{ flex: "1 1 300px", margin: 0, position: "relative", overflow: "hidden" }}>
                <img src={growthImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.13, pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "relative", zIndex: 1 }}>
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

        {/* ── BROWSE TRACK TIMELINE ── */}
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

            <div className="sim-timeline root-timeline" id="track-grid" style={{ marginTop: 16 }}>
              <div className="sim-timeline-line" />

              {trackOrder.map((key, index) => {
                const track      = tracks[key];
                const isActive   = selectedTrack === key;
                const isRec      = recommendedTrack === key;
                const isExpanded = expandedTrack === key;
                const y5         = y5Projections[key];
                const { done: stgDone, total: stgTotal } = getStageCount(key);
                const stgArr     = trackStageProgress[key] || new Array(track.stages.length).fill(false);
                const stgPct     = stgTotal > 0 ? Math.round((stgDone / stgTotal) * 100) : 0;
                const isLeft     = index % 2 === 0;

                return (
                  <ScrollReveal
                    key={key}
                    as="div"
                    id={isRec ? "recommended" : `track-step-${index}`}
                    className={`sim-timeline-step ${isLeft ? "step-left" : "step-right"}`}
                    delay={index * 120}
                  >
                    {/* DOT */}
                    <div
                      className={`sim-timeline-dot ${isActive ? "dot-recommended" : ""}`}
                      style={isActive ? { borderColor: track.color, background: `rgba(${track.colorRgb},0.15)` } : {}}
                    />

                    {/* TEXT BLOCK */}
                    <div className="sim-step-text">
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                        {isActive && (
                          <span className="sim-recommended-badge" style={{ background: track.color, color: "#020202" }}>
                            Your track
                          </span>
                        )}
                        {isRec && !isActive && (
                          <span className="sim-recommended-badge">Recommended</span>
                        )}
                      </div>
                      <p className="sim-step-label">Track {String(index + 1).padStart(2, "0")}</p>
                      <h2 className="sim-step-title" style={isActive ? { color: track.color } : {}}>
                        {track.name}
                      </h2>
                      <p className="sim-step-desc">{track.explanation}</p>
                      <p className="sim-step-detail">
                        <strong style={{ color: "#c0ccc8" }}>Who it's for:</strong> {track.who}
                      </p>

                      {/* Expandable details */}
                      {isExpanded && (
                        <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                          <div className="strategy-detail-leaf strategy-detail-leaf--trade">
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#d6a85a", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}><Scale size={11} /> Trade-off</p>
                            <p style={{ fontSize: "0.8rem", color: "#c0ccc8", margin: 0, lineHeight: 1.5 }}>{track.tradeoffs}</p>
                          </div>
                          <div className="strategy-detail-leaf strategy-detail-leaf--warning">
                            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px", display: "flex", alignItems: "center", gap: 5 }}><AlertTriangle size={11} /> Warnings</p>
                            {track.warnings.map((w, i) => (
                              <div key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
                                <AlertTriangle size={12} color="#ff9898" style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.4 }}>{w}</p>
                              </div>
                            ))}
                          </div>
                          <div className="strategy-detail-leaf strategy-detail-leaf--example">
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#4facfe", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 5 }}><BarChart3 size={11} /> Real example</p>
                            <p style={{ fontSize: "0.8rem", color: "#c0ccc8", margin: 0, lineHeight: 1.5 }}>{track.example}</p>
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          className="sim-step-btn"
                          style={isActive ? { background: `rgba(${track.colorRgb},0.15)`, borderColor: track.color, color: track.color } : {}}
                          onClick={() => isActive ? navigate(track.route) : handleSelectTrack(key)}
                        >
                          {isActive ? "Open track →" : "Select track →"}
                        </button>
                        <button
                          onClick={() => setExpandedTrack(isExpanded ? null : key)}
                          className="sim-step-details-btn"
                        >
                          {isExpanded ? "Less ↑" : "Details ↓"}
                        </button>
                      </div>
                    </div>

                    {/* MEDIA / STATS BLOCK */}
                    <div
                      className="sim-step-media"
                      style={{
                        background: `linear-gradient(145deg, rgba(6,12,10,0.72), rgba(13,22,19,0.86)), url(${rootsImg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div style={{ background: "linear-gradient(145deg, rgba(12,17,16,0.9), rgba(17,24,23,0.84))", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", border: `1px solid ${isActive ? `rgba(${track.colorRgb},0.35)` : "rgba(255,255,255,0.09)"}`, boxShadow: isActive ? `0 8px 32px rgba(${track.colorRgb},0.12)` : "0 8px 32px rgba(0,0,0,0.3)", borderRadius: "34px 12px 34px 12px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>

                        {/* Icon + name */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: `rgba(${track.colorRgb},0.12)`, border: `1px solid rgba(${track.colorRgb},0.25)`, display: "flex", alignItems: "center", justifyContent: "center", color: track.color }}>
                            {icons[key]}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: "0.68rem", color: "#667c74", textTransform: "uppercase", letterSpacing: "0.08em" }}>{track.focus}</p>
                            <p style={{ margin: 0, fontWeight: 700, color: "#f4f6fc", fontSize: "0.9rem" }}>{track.name}</p>
                          </div>
                        </div>

                        {/* Difficulty + horizon pills */}
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: 20, background: `rgba(${track.colorRgb},0.1)`, border: `1px solid rgba(${track.colorRgb},0.2)`, color: track.color, fontWeight: 600 }}>
                            {track.difficulty}
                          </span>
                          <span style={{ fontSize: "0.72rem", padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#8a9a96" }}>
                            {track.timeHorizon}
                          </span>
                        </div>

                        {/* Y5 projection */}
                        {y5 > 0 && (
                          <div>
                            <p style={{ margin: "0 0 2px", fontSize: "0.68rem", color: "#667c74", textTransform: "uppercase", letterSpacing: "0.08em" }}>Est. Year 5</p>
                            <p style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700, color: track.color }}>R{y5.toLocaleString("en-ZA")}</p>
                          </div>
                        )}

                        {/* Stage progress */}
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <p style={{ margin: 0, fontSize: "0.68rem", color: "#667c74", textTransform: "uppercase", letterSpacing: "0.08em" }}>Stage Progress</p>
                            <p style={{ margin: 0, fontSize: "0.68rem", color: "#667c74" }}>{stgDone}/{stgTotal}</p>
                          </div>
                          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ position: "absolute", top: "50%", left: 10, right: 10, height: 2, background: "#1a1f1e", borderRadius: 1, transform: "translateY(-50%)" }} />
                            <div style={{ position: "absolute", top: "50%", left: 10, height: 2, borderRadius: 1, background: track.color, transform: "translateY(-50%)", width: stgTotal > 1 ? `${(stgDone / (stgTotal - 1)) * 85}%` : "0%", transition: "width 0.4s ease" }} />
                            {track.stages.map((stage, i) => {
                              const checked = stgArr[i] || false;
                              return (
                                <button
                                  key={stage}
                                  title={`${stage}: ${track.stageHints[i]}`}
                                  onClick={() => toggleStage(key, i)}
                                  style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, zIndex: 2, background: checked ? `rgba(${track.colorRgb},0.2)` : "#111816", border: `2px solid ${checked ? track.color : "#2a3530"}`, color: checked ? track.color : "#4a5c56", fontSize: "0.65rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                                >
                                  {checked ? "✓" : i + 1}
                                </button>
                              );
                            })}
                          </div>
                          <div style={{ marginTop: 8, height: 3, background: "#1a1f1e", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: track.color, width: `${stgPct}%`, borderRadius: 2, transition: "width 0.4s ease" }} />
                          </div>
                          <p style={{ fontSize: "0.64rem", color: "#445550", marginTop: 5 }}>Click a node to mark complete</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
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
              <button className="pill outline" onClick={() => { localStorage.setItem(`dismissedUpgrade_${newTrack}`, "1"); setShowPopup(false); }}>Stay on current</button>
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

/* ── ScrollReveal — fades + slides in when scrolled into view ── */
function ScrollReveal({ as: Tag = "div", children, delay = 0, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      {...props}
      style={{
        ...props.style,
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
