import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AppNav from "../components/AppNav";
import "../styles/money.css";
import ExplainerPanel from "../components/ExplainerPanel";
import useProgress from "../hooks/useProgress";
import Tour from "../components/Tour";
import { useUser } from "../context/UserContext";
import { calcMonthlyTax } from "../utils/tax";
import { Target, GraduationCap, Check } from "lucide-react";
import FlipCard from "../components/FlipCard";
import Typewriter from "../components/Typewriter";
import SlideIn from "../components/SlideIn";
import NumberCounter from "../components/NumberCounter";
import soilBg from "../assets/soil.png";
import sandImg from "../assets/sand.png";
import { getTrackMonthlyAmount } from "../utils/trackAmounts";

export default function MoneySnapshot() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [grossIncome, setGrossIncome] = useState(Number(user?.grossSalary ?? user?.salary) || 50000);
  const [expenses, setExpenses] = useState(Number(user?.expenses) || 0);
  const [savings, setSavings] = useState(Number(user?.savings) || 0);

  useEffect(() => {
    const g = user?.grossSalary ?? user?.salary;
    if (g != null) setGrossIncome(Number(g));
    if (user?.expenses != null) setExpenses(Number(user.expenses));
    if (user?.savings  != null) setSavings(Number(user.savings));
  }, [user?.grossSalary, user?.salary, user?.expenses, user?.savings]);

  const { paye, uif, netPay } = calcMonthlyTax(grossIncome);
  const income = netPay;

  const net = income - expenses;
  const safeIncome = income > 0 ? income : 1;

  const savingsLogTotal = (user?.savingsLog || [])
    .filter(e => !e.missed && e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const catchupLogTotal = (user?.catchupLog || [])
    .filter(e => !e.missed && e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const correctionLogTotal = (user?.correctionLog || [])
    .filter(e => !e.missed && e.status !== "missed")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const trackStrategy = ["property", "balanced", "catchup", "correction"].includes(user?.strategy) ? user.strategy : "balanced";
  const goalMonthly = getTrackMonthlyAmount(user, trackStrategy);
  const goal =
    trackStrategy === "property"
      ? Number(user?.depositAmount || user?.depositGoal) || goalMonthly * 60 || 600000
      : trackStrategy === "balanced"
      ? Number(user?.fiveYearGoal) || goalMonthly * 60 || 600000
      : trackStrategy === "catchup"
      ? Number(user?.debt || user?.goalAmount) || goalMonthly * 60 || 600000
      : trackStrategy === "correction"
      ? (Number(user?.goalAmount) * (Number(user?.correctionTargetMonths) || 12)) || Number(user?.fiveYearGoal) || goalMonthly * 60 || 600000
      : Number(user?.fiveYearGoal) || goalMonthly * 60 || 600000;
  const fiveYearGoal = Number(user?.fiveYearGoal) || goalMonthly * 60;

  const trackGoalValues = {
    property: {
      current: savingsLogTotal,
      target: goal,
      monthsLabel: (cur, tgt, n) => tgt > cur && n > 0 ? Math.ceil((tgt - cur) / n) : 0,
      progressLabel: (cur, tgt) => `R${cur.toLocaleString("en-ZA")} saved toward deposit of R${tgt.toLocaleString("en-ZA")}`,
    },
    balanced: {
      current: savingsLogTotal,
      target: fiveYearGoal,
      monthsLabel: () => null,
      progressLabel: (cur) => `R${cur.toLocaleString("en-ZA")} invested so far · R${goalMonthly.toLocaleString("en-ZA")}/month target`,
    },
    catchup: {
      current: catchupLogTotal,
      target: goal,
      monthsLabel: (cur, tgt) => {
        const monthly = getTrackMonthlyAmount(user, "catchup");
        return tgt > cur && monthly > 0 ? Math.ceil((tgt - cur) / monthly) : 0;
      },
      progressLabel: (cur, tgt) => `R${cur.toLocaleString("en-ZA")} cleared of R${tgt.toLocaleString("en-ZA")} debt`,
    },
    correction: {
      current: correctionLogTotal,
      target: goal,
      monthsLabel: (cur, tgt, n) => tgt > cur && n > 0 ? Math.ceil((tgt - cur) / n) : 0,
      progressLabel: (cur, tgt) => `R${cur.toLocaleString("en-ZA")} of R${tgt.toLocaleString("en-ZA")} target reached`,
    },
  };

  const tgv = trackGoalValues[trackStrategy] || trackGoalValues.balanced;
  const tgvCurrent = tgv.current;
  const tgvTarget = Math.max(tgv.target, 1);
  const tgvProgress = Math.min(100, Math.round((tgvCurrent / tgvTarget) * 100));
  const tgvMonths = tgv.monthsLabel(tgvCurrent, tgvTarget, goalMonthly);
  const tgvLabel = tgv.progressLabel(tgvCurrent, tgvTarget);

  const [showPanel, setShowPanel] = useState(false);
  const [content, setContent] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const showTooltip = (key, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + 8 });
    setActiveTooltip(key);
  };
  const hideTooltip = () => setActiveTooltip(null);

  const monthlySurplus = Math.max(0, net);
  const savingsRate = Math.round((monthlySurplus / safeIncome) * 100);
  const activeLogTotal = user?.strategy === "catchup" ? catchupLogTotal : savingsLogTotal;
  const progress = Math.min(100, Math.round((activeLogTotal / Math.max(goal, 1)) * 100));
  const monthsToGoal =
    activeLogTotal >= goal ? 0 : Math.ceil((goal - activeLogTotal) / (goalMonthly || 1));

  const [breakdownEdit, setBreakdownEdit] = useState({
    housing:   user?.breakdown?.housing   ?? Math.round(expenses * 0.4),
    transport: user?.breakdown?.transport ?? Math.round(expenses * 0.2),
    lifestyle: user?.breakdown?.lifestyle ?? Math.round(expenses * 0.25),
    debt:      user?.breakdown?.debt      ?? Math.round(expenses * 0.15),
  });

  const breakdown = { ...breakdownEdit, savings: monthlySurplus };

  const handleBreakdownChange = (e) => {
    setBreakdownEdit({ ...breakdownEdit, [e.target.name]: Number(e.target.value) });
  };

  const debtToIncome =
    income > 0 ? Math.round((breakdown.debt / income) * 100) : 0;
  const disposableIncome = income - expenses;

  const pctOf = (val) => income > 0 ? Math.round((val / income) * 100) : 0;
  const housingPct   = pctOf(breakdownEdit.housing);
  const lifestylePct = pctOf(breakdownEdit.lifestyle);
  const transportPct = pctOf(breakdownEdit.transport);
  const debtPct      = pctOf(breakdownEdit.debt);

  const generateNarrative = () => {
    const parts = [];
    if (housingPct > 35)
      parts.push(`You're allocating ${housingPct}% to housing — above the recommended 30% for your income band.`);
    else
      parts.push(`Housing sits at ${housingPct}% of take-home — within a healthy range.`);
    if (lifestylePct > 20)
      parts.push(`Lifestyle spending is at ${lifestylePct}%, which is on the higher side; trimming this frees up capital.`);
    else
      parts.push(`Lifestyle spend is ${lifestylePct}% — reasonable for your income band.`);
    if (transportPct > 15)
      parts.push(`Transport is ${transportPct}% of income — worth reviewing whether vehicle costs can be reduced.`);
    if (savingsRate > 30)
      parts.push(`Your ${savingsRate}% savings rate is strong.`);
    else if (savingsRate < 15)
      parts.push(`A ${savingsRate}% savings rate is below recommended levels — aim for at least 20%.`);
    if (debtPct > 40)
      parts.push(`Debt obligations at ${debtPct}% of income are high; prioritise repayment.`);
    if (disposableIncome < 0)
      parts.push("Your expenses currently exceed your take-home pay.");
    return parts.join(" ") || "Your financial position is stable.";
  };
  const narrative = generateNarrative();

  const handleSavingsRateChange = (e) => {
    const rate = Number(e.target.value);
    if (rate >= 0 && rate <= 100) setSavings(Math.round(income * (rate / 100)));
  };

  const handleDisposableIncomeChange = (e) => {
    const val = Number(e.target.value);
    const newExpenses = income - val;
    if (newExpenses >= 0) setExpenses(newExpenses);
  };

  const handleGrossChange = (e) => setGrossIncome(e.target.value === "" ? 0 : Number(e.target.value));

  const snapshotSteps = [
    { text: "This is your financial snapshot — everything updates live.", target: "header" },
    { text: "Track your financial journey through milestones.", target: "milestones" },
    { text: "These are your key financial metrics.", target: "metrics" },
    { text: "Edit your income and expenses here.", target: "stats" },
    { text: "This shows your progress toward your deposit goal.", target: "deposit" },
    { text: "These AI insights help you improve your finances.", target: "insights" },
  ];

  const getCoachSteps = () => {
    const steps = [];
    if (net < 0) {
      steps.push({ text: "You're currently spending more than you earn. Let's fix that first.", target: "stats", action: () => setExpenses(expenses - 1000), actionLabel: "Reduce expenses by R1,000" });
    } else if (savingsRate < 15) {
      steps.push({ text: `You're only saving ${savingsRate}% — increasing this will significantly improve your future.`, target: "metrics", action: () => setSavings(Math.round(income * 0.2)), actionLabel: "Boost to 20%" });
    } else if (savingsRate < 30) {
      steps.push({ text: `You're saving ${savingsRate}% — you're on track, but optimisation will accelerate your goals.`, target: "metrics", action: () => setSavings(Math.round(income * 0.3)), actionLabel: "Optimise to 30%" });
    } else {
      steps.push({ text: `You're saving ${savingsRate}% — strong position. Now focus on growth.`, target: "insights" });
    }
    steps.push({ text: `You are ${progress}% toward your deposit goal.`, target: "deposit" });
    steps.push({ text: "These insights are personalised to help you improve faster.", target: "insights" });
    return steps;
  };

  const allTourSteps = [...snapshotSteps, ...getCoachSteps()];

  useEffect(() => {
    const currentBreakdown = { ...breakdownEdit };
    updateUser({ grossSalary: grossIncome, salary: income, expenses, monthsToGoal, breakdown: currentBreakdown });
  }, [grossIncome, income, expenses, breakdownEdit]);

  const { progress: milestoneProgress, milestoneStatus, trackRoute, trackName, percent, toggleMilestone } = useProgress();
  const strategy = user?.strategy || "property";

  const TRACK_CONFIG = {
    property: {
      milestones: [
        { key: "emergencyFund", label: "Emergency Fund" },
        { key: "deposit",       label: "Deposit Saved" },
        { key: "purchase",      label: "Property Bought" },
      ],
      goalLabel: "Deposit target",
      goalProgressLabel: "saved toward deposit",
      depositButtonLabel: "Optimise to 25% savings rate",
      getNextAction: () => {
        const shortfall = Math.max(0, goal - savingsLogTotal);
        const months = net > 0 ? Math.ceil(shortfall / net) : "—";
        const emergencyShortfall = Math.max(0, expenses * 4 - savingsLogTotal);
        const emMonths = net > 0 ? Math.ceil(emergencyShortfall / net) : "—";
        if (!milestoneProgress.emergencyFund) return { action: "Build your emergency fund", how: emergencyShortfall > 0 ? `You need R${emergencyShortfall.toLocaleString("en-ZA")} more (4× expenses). Set aside R${Math.round(net * 0.5).toLocaleString("en-ZA")}/month and you'll reach it in ~${emMonths} months.` : "You have enough saved — mark this milestone complete above." };
        if (!milestoneProgress.deposit) return { action: "Save for your deposit", how: `You need R${shortfall.toLocaleString("en-ZA")} more. At R${net.toLocaleString("en-ZA")}/month surplus that's ~${months} months. Boosting your savings rate to 30% would cut this significantly.` };
        if (!milestoneProgress.purchase) return { action: "Prepare for property purchase", how: "Get a bond pre-approval, budget for transfer duties (~3% of purchase price), and confirm your deposit is liquid." };
        return { action: "Optimise post-purchase", how: "Pay extra into your bond and start building an investment portfolio." };
      },
      getInsights: () => {
        const out = [];
        if (savingsRate >= 25) out.push({ text: `Your ${savingsRate}% savings rate is on track for deposit accumulation.` });
        else out.push({ text: `At ${savingsRate}% savings rate you need to save more to reach your deposit on time.`, action: () => setSavings(Math.round(income * 0.25)), actionLabel: "Boost to 25%" });
        if (expenses / safeIncome > 0.7) out.push({ text: "High expense ratio is slowing your deposit timeline.", action: () => setExpenses(expenses - 500), actionLabel: "Trim expenses" });
        if (progress > 50) out.push({ text: "You're more than halfway to your deposit — strong discipline." });
        else if (progress < 20) out.push({ text: "Early stage — consistency now compounds significantly over time." });
        if (net < 0) out.push({ text: "Your expenses exceed take-home pay. Fix this before saving for a deposit." });
        return out;
      },
    },
    balanced: {
      milestones: [
        { key: "emergencyFund", label: "Safety Net" },
        { key: "deposit",       label: "Investing Started" },
        { key: "purchase",      label: "Financial Independence" },
      ],
      goalLabel: "Monthly investment target",
      goalProgressLabel: "toward investment target",
      depositButtonLabel: "Set savings to 20%",
      getNextAction: () => {
        const shortfall = Math.max(0, goal - savingsLogTotal);
        const months = net > 0 ? Math.ceil(shortfall / net) : "—";
        if (!milestoneProgress.emergencyFund) return { action: "Build a 3–6 month safety net", how: `Target R${(expenses * 4).toLocaleString("en-ZA")} (4× expenses). Put R${Math.round(net * 0.5).toLocaleString("en-ZA")}/month aside until you reach it.` };
        if (!milestoneProgress.deposit) return { action: "Start investing consistently", how: `Open a tax-free savings account (TFSA) or unit trust and contribute R${Math.round(income * 0.15).toLocaleString("en-ZA")}/month (15% of take-home). You have the surplus for it.` };
        if (!milestoneProgress.purchase) return { action: "Scale up investments", how: `Increase contributions to 20–30% of take-home (R${Math.round(income * 0.2).toLocaleString("en-ZA")}–R${Math.round(income * 0.3).toLocaleString("en-ZA")}/month). Diversify across TFSA, ETFs, and retirement annuity.` };
        return { action: "Maintain and rebalance", how: "Review your portfolio allocation annually and rebalance toward your target asset mix." };
      },
      getInsights: () => {
        const out = [];
        if (savingsRate >= 20) out.push({ text: `${savingsRate}% savings rate — well-positioned for a balanced wealth-building approach.` });
        else out.push({ text: `Aim for at least 20% savings rate for balanced growth. You're at ${savingsRate}%.`, action: () => setSavings(Math.round(income * 0.2)), actionLabel: "Set to 20%" });
        if (debtPct > 20) out.push({ text: "Debt repayments are eating into your investment capacity. Prioritise clearing high-interest debt first." });
        if (lifestylePct > 25) out.push({ text: `Lifestyle spend is ${lifestylePct}% of income — trimming this directly increases what you can invest.`, action: () => setExpenses(expenses - 500), actionLabel: "Reduce lifestyle spend" });
        if (net < 0) out.push({ text: "Expenses exceed income — balance your budget before investing." });
        return out;
      },
    },
    catchup: {
      milestones: [
        { key: "emergencyFund", label: "Debt Cleared" },
        { key: "deposit",       label: "Emergency Fund" },
        { key: "purchase",      label: "Wealth Building" },
      ],
      goalLabel: "Total savings target",
      goalProgressLabel: "saved toward target",
      depositButtonLabel: "Set savings to 30%",
      getNextAction: () => {
        const debtAmt = Number(user?.breakdown?.debt) || 0;
        if (!milestoneProgress.emergencyFund) return { action: "Clear your debt aggressively", how: debtAmt > 0 ? `You have R${debtAmt.toLocaleString("en-ZA")}/month in debt repayments. Put every surplus rand toward the highest-interest debt first (avalanche method). At R${net.toLocaleString("en-ZA")}/month surplus you could clear significant debt quickly.` : "Track all outstanding debt and throw your full surplus at it each month." };
        if (!milestoneProgress.deposit) return { action: "Build your emergency fund", how: `Target R${(expenses * 6).toLocaleString("en-ZA")} (6× expenses as a buffer). Allocate R${Math.round(net * 0.6).toLocaleString("en-ZA")}/month until done.` };
        if (!milestoneProgress.purchase) return { action: "Catch up on wealth building", how: `Maximise your TFSA (R${(36000).toLocaleString("en-ZA")}/year limit) and contribute to a retirement annuity. You have R${net.toLocaleString("en-ZA")}/month surplus to deploy.` };
        return { action: "Accelerate investments", how: "You've caught up — now maximise compound growth by increasing contributions and diversifying." };
      },
      getInsights: () => {
        const out = [];
        if (debtPct > 30) out.push({ text: `${debtPct}% of income going to debt — this is the primary drag on your wealth. Eliminate it first.` });
        if (savingsRate < 20) out.push({ text: "A catch-up strategy needs an aggressive savings rate of 30%+.", action: () => setSavings(Math.round(income * 0.3)), actionLabel: "Boost to 30%" });
        else out.push({ text: `${savingsRate}% savings rate is a strong foundation for catching up.` });
        if (expenses / safeIncome > 0.6) out.push({ text: "Reducing expenses is the fastest lever for a catch-up strategy.", action: () => setExpenses(expenses - 1000), actionLabel: "Cut R1,000 from expenses" });
        if (net < 0) out.push({ text: "You cannot build wealth while overspending. Getting to breakeven is step one." });
        return out;
      },
    },
    correction: {
      milestones: [
        { key: "emergencyFund", label: "Budget Balanced" },
        { key: "deposit",       label: "Debt Reducing" },
        { key: "purchase",      label: "Debt Free" },
      ],
      goalLabel: "Debt to eliminate",
      goalProgressLabel: "debt cleared",
      depositButtonLabel: "Reduce expenses by 10%",
      getNextAction: () => {
        if (!milestoneProgress.emergencyFund) return { action: "Balance your budget", how: net < 0 ? `You're overspending by R${Math.abs(net).toLocaleString("en-ZA")}/month. Cut lifestyle and transport spend first — these are the most flexible categories.` : `You have a R${net.toLocaleString("en-ZA")}/month surplus. Redirect it entirely toward debt repayment.` };
        if (!milestoneProgress.deposit) return { action: "Reduce debt systematically", how: `List all debts by interest rate and attack the highest first. Put R${Math.round(net * 0.8).toLocaleString("en-ZA")}/month (80% of surplus) toward debt each month.` };
        if (!milestoneProgress.purchase) return { action: "Eliminate remaining debt", how: "You're close — stay consistent. Once clear, redirect all debt repayment amounts into savings immediately." };
        return { action: "Rebuild financial health", how: "Debt free — now build a 3-month emergency fund and start a TFSA." };
      },
      getInsights: () => {
        const out = [];
        if (net < 0) out.push({ text: `You're overspending by R${Math.abs(net).toLocaleString("en-ZA")}/month. This must be resolved before any other goal.` });
        if (debtPct > 35) out.push({ text: `${debtPct}% of income going to debt repayments is unsustainable — focus on the highest-interest debt first.` });
        if (lifestylePct > 20) out.push({ text: `Lifestyle spend at ${lifestylePct}% is a key area to reduce during a correction phase.`, action: () => setExpenses(expenses - 500), actionLabel: "Reduce lifestyle spend" });
        if (savingsRate > 10) out.push({ text: "Positive savings rate during a correction — redirect this toward debt clearance." });
        if (transportPct > 15) out.push({ text: `Transport at ${transportPct}% of income is high — consider whether vehicle costs can be reduced.` });
        return out;
      },
    },
  };

  const trackCfg = TRACK_CONFIG[strategy] || TRACK_CONFIG.property;
  const { action: nextAction, how: nextHow } = trackCfg.getNextAction();
  const aiInsights = trackCfg.getInsights();

  const track = {
    property:   "First Property",
    balanced:   "Balanced Lifestyle",
    catchup:    "Catch-Up Wealth",
    correction: "Lifestyle Correction",
  }[strategy] || strategy;

  const explainers = {
    net: {
      title: "Net Position",
      text: "Your net position represents the difference between income and expenses. A positive value indicates surplus funds available for saving or investing.",
    },
    property: {
      title: trackCfg.goalLabel,
      text: "This represents your target amount. Increasing contributions reduces the time required to reach this milestone.",
    },
  };

  // Soil health score — composite of savings rate, debt load, and surplus state
  const soilScore = Math.min(100, Math.max(0,
    Math.round(savingsRate * 1.5 + (100 - debtToIncome) * 0.3 + (net >= 0 ? 20 : 0))
  ));
  const soilLabel = soilScore >= 75 ? "Thriving" : soilScore >= 50 ? "Growing" : soilScore >= 30 ? "Recovering" : "Needs care";

  return (
    <div className="money">
      <AppNav />

      {/* NATURE HERO */}
      <div className="money-hero" id="header">
        <img src={soilBg} alt="" className="money-hero__bg" />
        <div className="money-hero__vignette" />

        <div className="money-hero__greeting">
          <SlideIn tag="p" className="money-hero__eyebrow" text="Your financial roots" />
          <SlideIn tag="h1" className="money-hero__name" text={`${user?.name?.split(" ")[0] || "there"}'s Financial Health`} delay={60} />
          <p className="money-hero__sub">Every number here tells the story of your roots.<br />Strong foundations grow tall trees.</p>
        </div>

        <div className="money-hero__score-card">
          <p className="money-hero__card-eye">Financial Health Score</p>
          <div className="money-hero__score-row">
            <NumberCounter as="span" className="money-hero__score-num" value={soilScore} />
            <span className="money-hero__score-denom">/100</span>
          </div>
          <p className="money-hero__score-label">{soilLabel} · {savingsRate}% nourishment rate</p>
          <button className="ghost-btn" style={{ marginTop: 8 }} onClick={() => navigate("/money")}>See breakdown →</button>
        </div>

        <div className="money-hero__track-card">
          <p className="money-hero__card-eye">Active Growth Path</p>
          <h3 className="money-hero__track-name">{track}</h3>
          <div className="money-hero__track-bar">
            <div className="money-hero__track-fill" style={{ width: `${tgvProgress}%` }} />
          </div>
          <p className="money-hero__track-pct"><NumberCounter value={tgvProgress} suffix="%" /> toward goal</p>
          <button className="ghost-btn" style={{ marginTop: 8 }} onClick={() => navigate("/strategy")}>Tend your path →</button>
        </div>

        <div className="money-hero__strip">
          <div className="money-hero__strip-item money-glow">
            <p className="money-hero__strip-label">Gross Monthly</p>
            <p className="money-hero__strip-value"><NumberCounter value={grossIncome} prefix="R" /></p>
          </div>
          <div className="money-hero__strip-divider" />
          <div className="money-hero__strip-item money-glow">
            <p className="money-hero__strip-label">Take-home</p>
            <p className="money-hero__strip-value"><NumberCounter value={income} prefix="R" /></p>
          </div>
          <div className="money-hero__strip-divider" />
          <div className="money-hero__strip-item money-glow">
            <p className="money-hero__strip-label">Monthly Surplus</p>
            <p className="money-hero__strip-value" style={{ color: net >= 0 ? "#84a794" : "#d6765a" }}>
              <NumberCounter value={net} prefix="R" />
            </p>
          </div>
        </div>
      </div>

      <div className="money-container">

        {/* ── UNIFIED INPUT PANEL ── */}
        <div className="snap-inputs-panel card money-glow" id="stats">
          <div className="snap-inputs-row">
            <div className="snap-input-col">
              <p className="label">Gross Monthly Salary</p>
              <div className="value-input">
                <span className="currency">R</span>
                <input className="input-number" type="number" placeholder="0" value={grossIncome || ""} onChange={handleGrossChange} />
              </div>
              <div className="tax-breakdown">
                <span>PAYE: <strong>R{paye.toLocaleString("en-ZA")}</strong></span>
                <span>UIF: <strong>R{uif.toLocaleString("en-ZA")}</strong></span>
                <span>Take-home: <strong className="accent">R{income.toLocaleString("en-ZA")}</strong></span>
              </div>
            </div>
            <div className="snap-col-divider" />
            <div className="snap-input-col">
              <p className="label">Fixed Expenses</p>
              <div className="value-input">
                <span className="currency">R</span>
                <input className="input-number" type="number" placeholder="0" value={expenses || ""} onChange={(e) => setExpenses(e.target.value === "" ? 0 : Number(e.target.value))} />
              </div>
            </div>
            <div className="snap-col-divider" />
            <div className="snap-input-col snap-input-col--net">
              <p className="label">
                Net Position
                <span className="info-icon" onMouseEnter={(e) => showTooltip("net", e)} onMouseLeave={hideTooltip} onClick={() => { setContent(explainers.net); setShowPanel(true); }}>ⓘ</span>
              </p>
              <h3 className="big-number" style={{ color: net >= 0 ? "#f4f6fc" : "#d6765a" }}>
                <NumberCounter value={net} prefix="R" />
              </h3>
              <span className="small">{savingsRate}% nourishment rate</span>
            </div>
          </div>
        </div>

        {/* ── MAIN ASYMMETRIC GRID ── */}
        <div className="snap-main-grid">

          {/* LEFT — narrative & intelligence */}
          <div className="snap-col">
            <div className="card" id="metrics">
              <h3>Growth Metrics</h3>
              <div className="metrics-inline">
                <div className="metric-item money-glow">
                  <span className="metric-item-label">Debt-to-Income</span>
                  <strong><NumberCounter value={debtToIncome} suffix="%" /></strong>
                </div>
                <div className="metric-item money-glow">
                  <span className="metric-item-label">Disposable</span>
                  <strong><NumberCounter value={disposableIncome} prefix="R" /></strong>
                </div>
                <div className="metric-item">
                  <span className="metric-item-label">Nourishment</span>
                  <strong><NumberCounter value={savingsRate} suffix="%" /></strong>
                </div>
              </div>
              <div className="metrics-sliders">
                <label>Adjust disposable income</label>
                <input type="number" value={disposableIncome} onChange={handleDisposableIncomeChange} title="Adjusts your expenses" />
                <label>Adjust nourishment rate (%)</label>
                <input type="number" value={savingsRate} onChange={handleSavingsRateChange} title="Adjusts your savings amount" />
              </div>
            </div>

            <FlipCard
              className="sim-card-flip"
              front={
                <div className="card" style={{ position: "relative", overflow: "hidden" }}>
                  <img src={sandImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.07, pointerEvents: "none", zIndex: 0 }} />
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3>Ground Truth</h3>
                    <Typewriter
                      text={narrative}
                      speed={12}
                      tag="p"
                      className="small"
                      style={{ marginTop: 6, lineHeight: 1.7 }}
                    />
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(178,200,188,0.08)" }}>
                      <p className="label" style={{ display: "flex", alignItems: "center", gap: 5 }}><Target size={12} /> Next Growth Step</p>
                      <p className="accent" style={{ marginTop: 4, fontSize: 13, fontWeight: 600 }}>{nextAction}</p>
                      <Typewriter
                        text={nextHow}
                        speed={12}
                        delay={600}
                        tag="p"
                        className="small"
                        style={{ marginTop: 6, lineHeight: 1.6, color: "#c8d8d4" }}
                      />
                      <p className="small" style={{ marginTop: 8 }}>Path: <span className="accent">{track}</span></p>
                    </div>
                  </div>
                </div>
              }
              back={
                <>
                  <span className="flip-back-label">Next Growth Step</span>
                  <span className="flip-back-count" style={{ fontSize: 20, color: "rgba(132,167,148,0.6)" }}>{nextAction}</span>
                  <span className="flip-back-sub">Path: {track}</span>
                </>
              }
            />

            <FlipCard
              className="card-flip"
              id="insights"
              noFlip
              front={
                <>
                  <h3>Growth Intelligence</h3>
                  {aiInsights.map((insight, i) => (
                    <div className="insight" key={i}>
                      <Typewriter text={insight.text} speed={14} delay={i * 200} />
                      {insight.action && <button onClick={insight.action}>{insight.actionLabel}</button>}
                    </div>
                  ))}
                </>
              }
              back={
                <>
                  <span className="flip-back-label">Growth Intelligence</span>
                  <span className="flip-back-count">{aiInsights.length}</span>
                  <span className="flip-back-sub">personalised insights based on your financial profile</span>
                </>
              }
            />
          </div>

          {/* RIGHT — progress & tracking */}
          <div className="snap-col">
            <div className="card" id="milestones">
              <h3>Growth Milestones</h3>
              <div className="ms-track">
                {trackCfg.milestones.map(({ key }, index) => {
                  const keys = trackCfg.milestones.map(m => m.key);
                  const isCompleted = milestoneProgress[key];
                  const isPrevDone  = index === 0 || milestoneProgress[keys[index - 1]];
                  const isLocked    = !isPrevDone;
                  const isCurrent   = !isCompleted && isPrevDone;
                  return (
                    <div key={key} className="ms-step-col">
                      <div className="ms-circle-row">
                        {index > 0 && <div className={`ms-line ${milestoneProgress[keys[index - 1]] ? "filled" : ""}`} />}
                        <button
                          type="button"
                          className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                          onClick={() => !isLocked && toggleMilestone(key)}
                          disabled={isLocked}
                          title={isCompleted ? "Achieved" : isLocked ? "Complete previous milestone first" : milestoneStatus?.[key]?.hint || "Tap to check off"}
                        >
                          {isCompleted && <Check size={14} />}
                          {isCompleted ? "✓" : index + 1}
                        </button>
                        {index < trackCfg.milestones.length - 1 && <div className={`ms-line ${isCompleted ? "filled" : ""}`} />}
                      </div>
                      <div className="ms-label">
                        <span className="step-label">{milestoneStatus?.[key]?.label || key}</span>
                        {isCurrent && !isCompleted && <span className="ms-hint" onClick={() => navigate(trackRoute)}>{milestoneStatus?.[key]?.hint || `Go to ${trackName} →`}</span>}
                        {isLocked && <span className="step-locked-label">Locked</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="muted" style={{ marginTop: 10 }}>{percent}% complete</p>
              {percent < 100 && <button className="pill" style={{ marginTop: 8 }} onClick={() => navigate(trackRoute)}>Update progress in {trackName} →</button>}
            </div>

            <div className="card money-glow" id="deposit">
              <h3>
                {trackCfg.goalLabel}
                <span className="info-icon" onMouseEnter={(e) => showTooltip("property", e)} onMouseLeave={hideTooltip} onClick={() => { setContent(explainers.property); setShowPanel(true); }}>ⓘ</span>
              </h3>
              <div className="progress">
                <div className="fill" style={{ width: `${tgvProgress}%` }} />
              </div>
              <p className="small">
                {tgvLabel}
                {tgvMonths !== null ? ` - ${tgvMonths} months to go` : ""}
              </p>
              <button className="pill" onClick={() => navigate("/setup")}>{trackCfg.depositButtonLabel}</button>
            </div>

            <div className="card" style={{ position: "relative", overflow: "hidden" }}>
              <img src={sandImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.07, pointerEvents: "none", zIndex: 0 }} />
              <h3 style={{ position: "relative", zIndex: 1 }}>The Current</h3>
              <p className="small" style={{ marginBottom: 4, color: "#8fa3a0", position: "relative", zIndex: 1 }}>
                Where your money flows each month
              </p>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="chart" style={{ background: `conic-gradient(#84a794 0% ${(monthlySurplus / safeIncome) * 100}%, #6faad3 ${(monthlySurplus / safeIncome) * 100}% ${((monthlySurplus + expenses) / safeIncome) * 100}%, #d6a85a ${((monthlySurplus + expenses) / safeIncome) * 100}% 100%)` }} />
                <div className="legend">
                  <p>Surplus - R{monthlySurplus.toLocaleString("en-ZA")}</p>
                  <p>Expenses - R{expenses.toLocaleString("en-ZA")}</p>
                  <p>Invested total - R{savingsLogTotal.toLocaleString("en-ZA")}</p>
                </div>
                <button className="pill full" onClick={() => navigate("/simulation")}>Explore financial scenarios →</button>
              </div>
            </div>

            <div className="card" id="breakdown">
              <h3>Your Foundation</h3>
              <div className="breakdown-grid">
                {["housing","transport","lifestyle","debt"].map((cat) => (
                  <div className="breakdown-item" key={cat}>
                    <p>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                    <input className="input-number" type="number" name={cat} value={breakdownEdit[cat]} onChange={handleBreakdownChange} />
                  </div>
                ))}
                <div className="breakdown-item">
                  <p>Savings</p>
                  <strong>R{breakdown.savings.toLocaleString("en-ZA")}</strong>
                </div>
              </div>
              <button className="pill" style={{ marginTop: 12 }} onClick={() => setBreakdownEdit({ housing: Math.round(expenses * 0.4), transport: Math.round(expenses * 0.2), lifestyle: Math.round(expenses * 0.25), debt: Math.round(expenses * 0.15) })}>Reset to auto</button>
            </div>
          </div>

        </div>
      </div>

      <div className="continue-row">
        <button className="primary-btn" onClick={() => navigate("/strategy")}>
          Continue →
        </button>
      </div>

      <ExplainerPanel show={showPanel} onClose={() => setShowPanel(false)} content={content} />

      {activeTooltip && explainers[activeTooltip] && (
        <div className="tooltip-advanced" style={{ position: "fixed", top: tooltipPos.y, left: tooltipPos.x, zIndex: 9999 }}>
          <h4>{explainers[activeTooltip].title}</h4>
          <p>{explainers[activeTooltip].text}</p>
          <span className="tooltip-hint">Click to learn more →</span>
        </div>
      )}

      <div className="finance-orb" onClick={() => navigate("/learn")} title="Go to Finance School">
        <GraduationCap size={26} strokeWidth={1.5} />
      </div>

      <Tour steps={allTourSteps} storageKey="snapshotTour" />
    </div>
  );
}
