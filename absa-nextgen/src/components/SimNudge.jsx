import { useNavigate } from "react-router-dom";
import { ArrowRight, FlaskConical, Home, LineChart, PiggyBank } from "lucide-react";

const studioConfig = {
  property: {
    route: "/simulation/property",
    label: "Property Studio",
    title: "Property vs Renting",
    text: "Test whether buying beats renting across your first 5 years.",
    Icon: Home,
  },
  balanced: {
    route: "/simulation/investing",
    label: "Investing Studio",
    title: "Local vs Offshore",
    text: "Compare portfolio allocations before you commit your monthly investment.",
    Icon: LineChart,
  },
  catchup: {
    route: "/simulation/debt",
    label: "Debt Studio",
    title: "Debt vs Invest",
    text: "See whether clearing debt or investing first creates the better Year 5 outcome.",
    Icon: PiggyBank,
  },
  correction: {
    route: "/simulation/debt",
    label: "Debt Studio",
    title: "Debt vs Invest",
    text: "Model your reset plan and see how debt reduction changes your timeline.",
    Icon: PiggyBank,
  },
};

export default function SimNudge({ track }) {
  const navigate = useNavigate();
  const config = studioConfig[track] || {
    route: "/simulation",
    label: "Simulation Lab",
    title: "Decision Studio",
    text: "Test your financial decision before you make it.",
    Icon: FlaskConical,
  };
  const Icon = config.Icon;

  return (
    <button className="sim-nudge" type="button" onClick={() => navigate(config.route)}>
      <span className="sim-nudge-glow" />
      <span className="sim-nudge-icon">
        <Icon size={17} strokeWidth={1.8} />
      </span>
      <span className="sim-nudge-body">
        <span className="sim-nudge-label">{config.label}</span>
        <span className="sim-nudge-title">{config.title}</span>
        <span className="sim-nudge-text">{config.text}</span>
      </span>
      <span className="sim-nudge-cta">
        Try studio <ArrowRight size={14} strokeWidth={2} />
      </span>
    </button>
  );
}
