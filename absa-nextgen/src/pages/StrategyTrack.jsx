import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import { Home, TrendingUp, Shield, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { getTrackProgression } from "../utils/trackProgression";

// ================= TRACK DATA (static — safe at module level) =================
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
};

// FIX 1: Declared once at module level (was duplicated before)
const trackOrder = ["correction", "foundation", "balanced", "property"];

// FIX 2: trackLabels was used but never defined
const trackLabels = {
  correction: "Correction",
  foundation: "Foundation",
  balanced: "Balanced",
  property: "Property",
};

export default function StrategyTrack() {
  const navigate = useNavigate();
  const { user, updateUser, setUser, updateProfile } = useUser();
  // FIX: updateUser may be named differently in your context — fall back gracefully
  const applyTrackUpdate = updateUser ?? setUser ?? updateProfile ?? (() => {});

  // FIX 3: All hooks moved inside the component (they were at module level before, causing the crash)
  const [showPopup, setShowPopup] = useState(false);
  const [newTrack, setNewTrack] = useState(null);

  const selectedTrack = user?.strategy;
  const currentIndex = trackOrder.indexOf(user?.strategy);

  useEffect(() => {
    if (!user) return;

    const progression = getTrackProgression(user);

    if (progression?.track && progression.track !== user.strategy) {
      applyTrackUpdate({ strategy: progression.track });
      setNewTrack(progression.track);
      setShowPopup(true);
    }
  }, [user]);

  // ================= RECOMMENDATION LOGIC =================
  const getRecommendedTrack = () => {
    if (!user) return null;

    if (user.debt > 0) {
      return {
        track: "correction",
        reason:
          "You currently have debt. Reducing it should be your first priority before building wealth.",
      };
    }

    if (!user.savings || user.savings < 10000) {
      return {
        track: "foundation",
        reason:
          "You don't yet have a strong financial safety net. Building savings will protect you.",
      };
    }

    if (user.goal === "buy_home") {
      return {
        track: "property",
        reason:
          "You want to buy a home, so focusing on saving for a deposit is the smartest move.",
      };
    }

    return {
      track: "balanced",
      reason:
        "You're in a stable position, so balancing lifestyle and investing makes sense.",
    };
  };

  const recommendation = getRecommendedTrack();
  const recommendedTrack = recommendation?.track;

  // ================= ICONS =================
  const icons = {
    property: <Home size={20} />,
    balanced: <TrendingUp size={20} />,
    foundation: <Shield size={20} />,
    correction: <Scale size={20} />,
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        <h1>Strategy Tracks</h1>
        <p className="muted">
          Explore different financial paths and understand their trade-offs.
        </p>

        {/* ================= TRACK PROGRESSION BAR ================= */}
        <div className="progression-bar">
          {trackOrder.map((track, i) => (
            <div
              key={track}
              className={`step ${i <= currentIndex ? "active" : ""}`}
            >
              {trackLabels[track]}
            </div>
          ))}
        </div>

        {/* ================= PROGRESS POPUP ================= */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>🎉 Progress Update</h3>
              <p>
                You've progressed to a new stage:
                <strong> {newTrack}</strong>
              </p>
              <button onClick={() => setShowPopup(false)}>Continue →</button>
            </div>
          </div>
        )}

        {/* ================= NO STRATEGY SELECTED ================= */}
        {!selectedTrack && (
          <div className="card warning">
            <h3>No Strategy Selected</h3>
            <p>Please complete setup to choose your financial path.</p>
            <button onClick={() => navigate("/setup")}>Go to Setup →</button>
          </div>
        )}

        {/* ================= CURRENT TRACK ================= */}
        {selectedTrack && (
          <div className="card highlight">
            <h3>Your Current Strategy</h3>
            <p>
              You are on <strong>{tracks[selectedTrack]?.name}</strong>
            </p>
            <button
              className="primary-btn"
              onClick={() => navigate(tracks[selectedTrack]?.route || "/home")}
            >
              Continue →
            </button>
          </div>
        )}

        {/* ================= TRACK GRID ================= */}
        <div className="track-grid">
          {Object.entries(tracks).map(([key, track]) => {
            const isActive = selectedTrack === key;
            const isRecommended = recommendedTrack === key;

            return (
              <div
                key={key}
                className={`track-card ${isActive ? "active" : ""}`}
              >
                {/* HEADER */}
                <div className="track-header">
                  <div className="icon">{icons[key]}</div>

                  <div>
                    <h3>{track.name}</h3>

                    {isRecommended && (
                      <>
                        <span className="badge">Recommended</span>
                        <p className="recommendation-reason">
                          {recommendation?.reason}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <p className="explanation">{track.explanation}</p>

                <div className="track-details">
                  <p>
                    <strong>Focus:</strong> {track.focus}
                  </p>
                  <p>
                    <strong>Who it's for:</strong> {track.who}
                  </p>
                  <p>
                    <strong>Trade-off:</strong> {track.tradeoffs}
                  </p>
                  <p>
                    <strong>What to do:</strong> {track.recommendations}
                  </p>
                  <p>
                    <strong>Risk:</strong> {track.risks}
                  </p>
                </div>

                {/* BUTTON */}
                {isActive ? (
                  <button className="primary-btn" disabled>
                    Current Track
                  </button>
                ) : (
                  <button
                    className="secondary-btn"
                    onClick={() => navigate(track.route)}
                  >
                    View →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
