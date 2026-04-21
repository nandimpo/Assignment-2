import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/setup.css";

export default function Setup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
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

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // ✅ FIX: ALWAYS KEEP SESSION
  const ensureSession = () => {
    const session = sessionStorage.getItem("session");
    if (!session) {
      sessionStorage.setItem("session", JSON.stringify({ loggedIn: true }));
    }
  };

  const skip = () => {
    ensureSession();
    navigate("/home");
  };

  const handleSubmit = () => {
    ensureSession();

    const user = JSON.parse(sessionStorage.getItem("user")) || {};

    const updatedUser = {
      ...user,
      strategy: selected,
      salary: Number(form.salary),
      expenses: Number(form.expenses),
      isSetupComplete: true,
    };

    sessionStorage.setItem("user", JSON.stringify(updatedUser));

    navigate("/home"); // ✅ DIRECT (no step 4 delay)
  };

  return (
    <div className="setup-page">
      <button className="skip-btn" onClick={skip}>
        Skip
      </button>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="step-content">
          <h1>Welcome to Wealth Studio</h1>
          <button onClick={next}>Get Started →</button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="step-content">
          <h2>Choose Strategy</h2>

          <div onClick={() => setSelected("Property")}>🏡 Property Track</div>

          <button onClick={back}>Back</button>
          <button onClick={next} disabled={!selected}>
            Continue →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="step-content">
          <h2>Financial Setup</h2>

          <input name="salary" placeholder="Salary" onChange={handleChange} />
          <input
            name="expenses"
            placeholder="Expenses"
            onChange={handleChange}
          />

          <button onClick={back}>Back</button>
          <button onClick={handleSubmit}>Finish →</button>
        </div>
      )}
    </div>
  );
}
