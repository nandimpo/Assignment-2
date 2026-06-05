import { useNavigate, useSearchParams } from "react-router-dom";
import useTransitionNavigate from "../hooks/useTransitionNavigate";
import { useEffect, useState } from "react";
import LandingNav from "../components/LandingNav";
import Intro from "../components/Intro";
import TypewriterHeading from "../components/TypewriterHeading";
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
import settings from "../assets/settings.png";
import heroVideo from "../assets/hero-video.mp4";

export default function Landing() {
  const navigate = useNavigate();
  const transitionTo = useTransitionNavigate();
  const [searchParams] = useSearchParams();

  const [entered, setEntered] = useState(
    () =>
      searchParams.get("skip") === "true" ||
      sessionStorage.getItem("introSeen") === "true",
  );
  const [fadeOut, setFadeOut] = useState(false);

  /* â”€â”€ redirect if already logged in â”€â”€ */
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) navigate("/home");
  }, [navigate]);

  /* â”€â”€ scroll fade-in observer â”€â”€ */
  useEffect(() => {
    if (!entered) return;

    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("show"),
        ),
      { threshold: 0.12 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [entered]);

  const handleEnter = () => {
    sessionStorage.setItem("introSeen", "true");
    setFadeOut(true);
    setTimeout(() => setEntered(true), 800);
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* â”€â”€ show intro until user clicks Explore â”€â”€ */
  if (!entered) {
    return <Intro onEnter={handleEnter} fadeOut={fadeOut} />;
  }

  return (
    <div className="landing">
      <LandingNav scrollTo={scrollToSection} />

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• WAVE BACKGROUND â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="hero" className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        {/* MAIN CONTENT */}
        <div className="xapo-layout">
          <h1>The Home for Young South African Professionals.</h1>
          <p>
            A private financial system built for young South African
            professionals ready to grow, invest, and own their future.
          </p>
          <button className="cta-btn" onClick={() => transitionTo("/login")}>
            Join now
          </button>
        </div>

        {/* SCROLL HINT */}
        <div className="scroll-hint">
          <p>Scroll</p>
          <span></span>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• STATS BAR â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="stats-bar container fade-in">
        <div className="stat">
          <h3>R 2.4B+</h3>
          <p>Assets managed</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>47,000+</h3>
          <p>Young professionals</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>92%</h3>
          <p>Hit their savings goal</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>5 Years</h3>
          <p>To financial freedom</p>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• TRUST â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="trust" className="section container fade-in">
        <div className="text">
          <p className="eyebrow">THE PLATFORM</p>
          <TypewriterHeading text="More than banking â€” it's your financial system" />
          <p>
            ABSA Wealth Studio combines real financial data, structured
            decision-making, and guided education into one powerful experience.
          </p>
          <p>
            From your salary and expenses to property goals and investments â€”
            everything connects to help you make smarter decisions.
          </p>
          <p className="highlight">
            Built for young South African professionals navigating their first
            real financial chapter.
          </p>
        </div>
        <div className="image-wrap fade-in">
          <img src={coins} className="image" alt="coins" />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• HOW IT WORKS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="how" className="hiw-section container fade-in">
        <div className="hiw-image">
          <img src={magnifier} className="image" alt="magnifier" />
        </div>
        <div className="hiw-text">
          <p className="eyebrow">HOW IT WORKS</p>
          <TypewriterHeading text="Three steps to financial clarity" />

          <div className="hiw-step">
            <span className="hiw-num">01</span>
            <div className="hiw-body">
              <strong>See everything</strong>
              <p>
                Connect your income, expenses, and financial position in one
                place.
              </p>
            </div>
          </div>

          <div className="hiw-step">
            <span className="hiw-num">02</span>
            <div className="hiw-body">
              <strong>Choose direction</strong>
              <p>
                Follow structured tracks like property, saving, or investing.
              </p>
            </div>
          </div>

          <div className="hiw-step">
            <span className="hiw-num">03</span>
            <div className="hiw-body">
              <strong>Make decisions</strong>
              <p>Simulate scenarios before committing in real life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• FEATURE CARDS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="features-section container fade-in">
        <p className="eyebrow" style={{ textAlign: "center" }}>
          WHAT'S INSIDE
        </p>
        <TypewriterHeading
          text="Three tools. One financial system."
          style={{ textAlign: "center", marginBottom: "40px" }}
        />
        <div className="feature-cards">
          <div className="feature-card" onClick={() => transitionTo("/login")}>
            <h3>Money Snapshot</h3>
            <p>
              See your full financial picture â€” income, expenses, debt, and
              savings rate â€” in one live dashboard.
            </p>
            <span className="feature-link">Explore Snapshot â†’</span>
          </div>
          <div
            className="feature-card feature-card--accent"
            onClick={() => transitionTo("/login")}
          >
            <h3>Strategy Tracks</h3>
            <p>
              Follow a personalised path â€” Property, Foundation, Balanced
              Lifestyle, or Lifestyle Correction.
            </p>
            <span className="feature-link">View Tracks â†’</span>
          </div>
          <div className="feature-card" onClick={() => transitionTo("/login")}>
            <h3>Simulation Lab</h3>
            <p>
              Model real decisions â€” rent vs buy, car finance, investing â€”
              before committing your money.
            </p>
            <span className="feature-link">Try Simulation â†’</span>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• FINANCE SCHOOL â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="section container fade-in">
        <div className="text">
          <p className="eyebrow">FINANCE SCHOOL</p>
          <TypewriterHeading text="Learn as you build wealth" />
          <p>
            Finance School gives you structured lessons, quizzes, and real-world
            insights tailored to your financial journey.
          </p>
          <p>
            Whether you're understanding budgeting, property, or investing â€”
            you gain knowledge that directly impacts your decisions inside the
            app.
          </p>
          <p className="highlight">
            Not just theory â€” applied learning connected to your real
            finances.
          </p>
        </div>
        <div className="image-wrap fade-in">
          <img src={house} className="image" alt="learning" />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• SUPPORT â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="support" className="section container fade-in">
        <div className="text">
          <p className="eyebrow">INTELLIGENT GUIDANCE</p>
          <TypewriterHeading text="Guided every step of the way" />
          <p>
            Get intelligent recommendations, next steps, and insights based on
            your financial situation.
          </p>
          <p>You're never guessing â€” the system guides you forward.</p>
        </div>
        <div className="image-wrap fade-in">
          <img src={settings} className="image" alt="settings" />
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="cta-section container fade-in">
        <p className="eyebrow">GET STARTED</p>
        <TypewriterHeading
          text="Start your financial freedom today"
          style={{ textAlign: "center" }}
        />
        <p className="cta-sub">Learn. Plan. Execute. Grow.</p>
        <button className="cta-btn" onClick={() => transitionTo("/login")}>
          Start Your Journey
        </button>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <footer className="footer-extended">
        <div className="footer-top container">
          <div className="footer-brand">
            <h3>ABSA Wealth Studio</h3>
            <p>Johannesburg, South Africa</p>
            <div className="socials">
              <a href="#">
                <FaInstagram />
              </a>
              <a href="#">
                <FaYoutube />
              </a>
              <a href="#">
                <FaEnvelope />
              </a>
              <a href="#">
                <FaFacebook />
              </a>
              <a href="#">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <p>Money Snapshot</p>
              <p>Strategy Tracks</p>
            </div>
            <div className="footer-col">
              <h4>Learn</h4>
              <p>Finance School</p>
              <p>Investing 101</p>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <p>Help Centre</p>
              <p>Contact</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom container">
          <p>Â© 2025 ABSA Wealth Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
