import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/setup.css";

export default function Setup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    salary: "",
    expenses: "",
    housePrice: "",
  });

  const [selectedTrack, setSelectedTrack] = useState("Property");

  const [suggestedPercent, setSuggestedPercent] = useState(10);
  const [userPercent, setUserPercent] = useState(10);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= EMAIL VALIDATION (ADDED) ================= */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* AUTO SUGGESTION */
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

  const handleSubmit = () => {
    const user = JSON.parse(sessionStorage.getItem("user")) || {};

    /* ================= EMAIL CHECK (ADDED) ================= */
    if (!user.email || !isValidEmail(user.email)) {
      alert(
        "Invalid email detected. Please register with a valid email (must include @ and .)",
      );
      navigate("/register");
      return;
    }

    const updatedUser = {
      ...user,
      strategy: selectedTrack, // ✅ SAVE TRACK
      salary: Number(form.salary),
      expenses: Number(form.expenses),
      housePrice: Number(form.housePrice),
      depositPercent: userPercent,
      depositAmount,
      monthsToGoal,
    };

    sessionStorage.setItem("user", JSON.stringify(updatedUser));
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
              <div
                className={`track-card active ${
                  selectedTrack === "Property" ? "selected" : ""
                }`}
                onClick={() => setSelectedTrack("Property")}
              >
                <div className="track-title">🏡 First Property Track</div>
                <div className="track-preview">
                  Best for first-time buyers building a deposit
                </div>
              </div>

              <div className="track-card disabled">
                <div className="track-title">
                  💼 Balanced Lifestyle & Investing
                </div>
                <div className="track-preview">
                  Coming soon — manage spending + investing together
                </div>
              </div>

              <div className="track-card disabled">
                <div className="track-title">⚡ Catch-Up Wealth</div>
                <div className="track-preview">
                  Coming soon — aggressive saving strategy
                </div>
              </div>
            </div>
          </div>

          {/* ================= INPUTS ================= */}
          <input
            name="salary"
            placeholder="Monthly salary"
            onChange={handleChange}
          />

          <input
            name="expenses"
            placeholder="Monthly expenses"
            onChange={handleChange}
          />

          <input
            name="housePrice"
            placeholder="Target house price"
            onChange={handleChange}
          />

          {/* ================= DEPOSIT ================= */}
          {form.housePrice && (
            <div className="deposit-card">
              <div className="deposit-header">
                <p>Recommended deposit</p>
                <span className="badge">AI suggestion</span>
              </div>

              <h1>
                {userPercent}% <span>(R{depositAmount.toLocaleString()})</span>
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

          <button className="btn primary" onClick={handleSubmit}>
            Finish →
          </button>
        </div>
      </div>
    </div>
  );
}
