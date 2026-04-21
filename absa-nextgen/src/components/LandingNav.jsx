import { useNavigate } from "react-router-dom";
import "../styles/nav.css";

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
      <h1 className="logo">ABSA Wealth Studio</h1>

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
