import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/login.css";
import planet from "../assets/planet.png"; // ✅ FIX

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please register first");
      return;
    }

    if (user.isSetupComplete) {
      navigate("/home");
    } else {
      navigate("/setup");
    }
  };

  return (
    <div className="login-page">
      <div className="login-nav">
        <h1>ABSA Wealth</h1>
        <div>
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>

      <div className="login-container">
        {/* LEFT */}
        <div className="login-left">
          <img src={planet} alt="planet" /> {/* ✅ FIXED */}
          <div className="brand">
            <h2>ABSA WEALTH</h2>
            <p>Financial clarity for your first 5 years</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="login-right">
          <h2>Login</h2>
          <p className="subtitle">Welcome back</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
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
