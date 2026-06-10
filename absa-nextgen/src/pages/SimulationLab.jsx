import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, TrendingUp, Scale, CreditCard } from "lucide-react";
import propertySim from "../assets/property-sim.gif";
import carSim from "../assets/car-sim.gif";
import investingSim from "../assets/investing-sim.gif";
import debtSim from "../assets/debt-sim.gif";
import AppNav from "../components/AppNav";
import SlideIn from "../components/SlideIn";
import { useUser } from "../context/UserContext";
import { getTrackMonthlyAmount } from "../utils/trackAmounts";
import { getCompletedLogMonths, projectCompoundFixedWindow, projectLinearFixedWindow } from "../utils/projections";
import "../styles/simulation.css";
import "../styles/fiveyear.css";

export default function SimulationLab() {
  const navigate   = useNavigate();
  const { user }   = useUser();
  const userTrack  = user?.strategy || "property";

  const monthlyInvest  = getTrackMonthlyAmount(user, userTrack);
  const savingsLogTotal = (user?.savingsLog || [])
    .filter(e => !e.missed && e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const elapsedSavingsMonths = getCompletedLogMonths(user?.savingsLog || []);
  const year5Portfolio = monthlyInvest > 0
    ? userTrack === "balanced"
      ? projectCompoundFixedWindow({
          monthly: monthlyInvest,
          currentSaved: savingsLogTotal,
          elapsedMonths: elapsedSavingsMonths,
          annualRate: 0.10,
        })
      : projectLinearFixedWindow({
          monthly: monthlyInvest,
          currentSaved: savingsLogTotal,
          elapsedMonths: elapsedSavingsMonths,
        })
    : 0;

  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  const tourSteps = [
    { text: "Welcome! Explore simulations to test financial decisions.", target: "header" },
    { text: "Start here — this is your recommended simulation.",           target: "sim-step-0" },
    { text: "Click 'Open Studio' to run the simulation.",                  target: "sim-btn-0" },
    { text: "Compare scenarios and learn from outcomes.",                  target: "sim-step-2" },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("seenTour");
    if (seen) setShowTour(false);
  }, []);

  useEffect(() => {
    if (!showTour) {
      const el = document.getElementById(tourSteps[tourStep]?.target);
      if (el) el.classList.remove("highlight");
      return;
    }
    const step = tourSteps[tourStep];
    const el   = document.getElementById(step.target);
    if (el) {
      el.classList.add("highlight");
      const rect = el.getBoundingClientRect();
      setSpotlight({ top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16 });
      return () => el.classList.remove("highlight");
    }
  }, [tourStep, showTour]);

  const endTour = () => { localStorage.setItem("seenTour", "true"); setShowTour(false); };

  const simulations = [
    {
      id:          "property",
      step:        "Studio 01",
      title:       "Property vs Renting",
      description: "Your landlord is building equity. You're not. But is buying always the right move in your first 5 years?",
      detail:      "Model a R1.8M bond vs R12,000/month rent. See total cost, interest paid, and the equity you'd build — side by side over 5 years.",
      route:       "/simulation/property",
      icon:        Home,
      gif:         propertySim,
    },
    {
      id:          "car",
      step:        "Studio 02",
      title:       "Car vs Invest",
      description: "Every rand you put into a depreciating car is a rand that isn't compounding in a portfolio.",
      detail:      "Set your vehicle price, deposit, and finance rate. See the true opportunity cost of your car choice by Year 5.",
      route:       "/simulation/car",
      icon:        TrendingUp,
      gif:         carSim,
    },
    {
      id:          "investing",
      step:        "Studio 03",
      title:       "Local vs Offshore Investing",
      description: "JSE or global markets? The split you choose today determines where your portfolio is by Year 5.",
      detail:      "Adjust your local/offshore allocation and return assumptions. See how SA CGT, TFSA limits, and rand-hedge exposure shape your outcome.",
      route:       "/simulation/investing",
      icon:        Scale,
      gif:         investingSim,
    },
    {
      id:          "catchup",
      step:        "Studio 04",
      title:       "Debt Payoff vs Invest",
      description: "Should you crush your debt first, or start building wealth now? The answer depends on your rates.",
      detail:      "Compare two strategies: pay debt first then invest, or invest while servicing debt. See the 5-year net worth gap.",
      route:       "/simulation/debt",
      icon:        CreditCard,
      gif:         debtSim,
    },
  ];

  return (
    <div className="simulation-page">
      <AppNav />

      <div className="sim-container">

        {/* HEADER */}
        <div id="header" className="sim-timeline-header">
          <p className="sim-eyebrow">Simulation Lab · 5-Year Journey</p>
          <SlideIn tag="h1" text="Every decision shapes your 5-year outcome" />
          <SlideIn tag="p" className="sim-subtitle" delay={120}
            text="Run scenarios across your first 5 years before committing to a financial choice." />
        </div>

        {/* Y5 BANNER */}
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

        {/* TIMELINE */}
        <div className="sim-timeline" id="list">

          {/* vertical line */}
          <div className="sim-timeline-line" />

          {simulations.map((sim, index) => {
            const isRecommended = sim.id === userTrack ||
              (sim.id === "catchup" && ["catchup", "correction"].includes(userTrack));
            const isLeft = index % 2 === 0; // even = text left, gif right

            return (
              <div
                key={sim.id}
                id={`sim-step-${index}`}
                className={`sim-timeline-step ${isLeft ? "step-left" : "step-right"}`}
              >
                {/* DOT on the line */}
                <div className={`sim-timeline-dot ${isRecommended ? "dot-recommended" : ""}`} />

                {/* TEXT BLOCK */}
                <div className="sim-step-text">
                  {isRecommended && <span className="sim-recommended-badge">Recommended for you</span>}
                  <p className="sim-step-label">{sim.step}</p>
                  <h2 className="sim-step-title">{sim.title}</h2>
                  <p className="sim-step-desc">{sim.description}</p>
                  <p className="sim-step-detail">{sim.detail}</p>
                  <button
                    id={`sim-btn-${index}`}
                    className="sim-step-btn"
                    onClick={() => navigate(sim.route)}
                  >
                    Open Studio →
                  </button>
                </div>

                {/* GIF / MEDIA BLOCK */}
                <div className="sim-step-media">
                  {sim.gif ? (
                    <img
                      src={sim.gif}
                      alt={sim.title}
                      className="sim-step-gif"
                    />
                  ) : (
                    <div className="sim-step-gif-placeholder">
                      <sim.icon size={32} color="#84a794" />
                      <p>gif coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* TOUR OVERLAY */}
      {showTour && spotlight && (
        <div className="tour-overlay">
          <div className="spotlight" style={{ top: spotlight.top, left: spotlight.left, width: spotlight.width, height: spotlight.height }} />
          <div className="tour-box">
            <p>{tourSteps[tourStep].text}</p>
            <div className="tour-actions">
              <button onClick={endTour}>Skip</button>
              <button onClick={() => { tourStep < tourSteps.length - 1 ? setTourStep(tourStep + 1) : endTour(); }}>
                {tourStep === tourSteps.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
