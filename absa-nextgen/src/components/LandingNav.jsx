import { useNavigate } from "react-router-dom";
import "../styles/nav.css";
import logo from "../assets/logo.png"; // ✅ ADD

export default function LandingNav() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="nav">
      {/* ✅ LOGO (UPDATED) */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

      <div className="nav-links">
        <button onClick={() => scrollTo("how")}>How it works</button>

        <button onClick={() => scrollTo("support")}>Support</button>

        <button onClick={() => navigate("/login")}>Login</button>

        <button className="primary" onClick={() => navigate("/register")}>
          Get Started
        </button>
      </div>
    </nav>
  );
}
