import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useTransitionNavigate from "../hooks/useTransitionNavigate";
import "../styles/nav.css";
import logo from "../assets/logo.png";

export default function LandingNav() {
  const navigate = useNavigate();
  const transitionTo = useTransitionNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const sections = ["hero", "how", "support"];
    const observers = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [location]);

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav className="nav">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

      <div className="nav-links">
        <button
          className={activeSection === "how" ? "active" : ""}
          onClick={() => scrollTo("how")}
        >
          How it works
        </button>

        <button
          className={activeSection === "support" ? "active" : ""}
          onClick={() => scrollTo("support")}
        >
          Support
        </button>

        <button
          className={isLoginPage ? "active" : ""}
          onClick={() => transitionTo("/login")}
        >
          Login
        </button>

        <button className="primary" onClick={() => transitionTo("/register")}>
          Get Started
        </button>
      </div>
    </nav>
  );
}
