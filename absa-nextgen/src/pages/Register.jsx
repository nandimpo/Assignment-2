import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/register.css";
import planet from "../assets/planet.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    // ✅ Simple email check (allows fake emails but enforces @)
    const emailValid = /^[^\s@]+@[^\s@]+$/.test(form.email);

    if (!emailValid) {
      setError("Please enter a valid email (must include @).");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const user = {
      name: form.name,
      email: form.email.toLowerCase(), // ✅ normalize
      password: form.password,
      isSetupComplete: false,
      strategy: null,
      simulations: [],
    };

    // Save user
    sessionStorage.setItem("user", JSON.stringify(user));

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
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/login")}>Login</button>
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

            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button onClick={handleRegister}>Continue</button>

            <p className="switch">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
