import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/setup.css";
import { useUser } from "../context/UserContext";

export default function Setup() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    name: user?.name || "",
    salary: user?.salary || "",
    expenses: user?.expenses || "",
    housePrice: user?.housePrice || "",
  });

  const [selectedTrack, setSelectedTrack] = useState(
    user?.strategy || "Property",
  );

  const [suggestedPercent, setSuggestedPercent] = useState(10);
  const [userPercent, setUserPercent] = useState(10);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= AUTO SUGGESTION ================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      name: user.name || "",
      salary: user.salary || "",
      expenses: user.expenses || "",
      housePrice: user.housePrice || "",
    });

    setSelectedTrack(user.strategy || "Property");
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

  const depositAmount = Math.round(
    (Number(form.housePrice || 0) * userPercent) / 100,
  );

  const monthlySavings = Number(form.salary || 0) - Number(form.expenses || 0);

  const monthsToGoal =
    monthlySavings > 0 ? Math.ceil(depositAmount / monthlySavings) : 0;

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const salary = Number(form.salary);
    const expenses = Number(form.expenses);
    const housePrice = Number(form.housePrice);

    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!salary || !expenses || !housePrice) {
      alert("Please fill in all fields");
      return;
    }

    if (salary <= 0 || expenses < 0 || housePrice <= 0) {
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
      depositPercent: userPercent,
      depositAmount,
      monthsToGoal,
      savings: salary - expenses,
    };

    setUser(updatedUser); // ✅ THIS replaces localStorage.setItem
    navigate("/home");
  };

  return (
    <div className="setup-page">
      <AppNav />

      <div className="setup-container">
        <div className="setup-card">
          <h2>Set your finances</h2>

          {/* ================= TRACK SELECT ================= */}
          <div className="track-select">
            <p className="label">Choose your strategy</p>

            <div className="track-options">
              {/* Track 1 */}
              <div
                className={`track-card ${
                  selectedTrack === "Property" ? "selected" : ""
                }`}
                onClick={() => setSelectedTrack("Property")}
              >
                <div className="track-title">🏡 First Property Track</div>
                <div className="track-preview">
                  Best for first-time buyers building a deposit
                </div>
              </div>

              {/* Track 2 */}
              <div
                className={`track-card ${
                  selectedTrack === "Balanced" ? "selected" : ""
                }`}
                onClick={() => setSelectedTrack("Balanced")}
              >
                <div className="track-title">
                  💼 Balanced Lifestyle & Investing
                </div>
                <div className="track-preview">
                  Manage spending + investing together
                </div>
              </div>

              {/* Track 3 */}
              <div
                className={`track-card ${
                  selectedTrack === "CatchUp" ? "selected" : ""
                }`}
                onClick={() => setSelectedTrack("CatchUp")}
              >
                <div className="track-title">⚡ Catch-Up Wealth</div>
                <div className="track-preview">Aggressive saving strategy</div>
              </div>
            </div>
          </div>

          {/* ================= INPUTS ================= */}
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="salary"
            placeholder="Monthly salary"
            value={form.salary}
            onChange={handleChange}
          />

          <input
            type="number"
            name="expenses"
            placeholder="Monthly expenses"
            value={form.expenses}
            onChange={handleChange}
          />

          <input
            type="number"
            name="housePrice"
            placeholder="Target house price"
            value={form.housePrice}
            onChange={handleChange}
          />

          {/* ================= FEEDBACK ================= */}
          {form.salary && form.expenses && (
            <div className="feedback">
              <p>
                You can save{" "}
                <strong>R{monthlySavings.toLocaleString("en-ZA")}</strong> per
                month
              </p>

              <p>
                Savings rate:{" "}
                <strong>
                  {Math.round((monthlySavings / Number(form.salary)) * 100)}%
                </strong>
              </p>
            </div>
          )}

          {/* ================= DEPOSIT ================= */}
          {form.housePrice && (
            <div className="deposit-card">
              <div className="deposit-header">
                <p>Recommended deposit</p>
                <span className="badge">AI suggestion</span>
              </div>

              <h1>
                {userPercent}%{" "}
                <span>(R{depositAmount.toLocaleString("en-ZA")})</span>
              </h1>

              <input
                type="range"
                min="5"
                max="20"
                value={userPercent}
                onChange={(e) => setUserPercent(Number(e.target.value))}
                className="slider"
              />

              <div className="range-labels">
                <span>5%</span>
                <span>20%</span>
              </div>

              {userPercent !== suggestedPercent && (
                <p className="muted small">Suggested: {suggestedPercent}%</p>
              )}

              <p className="timeline">
                {monthsToGoal > 0
                  ? `${monthsToGoal} months to reach`
                  : "Add income details"}
              </p>
            </div>
          )}

          {/* ================= BUTTON ================= */}
          <button className="btn primary" onClick={handleSubmit}>
            Save & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
