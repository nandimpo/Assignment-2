import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/setup.css";
import { useUser } from "../context/UserContext";
import { calcMonthlyTax } from "../utils/tax";
import { Home, Wallet, Zap, RefreshCw, Building2, Car, ShoppingBag, CreditCard, TrendingDown, Clock, CheckCircle, Target } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    name:               user?.name || "",
    grossSalary:        user?.grossSalary || user?.salary || "",
    expenses:           user?.expenses || "",
    housePrice:         user?.housePrice || "",
    goalAmount:         user?.goalAmount || "",
    fiveYearGoal:       user?.fiveYearGoal || "",
    catchupMonthly:      user?.catchupMonthly || "",
    catchupTargetMonths: user?.catchupTargetMonths || "",
    propertyTargetMonths: user?.propertyTargetMonths || "",
    correctionTargetMonths: user?.correctionTargetMonths || "",
  });

  const [selectedTrack, setSelectedTrack] = useState(
    user?.strategy || "property",
  );

  // Track-specific goal config
  const trackGoalConfig = {
    property:   { label: "Target house price (R)",          field: "housePrice",  hint: "What property price are you aiming for?" },
    balanced:   { label: "Monthly investment target (R)",   field: "goalAmount",  hint: "How much do you want to invest monthly?" },
    catchup:    { label: "Total debt to eliminate (R)",     field: "goalAmount",  hint: "What is your total outstanding debt?" },
    correction: { label: "Monthly overspend to reduce (R)", field: "goalAmount",  hint: "How much are you currently overspending per month?" },
  };

  const fiveYearGoalConfig = {
    property:   { label: "5-year portfolio goal after purchase (R)", hint: "How much do you want to have invested 5 years after buying?" },
    balanced:   { label: "5-year portfolio target (R)",              hint: "What total portfolio value do you want after 5 years?" },
    catchup:    { label: "5-year wealth target after clearing debt (R)", hint: "Once debt-free, how much do you want to have built?" },
    correction: { label: "5-year savings target (R)",                hint: "How much do you want saved after 5 years of correcting habits?" },
    foundation: { label: "5-year savings goal (R)",                  hint: "What total savings do you want to reach in 5 years?" },
  };

  const goalConfig = trackGoalConfig[selectedTrack] || trackGoalConfig.property;

  const [suggestedPercent, setSuggestedPercent] = useState(10);
  const [userPercent, setUserPercent] = useState(10);
  const [goalFlash, setGoalFlash] = useState(false);
  const [breakdownFlash, setBreakdownFlash] = useState(false);

  const [breakdown, setBreakdown] = useState({
    housing:   user?.breakdown?.housing   || "",
    mobility:  user?.breakdown?.mobility  || "",
    lifestyle: user?.breakdown?.lifestyle || "",
    debt:      user?.breakdown?.debt      || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate monthly investment goal against disposable income (balanced track only)
    if (name === "goalAmount" && selectedTrack === "balanced") {
      const val = Number(value);
      const disp = disposableIncome;
      if (disp > 0 && val > disp) {
        setGoalFlash(true);
        setTimeout(() => setGoalFlash(false), 1800);
        return; // block the update
      }
    }
    setForm({ ...form, [name]: value });
  };

  const handleBreakdownChange = (e) => {
    const newVal = e.target.value === "" ? "" : Number(e.target.value);
    const updated = { ...breakdown, [e.target.name]: newVal };
    const totalExpenses = Number(form.expenses) || 0;
    const newTotal = (Number(updated.housing) || 0) + (Number(updated.mobility) || 0) +
                     (Number(updated.lifestyle) || 0) + (Number(updated.debt) || 0);
    if (totalExpenses > 0 && newTotal > totalExpenses) {
      setBreakdownFlash(true);
      setTimeout(() => setBreakdownFlash(false), 1800);
      return;
    }
    setBreakdown(updated);
  };

  const grossSalary = Number(form.grossSalary) || 0;
  const { paye, uif, netPay } = calcMonthlyTax(grossSalary);
  const income = netPay;
  const expenses = Number(form.expenses) || 0;

  const debtToIncome =
    income > 0 ? Math.round((breakdown.debt / income) * 100) : 0;

  const disposableIncome = income - expenses;

  /* ================= AUTO SUGGESTION ================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      name:               user.name || "",
      grossSalary:        user.grossSalary || user.salary || "",
      expenses:           user.expenses || "",
      housePrice:         user.housePrice || "",
      goalAmount:         user.goalAmount || "",
      fiveYearGoal:       user.fiveYearGoal || "",
      catchupMonthly:     user.catchupMonthly || "",
      catchupTargetMonths: user.catchupTargetMonths || "",
    });

    setSelectedTrack(user.strategy || "property");
  }, []); // 👈 IMPORTANT: empty dependency

  useEffect(() => {
    const gross = Number(form.grossSalary);
    const exp = Number(form.expenses);

    if (!gross || !exp) return;

    const { netPay: net } = calcMonthlyTax(gross);
    const savings = net - exp;
    const rate = net > 0 ? (savings / net) * 100 : 0;

    let percent = 10;
    if (rate < 15) percent = 5;
    else if (rate < 30) percent = 10;
    else percent = 15;

    setSuggestedPercent(percent);
    setUserPercent(percent);
  }, [form.grossSalary, form.expenses]);

  // Goal amount — either housePrice (property) or goalAmount (other tracks)
  const rawGoal = selectedTrack === "property"
    ? Number(form.housePrice || 0)
    : Number(form.goalAmount || 0);

  const depositAmount = selectedTrack === "property"
    ? Math.round((rawGoal * userPercent) / 100)
    : rawGoal;

  const monthlySavings = income - expenses;

  const monthsToGoal = monthlySavings > 0
    ? Math.ceil(depositAmount / monthlySavings)
    : 0;

  // ── Catch-Up specific calculations ──────────────────────────────────────────
  const totalDebt        = Number(form.goalAmount) || 0;
  const catchupMonthly   = Number(form.catchupMonthly) || 0;
  const catchupTarget    = Number(form.catchupTargetMonths) || 0;

  const actualMonths     = catchupMonthly > 0 && totalDebt > 0
    ? Math.ceil(totalDebt / catchupMonthly) : null;
  const requiredMonthly  = catchupTarget > 0 && totalDebt > 0
    ? Math.ceil(totalDebt / catchupTarget) : null;
  const shortfallMonthly = requiredMonthly && catchupMonthly
    ? Math.max(0, requiredMonthly - catchupMonthly) : null;
  const catchupFeasible  = actualMonths !== null && catchupTarget > 0
    ? actualMonths <= catchupTarget : null;

  const catchupSuggestion = (() => {
    if (!totalDebt || !catchupMonthly) return null;
    if (catchupFeasible === true)
      return { type: "good", msg: `You'll clear R${totalDebt.toLocaleString("en-ZA")} in ${actualMonths} months — ${catchupTarget > 0 ? `${catchupTarget - actualMonths} months ahead of target` : "on track"}. Great discipline!` };
    if (catchupFeasible === false)
      return { type: "warn", msg: `At R${catchupMonthly.toLocaleString("en-ZA")}/month you'll need ${actualMonths} months. To hit ${catchupTarget} months you need R${requiredMonthly?.toLocaleString("en-ZA")}/month — R${shortfallMonthly?.toLocaleString("en-ZA")} more.` };
    if (actualMonths)
      return { type: "info", msg: `At R${catchupMonthly.toLocaleString("en-ZA")}/month you'll clear your debt in ${actualMonths} months (${(actualMonths / 12).toFixed(1)} years). Set a target month to get a personalised plan.` };
    return null;
  })();

  // ── Property specific calculations ───────────────────────────────────────────
  const propDeposit        = depositAmount;
  const propMonthly        = monthlySavings;
  const propActualMonths   = propMonthly > 0 && propDeposit > 0 ? Math.ceil(propDeposit / propMonthly) : null;
  const propTarget         = Number(form.propertyTargetMonths) || 0;
  const propRequired       = propTarget > 0 && propDeposit > 0 ? Math.ceil(propDeposit / propTarget) : null;
  const propShortfall      = propRequired && propMonthly ? Math.max(0, propRequired - propMonthly) : 0;
  const propOnTrack        = propActualMonths !== null && propTarget > 0 ? propActualMonths <= propTarget : null;

  const propertySuggestion = (() => {
    if (!propDeposit || !propMonthly) return null;
    if (propOnTrack === true)
      return { type: "good", msg: `At R${propMonthly.toLocaleString("en-ZA")}/month surplus you'll save your R${propDeposit.toLocaleString("en-ZA")} deposit in ${propActualMonths} months — ${propTarget - propActualMonths} months ahead of target. Solid!` };
    if (propOnTrack === false)
      return { type: "warn", msg: `At your current surplus you'll take ${propActualMonths} months. To hit ${propTarget} months you need to save R${propRequired?.toLocaleString("en-ZA")}/month — R${propShortfall.toLocaleString("en-ZA")} more than your current surplus.` };
    if (propActualMonths)
      return { type: "info", msg: `At R${propMonthly.toLocaleString("en-ZA")}/month surplus you'll reach your R${propDeposit.toLocaleString("en-ZA")} deposit in ${propActualMonths} months (${(propActualMonths / 12).toFixed(1)} yrs). Add a target month to see if you're on track.` };
    return null;
  })();

  // ── Balanced specific calculations ────────────────────────────────────────────
  const balMonthly    = Number(form.goalAmount) || 0;
  const balGoal       = Number(form.fiveYearGoal) || 0;
  const r             = 0.10 / 12;
  const balY5         = balMonthly > 0 ? Math.round(balMonthly * ((Math.pow(1 + r, 60) - 1) / r)) : 0;
  const balSurplus    = balY5 - balGoal;
  const balOnTrack    = balGoal > 0 && balY5 > 0 ? balY5 >= balGoal : null;
  const balRequired   = balGoal > 0 ? Math.ceil(balGoal / ((Math.pow(1 + r, 60) - 1) / r)) : null;

  const balancedSuggestion = (() => {
    if (!balMonthly) return null;
    if (balOnTrack === true)
      return { type: "good", msg: `Investing R${balMonthly.toLocaleString("en-ZA")}/month at 10% p.a. gives you R${balY5.toLocaleString("en-ZA")} by Year 5 — R${balSurplus.toLocaleString("en-ZA")} above your R${balGoal.toLocaleString("en-ZA")} goal. Excellent!` };
    if (balOnTrack === false)
      return { type: "warn", msg: `R${balMonthly.toLocaleString("en-ZA")}/month gives you R${balY5.toLocaleString("en-ZA")} by Year 5, but your goal is R${balGoal.toLocaleString("en-ZA")}. You need R${balRequired?.toLocaleString("en-ZA")}/month to hit it — R${((balRequired || 0) - balMonthly).toLocaleString("en-ZA")} more.` };
    return { type: "info", msg: `Investing R${balMonthly.toLocaleString("en-ZA")}/month at 10% p.a. compounds to R${balY5.toLocaleString("en-ZA")} by Year 5. Set a 5-year goal above to see if you're on track.` };
  })();

  // ── Correction specific calculations ──────────────────────────────────────────
  const corrOverspend  = Number(form.goalAmount) || 0;
  const corrTarget     = Number(form.correctionTargetMonths) || 0;
  const corrMonthly    = corrOverspend; // the goal IS the monthly reduction amount
  const corrActual     = corrMonthly > 0 ? Math.ceil((corrMonthly * 12) / corrMonthly) : null; // 12 months to build habit
  const corrRequired   = corrTarget > 0 && corrMonthly > 0 ? Math.ceil(corrMonthly / corrTarget) : null;
  const corrOnTrack    = corrTarget > 0 ? (corrTarget >= 12 ? true : false) : null; // habit takes ~12 months

  const correctionSuggestion = (() => {
    if (!corrMonthly) return null;
    const annualSaving = corrMonthly * 12;
    if (corrOnTrack === true)
      return { type: "good", msg: `Cutting R${corrMonthly.toLocaleString("en-ZA")}/month in overspending saves R${annualSaving.toLocaleString("en-ZA")} a year. Over ${corrTarget} months that's R${(corrMonthly * corrTarget).toLocaleString("en-ZA")} back in your pocket — great target!` };
    if (corrOnTrack === false)
      return { type: "warn", msg: `Behavioural change takes at least 12 months to stick. Set your target to 12+ months for a realistic plan. Rushing correction leads to relapse.` };
    return { type: "info", msg: `Reducing overspend by R${corrMonthly.toLocaleString("en-ZA")}/month saves R${annualSaving.toLocaleString("en-ZA")}/year. Set a target month below to get your personalised correction timeline.` };
  })();

  // Goal card heading per track
  const goalCardLabel = {
    property:   "Recommended deposit",
    balanced:   "Monthly investment goal",
    catchup:    "Debt payoff target",
    correction: "Monthly reduction target",
  }[selectedTrack];

  const goalTimeline = {
    property:   monthsToGoal > 0 ? `${monthsToGoal} months to reach deposit` : "Add income details",
    balanced:   rawGoal > 0 ? `R${rawGoal.toLocaleString("en-ZA")} invested monthly` : "Set your target",
    catchup:    monthsToGoal > 0 ? `${monthsToGoal} months to clear debt` : "Add income details",
    correction: rawGoal > 0 ? `Reduce R${rawGoal.toLocaleString("en-ZA")} / month` : "Set your target",
  }[selectedTrack];

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const gross = Number(form.grossSalary);
    const exp = Number(form.expenses);
    const housePrice = selectedTrack === "property" ? Number(form.housePrice) : 0;

    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!gross || !exp) {
      alert("Please fill in all fields");
      return;
    }

    if (gross <= 0 || exp < 0) {
      alert("Please enter valid positive numbers");
      return;
    }

    const { paye: submittedPAYE, uif: submittedUIF, netPay: submittedNet } = calcMonthlyTax(gross);

    if (exp >= submittedNet) {
      alert("Your expenses cannot exceed your net take-home pay");
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name,
      strategy: selectedTrack,
      isSetupComplete: true,
      grossSalary: gross,
      salary: submittedNet,
      netSalary: submittedNet,
      paye: submittedPAYE,
      uif: submittedUIF,
      expenses: exp,
      housePrice,
      goalAmount: rawGoal,
      depositPercent: userPercent,
      depositAmount,
      monthsToGoal,
      savings: submittedNet - exp,
      breakdown,
      fiveYearGoal:         Number(form.fiveYearGoal) || 0,
      catchupMonthly:         Number(form.catchupMonthly) || 0,
      catchupTargetMonths:    Number(form.catchupTargetMonths) || 0,
      propertyTargetMonths:   Number(form.propertyTargetMonths) || 0,
      correctionTargetMonths: Number(form.correctionTargetMonths) || 0,
      debt:                 selectedTrack === "catchup" ? totalDebt : Number(form.goalAmount) || 0,
      actualDebtMonths:     actualMonths,
      requiredMonthlyDebt:  requiredMonthly,
    };

    setUser(updatedUser); // ✅ THIS replaces localStorage.setItem
    navigate("/home");
  };

  const tracks = [
    { id: "property",   Icon: Home,       label: "First Property Track", desc: "Build a deposit & buy your first home" },
    { id: "balanced",   Icon: Wallet,     label: "Balanced Lifestyle",   desc: "Manage spending + investing together" },
    { id: "catchup",    Icon: Zap,        label: "Catch-Up Wealth",      desc: "Aggressive saving strategy" },
    { id: "correction", Icon: RefreshCw,  label: "Lifestyle Correction", desc: "Reduce debt & reset your finances" },
  ];

  return (
    <div className="setup-page">
      <AppNav />

      <div className="setup-container">
        <div className="setup-header">
          <h2>Set your finances</h2>
          <p className="setup-sub">Tell us about your situation to personalise your experience</p>
        </div>

        <div className="setup-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="setup-left">

            {/* TRACK SELECT */}
            <div className="setup-section">
              <p className="section-label">Choose your strategy</p>
              <div className="track-options">
                {tracks.map(({ id, Icon, label, desc }) => (
                  <div
                    key={id}
                    className={`track-card ${selectedTrack === id ? "selected" : ""}`}
                    onClick={() => setSelectedTrack(id)}
                  >
                    <Icon size={18} className="track-icon" strokeWidth={1.5} />
                    <div>
                      <div className="track-title">{label}</div>
                      <div className="track-preview">{desc}</div>
                    </div>
                    {selectedTrack === id && <span className="track-check">✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* METRICS */}
            <div className="setup-metrics">
              <div className="metric-pill">
                <span className="metric-label">Debt-to-income</span>
                <strong>{debtToIncome}%</strong>
              </div>
              <div className="metric-pill">
                <span className="metric-label">Disposable</span>
                <strong>R{disposableIncome.toLocaleString("en-ZA")}</strong>
              </div>
              {grossSalary > 0 && form.expenses && (
                <div className="metric-pill">
                  <span className="metric-label">Savings rate</span>
                  <strong>{income > 0 ? Math.round((monthlySavings / income) * 100) : 0}%</strong>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="setup-right">

            {/* PERSONAL + FINANCIAL INPUTS */}
            <div className="setup-section">
              <p className="section-label">Your details</p>
              <div className="input-row">
                <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
                <div className="labelled-input">
                  <label>Gross monthly salary (R)</label>
                  <input type="number" name="grossSalary" placeholder="e.g. 35 000" value={form.grossSalary} onChange={handleChange} />
                  {grossSalary > 0 && (
                    <div className="tax-inline">
                      <span>PAYE <strong>R{paye.toLocaleString("en-ZA")}</strong></span>
                      <span>UIF <strong>R{uif.toLocaleString("en-ZA")}</strong></span>
                      <span>Take-home <strong className="tax-net">R{income.toLocaleString("en-ZA")}</strong></span>
                    </div>
                  )}
                </div>
              </div>
              <div className="input-row">
                <input type="number" name="expenses" placeholder="Monthly expenses (R)" value={form.expenses} onChange={handleChange} />
                <div className={`goal-input-wrap${goalFlash ? " goal-input-flash" : ""}`}>
                  <input
                    type="number"
                    name={goalConfig.field}
                    placeholder={goalConfig.label}
                    value={form[goalConfig.field]}
                    onChange={handleChange}
                  />
                  <span className="goal-hint">{goalConfig.hint}</span>
                  {goalFlash && (
                    <p className="goal-flash-warning">
                      ⚠ Your investment goal exceeds your disposable income of R{disposableIncome.toLocaleString("en-ZA")}. Please enter a lower amount.
                    </p>
                  )}
                </div>
              </div>

              {/* 5-YEAR GOAL */}
              <div className="five-year-goal-row">
                <div className="five-year-goal-label">
                  <span className="five-year-icon">5</span>
                  <div>
                    <p className="five-year-title">Your 5-year goal</p>
                    <p className="five-year-hint">{(fiveYearGoalConfig[selectedTrack] || fiveYearGoalConfig.foundation).hint}</p>
                  </div>
                </div>
                <input
                  type="number"
                  name="fiveYearGoal"
                  placeholder={(fiveYearGoalConfig[selectedTrack] || fiveYearGoalConfig.foundation).label}
                  value={form.fiveYearGoal}
                  onChange={handleChange}
                  className="five-year-input"
                />
              </div>
            </div>

            {/* ── PROPERTY PLAN ── */}
            {selectedTrack === "property" && (
              <div className="setup-section" style={{ borderLeft: "3px solid #84a794" }}>
                <p className="section-label" style={{ color: "#84a794" }}>Property Plan</p>
                <div className="input-row">
                  <div className="labelled-input">
                    <label><Target size={12} /> Target months to save deposit</label>
                    <input type="number" name="propertyTargetMonths" placeholder="e.g. 24"
                      value={form.propertyTargetMonths} onChange={handleChange} />
                    <span className="goal-hint">How many months do you want to save your deposit in?</span>
                  </div>
                  <div className="labelled-input" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ margin: 0, fontSize: "0.65rem", color: "#445550", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current monthly surplus</p>
                    <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 700, color: propMonthly > 0 ? "#84a794" : "#445550" }}>
                      {propMonthly > 0 ? `R${propMonthly.toLocaleString("en-ZA")}` : "Add salary & expenses"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#556660" }}>Goes toward deposit each month</p>
                  </div>
                </div>
                {propertySuggestion && (
                  <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start",
                    background: propertySuggestion.type === "good" ? "rgba(132,167,148,0.08)" : propertySuggestion.type === "warn" ? "rgba(214,168,90,0.08)" : "rgba(79,172,254,0.07)",
                    border: `1px solid ${propertySuggestion.type === "good" ? "rgba(132,167,148,0.25)" : propertySuggestion.type === "warn" ? "rgba(214,168,90,0.25)" : "rgba(79,172,254,0.2)"}` }}>
                    <CheckCircle size={16} color={propertySuggestion.type === "good" ? "#84a794" : propertySuggestion.type === "warn" ? "#d6a85a" : "#4facfe"} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "0.78rem", fontWeight: 700, color: propertySuggestion.type === "good" ? "#84a794" : propertySuggestion.type === "warn" ? "#d6a85a" : "#4facfe" }}>
                        {propertySuggestion.type === "good" ? "On track 🏠" : propertySuggestion.type === "warn" ? "Needs adjustment ⚡" : "Deposit insight"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.6 }}>{propertySuggestion.msg}</p>
                      {propertySuggestion.type === "warn" && propRequired && (
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          {[["Your surplus", `R${propMonthly.toLocaleString("en-ZA")}/mo`, "#d6a85a"], ["Need", `R${propRequired.toLocaleString("en-ZA")}/mo`, "#4facfe"], ["Shortfall", `R${propShortfall.toLocaleString("en-ZA")}/mo`, "#ff9898"]].map(([l, v, c]) => (
                            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "5px 12px" }}>
                              <p style={{ margin: 0, fontSize: "0.6rem", color: "#445550", textTransform: "uppercase" }}>{l}</p>
                              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: c }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── BALANCED PLAN ── */}
            {selectedTrack === "balanced" && (
              <div className="setup-section" style={{ borderLeft: "3px solid #4facfe" }}>
                <p className="section-label" style={{ color: "#4facfe" }}>Investment Plan</p>
                <div className="input-row">
                  <div className="labelled-input" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ margin: 0, fontSize: "0.65rem", color: "#445550", textTransform: "uppercase", letterSpacing: "0.08em" }}>Year 5 projection</p>
                    <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 700, color: balY5 > 0 ? "#4facfe" : "#445550" }}>
                      {balY5 > 0 ? `R${balY5.toLocaleString("en-ZA")}` : "Set monthly amount"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#556660" }}>At 10% p.a. compound growth</p>
                  </div>
                  <div className="labelled-input" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ margin: 0, fontSize: "0.65rem", color: "#445550", textTransform: "uppercase", letterSpacing: "0.08em" }}>vs your 5-year goal</p>
                    <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 700, color: balOnTrack === true ? "#84a794" : balOnTrack === false ? "#ff9898" : "#445550" }}>
                      {balGoal > 0 ? (balOnTrack === true ? `+R${balSurplus.toLocaleString("en-ZA")}` : balOnTrack === false ? `-R${Math.abs(balSurplus).toLocaleString("en-ZA")}` : "—") : "Set 5-yr goal"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#556660" }}>{balOnTrack === true ? "Ahead of goal" : balOnTrack === false ? "Below goal" : "Add goal to compare"}</p>
                  </div>
                </div>
                {balancedSuggestion && (
                  <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start",
                    background: balancedSuggestion.type === "good" ? "rgba(132,167,148,0.08)" : balancedSuggestion.type === "warn" ? "rgba(214,168,90,0.08)" : "rgba(79,172,254,0.07)",
                    border: `1px solid ${balancedSuggestion.type === "good" ? "rgba(132,167,148,0.25)" : balancedSuggestion.type === "warn" ? "rgba(214,168,90,0.25)" : "rgba(79,172,254,0.2)"}` }}>
                    <CheckCircle size={16} color={balancedSuggestion.type === "good" ? "#84a794" : balancedSuggestion.type === "warn" ? "#d6a85a" : "#4facfe"} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "0.78rem", fontWeight: 700, color: balancedSuggestion.type === "good" ? "#84a794" : balancedSuggestion.type === "warn" ? "#d6a85a" : "#4facfe" }}>
                        {balancedSuggestion.type === "good" ? "On track 📈" : balancedSuggestion.type === "warn" ? "Increase monthly amount ⚡" : "Projection insight"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.6 }}>{balancedSuggestion.msg}</p>
                      {balancedSuggestion.type === "warn" && balRequired && (
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          {[["Investing now", `R${balMonthly.toLocaleString("en-ZA")}/mo`, "#d6a85a"], ["Need", `R${balRequired.toLocaleString("en-ZA")}/mo`, "#4facfe"], ["Yr 5 projection", `R${balY5.toLocaleString("en-ZA")}`, "#84a794"]].map(([l, v, c]) => (
                            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "5px 12px" }}>
                              <p style={{ margin: 0, fontSize: "0.6rem", color: "#445550", textTransform: "uppercase" }}>{l}</p>
                              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: c }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CORRECTION PLAN ── */}
            {selectedTrack === "correction" && (
              <div className="setup-section" style={{ borderLeft: "3px solid #ff9898" }}>
                <p className="section-label" style={{ color: "#ff9898" }}>Correction Plan</p>
                <div className="input-row">
                  <div className="labelled-input">
                    <label><Clock size={12} /> Target months to correct habits</label>
                    <input type="number" name="correctionTargetMonths" placeholder="e.g. 12"
                      value={form.correctionTargetMonths} onChange={handleChange} />
                    <span className="goal-hint">In how many months do you want to be back on track?</span>
                  </div>
                  <div className="labelled-input" style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ margin: 0, fontSize: "0.65rem", color: "#445550", textTransform: "uppercase", letterSpacing: "0.08em" }}>Annual saving if corrected</p>
                    <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 700, color: corrMonthly > 0 ? "#84a794" : "#445550" }}>
                      {corrMonthly > 0 ? `R${(corrMonthly * 12).toLocaleString("en-ZA")}` : "Set overspend amount"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.68rem", color: "#556660" }}>Per year back in your pocket</p>
                  </div>
                </div>
                {correctionSuggestion && (
                  <div style={{ marginTop: 12, padding: "14px 16px", borderRadius: 12, display: "flex", gap: 12, alignItems: "flex-start",
                    background: correctionSuggestion.type === "good" ? "rgba(132,167,148,0.08)" : correctionSuggestion.type === "warn" ? "rgba(214,168,90,0.08)" : "rgba(79,172,254,0.07)",
                    border: `1px solid ${correctionSuggestion.type === "good" ? "rgba(132,167,148,0.25)" : correctionSuggestion.type === "warn" ? "rgba(214,168,90,0.25)" : "rgba(79,172,254,0.2)"}` }}>
                    <CheckCircle size={16} color={correctionSuggestion.type === "good" ? "#84a794" : correctionSuggestion.type === "warn" ? "#d6a85a" : "#4facfe"} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: "0 0 4px", fontSize: "0.78rem", fontWeight: 700, color: correctionSuggestion.type === "good" ? "#84a794" : correctionSuggestion.type === "warn" ? "#d6a85a" : "#4facfe" }}>
                        {correctionSuggestion.type === "good" ? "Realistic plan 🔄" : correctionSuggestion.type === "warn" ? "Set a longer target ⚠" : "Correction insight"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.6 }}>{correctionSuggestion.msg}</p>
                      {correctionSuggestion.type === "good" && corrMonthly && corrTarget && (
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          {[["Monthly saved", `R${corrMonthly.toLocaleString("en-ZA")}`, "#84a794"], ["Over target", `${corrTarget} months`, "#4facfe"], ["Total reclaimed", `R${(corrMonthly * corrTarget).toLocaleString("en-ZA")}`, "#d6a85a"]].map(([l, v, c]) => (
                            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "5px 12px" }}>
                              <p style={{ margin: 0, fontSize: "0.6rem", color: "#445550", textTransform: "uppercase" }}>{l}</p>
                              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: c }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CATCH-UP SPECIFIC FIELDS ── */}
            {selectedTrack === "catchup" && (
              <div className="setup-section" style={{ borderLeft: "3px solid #d6a85a" }}>
                <p className="section-label" style={{ color: "#d6a85a" }}>Catch-Up Plan</p>

                <div className="input-row">
                  <div className="labelled-input">
                    <label><TrendingDown size={12} /> Monthly debt contribution (R)</label>
                    <input
                      type="number"
                      name="catchupMonthly"
                      placeholder="e.g. 5 000"
                      value={form.catchupMonthly}
                      onChange={handleChange}
                    />
                    <span className="goal-hint">How much can you put toward debt each month?</span>
                  </div>
                  <div className="labelled-input">
                    <label><Clock size={12} /> Target months to clear debt</label>
                    <input
                      type="number"
                      name="catchupTargetMonths"
                      placeholder="e.g. 24"
                      value={form.catchupTargetMonths}
                      onChange={handleChange}
                    />
                    <span className="goal-hint">In how many months do you want to be debt-free?</span>
                  </div>
                </div>

                {/* Smart suggestion */}
                {catchupSuggestion && (
                  <div style={{
                    marginTop: 12,
                    padding: "14px 16px",
                    borderRadius: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    background: catchupSuggestion.type === "good"
                      ? "rgba(132,167,148,0.08)" : catchupSuggestion.type === "warn"
                      ? "rgba(214,168,90,0.08)" : "rgba(79,172,254,0.07)",
                    border: `1px solid ${catchupSuggestion.type === "good"
                      ? "rgba(132,167,148,0.25)" : catchupSuggestion.type === "warn"
                      ? "rgba(214,168,90,0.25)" : "rgba(79,172,254,0.2)"}`,
                  }}>
                    <CheckCircle size={16} color={catchupSuggestion.type === "good" ? "#84a794" : catchupSuggestion.type === "warn" ? "#d6a85a" : "#4facfe"} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: catchupSuggestion.type === "good" ? "#84a794" : catchupSuggestion.type === "warn" ? "#d6a85a" : "#4facfe", marginBottom: 4 }}>
                        {catchupSuggestion.type === "good" ? "On track 🎯" : catchupSuggestion.type === "warn" ? "Needs adjustment ⚡" : "Plan insight"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8", lineHeight: 1.6 }}>{catchupSuggestion.msg}</p>
                      {catchupSuggestion.type === "warn" && requiredMonthly && (
                        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                          {[
                            ["Your current", `R${catchupMonthly.toLocaleString("en-ZA")}/mo`, "#d6a85a"],
                            ["Need to reach target", `R${requiredMonthly.toLocaleString("en-ZA")}/mo`, "#4facfe"],
                            ["Shortfall", `R${shortfallMonthly?.toLocaleString("en-ZA")}/mo`, "#ff9898"],
                          ].map(([l, v, c]) => (
                            <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "6px 12px" }}>
                              <p style={{ margin: 0, fontSize: "0.62rem", color: "#556660", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
                              <p style={{ margin: 0, fontSize: "0.82rem", fontWeight: 700, color: c }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SPENDING BREAKDOWN */}
            <div className="setup-section">
              {(() => {
                const totalExpenses = Number(form.expenses) || 0;
                const breakdownTotal = (Number(breakdown.housing)||0)+(Number(breakdown.mobility)||0)+(Number(breakdown.lifestyle)||0)+(Number(breakdown.debt)||0);
                const remaining = totalExpenses - breakdownTotal;
                const isOver = breakdownTotal > totalExpenses && totalExpenses > 0;
                return (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                    <p className="section-label" style={{ margin:0 }}>Spending breakdown</p>
                    {totalExpenses > 0 && (
                      <span style={{ fontSize:"0.72rem", color: isOver?"#ff6b6b": remaining===0?"#84a794":"#667c74" }}>
                        {isOver ? `Over R${Math.abs(remaining).toLocaleString("en-ZA")}` : remaining===0 ? "Fully allocated ✓" : `R${remaining.toLocaleString("en-ZA")} left`}
                      </span>
                    )}
                  </div>
                );
              })()}
              <div className={breakdownFlash ? "breakdown-flash" : ""} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
                {[
                  { icon:<Building2 size={11}/>, label:"Housing", name:"housing",   ph:"8 000" },
                  { icon:<Car size={11}/>,       label:"Transport",name:"mobility",  ph:"3 000" },
                  { icon:<ShoppingBag size={11}/>,label:"Lifestyle",name:"lifestyle",ph:"5 000" },
                  { icon:<CreditCard size={11}/>, label:"Debt",    name:"debt",      ph:"2 000" },
                ].map(({ icon, label, name, ph }) => (
                  <div key={name} className="labelled-input">
                    <label>{icon} {label}</label>
                    <input type="number" name={name} placeholder={ph} value={breakdown[name]} onChange={handleBreakdownChange} />
                  </div>
                ))}
              </div>
              {breakdownFlash && <p className="goal-flash-warning">⚠ Total exceeds R{(Number(form.expenses)||0).toLocaleString("en-ZA")} — reduce a category first.</p>}
            </div>

            {/* GOAL CARD — adapts per track */}
            {rawGoal > 0 && (
              <div className="deposit-card">
                <div className="deposit-header">
                  <p>{goalCardLabel}</p>
                  <span className="badge">Calculated</span>
                </div>

                {selectedTrack === "property" ? (
                  <>
                    <h1>{userPercent}% <span>(R{depositAmount.toLocaleString("en-ZA")})</span></h1>
                    <input type="range" min="5" max="20" value={userPercent} onChange={(e) => setUserPercent(Number(e.target.value))} className="slider" />
                    <div className="range-labels"><span>5%</span><span>20%</span></div>
                    {userPercent !== suggestedPercent && <p className="muted small">Suggested: {suggestedPercent}%</p>}
                  </>
                ) : (
                  <h1>R{rawGoal.toLocaleString("en-ZA")}</h1>
                )}

                <p className="timeline">{goalTimeline}</p>
              </div>
            )}

            <button className="btn primary" onClick={handleSubmit}>
              Save & Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
