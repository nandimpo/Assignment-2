import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LandingNav from "../components/LandingNav";
import "../styles/landing.css";
import planet from "../assets/planet.png";

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
import settings from "../assets/settings.png"; // ✅ FIXED

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing">
      <LandingNav scrollTo={scrollToSection} />

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-content container">
          <h1>Your First Five Years Start Here</h1>

          <p className="hero-sub">
            A smart financial system that helps you{" "}
            <strong>learn, plan, and build wealth</strong> — all in one place.
          </p>

          <button className="primary-btn" onClick={() => navigate("/login")}>
            Start Your Journey
          </button>

          <div className="hero-planet">
            <img src={planet} alt="planet" />
          </div>

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
          <h2>More than banking — it’s your financial system</h2>

          <p>
            ABSA Wealth Studio combines real financial data, structured
            decision-making, and guided education into one powerful experience.
          </p>

          <p>
            From your salary and expenses to property goals and investments —
            everything connects to help you make smarter decisions.
          </p>

          <p className="highlight">
            Built for young South African professionals navigating their first
            real financial chapter.
          </p>
        </div>

        <img src={coins} className="image" alt="coins" />
      </section>

      {/* GRAPH */}
      <section className="graph-section container fade-in">
        <h2>Your Financial Growth</h2>

        <p className="graph-sub">
          Track your progress, simulate outcomes, and see your future evolve.
        </p>

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
            Connect your income, expenses, and financial position in one place.
          </p>

          <p>
            <strong>2. Choose direction</strong>
            <br />
            Follow structured tracks like property, saving, or investing.
          </p>

          <p>
            <strong>3. Make decisions</strong>
            <br />
            Simulate scenarios before committing in real life.
          </p>
        </div>
      </section>

      {/* FINANCE SCHOOL */}
      <section className="section container fade-in">
        <div className="text">
          <h2>Finance School</h2>

          <p>
            Learn as you build. Finance School gives you structured lessons,
            quizzes, and real-world insights tailored to your financial journey.
          </p>

          <p>
            Whether you're understanding budgeting, property, or investing — you
            gain knowledge that directly impacts your decisions inside the app.
          </p>

          <p className="highlight">
            Not just theory — applied learning connected to your real finances.
          </p>
        </div>

        <img src={house} className="image" alt="learning" />
      </section>

      {/* SUPPORT */}
      <section id="support" className="section container fade-in">
        <div className="text">
          <h2>Guided every step of the way</h2>

          <p>
            Get intelligent recommendations, next steps, and insights based on
            your financial situation.
          </p>

          <p>You’re never guessing — the system guides you forward.</p>
        </div>

        <img src={settings} className="image" alt="settings" />
      </section>

      {/* CTA */}
      <section className="cta container fade-in">
        <h2>Start your financial freedom today</h2>

        <p className="cta-sub">Learn. Plan. Execute. Grow.</p>

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
            <p>Finance School</p>
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
