import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/setup.css";

export default function Setup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");
  const [selected, setSelected] = useState(null);

  const [form, setForm] = useState({
    salary: "",
    expenses: "",
    housePrice: "",
    depositPercent: 10,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const next = () => {
    setDirection("forward");
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection("back");
    setStep((s) => s - 1);
  };

  const skip = () => navigate("/home");

  const handleSubmit = () => {
    const depositAmount = (form.housePrice * form.depositPercent) / 100;

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      ...user,
      strategy: selected,
      salary: Number(form.salary),
      expenses: Number(form.expenses),
      housePrice: Number(form.housePrice),
      depositPercent: Number(form.depositPercent),
      depositGoal: depositAmount,
      isSetupComplete: true,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    next(); // go to recommendations
  };

  const savingsRate =
    form.salary && form.expenses
      ? Math.round(((form.salary - form.expenses) / form.salary) * 100)
      : 0;

  return (
    <div className="setup-page">
      <button className="skip-btn" onClick={skip}>
        Skip
      </button>

      {/* PROGRESS BAR */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className={`slide ${direction}`}>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="step-content">
            <h1>Welcome to Wealth Studio</h1>
            <p>Build your personalised financial journey</p>

            <div className="features">
              <div className="feature-card">💰 Money Snapshot</div>
              <div className="feature-card">📊 Strategy Track</div>
              <div className="feature-card">🧪 Simulation Lab</div>
            </div>

            <button className="btn primary" onClick={next}>
              Get Started →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="step-content">
            <h2>Choose Your Strategy</h2>

            <div className="strategy-options">
              <div
                className={`strategy-card ${
                  selected === "Property" ? "selected-card" : ""
                }`}
                onClick={() => setSelected("Property")}
              >
                🏡 Property
                {selected === "Property" && <div className="checkmark">✓</div>}
              </div>
            </div>

            <div className="nav-buttons">
              <button className="btn secondary" onClick={back}>
                Back
              </button>
              <button
                className="btn primary"
                onClick={next}
                disabled={!selected}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="step-content">
            <h2>Your Financial Setup</h2>

            <input
              type="number"
              name="salary"
              placeholder="Monthly Salary (R)"
              onChange={handleChange}
            />

            <input
              type="number"
              name="expenses"
              placeholder="Monthly Expenses (R)"
              onChange={handleChange}
            />

            <input
              type="number"
              name="housePrice"
              placeholder="Target House Price (R)"
              onChange={handleChange}
            />

            <div className="nav-buttons">
              <button className="btn secondary" onClick={back}>
                Back
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Finish →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 (🔥 PREMIUM TOUCH) */}
        {step === 4 && (
          <div className="step-content">
            <h2>Your Financial Insight</h2>

            <div className="insight-card">
              <p>
                You save <strong>{savingsRate}%</strong> of your income
              </p>

              {savingsRate > 20 && <p className="good">🔥 Strong position</p>}

              {savingsRate < 10 && <p className="bad">⚠️ Improve savings</p>}
            </div>

            <button className="btn primary" onClick={() => navigate("/home")}>
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
