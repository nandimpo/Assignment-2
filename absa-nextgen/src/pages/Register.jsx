import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleRegister = () => {
    const user = {
      name,
      isSetupComplete: false,
      strategy: null,
      simulations: [],
    };

    localStorage.setItem("user", JSON.stringify(user));
    navigate("/setup");
  };

  return (
    <div className="register-page">
      {/* LEFT BRAND SIDE */}
      <div className="register-left">
        <div className="brand-box">
          <div className="logo-circle"></div>

          <h2>ABSA NextGen Wealth</h2>
          <p>First Five Years Financial Studio</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="register-right">
        <div className="form-box">
          <h1>Create Account</h1>
          <p className="subtitle">Start your journey to financial clarity</p>

          <input
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />

          <button onClick={handleRegister}>Continue</button>

          <p className="switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}
