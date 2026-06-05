import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import { Home, TrendingUp, Shield, Scale, Zap, ArrowRight } from "lucide-react";
import TypewriterHeading from "../components/TypewriterHeading";
import { useEffect, useState } from "react";
import { getTrackProgression } from "../utils/trackProgression";

// ─── Static data (no user dependency) ────────────────────────────────────────

const tracks = {
  property: {
    name: "Property Path",
    explanation:
      "Designed for users aiming to buy property in the next 3–5 years. Focuses on aggressive saving and financial stability.",
    tradeoffs: "Reduced lifestyle flexibility and stricter budgeting.",
    who: "Stable income, clear long-term plans, strong goal to own property.",
    recommendations:
      "Save 20–30% monthly, avoid new debt, use low-risk savings accounts.",
    risks: "Burnout from over-saving and missing investment opportunities.",
    focus: "Saving & Stability",
    route: "/property",
  },
  balanced: {
    name: "Balanced Lifestyle",
    explanation: "Grow wealth steadily while maintaining your lifestyle.",
    tradeoffs: "Slower long-term wealth growth.",
    who: "People who want balance between enjoying life and building wealth.",
    recommendations:
      "Invest consistently, save 10–20%, manage spending consciously.",
    risks: "Lifestyle creep and delayed major financial milestones.",
    focus: "Flexibility & Investing",
    route: "/balanced",
  },
  foundation: {
    name: "Foundation Builder",
    explanation: "Focus on financial basics like saving and budgeting.",
    tradeoffs: "Slower progress toward large goals.",
    who: "Beginners, inconsistent income, or no savings.",
    recommendations: "Build emergency fund, track spending, stabilise income.",
    risks: "Delaying investing too long.",
    focus: "Emergency Funds & Basics",
    route: "/foundation",
  },
  correction: {
    name: "Lifestyle Correction",
    explanation: "Fix spending habits and reduce debt.",
    tradeoffs: "Requires strict discipline.",
    who: "People with debt or poor financial habits.",
    recommendations: "Pay off high-interest debt, cut expenses, avoid credit.",
    risks: "Hard to maintain discipline long-term.",
    focus: "Behavioural Change",
    route: "/correction",
  },
  catchup: {
    name: "Catch-Up Wealth",
    explanation: "Aggressive saving and debt elimination for those who need to accelerate their financial progress.",
    tradeoffs: "Requires significant lifestyle sacrifice in the short term.",
    who: "People behind on savings or with high debt loads needing fast recovery.",
    recommendations: "Eliminate all non-essential spending, attack highest-interest debt first, automate savings.",
    risks: "Burnout and unsustainable habits if not managed carefully.",
    focus: "Debt Elimination & Rapid Saving",
    route: "/catchup",
  },
};

const trackOrder = ["correction", "foundation", "balanced", "property", "catchup"];

const trackLabels = {
  correction: "Correction",
  foundation: "Foundation",
  balanced: "Balanced",
  property: "Property",
  catchup: "Catch-Up",
};

const icons = {
  property:   <Home size={20} />,
  balanced:   <TrendingUp size={20} />,
  foundation: <Shield size={20} />,
  correction: <Scale size={20} />,
  catchup:    <Zap size={20} />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StrategyTrack() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [showPopup, setShowPopup] = useState(false);
  const [newTrack, setNewTrack] = useState(null);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  const selectedTrack = user?.strategy;
  const currentIndex = trackOrder.indexOf(user?.strategy);

  // ── Recommendation ──────────────────────────────────────────────────────────

  const getRecommendedTrack = () => {
    if (!user) return null;
    if (user.debt > 0)
      return {
        track: "correction",
        reason:
          "You currently have debt. Reducing it should be your first priority before building wealth.",
      };
    if (!user.savings || user.savings < 10000)
      return {
        track: "foundation",
        reason:
          "You don't yet have a strong financial safety net. Building savings will protect you.",
      };
    if (user.goal === "buy_home")
      return {
        track: "property",
        reason:
          "You want to buy a home, so focusing on saving for a deposit is the smartest move.",
      };
    return {
      track: "balanced",
      reason:
        "You're in a stable position, so balancing lifestyle and investing makes sense.",
    };
  };

  const recommendation = getRecommendedTrack();
  const recommendedTrack = recommendation?.track;

  // ── Analysis ────────────────────────────────────────────────────────────────

  const getTrackAnalysis = () => {
    if (!user) return { confidence: 70, reasons: [], risks: [] };
    let confidence = 70;
    const reasons = [];
    const risks = [];

    if (user.debt > 0) {
      reasons.push("You have outstanding debt");
      risks.push("Debt slows wealth building");
      confidence += 10;
    }
    if (!user.savings || user.savings < 10000) {
      reasons.push("Your savings buffer is low");
      risks.push("You lack financial protection");
      confidence += 10;
    }
    if (user.goal === "buy_home") {
      reasons.push("You want to purchase property");
      confidence += 10;
    }
    if (user.savings > 50000 && user.debt === 0) {
      reasons.push("You are financially stable");
    }
    return { confidence: Math.min(confidence, 95), reasons, risks };
  };

  const analysis = getTrackAnalysis();

  // ── Future simulation ───────────────────────────────────────────────────────

  const simulateFuture = () => {
    if (!user) return null;
    const baseSavings = user.savings || 0;
    const monthly = (user.netSalary || user.salary) * 0.2;
    return {
      property:   Math.round((1000000 - baseSavings) / monthly),
      balanced:   Math.round((1000000 - baseSavings) / (monthly * 0.7)),
      foundation: Math.round((1000000 - baseSavings) / (monthly * 0.5)),
      correction: Math.round((1000000 - baseSavings) / (monthly * 0.3)),
      catchup:    Math.round((1000000 - baseSavings) / (monthly * 0.4)),
    };
  };

  const future = simulateFuture();

  // ── Tour steps ──────────────────────────────────────────────────────────────

  const getFinalSteps = () => {
    const steps = [];

    steps.push({
      text: "These are your financial strategy tracks — each path shapes your future differently.",
      target: "track-header",
    });

    if (recommendedTrack) {
      steps.push({
        text: `Based on your finances, we recommend the ${tracks[recommendedTrack].name}.`,
        target: "recommended",
      });
    }

    if (analysis?.reasons?.length) {
      steps.push({
        text: `This is because: ${analysis.reasons.slice(0, 2).join(", ")}.`,
        target: "recommended",
      });
    }

    if (future && recommendedTrack) {
      steps.push({
        text: `Following this path could help you reach your goal in about ${future[recommendedTrack]} months.`,
        target: "recommended",
        highlightStrong: true,
      });
    }

    steps.push({
      text: "You can explore or switch strategies at any time.",
      target: "track-grid",
      action: () => navigate(tracks[recommendedTrack]?.route),
      actionLabel: "View recommended plan",
    });

    return steps;
  };

  const trackTourSteps = getFinalSteps();

  // ── Tour handlers ───────────────────────────────────────────────────────────

  const endTour = () => {
    localStorage.setItem("seenTrackTour", "true");
    setShowTour(false);
    setSpotlight(null);
  };

  const nextStep = () => {
    if (tourStep < trackTourSteps.length - 1) {
      setTourStep((s) => s + 1);
    } else {
      endTour();
    }
  };

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const seen = localStorage.getItem("seenTrackTour");
    if (!seen) setShowTour(true);
  }, []);

  useEffect(() => {
    if (showTour) setTourStep(0);
  }, [user?.salary, user?.expenses, user?.savings]);

  useEffect(() => {
    if (!showTour || tourStep >= trackTourSteps.length) return;

    const step = trackTourSteps[tourStep];
    const el = document.getElementById(step.target);
    if (!el) {
      console.warn("❌ Missing tour target ID:", step.target);
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 10;
      setSpotlight({
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      });
    }, 520);
  }, [tourStep, showTour]);

  useEffect(() => {
    if (!user) return;
    const progression = getTrackProgression(user);
    if (progression?.track && progression.track !== user.strategy) {
      // Only suggest — never auto-change the user's chosen strategy
      setNewTrack(progression.track);
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* ── HEADER ── */}
        <div id="track-header">
          <p className="tracks-eyebrow">Strategy Tracks</p>
          <TypewriterHeading tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} speed={50} />
          <TypewriterHeading tag="p" className="subtitle" text={`You are on the ${tracks[selectedTrack]?.name || "—"} track · explore all paths or jump straight in`} speed={18} delay={900} />
        </div>

        {/* ── YOUR CURRENT TRACK — hero card ── */}
        {selectedTrack ? (
          <div className="current-track-hero" id="current-track">
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
              <button
                className="current-track-btn"
                onClick={() => navigate(tracks[selectedTrack]?.route)}
              >
                Open my track <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="track-card">
            <h3>No track selected</h3>
            <p>Complete setup to choose your financial path.</p>
            <button className="pill" onClick={() => navigate("/setup")}>Go to Setup →</button>
          </div>
        )}

        {/* ── DIVIDER ── */}
        <div className="tracks-section-label">All tracks — explore or switch</div>

        {/* ── TRACK GRID ── */}
        <div className="track-grid" id="track-grid">
          {Object.entries(tracks).map(([key, track]) => {
            const isActive = selectedTrack === key;
            const isRecommended = recommendedTrack === key;
            return (
              <div
                key={key}
                id={isRecommended ? "recommended" : undefined}
                className={`track-card ${isActive ? "active" : ""}`}
              >
                <div className="track-header">
                  <div className="track-icon">{icons[key]}</div>
                  <div>
                    <h3>{track.name}</h3>
                    <p className="track-focus">{track.focus}</p>
                    {isActive && <span className="badge" style={{ background: "#84a794", color: "#020202" }}>Your track</span>}
                    {isRecommended && !isActive && <span className="badge">Recommended</span>}
                  </div>
                </div>
                <p>{track.explanation}</p>
                <div className="explanation-box">
                  <p><strong>Who it's for:</strong> {track.who}</p>
                  <p><strong>Trade-off:</strong> {track.tradeoffs}</p>
                  <p><strong>What to do:</strong> {track.recommendations}</p>
                </div>
                {future && isRecommended && !isActive && (
                  <div className="impact-box">
                    <p>Estimated months to goal: <strong>{future[key]}</strong></p>
                  </div>
                )}
                <div className="btn-row">
                  <button
                    className={`pill ${isActive ? "" : "outline"}`}
                    onClick={() => navigate(track.route)}
                  >
                    {isActive ? "Open track →" : "View →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress popup */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>Progress Update</h3>
              <p>You've progressed to: <strong>{newTrack}</strong></p>
              <button onClick={() => setShowPopup(false)}>Continue →</button>
            </div>
          </div>
        )}
      </div>

      {/* Tour overlay */}
      {showTour && spotlight && (
        <>
          <div
            className="tour-mask-top"
            style={{ top: 0, left: 0, right: 0, height: spotlight.top }}
          />
          <div
            className="tour-mask-bottom"
            style={{
              top: spotlight.top + spotlight.height,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <div
            className="tour-mask-left"
            style={{
              top: spotlight.top,
              left: 0,
              width: spotlight.left,
              height: spotlight.height,
            }}
          />
          <div
            className="tour-mask-right"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              right: 0,
              height: spotlight.height,
            }}
          />

          <div
            className="tour-cutout"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
          />

          <div
            className={`tour-box ${
              trackTourSteps[tourStep]?.tone === "warning" ? "warning" : ""
            }`}
          >
            <p className="tour-counter">
              Step {tourStep + 1} of {trackTourSteps.length}
            </p>

            <p className="tour-text">{trackTourSteps[tourStep]?.text}</p>

            {trackTourSteps[tourStep]?.highlightStrong && (
              <div className="tour-highlight">🚀 This is your fastest path</div>
            )}

            {trackTourSteps[tourStep]?.action && (
              <button
                className="pill"
                style={{ marginTop: 10 }}
                onClick={trackTourSteps[tourStep].action}
              >
                {trackTourSteps[tourStep].actionLabel}
              </button>
            )}

            <div className="tour-actions">
              <button className="pill outline" onClick={endTour}>
                Skip
              </button>
              <button className="pill" onClick={nextStep}>
                {tourStep === trackTourSteps.length - 1 ? "Done" : "Next →"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
