import { useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";

export default function SimNudge({ track }) {
  const navigate = useNavigate();

  const messages = {
    property:   "Run the Property vs Renting Studio — see if buying actually beats renting over your first 5 years.",
    balanced:   "Run the Local vs Offshore Studio — see which allocation grows your portfolio fastest over 5 years.",
    catchup:    "Run the Debt vs Invest Studio — find out whether clearing debt or investing first wins by Year 5.",
    correction: "Run the Debt vs Invest Studio — model whether paying off debt or investing delivers more by Year 5.",
  };

  const message = messages[track] || "Test financial decisions before you make them — see your 5-year outcome.";

  return (
    <div className="sim-nudge" onClick={() => navigate("/simulation")}>
      <div className="sim-nudge-icon">
        <FlaskConical size={18} />
      </div>
      <div className="sim-nudge-body">
        <p className="sim-nudge-label">Simulation Lab</p>
        <p className="sim-nudge-text">{message}</p>
      </div>
      <span className="sim-nudge-cta">Try it →</span>
    </div>
  );
}
