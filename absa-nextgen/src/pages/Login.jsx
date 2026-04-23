import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/login.css";
import planet from "../assets/planet.png";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  //  If already logged in
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) navigate("/home");
  }, []);

  const handleLogin = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
      setError("No account found. Please register first.");
      return;
    }

    if (form.email !== user.email || form.password !== user.password) {
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
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/register")}>Register</button>
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
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button className="submit">Login</button>
          </form>

          <p className="switch">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register</span>
          </p>
        </div>
      </div>
    </div>
  );
}
