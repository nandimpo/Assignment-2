import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import useTransitionNavigate from "../hooks/useTransitionNavigate";
import "../styles/nav.css";
import logo from "../assets/logo.png";
// LandingNav component: top navigation bar with logo and links. Highlights active section based on scroll position. Changes style on scroll. Provides smooth scrolling to sections and transitions to login/register pages.
export default function LandingNav() {
  const navigate = useNavigate();
  const transitionTo = useTransitionNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollTo = (id) => {
    setMenuOpen(false);
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
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [location]);

  const isLoginPage = location.pathname === "/login";
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${menuOpen ? " nav-menu-open" : ""}`}>
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

      <button
        className="nav-burger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

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
          onClick={() => { setMenuOpen(false); transitionTo("/login"); }}
        >
          Login
        </button>

        <button className="primary" onClick={() => { setMenuOpen(false); transitionTo("/register"); }}>
          Get Started
        </button>
      </div>
    </nav>
  );
}
