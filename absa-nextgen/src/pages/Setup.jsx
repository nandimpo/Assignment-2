import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/setup.css";
import { useUser } from "../context/UserContext";
import { Home, Wallet, Zap, RefreshCw, Building2, Car, ShoppingBag, CreditCard } from "lucide-react";

export default function Setup() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    name: user?.name || "",
    salary: user?.salary || "",
    expenses: user?.expenses || "",
    housePrice: user?.housePrice || "",
    goalAmount: user?.goalAmount || "",
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

  const goalConfig = trackGoalConfig[selectedTrack] || trackGoalConfig.property;

  const [suggestedPercent, setSuggestedPercent] = useState(10);
  const [userPercent, setUserPercent] = useState(10);

  const [breakdown, setBreakdown] = useState({
    housing:   user?.breakdown?.housing   || "",
    mobility:  user?.breakdown?.mobility  || "",
    lifestyle: user?.breakdown?.lifestyle || "",
    debt:      user?.breakdown?.debt      || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBreakdownChange = (e) => {
    setBreakdown({
      ...breakdown,
      [e.target.name]: e.target.value === "" ? "" : Number(e.target.value),
    });
  };

  const income = Number(form.salary) || 0;
  const expenses = Number(form.expenses) || 0;

  const debtToIncome =
    income > 0 ? Math.round((breakdown.debt / income) * 100) : 0;

  const disposableIncome = income - expenses;

  /* ================= AUTO SUGGESTION ================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      salary: user.salary || "",
      expenses: user.expenses || "",
      housePrice: user.housePrice || "",
    });

    setSelectedTrack(user.strategy || "property");
  }, []); // 👈 IMPORTANT: empty dependency

  useEffect(() => {
    const salary = Number(form.salary);
    const expenses = Number(form.expenses);

    if (!salary || !expenses) return;

    const savings = salary - expenses;
    const rate = (savings / salary) * 100;

    let percent = 10;

    if (rate < 15) percent = 5;
    else if (rate < 30) percent = 10;
    else percent = 15;

    setSuggestedPercent(percent);
    setUserPercent(percent);
  }, [form.salary, form.expenses]);

  // Goal amount — either housePrice (property) or goalAmount (other tracks)
  const rawGoal = selectedTrack === "property"
    ? Number(form.housePrice || 0)
    : Number(form.goalAmount || 0);

  const depositAmount = selectedTrack === "property"
    ? Math.round((rawGoal * userPercent) / 100)
    : rawGoal;

  const monthlySavings = Number(form.salary || 0) - Number(form.expenses || 0);

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
    const salary = Number(form.salary);
    const expenses = Number(form.expenses);
    const housePrice = selectedTrack === "property" ? Number(form.housePrice) : 0;

    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!salary || !expenses) {
      alert("Please fill in all fields");
      return;
    }

    if (salary <= 0 || expenses < 0) {
      alert("Please enter valid positive numbers");
      return;
    }

    if (expenses >= salary) {
      alert("Your expenses cannot be greater than or equal to your salary");
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name,
      strategy: selectedTrack,
      salary,
      expenses,
      housePrice,
      goalAmount: rawGoal,
      depositPercent: userPercent,
      depositAmount,
      monthsToGoal,
      savings: salary - expenses,
      // ✅ ADD THIS
      breakdown: breakdown,
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
              {form.salary && form.expenses && (
                <div className="metric-pill">
                  <span className="metric-label">Savings rate</span>
                  <strong>{Math.round((monthlySavings / Number(form.salary)) * 100)}%</strong>
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
                <input type="text"   name="name"       placeholder="Your name"          value={form.name}       onChange={handleChange} />
                <input type="number" name="salary"     placeholder="Monthly salary (R)" value={form.salary}     onChange={handleChange} />
              </div>
              <div className="input-row">
                <input type="number" name="expenses" placeholder="Monthly expenses (R)" value={form.expenses} onChange={handleChange} />
                <div className="goal-input-wrap">
                  <input
                    type="number"
                    name={goalConfig.field}
                    placeholder={goalConfig.label}
                    value={form[goalConfig.field]}
                    onChange={handleChange}
                  />
                  <span className="goal-hint">{goalConfig.hint}</span>
                </div>
              </div>
            </div>

            {/* SPENDING BREAKDOWN */}
            <div className="setup-section">
              <p className="section-label">Spending breakdown</p>
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
