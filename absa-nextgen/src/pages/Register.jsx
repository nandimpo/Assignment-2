import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useTransitionNavigate from "../hooks/useTransitionNavigate";
import "../styles/register.css";
import planet from "../assets/planet.png";

export default function Register() {
  const navigate = useNavigate();
  const transitionTo = useTransitionNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const nameValid = form.name.trim().length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = form.password.length >= 6;

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    let email = form.email.trim();

    // ✅ AUTO-ADD DOMAIN if user forgot @
    if (!email.includes("@")) {
      email = email + "@example.com";
    }

    // ✅ STRICT email check (@ and . required)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValid) {
      setError("Please enter a valid email (must include @ and .)");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const user = {
      name: form.name,
      email: email.toLowerCase(), // ✅ uses updated email
      password: form.password,
      isSetupComplete: false,
      strategy: null,
      simulations: [],
    };

    // Save user to localStorage so UserContext and Login can read it
    localStorage.setItem("user", JSON.stringify(user));

    // Create session
    sessionStorage.setItem("session", JSON.stringify({ loggedIn: true }));

    navigate("/setup");
  };

  return (
    <div className="login-page">
      {/* NAV */}
      <div className="login-nav">
        <h1>ABSA Wealth Studio</h1>

        <div>
          <button onClick={() => navigate("/?skip=true")}>Home</button>
          <button onClick={() => transitionTo("/login", "gold")}>Login</button>
        </div>
      </div>

      {/* REGISTER PAGE */}
      <div className="register-page">
        {/* LEFT */}
        <div className="register-left">
          <div className="brand-box">
            <img src={planet} alt="planet" className="planet" />

            <h2>ABSA NextGen Wealth</h2>
            <p>First Five Years Financial Studio</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="register-right">
          <div className="form-box">
            <h1>Create Account</h1>
            <p className="subtitle">Start your journey to financial clarity</p>

            {error && <div className="error">{error}</div>}

            <div className="input-wrap">
              <input
                placeholder="Your Name"
                value={form.name}
                className={nameValid ? "input-valid" : ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {nameValid && <span className="input-check">✓</span>}
            </div>

            <div className="input-wrap">
              <input
                type="email"
                placeholder="Email (e.g. name or name@email.com)"
                value={form.email}
                className={emailValid ? "input-valid" : ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {emailValid && <span className="input-check">✓</span>}
            </div>

            <div className="input-wrap">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                className={passwordValid ? "input-valid" : ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {passwordValid && <span className="input-check">✓</span>}
            </div>

            <button onClick={handleRegister}>Continue</button>

            <p className="switch">
              Already have an account?{" "}
              <span onClick={() => transitionTo("/login", "gold")}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
