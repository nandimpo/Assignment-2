import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/login.css";
import planet from "../assets/planet.png";
import useTransitionNavigate from "../hooks/useTransitionNavigate";

export default function Login() {
  const navigate = useNavigate();
  const transitionTo = useTransitionNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = form.password.length >= 6;

  //  If already logged in
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) navigate("/home");
  }, [navigate]);

  const handleLogin = () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      setError("No account found. Please register first.");
      return;
    }

    if (form.email.toLowerCase() !== user.email || form.password !== user.password) {
      setError("Invalid email or password.");
      return;
    }

    //  create session
    sessionStorage.setItem("session", JSON.stringify({ loggedIn: true }));

    // ALWAYS GO HOME
    navigate("/home");
  };

  return (
    <div className="login-page">
      <div className="login-nav">
        <h1>ABSA Wealth Studio</h1>
        <div>
          <button onClick={() => navigate("/?skip=true")}>Home</button>
          <button onClick={() => transitionTo("/register")}>Register</button>
        </div>
      </div>

      <div className="login-container">
        {/* LEFT */}
        <div className="login-left">
          <img src={planet} alt="planet" />
          <div className="brand">
            <h2>ABSA WEALTH</h2>
            <p>Financial clarity for your first 5 years</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h2>Login</h2>
          <p className="subtitle">Welcome back</p>

          {error && <div className="error">{error}</div>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="input-wrap">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                className={emailValid ? "input-valid" : ""}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
              />
              {emailValid && <span className="input-check">✓</span>}
            </div>

            <div className="input-wrap">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                className={passwordValid ? "input-valid" : ""}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
              />
              {passwordValid && <span className="input-check">✓</span>}
            </div>

            <button className="submit">Login</button>
          </form>

          <p className="switch">
            Don’t have an account?{" "}
            <span onClick={() => transitionTo("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
