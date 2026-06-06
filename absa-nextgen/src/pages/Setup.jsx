import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/setup.css";
import { useUser } from "../context/UserContext";
import { calcMonthlyTax } from "../utils/tax";
import { Home, Wallet, Zap, RefreshCw, Building2, Car, ShoppingBag, CreditCard } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    name:         user?.name || "",
    grossSalary:  user?.grossSalary || user?.salary || "",
    expenses:     user?.expenses || "",
    housePrice:   user?.housePrice || "",
    goalAmount:   user?.goalAmount || "",
    fiveYearGoal: user?.fiveYearGoal || "",
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
      name:         user.name || "",
      grossSalary:  user.grossSalary || user.salary || "",
      expenses:     user.expenses || "",
      housePrice:   user.housePrice || "",
      goalAmount:   user.goalAmount || "",
      fiveYearGoal: user.fiveYearGoal || "",
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
      fiveYearGoal: Number(form.fiveYearGoal) || 0,
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

            {/* SPENDING BREAKDOWN */}
            <div className="setup-section">
              {(() => {
                const totalExpenses = Number(form.expenses) || 0;
                const breakdownTotal = (Number(breakdown.housing) || 0) + (Number(breakdown.mobility) || 0) +
                                       (Number(breakdown.lifestyle) || 0) + (Number(breakdown.debt) || 0);
                const remaining = totalExpenses - breakdownTotal;
                const isOver = breakdownTotal > totalExpenses && totalExpenses > 0;
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <p className="section-label" style={{ margin: 0 }}>Spending breakdown</p>
                    {totalExpenses > 0 && (
                      <span style={{ fontSize: "0.78rem", color: isOver ? "#ff6b6b" : remaining === 0 ? "#84a794" : "#8a9a96" }}>
                        {isOver
                          ? `Over by R${Math.abs(remaining).toLocaleString("en-ZA")}`
                          : remaining === 0
                          ? "Fully allocated ✓"
                          : `R${remaining.toLocaleString("en-ZA")} unallocated of R${totalExpenses.toLocaleString("en-ZA")}`}
                      </span>
                    )}
                  </div>
                );
              })()}
              <div className={breakdownFlash ? "breakdown-flash" : ""}>
                <div className="input-row">
                  <div className="labelled-input">
                    <label><Building2 size={12} /> Housing / Rent</label>
                    <input type="number" name="housing" placeholder="e.g. 8 000" value={breakdown.housing} onChange={handleBreakdownChange} />
                  </div>
                  <div className="labelled-input">
                    <label><Car size={12} /> Transport</label>
                    <input type="number" name="mobility" placeholder="e.g. 3 000" value={breakdown.mobility} onChange={handleBreakdownChange} />
                  </div>
                </div>
                <div className="input-row">
                  <div className="labelled-input">
                    <label><ShoppingBag size={12} /> Lifestyle</label>
                    <input type="number" name="lifestyle" placeholder="e.g. 5 000" value={breakdown.lifestyle} onChange={handleBreakdownChange} />
                  </div>
                  <div className="labelled-input">
                    <label><CreditCard size={12} /> Debt Repayments</label>
                    <input type="number" name="debt" placeholder="e.g. 2 000" value={breakdown.debt} onChange={handleBreakdownChange} />
                  </div>
                </div>
                {breakdownFlash && (
                  <p className="goal-flash-warning">
                    ⚠ Your breakdown total would exceed your monthly expenses of R{(Number(form.expenses) || 0).toLocaleString("en-ZA")}. Reduce another category first.
                  </p>
                )}
              </div>
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
