import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tour from "../components/Tour";
import AppNav from "../components/AppNav";
import "../styles/home.css";
import TypewriterHeading from "../components/TypewriterHeading";
import { Home as HomeIcon, Scale, Shield, RefreshCw, Building2, TrendingUp, CreditCard, Target, GraduationCap } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const net = income - expenses;

  const safeIncome = income > 0 ? income : 1;
  const savingsRate = Math.round((net / safeIncome) * 100);

  let nextStep = "Move closer to your 5-year goal";
  if (!user?.strategy) nextStep = "Choose your financial strategy";
  else if (!user?.salary) nextStep = "Add your income details";
  else if (!user?.expenses) nextStep = "Track your monthly expenses";

  const tourSteps = [
    {
      text: "Welcome — this is your financial dashboard.",
      target: "home-header",
    },
    { text: "This shows your next financial action.", target: "next-step" },
    {
      text: "Your financial health score updates as you improve.",
      target: "health",
    },
    {
      text: "Here's your income, expenses, and net position.",
      target: "stats",
    },
    { text: "This is your current strategy track.", target: "tracks" },
  ];

  const [nudgeType, setNudgeType] = useState("positive");

  useEffect(() => {
    if (savingsRate < 20) setNudgeType("warning");
    else setNudgeType("positive");
  }, [savingsRate]);

  let healthScore = 50;
  if (savingsRate >= 30) healthScore = 90;
  else if (savingsRate >= 20) healthScore = 75;
  else if (savingsRate >= 10) healthScore = 60;
  else healthScore = 40;

  let healthLabel = "Moderate";
  if (healthScore >= 80) healthLabel = "Excellent";
  else if (healthScore >= 65) healthLabel = "Good";
  else if (healthScore < 50) healthLabel = "Needs Attention";

  const trackDetails = {
    property: {
      explanation:
        "This track focuses on aggressively saving toward a home deposit within 3–5 years by prioritising stability and reducing unnecessary spending.",
      tradeoffs:
        "You will limit lifestyle spending and flexibility in order to reach your property goal faster.",
    },
    balanced: {
      explanation:
        "This track balances saving and investing while maintaining your current lifestyle.",
      tradeoffs:
        "You gain flexibility and lifestyle comfort, but your long-term goals may take longer to achieve.",
    },
    foundation: {
      explanation:
        "This track focuses on building a strong financial base through emergency savings and essential budgeting.",
      tradeoffs:
        "Progress toward large goals like property will be slower while you stabilise your finances.",
    },
    correction: {
      explanation:
        "This track helps you reduce debt and rebalance your spending habits.",
      tradeoffs:
        "Requires strict discipline and reduced spending in the short term to improve long-term health.",
    },
  };

  return (
    <div className="home">
      <AppNav />

      <div className="container">
        {/* HEADER */}
        <section className="home-header fade-in" id="home-header">
          <TypewriterHeading tag="h2" text={`Welcome back, ${user?.name || "User"}`} speed={50} />
          <p>
            You are on the{" "}
            <span className="accent">{user?.strategy || "Property"}</span> track
          </p>
        </section>

        {/* NEXT STEP */}
        <section className="next-step fade-in" id="next-step">
          <div>
            <p className="label">Next Step</p>
            <h3>{nextStep}</h3>
          </div>
          <button className="primary-btn" onClick={() => navigate("/strategy")}>
            Continue →
          </button>
        </section>

        {/* HEALTH */}
        <section className="health-card fade-in" id="health">
          <div className="score-ring">{healthScore}</div>
          <div>
            <h3>
              Financial Health
              <span className="info-hover">
                ⓘ
                <div className="tooltip">
                  Based on:
                  <br />• Savings rate
                  <br />• Spending behaviour
                  <br />• Setup progress
                </div>
              </span>
            </h3>
            <p className="muted">{healthLabel}</p>
          </div>
        </section>

        {/* STATS */}
        <section className="stats fade-in" id="stats">
          <div className="stat">
            <p>Monthly income</p>
            <h3>R{income.toLocaleString("en-ZA")}</h3>
          </div>
          <div className="stat">
            <p>Fixed Costs</p>
            <h3>R{expenses.toLocaleString("en-ZA")}</h3>
          </div>
          <div
            className="stat highlight clickable"
            onClick={() => navigate("/money")}
          >
            <p>Net Position</p>
            <h3>R{net.toLocaleString("en-ZA")}</h3>
            <span>View breakdown →</span>
          </div>
        </section>

        {/* GOAL */}
        <section className="goal-card fade-in" id="goal">
          {{
            property:   <p className="muted">Your Deposit Plan</p>,
            balanced:   <p className="muted">Your Investment Goal</p>,
            catchup:    <p className="muted">Debt Elimination Target</p>,
            correction: <p className="muted">Lifestyle Correction Goal</p>,
          }[user?.strategy] || <p className="muted">Your Financial Goal</p>}
          <h3>R{(user?.strategy === "property"
            ? user?.depositAmount
            : user?.goalAmount
          )?.toLocaleString("en-ZA") || 0}</h3>
          {user?.strategy === "property" && (
            <span className="muted">{user?.depositPercent || 0}% of home value</span>
          )}
          <br />
          <span className="muted">{user?.monthsToGoal || 0} months to reach</span>
        </section>

        {/* NUDGE */}
        <section className={`nudge ${nudgeType} fade-in`} id="nudge">
          <p>
            {nudgeType === "positive"
              ? `You're saving ${savingsRate}% — strong position`
              : `Your savings rate is ${savingsRate}% — consider reducing expenses`}
          </p>
        </section>

        {/* HERO */}
        <section className="hero-row fade-in" id="hero">
          <div>
            <TypewriterHeading tag="h2" text="Take control of your financial future" speed={40} delay={200} />
            <p className="muted">
              Track, simulate, and move forward with clarity.
            </p>
          </div>
          <button className="primary-btn" onClick={() => navigate("/money")}>
            View Money →
          </button>
        </section>

        {/* SIMULATIONS */}
        <section className="simulation-box fade-in" id="simulations">
          <h3>Your Simulations</h3>
          <p className="empty">No simulations yet — start exploring</p>
        </section>

        {/* FEATURES */}
        <section className="feature-row fade-in" id="features">
          <div className="feature-card" onClick={() => navigate("/money")}>
            <h3>Money Snapshot</h3>
            <p>See your financial position</p>
          </div>
          <div className="feature-card" onClick={() => navigate("/strategy")}>
            <h3>Strategy Track</h3>
            <p>Plan your next 5 years</p>
          </div>
          <div className="feature-card" onClick={() => navigate("/simulation")}>
            <h3>Simulation Lab</h3>
            <p>Test decisions</p>
          </div>
        </section>

        {/* STRATEGY TRACKS PREVIEW */}
        <section className="preview-section fade-in" id="tracks">
          <div className="preview-header">
            <div>
              <h3>Strategy Tracks</h3>
              <p className="muted">
                Pathways built around your goals &amp; life stage
              </p>
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate("/strategy")}
            >
              View Tracks →
            </button>
          </div>

          <div className="preview-grid">
            <div
              className={`preview-card available ${user?.strategy === "property" ? "active-track" : ""}`}
              onClick={() => navigate("/strategy")}
            >
              <div className="preview-card-icon"><HomeIcon size={20} strokeWidth={1.5} /></div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">First Property Path</span>
                  <span className={`badge ${user?.strategy === "property" ? "active-badge" : "available-badge"}`}>{user?.strategy === "property" ? "Active" : "Available"}</span>
                </div>
                <p className="preview-card-sub">
                  Save for a home deposit in 3–5 years
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Saving &amp; Stability
                </p>
                <p className="preview-card-extra">
                  {trackDetails.property.explanation}
                </p>
                <p className="preview-card-tradeoff">
                  Trade-off: {trackDetails.property.tradeoffs}
                </p>
              </div>
            </div>

            <div
              className={`preview-card available ${user?.strategy === "balanced" ? "active-track" : ""}`}
              onClick={() => navigate("/strategy")}
            >
              <div className="preview-card-icon"><Scale size={20} strokeWidth={1.5} /></div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">
                    Balanced Lifestyle &amp; Investing
                  </span>
                  <span className={`badge ${user?.strategy === "balanced" ? "active-badge" : "available-badge"}`}>{user?.strategy === "balanced" ? "Active" : "Available"}</span>
                </div>
                <p className="preview-card-sub">
                  Maintain your lifestyle while building wealth
                </p>
                <p className="preview-card-focus">
                  <span className="label">Focus</span> Flexibility &amp;
                  Investing
                </p>
                <p className="preview-card-extra">
                  {trackDetails.balanced.explanation}
                </p>
                <p className="preview-card-tradeoff">
                  Trade-off: {trackDetails.balanced.tradeoffs}
                </p>
              </div>
            </div>

            <div
              className={`preview-card available ${user?.strategy === "foundation" ? "active-track" : ""}`}
              onClick={() => navigate("/strategy")}
            >
              <div className="preview-card-icon"><Shield size={20} strokeWidth={1.5} /></div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">Foundation Builder</span>
                  <span className={`badge ${user?.strategy === "foundation" ? "active-badge" : "available-badge"}`}>{user?.strategy === "foundation" ? "Active" : "Available"}</span>
                </div>
                <p className="preview-card-sub">Build financial stability from scratch</p>
                <p className="preview-card-focus"><span className="label">Focus</span> Emergency Funds &amp; Basics</p>
                <p className="preview-card-extra">{trackDetails.foundation.explanation}</p>
                <p className="preview-card-tradeoff">Trade-off: {trackDetails.foundation.tradeoffs}</p>
              </div>
            </div>

            <div
              className={`preview-card available ${user?.strategy === "correction" || user?.strategy === "catchup" ? "active-track" : ""}`}
              onClick={() => navigate("/strategy")}
            >
              <div className="preview-card-icon"><RefreshCw size={20} strokeWidth={1.5} /></div>
              <div className="preview-card-body">
                <div className="preview-card-title-row">
                  <span className="preview-card-name">Lifestyle Correction</span>
                  <span className={`badge ${user?.strategy === "correction" || user?.strategy === "catchup" ? "active-badge" : "available-badge"}`}>{user?.strategy === "correction" || user?.strategy === "catchup" ? "Active" : "Available"}</span>
                </div>
                <p className="preview-card-sub">Rebalance spending and reduce debt</p>
                <p className="preview-card-focus"><span className="label">Focus</span> Behavioural Change</p>
                <p className="preview-card-extra">{trackDetails.correction.explanation}</p>
                <p className="preview-card-tradeoff">Trade-off: {trackDetails.correction.tradeoffs}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATIONS PREVIEW */}
        <section className="preview-section fade-in">
          <div className="preview-header">
            <div>
              <h3>Simulation Lab</h3>
              <p className="muted">
                Test financial decisions before you make them
              </p>
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate("/simulation")}
            >
              Open Lab →
            </button>
          </div>

          <div className="sim-preview-grid">
            <div
              className="sim-card available"
              onClick={() => navigate("/simulation")}
            >
              <div className="sim-card-top">
                <span className="sim-icon"><Building2 size={20} strokeWidth={1.5} /></span>
                <span className="badge available-badge">Available</span>
              </div>
              <h4>Buy vs Rent</h4>
              <p className="muted">
                Compare the true long-term cost of buying a home vs renting
              </p>
            </div>

            <div
              className="sim-card available"
              onClick={() => navigate("/simulation")}
            >
              <div className="sim-card-top">
                <span className="sim-icon"><TrendingUp size={20} strokeWidth={1.5} /></span>
                <span className="badge available-badge">Available</span>
              </div>
              <h4>Investment Growth</h4>
              <p className="muted">
                Project returns across different asset classes over time
              </p>
            </div>

            <div
              className="sim-card available"
              onClick={() => navigate("/simulation")}
            >
              <div className="sim-card-top">
                <span className="sim-icon"><CreditCard size={20} strokeWidth={1.5} /></span>
                <span className="badge available-badge">Available</span>
              </div>
              <h4>Debt Payoff Planner</h4>
              <p className="muted">Find the fastest path to being debt-free</p>
            </div>

            <div
              className="sim-card available"
              onClick={() => navigate("/simulation")}
            >
              <div className="sim-card-top">
                <span className="sim-icon"><Target size={20} strokeWidth={1.5} /></span>
                <span className="badge available-badge">Available</span>
              </div>
              <h4>Retirement Readiness</h4>
              <p className="muted">
                See if you're on track for the retirement you want
              </p>
            </div>
          </div>
        </section>

        {/* FINANCE SCHOOL ORB */}
        <div
          className="finance-orb"
          onClick={() => navigate("/learn")}
          title="Go to Finance School"
        >
          <GraduationCap size={22} strokeWidth={1.5} />
        </div>
      </div>

      {/* Tour — single source, uses Tour component only */}
      <Tour steps={tourSteps} storageKey="homeTour" />
    </div>
  );
}
