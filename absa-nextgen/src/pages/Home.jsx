import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tour from "../components/Tour";
import AppNav from "../components/AppNav";
import "../styles/home.css";
import "../styles/fiveyear.css";
import SlideIn from "../components/SlideIn";
import { Home as HomeIcon, Scale, Shield, RefreshCw, Building2, TrendingUp, CreditCard, Target, GraduationCap, Info, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const net      = income - expenses;
  const safeIncome  = income > 0 ? income : 1;
  // Use actual goalAmount (monthly investing) for savings rate if set, else net surplus
  const investingAmount = Number(user?.goalAmount) > 0 ? Number(user.goalAmount) : Math.max(net, 0);
  const savingsRate = Math.round((investingAmount / safeIncome) * 100);

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

  const tips = [
    { tag: "Saving",     text: "Automating your savings on payday removes the temptation to spend first. Set it and forget it." },
    { tag: "Property",   text: "A 10% deposit on a R1.8M home is R180 000. At R18k/month saved, you're 10 months away." },
    { tag: "Debt",       text: "Paying off the highest-interest debt first (avalanche method) saves you the most money long-term." },
    { tag: "Investing",  text: "Time in the market beats timing the market. Starting with R500/month at 25 beats R2000/month at 35." },
    { tag: "Budgeting",  text: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Adjust the ratios for your track." },
    { tag: "Property",   text: "Bond pre-approval strengthens your offer when buying. Get it before you start house-hunting." },
    { tag: "Mindset",    text: "A R500 daily coffee habit costs R10 950/year. Small habits have large compounding effects." },
    { tag: "Investing",  text: "Offshore investing gives you rand-hedge protection. Even 20–30% offshore reduces local risk." },
    { tag: "Emergency",  text: "3–6 months of expenses in an emergency fund prevents you from dipping into your savings goals." },
    { tag: "Saving",     text: "Increasing your savings rate by just 2% per year compounds dramatically over a 5-year horizon." },
    { tag: "Tax",        text: "A Tax-Free Savings Account (TFSA) lets you invest up to R36 000/year with zero tax on returns." },
    { tag: "Debt",       text: "Never take on new debt while paying off existing debt — the interest works against you twice." },
    { tag: "Property",   text: "Transfer duty on a R1.8M property is roughly R22 000. Budget for it alongside your deposit." },
    { tag: "Mindset",    text: "Your net salary — not your gross — is your real income. Build your budget around take-home pay." },
    { tag: "Investing",  text: "Compound interest is most powerful in the first few years. Every month you delay costs more than you think." },
  ];

  const r = 0.10 / 12;
  const savingsLogTotal = (user?.savingsLog || [])
    .filter(e => e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const currentSaved = savingsLogTotal;
  const trackIs = user?.strategy;

  // Catch-up track: show debt clearance, not wealth accumulation
  const totalDebt      = Number(user?.debt || user?.goalAmount) || 0;
  const catchupMonthly = Number(user?.catchupMonthly) || Math.max(Math.round(net * 0.3), 0);

  // All other tracks: monthly investment amount
  const monthlyInvest = trackIs === "catchup"
    ? catchupMonthly
    : Number(user?.goalAmount) > 0
      ? Number(user.goalAmount)
      : Math.max(Math.round(net * 0.2), 0);

  const y5Values = [1, 2, 3, 4, 5].map((y) => {
    if (trackIs === "catchup") {
      // Show remaining debt each year (floors at 0)
      return Math.max(0, totalDebt - catchupMonthly * 12 * y);
    }
    if (trackIs === "balanced") return Math.round(currentSaved + monthlyInvest * ((Math.pow(1 + r, y * 12) - 1) / r));
    return Math.round(currentSaved + monthlyInvest * 12 * y);
  });

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const [tipIndex, setTipIndex] = useState(dayOfYear % tips.length);
  const currentTip = tips[tipIndex];

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
          <SlideIn tag="h2" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} />
          <SlideIn tag="p" className="subtitle" delay={120} text={`You are on the ${trackNames[user?.strategy] || "—"} track`} />
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

        {/* ── 5-YEAR PROJECTION STRIP ── */}
        {net > 0 && (
          <div className="home-y5-strip fade-in">
            <div className="home-y5-left">
              <p className="home-y5-eyebrow">
                {trackIs === "catchup" ? "Debt Clearance · Catch-Up Wealth" : `5-Year Journey · ${trackNames[user?.strategy] || "Your Track"}`}
              </p>
              {trackIs === "catchup" ? (
                <>
                  <p className="home-y5-amount" style={{ color: y5Values[4] === 0 ? "#84a794" : "#ff9898" }}>
                    {y5Values[4] === 0 ? "Debt-Free ✓" : `R${y5Values[4].toLocaleString("en-ZA")} left`}
                  </p>
                  <p className="home-y5-sub">
                    {y5Values[4] === 0
                      ? `Cleared in under 5 yrs at R${catchupMonthly.toLocaleString("en-ZA")}/month`
                      : `R${totalDebt.toLocaleString("en-ZA")} total · R${catchupMonthly.toLocaleString("en-ZA")}/month attack`}
                  </p>
                </>
              ) : (
                <>
                  <p className="home-y5-amount">R{y5Values[4].toLocaleString("en-ZA")}</p>
                  <p className="home-y5-sub">projected by Year 5 at R{monthlyInvest.toLocaleString("en-ZA")}/month</p>
                </>
              )}
            </div>
            <div className="home-y5-years">
              {[1, 2, 3, 4, 5].map((y, i) => (
                <div key={y} className={`home-y5-year ${y === 5 ? "home-y5-year--end" : ""}`}>
                  <span className="home-y5-year-label">Yr {y}</span>
                  <span className="home-y5-year-value" style={ trackIs === "catchup" && y5Values[i] === 0 ? { color: "#84a794" } : {} }>
                    {trackIs === "catchup" && y5Values[i] === 0 ? "Gone ✓" : `R${(y5Values[i] / 1000).toFixed(0)}k`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ROW 3: GOAL + NUDGE ── */}
        <div className="home-row fade-in">
          <section className="goal-card" id="goal">
            {(() => {
              const strategy = user?.strategy;
              const goalLabels  = { property: "Deposit Target", balanced: "5-Year Portfolio Goal", catchup: "Debt to Clear", correction: "Correction Goal" };
              const goalLabel   = goalLabels[strategy] || "Financial Goal";

              let displayAmount, subLine;

              if (strategy === "property") {
                displayAmount = user?.depositAmount;
                const months = user?.monthsToGoal;
                subLine = months ? `${months} months to reach deposit` : "Set your house price in Setup";
              } else if (strategy === "balanced") {
                displayAmount = user?.fiveYearGoal || null;
                const monthly = user?.goalAmount;
                subLine = monthly
                  ? `Investing R${Number(monthly).toLocaleString("en-ZA")}/month`
                  : "Set your monthly target in Setup";
              } else if (strategy === "catchup") {
                displayAmount = user?.debt || user?.goalAmount;
                const cu = Number(user?.catchupMonthly);
                const debt = Number(user?.debt || user?.goalAmount);
                const months = cu > 0 && debt > 0 ? Math.ceil(debt / cu) : null;
                subLine = months
                  ? `${months} months to clear at R${cu.toLocaleString("en-ZA")}/month`
                  : "Set your debt + contribution in Setup";
              } else {
                displayAmount = user?.goalAmount;
                subLine = displayAmount ? `R${Number(displayAmount).toLocaleString("en-ZA")}/month to reduce` : "Set your target in Setup";
              }

              return (
                <>
                  <span className="label">{goalLabel}</span>
                  <h3 style={{ fontSize: 26, fontWeight: 700, margin: "6px 0 4px" }}>
                    {displayAmount ? `R${Number(displayAmount).toLocaleString("en-ZA")}` : "Not set"}
                  </h3>
                  <p className="muted" style={{ fontSize: 13 }}>{subLine}</p>
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

        {/* ── DAILY TIP ── */}
        <section className="daily-tip fade-in">
          <div className="daily-tip-left">
            <Sparkles size={16} className="daily-tip-icon" />
            <span className="daily-tip-tag">{currentTip.tag}</span>
          </div>
          <p className="daily-tip-text">{currentTip.text}</p>
          <div className="daily-tip-nav">
            <button onClick={() => setTipIndex((tipIndex - 1 + tips.length) % tips.length)}><ChevronLeft size={14} /></button>
            <span>{tipIndex + 1} / {tips.length}</span>
            <button onClick={() => setTipIndex((tipIndex + 1) % tips.length)}><ChevronRight size={14} /></button>
          </div>
        </section>

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
