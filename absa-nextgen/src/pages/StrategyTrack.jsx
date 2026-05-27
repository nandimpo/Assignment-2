import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";

const tracks = {
  property: {
    name: "Property Path",
    explanation:
      "Save aggressively for a home deposit within 3–5 years by prioritising stability and disciplined saving.",
    tradeoffs: "Less lifestyle flexibility and reduced discretionary spending.",
    route: "/property",
  },

  balanced: {
    name: "Balanced Lifestyle",
    explanation:
      "Maintain your lifestyle while gradually building wealth through saving and investing.",
    tradeoffs: "Slower long-term wealth accumulation.",
    route: "/balanced", // ✅ FIXED
  },

  foundation: {
    name: "Foundation Builder",
    explanation:
      "Focus on building financial stability through emergency savings and budgeting.",
    tradeoffs: "Slower progress toward large goals like property ownership.",
    route: "/foundation", // ✅ FIXED
  },

  correction: {
    name: "Lifestyle Correction",
    explanation:
      "Rebalance your finances by reducing debt and adjusting spending habits.",
    tradeoffs: "Requires strict discipline and short-term sacrifices.",
    route: "/correction", // ✅ FIXED
  },
};

export default function StrategyTrack() {
  const navigate = useNavigate();
  const { user } = useUser();

  const selectedTrack = user?.strategy;

  return (
    <div className="track-page">
      <AppNav />

      <div className="container">
        <h1>Strategy Tracks</h1>
        <p className="muted">
          Explore different financial paths and understand their trade-offs.
        </p>

        {/* 🔒 CURRENT STRATEGY (FORCED FLOW) */}
        {selectedTrack && (
          <div className="card highlight">
            <h3>Your Current Strategy</h3>
            <p>
              You are currently on the{" "}
              <strong>{tracks[selectedTrack]?.name}</strong> track.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate(tracks[selectedTrack]?.route || "/home")}
            >
              Continue your track →
            </button>
          </div>
        )}

        {/* ❗ NO TRACK SELECTED */}
        {!selectedTrack && (
          <div className="card warning">
            <h3>No Strategy Selected</h3>
            <p>Please complete setup to choose your financial path.</p>
            <button onClick={() => navigate("/setup")}>Go to Setup →</button>
          </div>
        )}

        {/* 🧠 TRACK OPTIONS */}
        <div className="track-grid">
          {Object.entries(tracks).map(([key, track]) => {
            const isActive = selectedTrack === key;

            return (
              <div
                key={key}
                className={`track-card ${isActive ? "active" : ""}`}
              >
                <h3>{track.name}</h3>

                <p className="track-explanation">{track.explanation}</p>

                <p className="track-tradeoff">
                  <strong>Trade-off:</strong> {track.tradeoffs}
                </p>

                {isActive ? (
                  <button className="primary-btn" disabled>
                    Current Track
                  </button>
                ) : (
                  <button
                    className="secondary-btn"
                    onClick={() => navigate(track.route)}
                  >
                    Preview Path →
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
