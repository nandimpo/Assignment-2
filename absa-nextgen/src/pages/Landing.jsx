import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LandingNav from "../components/LandingNav";
import "../styles/landing.css";

import coins from "../assets/coins.png";
import magnifier from "../assets/magnifier.png";
import house from "../assets/house.png";

export default function Landing() {
  const navigate = useNavigate();

  // FADE IN ANIMATION
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
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="landing">
      <LandingNav />

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-content container">
          <h1>Your First Five Years Start Here</h1>
          <p>Navigate your financial future with clarity</p>

          <button className="primary-btn" onClick={() => navigate("/login")}>
            Start Your Journey
          </button>
        </div>
      </section>

      {/* TRUST */}
      <section className="section container fade-in">
        <div className="text">
          <h2>Trusted by a new generation of professionals</h2>
          <p>
            Built for individuals who want more than basic banking. Our platform
            gives you structure, insight, and guidance.
          </p>
        </div>

        <img src={coins} className="image floating" alt="coins" />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section container reverse fade-in">
        <img src={magnifier} className="image floating" alt="magnifier" />

        <div className="text">
          <h2>How it works</h2>
          <p>Step 1: See your finances clearly</p>
          <p>Step 2: Choose your strategy</p>
          <p>Step 3: Simulate decisions</p>
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="section container fade-in">
        <div className="text">
          <h2>Support</h2>
          <p>
            We’re here when it matters. Whether you're starting or scaling, we
            guide you with clarity.
          </p>
        </div>

        <img src={house} className="image floating" alt="house" />
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials container fade-in">
        <h2>Here’s what others have to say</h2>

        <div className="cards">
          <div className="card glass">
            <p>“I finally understand my money.”</p>
            <span>Thando M.</span>
          </div>

          <div className="card glass highlight">
            <p>“Now I feel like I have direction.”</p>
            <span>Lerato K.</span>
          </div>

          <div className="card glass">
            <p>“Like a financial coach in my pocket.”</p>
            <span>Kabelo S.</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta container fade-in">
        <h2>Start your financial freedom today</h2>

        <button className="primary-btn" onClick={() => navigate("/login")}>
          Start Your Journey
        </button>
      </section>

      {/* FOOTER */}
      <footer className="footer container">
        <p>© 2026 ABSA Wealth Studio</p>
      </footer>
    </div>
  );
}
