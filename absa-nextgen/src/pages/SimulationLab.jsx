import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, TrendingUp, Scale } from "lucide-react";
import AppNav from "../components/AppNav";
import SlideIn from "../components/SlideIn";
import { useUser } from "../context/UserContext";
import "../styles/simulation.css";
import "../styles/fiveyear.css";

function SimulationCard({ sim, navigate, isRecommended, index }) {
  const Icon = sim.icon;

  return (
    <div
      id={`card-${index}`}
      className={`simulation-card clickable ${isRecommended ? "recommended" : ""}`}
      onClick={() => navigate(sim.route)}
    >
      <div className="sim-left">
        <div className="sim-icon-wrap">
          <Icon size={20} />
        </div>
        <div className="sim-info">
          <span className="sim-y5-tag">5-Year Impact</span>
          <h3>{sim.title}</h3>
          <p className="sim-desc">{sim.description}</p>
          <p className="sim-detail">{sim.detail}</p>
        </div>
      </div>

      <button
        id={`button-${index}`}
        className="sim-btn"
        onClick={(e) => { e.stopPropagation(); navigate(sim.route); }}
      >
        Open Studio →
      </button>
    </div>
  );
}

export default function SimulationLab() {
  const navigate = useNavigate();
  const { user } = useUser();
  const userTrack = user?.strategy || "property";

  // 5-year projection from user's current financials
  const monthlyNet = Math.max((Number(user?.netSalary || user?.salary) || 0) - (Number(user?.expenses) || 0), 0);
  const monthlyInvest = Math.round(monthlyNet * 0.2);
  const r = 0.10 / 12;
  const year5Portfolio = monthlyInvest > 0
    ? Math.round((Number(user?.savings) || 0) + monthlyInvest * ((Math.pow(1 + r, 60) - 1) / r))
    : 0;

  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(true);
  const [spotlight, setSpotlight] = useState(null);

  const tourSteps = [
    {
      text: "Welcome 👋 Explore simulations to test financial decisions.",
      target: "header",
    },
    {
      text: "Start here — this is your recommended simulation.",
      target: "card-0",
    },
    { text: "Click 'Open Studio' to run the simulation.", target: "button-0" },
    { text: "Compare scenarios and learn from outcomes.", target: "list" },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (seen) setShowTour(false);
  }, []);

  useEffect(() => {
    const step = tourSteps[tourStep];
    const el = document.getElementById(step.target);
    if (el) {
      el.classList.add("highlight");
      const rect = el.getBoundingClientRect();
      setSpotlight({
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      });
      return () => el.classList.remove("highlight");
    }
  }, [tourStep]);

  const endTour = () => {
    localStorage.setItem("seenTour", "true");
    setShowTour(false);
  };

  const simulations = [
    {
      id: "property",
      title: "Property vs Renting",
      description: "What does buying vs renting cost over your first 5 years?",
      detail: "R1.8M bond vs R12,000 rent — see the 5-year cost gap",
      route: "/simulation/property",
      icon: Home,
    },
    {
      id: "car",
      title: "Car vs Invest",
      description: "If you invest instead of buying a car, where are you at Year 5?",
      detail: "R600,000 car vs compounding portfolio — opportunity cost over 5 years",
      route: "/simulation/car",
      icon: TrendingUp,
    },
    {
      id: "investing",
      title: "Local vs Offshore Investing",
      description: "Which allocation builds more wealth over 5 years?",
      detail: "JSE vs global portfolio — projected Year 5 outcome by split",
      route: "/simulation/investing",
      icon: Scale,
    },
  ];

  return (
    <div className="simulation-page">
      <AppNav />

      <div className="sim-container">
        <div id="header">
          <p className="sim-eyebrow">Simulation Lab · 5-Year Journey</p>
          <SlideIn tag="h1" text="Every decision shapes your 5-year outcome" />
          <SlideIn tag="p" className="sim-subtitle" delay={120} text="Run scenarios across your first 5 years before committing to a financial choice." />
        </div>

        {/* 5-YEAR JOURNEY BANNER */}
        {year5Portfolio > 0 && (
          <div className="sim-y5-banner">
            <div className="sim-y5-banner-left">
              <p className="sim-y5-banner-eyebrow">Your Year 5 Projection</p>
              <p className="sim-y5-banner-title">R{year5Portfolio.toLocaleString("en-ZA")}</p>
              <p className="sim-y5-banner-sub">
                at R{monthlyInvest.toLocaleString("en-ZA")}/month invested · {user?.strategy ? user.strategy.charAt(0).toUpperCase() + user.strategy.slice(1) : "—"} track
              </p>
            </div>
            <p style={{ color: "#8a9a96", fontSize: "0.82rem", maxWidth: 280, margin: 0 }}>
              Use these simulations to see how today's decisions — property, car, investments — change this number by Year 5.
            </p>
          </div>
        )}

        <section className="simulation-list" id="list">
          {simulations.map((sim, index) => (
            <SimulationCard
              key={sim.id}
              sim={sim}
              index={index}
              navigate={navigate}
              isRecommended={sim.id === userTrack}
            />
          ))}
        </section>

        {showTour && spotlight && (
          <div className="tour-overlay">
            <div
              className="spotlight"
              style={{
                top: spotlight.top,
                left: spotlight.left,
                width: spotlight.width,
                height: spotlight.height,
              }}
            />
            <div className="tour-box">
              <p>{tourSteps[tourStep].text}</p>
              <div className="tour-actions">
                <button onClick={endTour}>Skip</button>
                <button
                  onClick={() => {
                    if (tourStep < tourSteps.length - 1) {
                      setTourStep(tourStep + 1);
                    } else {
                      endTour();
                    }
                  }}
                >
                  {tourStep === tourSteps.length - 1 ? "Done" : "Next"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
