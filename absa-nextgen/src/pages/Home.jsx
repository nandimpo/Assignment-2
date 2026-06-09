import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Tour from "../components/Tour";
import AppNav from "../components/AppNav";
import "../styles/home.css";
import "../styles/fiveyear.css";
import SlideIn from "../components/SlideIn";
import { Home as HomeIcon, Scale, RefreshCw, Building2, TrendingUp, CreditCard, Target, GraduationCap, Sparkles, ChevronRight, ChevronLeft, Sprout } from "lucide-react";
import FlipCard from "../components/FlipCard";
import Typewriter from "../components/Typewriter";
import NumberCounter from "../components/NumberCounter";
import { useUser } from "../context/UserContext";
import rootsImg from "../assets/roots.png";
import treeImg from "../assets/tree.png";
import leafImg from "../assets/leaf.png";
import { getTrackMonthlyAmount } from "../utils/trackAmounts";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const net      = income - expenses;
  const safeIncome  = income > 0 ? income : 1;
  const investingAmount = getTrackMonthlyAmount(user);
  const savingsRate = Math.round((investingAmount / safeIncome) * 100);

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
    correction: "Lifestyle Correction",
    catchup:    "Catch-Up Wealth",
  };

  const tourSteps = [
    { text: "Welcome — this is your financial dashboard.", target: "home-header" },
    { text: "This shows your next financial action.", target: "next-step" },
    { text: "Your financial health score updates as you improve.", target: "health" },
    { text: "Here's your income, expenses, and net position.", target: "stats" },
    { text: "This is your current strategy track.", target: "tracks" },
  ];

  const strategyTracks = [
    { id: "property",   Icon: HomeIcon,  name: "First Property Path",            sub: "Save for a home deposit in 3–5 years",         focus: "Saving & Stability" },
    { id: "balanced",   Icon: Scale,     name: "Balanced Lifestyle & Investing", sub: "Maintain your lifestyle while building wealth", focus: "Flexibility & Investing" },
    { id: "correction", Icon: RefreshCw, name: "Lifestyle Correction",           sub: "Rebalance spending and reduce debt",            focus: "Behavioural Change" },
  ];

  const tips = [
    { tag: "Saving",    text: "Automating your savings on payday removes the temptation to spend first." },
    { tag: "Property",  text: "A 10% deposit on a R1.8M home is R180 000. At R18k/month saved, you're 10 months away." },
    { tag: "Debt",      text: "Paying off the highest-interest debt first (avalanche method) saves the most long-term." },
    { tag: "Investing", text: "Time in the market beats timing the market. Starting at 25 with R500/month beats R2000/month at 35." },
    { tag: "Budgeting", text: "The 50/30/20 rule: 50% needs, 30% wants, 20% savings. Adjust for your track." },
    { tag: "Property",  text: "Bond pre-approval strengthens your offer when buying. Get it before house-hunting." },
    { tag: "Mindset",   text: "A R500 daily coffee habit costs R10 950/year. Small habits have large compounding effects." },
    { tag: "Investing", text: "Offshore investing gives rand-hedge protection. Even 20–30% offshore reduces local risk." },
    { tag: "Emergency", text: "3–6 months of expenses in an emergency fund prevents dipping into your savings goals." },
    { tag: "Saving",    text: "Increasing your savings rate by just 2% per year compounds dramatically over 5 years." },
    { tag: "Tax",       text: "A TFSA lets you invest up to R36 000/year with zero tax on returns." },
    { tag: "Debt",      text: "Never take on new debt while paying off existing debt — interest works against you twice." },
    { tag: "Property",  text: "Transfer duty on a R1.8M property is roughly R22 000. Budget for it alongside your deposit." },
    { tag: "Mindset",   text: "Your net salary — not gross — is your real income. Build your budget around take-home pay." },
    { tag: "Investing", text: "Compound interest is most powerful early. Every month you delay costs more than you think." },
  ];

  const r = 0.10 / 12;
  const savingsLogTotal = (user?.savingsLog || [])
    .filter(e => e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const trackIs = user?.strategy;

  const totalDebt      = Number(user?.debt || user?.goalAmount) || 0;
  const catchupMonthly = getTrackMonthlyAmount(user, "catchup");
  const monthlyInvest  = getTrackMonthlyAmount(user, trackIs);

  const y5Values = [1, 2, 3, 4, 5].map((y) => {
    if (trackIs === "catchup") return Math.max(0, totalDebt - catchupMonthly * 12 * y);
    if (trackIs === "balanced") return Math.round(savingsLogTotal + monthlyInvest * ((Math.pow(1 + r, y * 12) - 1) / r));
    return Math.round(savingsLogTotal + monthlyInvest * 12 * y);
  });
  const formatCompactRand = (value) => `R${Math.round(value / 1000).toLocaleString("en-ZA")}k`;

  const goalLabels = { property: "Deposit Target", balanced: "5-Year Portfolio Goal", catchup: "Debt to Clear", correction: "Correction Goal" };
  const goalLabel  = goalLabels[user?.strategy] || "Financial Goal";
  let displayAmount, goalSubLine;
  if (user?.strategy === "property") {
    displayAmount = user?.depositAmount;
    goalSubLine = user?.monthsToGoal ? `${user.monthsToGoal} months to deposit` : "Set your house price in Setup";
  } else if (user?.strategy === "balanced") {
    displayAmount = user?.fiveYearGoal || null;
    goalSubLine = user?.goalAmount ? `Investing R${Number(user.goalAmount).toLocaleString("en-ZA")}/month` : "Set monthly target in Setup";
  } else if (user?.strategy === "catchup") {
    displayAmount = user?.debt || user?.goalAmount;
    const cu = Number(user?.catchupMonthly), debt = Number(user?.debt || user?.goalAmount);
    const mo = cu > 0 && debt > 0 ? Math.ceil(debt / cu) : null;
    goalSubLine = mo ? `${mo} months to clear at R${cu.toLocaleString("en-ZA")}/month` : "Set your debt + contribution in Setup";
  } else {
    displayAmount = user?.goalAmount;
    goalSubLine = displayAmount ? `R${Number(displayAmount).toLocaleString("en-ZA")}/month to reduce` : "Set your target in Setup";
  }

  const depositProgress = user?.strategy === "property" && user?.depositAmount > 0
    ? Math.min(Math.round((savingsLogTotal / Number(user.depositAmount)) * 100), 100)
    : 70;

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const [tipIndex, setTipIndex] = useState(dayOfYear % tips.length);
  const currentTip = tips[tipIndex];

  const simCards = [
    { Icon: Building2,  label: "Buy vs Rent",         desc: "Compare buying vs renting long-term" },
    { Icon: TrendingUp, label: "Investment Growth",    desc: "Project returns across asset classes" },
    { Icon: CreditCard, label: "Debt Payoff Planner",  desc: "Find the fastest path to debt-free" },
    { Icon: Target,     label: "Retirement Readiness", desc: "See if you're on track for retirement" },
  ];

  return (
    <div className="home">
      <AppNav />

      <div className="home-container">

        {/* ══ HERO ══ */}
        <div className="hero" id="home-header">
          <img src={treeImg} alt="" className="hero__bg" />
          <div className="hero__vignette" />
          <div className="hero__greeting">
            <div className="hero__title-row">
              <SlideIn tag="h1" text={`Hi, ${user?.name?.split(" ")[0] || "there"}`} />
              <Sprout className="hero__title-icon" size={34} strokeWidth={2.2} aria-hidden="true" />
            </div>
            <p className="hero__sub">Your growth journey continues.<br />Small steps today. Strong future tomorrow.</p>
          </div>
          <div className="hero__year-card">
            <p className="hero__year-label">Year 2 of 5</p>
            <p className="hero__year-text">You're building real momentum.</p>
            <button className="ghost-btn" onClick={() => navigate("/strategy")}>View your journey →</button>
          </div>
          <div className="hero__pos-card" id="health" onClick={() => navigate("/money")}>
            <p className="hero__card-eyebrow">Financial Position</p>
            <div className="hero__pos-score">
              <NumberCounter as="span" className="hero__pos-num" value={healthScore} />
              <span className="hero__pos-denom">/100</span>
            </div>
            <p className="hero__card-sub">{healthLabel} position.<br />You're well on track.</p>
            <button className="ghost-btn" style={{ marginTop: 8 }}>View details →</button>
          </div>
          <div className="hero__path-card" id="next-step" onClick={() => navigate("/strategy")}>
            <p className="hero__card-eyebrow">Active Path</p>
            <h3 className="hero__path-name">{trackNames[user?.strategy] || "Choose a path"}</h3>
            {user?.strategy === "property" && (
              <p className="hero__card-sub" style={{ marginBottom: 6 }}>Stage 2 of 4 · Deposit Saving</p>
            )}
            <div className="hero__progress-bar">
              <div className="hero__progress-fill" style={{ width: `${depositProgress}%` }} />
            </div>
            <NumberCounter as="p" className="hero__progress-pct" value={depositProgress} suffix="%" />
            <button className="ghost-btn" style={{ marginTop: 8 }}>Continue your path →</button>
          </div>
          <div className="hero__bottom-strip hero__bottom-strip--single">
            <p className="hero__strip-label">Today's Insight</p>
            <p className="hero__insight-text">{currentTip.text}</p>
            <button className="ghost-btn" style={{ marginTop: 8 }} onClick={() => navigate("/money")}>See breakdown →</button>
          </div>
        </div>

        {/* ══ ROW A: Stats 3-col ══ */}
        <section className="stats fade-in" id="stats">
          <div className="stat money-glow">
            <p>Monthly income</p>
            <h3><NumberCounter value={income} prefix="R" /></h3>
          </div>
          <div className="stat money-glow">
            <p>Fixed Costs</p>
            <h3><NumberCounter value={expenses} prefix="R" /></h3>
          </div>
          <div className="stat highlight clickable money-glow" onClick={() => navigate("/money")}>
            <p>Net Position</p>
            <h3><NumberCounter value={net} prefix="R" /></h3>
            <span className="view-link">View breakdown →</span>
          </div>
        </section>

        {/* ══ ROW B: 5-year strip ══ */}
        {net > 0 && (
          <div className="home-y5-strip fade-in money-glow">
            <div className="home-y5-left">
              <p className="home-y5-eyebrow">
                {trackIs === "catchup" ? "Debt Clearance · Catch-Up Wealth" : `5-Year Journey · ${trackNames[user?.strategy] || "Your Track"}`}
              </p>
              {trackIs === "catchup" ? (
                <>
                  <p className="home-y5-amount" style={{ color: y5Values[4] === 0 ? "#84a794" : "#ff9898" }}>
                    {y5Values[4] === 0 ? "Debt-Free" : <><NumberCounter value={y5Values[4]} prefix="R" /> left</>}
                  </p>
                  <p className="home-y5-sub">
                    {y5Values[4] === 0
                      ? `Cleared in under 5 yrs at R${catchupMonthly.toLocaleString("en-ZA")}/month`
                      : `R${totalDebt.toLocaleString("en-ZA")} total · R${catchupMonthly.toLocaleString("en-ZA")}/month attack`}
                  </p>
                </>
              ) : (
                <>
                  <p className="home-y5-amount"><NumberCounter value={y5Values[4]} prefix="R" /></p>
                  <p className="home-y5-sub">projected by Year 5 at R{monthlyInvest.toLocaleString("en-ZA")}/month</p>
                </>
              )}
            </div>
            <div className="home-y5-years">
              {[1, 2, 3, 4, 5].map((y, i) => (
                <div key={y} className={`home-y5-year ${y === 5 ? "home-y5-year--end" : ""}`}>
                  <span className="home-y5-year-label">Yr {y}</span>
                  <span className="home-y5-year-value" style={trackIs === "catchup" && y5Values[i] === 0 ? { color: "#84a794" } : {}}>
                    {trackIs === "catchup" && y5Values[i] === 0 ? "Gone" : formatCompactRand(y5Values[i])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ROW B: Goal (left) + Nudge | Tip (right stacked) ══ */}
        <div className="home-goal-row fade-in">
          <section className="goal-card money-glow" id="goal">
            <span className="label">{goalLabel}</span>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "3px 0 2px" }}>
              {displayAmount ? <NumberCounter value={Number(displayAmount)} prefix="R" /> : "Not set"}
            </h3>
            <p className="muted" style={{ fontSize: 11 }}>{goalSubLine}</p>
            <button className="primary-btn" style={{ marginTop: 8 }} onClick={() => navigate("/money")}>View Snapshot →</button>
          </section>

          <div className="home-nudge-tip-col">
            <FlipCard
              className="sim-card-flip"
              front={
                <section className={`nudge ${nudgeType}`} id="nudge">
                  <p className="nudge-label">Savings insight</p>
                  <Typewriter
                    className="nudge-text"
                    text={nudgeType === "positive"
                      ? `You're saving ${savingsRate}% — strong position`
                      : `Savings rate is ${savingsRate}% — consider reducing expenses`}
                    speed={18}
                  />
                  <Typewriter
                    className="nudge-sub muted"
                    text={nudgeType === "positive"
                      ? "Keep contributing consistently and you'll reach your goal faster."
                      : "Even a R500/month reduction in expenses can make a significant difference."}
                    speed={14}
                    delay={400}
                  />
                </section>
              }
              back={
                <>
                  <span className="flip-back-label">Savings Insight</span>
                  <span className="flip-back-count">{savingsRate}%</span>
                  <span className="flip-back-sub">{nudgeType === "positive" ? "Strong savings rate" : "Room to improve"}</span>
                </>
              }
            />

            <section className="daily-tip-compact">
              <div className="daily-tip-compact-top">
                <Sparkles size={13} className="daily-tip-icon" />
                <span className="daily-tip-tag">{currentTip.tag}</span>
              </div>
              <Typewriter className="daily-tip-text" text={currentTip.text} speed={16} />
              <div className="daily-tip-nav">
                <button onClick={() => setTipIndex((tipIndex - 1 + tips.length) % tips.length)}><ChevronLeft size={14} /></button>
                <span>{tipIndex + 1} / {tips.length}</span>
                <button onClick={() => setTipIndex((tipIndex + 1) % tips.length)}><ChevronRight size={14} /></button>
              </div>
            </section>
          </div>
        </div>

        {/* ══ ROW C: Strategy Paths (left) + Decision Studio (right) ══ */}
        <div className="home-bottom-row fade-in">

          <section className="home-paths-panel" id="tracks">
            <img src={rootsImg} alt="" className="home-panel-bg" />
            <div className="home-panel-header">
              <p className="home-panel-eyebrow">Growth Paths</p>
              <h3 className="home-panel-title">Strategy Paths</h3>
              <p className="muted" style={{ fontSize: 11 }}>Pathways built around your goals &amp; life stage</p>
            </div>
            <div className="home-paths-list">
              {strategyTracks.map(({ id, Icon, name, sub, focus }) => {
                const isActive = user?.strategy === id || (id === "correction" && user?.strategy === "catchup");
                return (
                  <div key={id} className={`home-path-row ${isActive ? "home-path-row--active" : ""}`} onClick={() => navigate("/strategy")}>
                    <div className="home-path-icon"><Icon size={14} strokeWidth={1.7} /></div>
                    <div className="home-path-text">
                      <p className="home-path-name">{name}</p>
                      <p className="home-path-sub">{sub}</p>
                    </div>
                    {isActive && <span className="home-path-badge">Active</span>}
                    <ChevronRight size={13} className="home-path-arrow" />
                  </div>
                );
              })}
            </div>
            <button className="ghost-btn" style={{ marginTop: 12 }} onClick={() => navigate("/strategy")}>Explore all paths →</button>
          </section>

          <section className="home-studio-panel">
            <img src={leafImg} alt="" className="home-panel-bg home-panel-bg--canopy" />
            <div className="home-panel-header">
              <p className="home-panel-eyebrow">Decision Studio</p>
              <h3 className="home-panel-title">Test before you commit</h3>
              <p className="muted" style={{ fontSize: 11 }}>Run scenarios before committing to a path</p>
            </div>
            <div className="home-studio-grid">
              {simCards.map(({ Icon, label, desc }) => (
                <div key={label} className="home-studio-card" onClick={() => navigate("/simulation")}>
                  <Icon size={16} strokeWidth={1.5} className="home-studio-icon" />
                  <p className="home-studio-label">{label}</p>
                  <p className="home-studio-desc">{desc}</p>
                </div>
              ))}
            </div>
            <button className="ghost-btn" style={{ marginTop: 12 }} onClick={() => navigate("/simulation")}>Open Studio →</button>
          </section>

        </div>

      </div>

      <div className="finance-orb" onClick={() => navigate("/learn")} title="Knowledge Hub">
        <GraduationCap size={22} strokeWidth={1.5} />
      </div>

      <Tour steps={tourSteps} storageKey="homeTour" />
    </div>
  );
}
