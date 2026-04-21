import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LandingNav from "../components/LandingNav";
import "../styles/landing.css";

import {
  FaInstagram,
  FaYoutube,
  FaEnvelope,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

import coins from "../assets/coins.png";
import magnifier from "../assets/magnifier.png";
import house from "../assets/house.png";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  // 🔥 UNIVERSAL SCROLL FUNCTION
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      {/* PASS SCROLL FUNCTION TO NAV */}
      <LandingNav scrollTo={scrollToSection} />

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-content container">
          <h1>Your First Five Years Start Here</h1>
          <p>Navigate your financial future with clarity</p>

          <button className="primary-btn" onClick={() => navigate("/login")}>
            Start Your Journey
          </button>

          {/* SCROLL ARROW */}
          <div
            className="scroll-indicator"
            onClick={() => scrollToSection("trust")}
          >
            <div className="mouse">
              <div className="wheel"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust" className="section container fade-in">
        <div className="text">
          <h2>Trusted by a new generation of professionals</h2>
          <p>
            ABSA Wealth Studio is built specifically for young professionals
            navigating their first real financial decisions — from salaries and
            savings to property and long-term investing.
          </p>
          <p>
            It’s more than banking. It’s a structured system designed to help
            you understand, plan, and grow your financial future with clarity.
          </p>
        </div>

        <img src={coins} className="image" alt="coins" />
      </section>

      {/* GRAPH */}
      <section className="graph-section container fade-in">
        <h2>Your Financial Growth</h2>

        <div className="graph">
          <div className="line"></div>
          <div className="dot"></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section container reverse fade-in">
        <img src={magnifier} className="image" alt="magnifier" />

        <div className="text">
          <h2>How it works</h2>

          <p>
            <strong>1. See everything</strong>
            <br />
            Track income and expenses clearly.
          </p>
          <p>
            <strong>2. Choose direction</strong>
            <br />
            Pick your financial path.
          </p>
          <p>
            <strong>3. Make decisions</strong>
            <br />
            Simulate before you commit.
          </p>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="section container fade-in">
        <div className="text">
          <h2>Support</h2>
          <p>
            We guide you with clarity at every step — whether you're budgeting,
            saving, or preparing for major financial milestones.
          </p>
        </div>

        <img src={house} className="image" alt="house" />
      </section>

      {/* CTA */}
      <section className="cta container fade-in">
        <h2>Start your financial freedom today</h2>

        <div className="cta-spacer"></div>

        <button className="primary-btn" onClick={() => navigate("/login")}>
          Start Your Journey
        </button>
      </section>

      {/* FOOTER */}
      <section className="footer-extended">
        <div className="footer-grid container">
          <div className="footer-card">
            <h4>ABSA Wealth Studio</h4>
            <p>Johannesburg, South Africa</p>
          </div>

          <div className="footer-card">
            <h4>Explore</h4>
            <p>Money Snapshot</p>
            <p>Strategy Tracks</p>
          </div>

          <div className="footer-card">
            <h4>Learn</h4>
            <p>Budgeting Basics</p>
            <p>Investing 101</p>
          </div>

          <div className="footer-card">
            <h4>Support</h4>
            <p>Help Centre</p>
            <p>Contact</p>
          </div>
        </div>

        <div className="socials">
          <FaInstagram />
          <FaYoutube />
          <FaEnvelope />
          <FaFacebook />
          <FaWhatsapp />
        </div>
      </section>
    </div>
  );
}
