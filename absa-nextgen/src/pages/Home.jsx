import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tour from "../components/Tour";
import AppNav from "../components/AppNav";
import "../styles/home.css";
import TypewriterHeading from "../components/TypewriterHeading";
import { Home as HomeIcon, Scale, Shield, RefreshCw, Building2, TrendingUp, CreditCard, Target, GraduationCap, Info } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const net      = income - expenses;
  const safeIncome  = income > 0 ? income : 1;
  const savingsRate = Math.round((net / safeIncome) * 100);

  let nextStep = "Move closer to your 5-year goal";
  if (!user?.strategy)  nextStep = "Choose your financial strategy";
  else if (!user?.salary)   nextStep = "Add your income details";
  else if (!user?.expenses) nextStep = "Track your monthly expenses";

  const [nudgeType, setNudgeType] = useState("positive");
  useEffect(() => {
    setNudgeType(savingsRate < 20 ? "warning" : "positive");
  }, [savingsRate]);

  let healthScore = 50;
  if (savingsRate >= 30) healthScore = 90;
  else if (savingsRate >= 20) healthScore = 75;
  else if (savingsRate >= 10) healthScore = 60;
  else healthScore = 40;
  let healthLabel = healthScore >= 80 ? "Excellent" : healthScore >= 65 ? "Good" : healthScore >= 50 ? "Moderate" : "Needs Attention";

  const trackNames = {
    property:   "Property Path",
    balanced:   "Balanced Lifestyle",
    foundation: "Foundation Builder",
    correction: "Lifestyle Correction",
    catchup:    "Catch-Up Wealth",
  };

  const trackDetails = {
    property:   { explanation: "Save aggressively toward a home deposit in 3–5 years.", tradeoffs: "Reduced lifestyle flexibility." },
    balanced:   { explanation: "Balance saving and investing while maintaining your lifestyle.", tradeoffs: "Slower long-term goals." },
    foundation: { explanation: "Build a strong financial base through emergency savings and budgeting.", tradeoffs: "Slower progress toward large goals." },
    correction: { explanation: "Reduce debt and rebalance spending habits.", tradeoffs: "Requires strict discipline short-term." },
  };

  const tourSteps = [
    { text: "Welcome — this is your financial dashboard.", target: "home-header" },
    { text: "This shows your next financial action.", target: "next-step" },
    { text: "Your financial health score updates as you improve.", target: "health" },
    { text: "Here's your income, expenses, and net position.", target: "stats" },
    { text: "This is your current strategy track.", target: "tracks" },
  ];

  const strategyTracks = [
    { id: "property",   Icon: HomeIcon,  name: "First Property Path",             sub: "Save for a home deposit in 3–5 years",          focus: "Saving & Stability" },
    { id: "balanced",   Icon: Scale,     name: "Balanced Lifestyle & Investing",  sub: "Maintain your lifestyle while building wealth",  focus: "Flexibility & Investing" },
    { id: "foundation", Icon: Shield,    name: "Foundation Builder",              sub: "Build financial stability from scratch",         focus: "Emergency Funds & Basics" },
    { id: "correction", Icon: RefreshCw, name: "Lifestyle Correction",            sub: "Rebalance spending and reduce debt",             focus: "Behavioural Change" },
  ];

  const simCards = [
    { Icon: Building2,  label: "Buy vs Rent",          desc: "Compare long-term cost of buying vs renting" },
    { Icon: TrendingUp, label: "Investment Growth",     desc: "Project returns across asset classes" },
    { Icon: CreditCard, label: "Debt Payoff Planner",   desc: "Find the fastest path to debt-free" },
    { Icon: Target,     label: "Retirement Readiness",  desc: "See if you're on track for retirement" },
  ];

  return (
    <div className="home">
      <AppNav />

      <div className="home-container">

        {/* ── HEADER ── */}
        <section className="home-header fade-in" id="home-header">
          <TypewriterHeading tag="h2" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} speed={50} />
          <TypewriterHeading tag="p" className="subtitle" text={`You are on the ${trackNames[user?.strategy] || "—"} track`} speed={18} delay={900} />
        </section>

        {/* ── ROW 1: NEXT STEP + HEALTH ── */}
        <div className="home-row fade-in">
          <section className="next-step" id="next-step">
            <div>
              <p className="label">Next Step</p>
              <h3>{nextStep}</h3>
            </div>
            <button className="primary-btn" onClick={() => navigate("/strategy")}>Continue →</button>
          </section>

          <section className="health-card" id="health">
            <div className="score-ring">{healthScore}</div>
            <div>
              <h3 style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Financial Health
                <span className="info-hover" style={{ display: "flex", alignItems: "center" }}>
                  <Info size={14} strokeWidth={1.5} />
                  <div className="tooltip">Based on:<br />• Savings rate<br />• Spending behaviour<br />• Setup progress</div>
                </span>
              </h3>
              <p className="muted">{healthLabel}</p>
            </div>
          </section>
        </div>

        {/* ── ROW 2: STATS ── */}
        <section className="stats fade-in" id="stats">
          <div className="stat">
            <p>Monthly income</p>
            <h3>R{income.toLocaleString("en-ZA")}</h3>
          </div>
          <div className="stat">
            <p>Fixed Costs</p>
            <h3>R{expenses.toLocaleString("en-ZA")}</h3>
          </div>
          <div className="stat highlight clickable" onClick={() => navigate("/money")}>
            <p>Net Position</p>
            <h3>R{net.toLocaleString("en-ZA")}</h3>
            <span className="view-link">View breakdown →</span>
          </div>
        </section>

        {/* ── ROW 3: GOAL + NUDGE ── */}
        <div className="home-row fade-in">
          <section className="goal-card" id="goal">
            {(() => {
              const goalLabels = { property: "Deposit Plan", balanced: "Investment Goal", catchup: "Debt Target", correction: "Correction Goal" };
              const goalLabel = goalLabels[user?.strategy] || "Financial Goal";
              const goalAmount = user?.strategy === "property" ? user?.depositAmount : user?.goalAmount;
              const months = user?.monthsToGoal;
              return (
                <>
                  <span className="label">{goalLabel}</span>
                  <h3 style={{ fontSize: 26, fontWeight: 700, margin: "6px 0 4px" }}>
                    {goalAmount ? `R${Number(goalAmount).toLocaleString("en-ZA")}` : "Not set"}
                  </h3>
                  <p className="muted" style={{ fontSize: 13 }}>
                    {months ? `${months} months to reach` : "Set your goal in Snapshot"}
                  </p>
                  <button className="primary-btn" style={{ marginTop: 12 }} onClick={() => navigate("/money")}>
                    View Snapshot →
                  </button>
                </>
              );
            })()}
          </section>

          <section className={`nudge ${nudgeType} fade-in`} id="nudge">
            <p className="nudge-label">Savings insight</p>
            <p className="nudge-text">
              {nudgeType === "positive"
                ? `You're saving ${savingsRate}% — strong position`
                : `Your savings rate is ${savingsRate}% — consider reducing expenses`}
            </p>
            <p className="nudge-sub muted">
              {nudgeType === "positive"
                ? "Keep contributing consistently and you'll reach your goal faster."
                : "Even a R500/month reduction in expenses can make a significant difference."}
            </p>
          </section>
        </div>

        {/* ── STRATEGY TRACKS ── */}
        <section className="preview-section fade-in" id="tracks">
          <div className="preview-header">
            <div>
              <h3>Strategy Tracks</h3>
              <p className="muted">Pathways built around your goals &amp; life stage</p>
              <button className="primary-btn" style={{ marginTop: 12 }} onClick={() => navigate("/strategy")}>View Tracks →</button>
            </div>
          </div>
          <div className="preview-grid">
            {strategyTracks.map(({ id, Icon, name, sub, focus }) => {
              const isActive = user?.strategy === id || (id === "correction" && user?.strategy === "catchup");
              return (
                <div key={id} className={`preview-card available ${isActive ? "active-track" : ""}`} onClick={() => navigate("/strategy")}>
                  <div className="preview-card-icon"><Icon size={20} strokeWidth={1.5} /></div>
                  <div className="preview-card-body">
                    <div className="preview-card-title-row">
                      <span className="preview-card-name">{name}</span>
                      {isActive && <span className="badge active-badge">Active</span>}
                    </div>
                    <p className="preview-card-sub">{sub}</p>
                    <p className="preview-card-focus"><span className="label">Focus</span> {focus}</p>
                    {trackDetails[id] && <p className="preview-card-extra">{trackDetails[id].explanation}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SIMULATION LAB ── */}
        <section className="preview-section fade-in">
          <div className="preview-header">
            <div>
              <h3>Simulation Lab</h3>
              <p className="muted">Test financial decisions before you make them</p>
              <button className="primary-btn" style={{ marginTop: 12 }} onClick={() => navigate("/simulation")}>Open Lab →</button>
            </div>
          </div>
          <div className="sim-preview-grid">
            {simCards.map(({ Icon, label, desc }) => (
              <div key={label} className="sim-card available" onClick={() => navigate("/simulation")}>
                <div className="sim-card-top">
                  <span className="sim-icon"><Icon size={20} strokeWidth={1.5} /></span>
                </div>
                <h4>{label}</h4>
                <p className="muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Finance School orb */}
      <div className="finance-orb" onClick={() => navigate("/learn")} title="Finance School">
        <GraduationCap size={22} strokeWidth={1.5} />
      </div>

      <Tour steps={tourSteps} storageKey="homeTour" />
    </div>
  );
}
