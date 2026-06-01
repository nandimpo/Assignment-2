import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, TrendingUp, Scale } from "lucide-react";
import AppNav from "../components/AppNav";
import "../styles/simulation.css";

function SimulationCard({ sim, navigate, isRecommended, index }) {
  const Icon = sim.icon;
  const [step, setStep] = useState(0);
  const steps = ["Adjust variables", "See outcomes", "Get insights"];

  useEffect(() => {
    if (step === 0) console.log("User adjusting inputs");
    if (step === 1) console.log("User viewing results");
    if (step === 2) console.log("User reading insights");
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < 2) setStep(step + 1);
    }, 4000);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div
      id={`card-${index}`}
      className={`simulation-card clickable ${isRecommended ? "recommended" : ""}`}
    >
      <div className="sim-left">
        <Icon size={24} className="sim-icon" />
        <div>
          <h3>{sim.title}</h3>
          <p className="sim-desc">{sim.description}</p>
          <p className="sim-detail">{sim.detail}</p>
        </div>
      </div>

      <button
        id={`button-${index}`}
        className="sim-btn"
        onClick={() => navigate(sim.route)}
      >
        Open Studio →
      </button>

      <div className="tooltip-box">
        <h4>What you'll learn</h4>
        <p>
          Explore the financial impact of this decision over time using real
          scenarios.
        </p>
        <span>Click to simulate →</span>
      </div>

      <p className="onboarding-text">
        {step === 0 && "Start by adjusting your scenario."}
        {step === 1 && "Watch how your decisions impact outcomes."}
        {step === 2 && "Use insights to make smarter financial choices."}
      </p>

      <section className="how-it-works-bar interactive">
        {steps.map((label, i) => (
          <div
            key={i}
            className={`step ${step === i ? "active" : ""}`}
            onClick={() => setStep(i)}
          >
            <span className="step-number">{i + 1}</span>
            <span>{label}</span>
            {i < steps.length - 1 && <span className="arrow">→</span>}
          </div>
        ))}
      </section>
    </div>
  );
}

export default function SimulationLab() {
  const navigate = useNavigate();
  const userTrack = "property"; // later dynamic

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
      description: "Compare buying vs. renting over 5 years",
      detail: "R1.8 million house vs R12,000 rent",
      route: "/simulation/property",
      icon: Home,
    },
    {
      id: "car",
      title: "Car vs Invest",
      description: "Compare buying a R600,000 car vs investing",
      detail: "Understand opportunity cost",
      route: "/simulation/car",
      icon: TrendingUp,
    },
    {
      id: "investing",
      title: "Local vs Offshore Investing",
      description: "Compare SA vs global portfolio growth",
      detail: "Diversification & currency exposure",
      route: "/simulation/investing",
      icon: Scale,
    },
  ];

  return (
    <div className="simulation-page">
      <AppNav />

      <div className="sim-container">
        <section className="simulation-header" id="header">
          <h1>Simulation Lab</h1>
          <p>Test your decisions before making them</p>
        </section>

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
