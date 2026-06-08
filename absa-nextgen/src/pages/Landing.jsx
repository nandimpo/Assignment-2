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
import { Sprout, TreePine, Leaf } from "lucide-react";

import coins from "../assets/coins.png";
import magnifier from "../assets/magnifier.png";
import house from "../assets/house.png";
import settings from "../assets/settings.png";
import heroVideo from "../assets/hero-video.mp4";
import rootsImg from "../assets/roots.png";
import soilImg from "../assets/soil.png";
import leafImg from "../assets/leaf.png";

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

  /* -- redirect if already logged in -- */
  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) navigate("/home");
  }, [navigate]);

  /* -- scroll fade-in observer -- */
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

  /* -- show intro until user clicks Explore -- */
  if (!entered) {
    return <Intro onEnter={handleEnter} fadeOut={fadeOut} />;
  }

  return (
    <div className="landing">
      <LandingNav scrollTo={scrollToSection} />

      {/* HERO */}
      <section id="hero" className="hero">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        {/* MAIN CONTENT */}
        <div className="xapo-layout">
          <p className="eyebrow" style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}><Sprout size={12} /> Plant · Nurture · Grow</p>
          <h1>Every tree started underground.</h1>
          <p>
            Wealth isn't built overnight — it grows from small, consistent decisions.
            ABSA Wealth Studio gives young South Africans the tools to plant their financial roots and watch them compound.
          </p>
          <button className="cta-btn" onClick={() => transitionTo("/login")}>
            Plant your first seed
          </button>
        </div>

        {/* SCROLL HINT */}
        <div className="scroll-hint">
          <p>Scroll</p>
          <span></span>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar container fade-in">
        <div className="stat">
          <h3>R 2.4B+</h3>
          <p>Wealth nurtured</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>47,000+</h3>
          <p>Seeds planted</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>92%</h3>
          <p>Reached their harvest</p>
        </div>
        <div className="stat-divider"></div>
        <div className="stat">
          <h3>5 Years</h3>
          <p>To financial freedom</p>
        </div>
      </div>

      {/* ROOTS PHILOSOPHY BREAK */}
      <div className="roots-break fade-in">
        <img src={rootsImg} alt="" className="roots-break__bg" />
        <div className="roots-break__vignette" />
        <div className="roots-break__content container">
          <Sprout size={36} color="#84a794" strokeWidth={1.5} />
          <blockquote className="roots-break__quote">
            "The best time to plant a tree was 20 years ago.<br />
            The second best time is now."
          </blockquote>
          <p className="roots-break__sub">Your financial roots begin with a single decision. This is yours.</p>
        </div>
      </div>

      {/* TRUST */}
      <section id="trust" className="section container fade-in">
        <div className="text">
          <p className="eyebrow">YOUR SOIL</p>
          <TypewriterHeading text="Before you can grow, you need roots." />
          <p>
            Strong trees don't grow from thin air — they grow from deep, healthy soil.
            ABSA Wealth Studio is built to give young South Africans that foundation:
            clarity on where they stand, direction on where to go, and the tools to get there.
          </p>
          <p>
            From your first salary to your first property — every decision you make
            here nourishes your financial future.
          </p>
          <p className="highlight">
            Built for young South African professionals planting their first real financial roots.
          </p>
        </div>
        <div className="image-wrap fade-in">
          <img src={coins} className="image" alt="coins" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="hiw-section container fade-in">
        <div className="hiw-image">
          <img src={magnifier} className="image" alt="magnifier" />
        </div>
        <div className="hiw-text">
          <p className="eyebrow">HOW YOU GROW</p>
          <TypewriterHeading text="Three stages of every great growth story" />

          <div className="hiw-step">
            <span className="hiw-num">01</span>
            <div className="hiw-body">
              <strong>Plant — Know your ground</strong>
              <p>
                Understand your financial soil. Connect your income, expenses,
                and position so you know exactly what you're working with.
              </p>
            </div>
          </div>

          <div className="hiw-step">
            <span className="hiw-num">02</span>
            <div className="hiw-body">
              <strong>Nurture — Choose your path</strong>
              <p>
                Follow a structured growth track — property, investing, debt
                correction, or balanced wealth. Your path, your pace.
              </p>
            </div>
          </div>

          <div className="hiw-step">
            <span className="hiw-num">03</span>
            <div className="hiw-body">
              <strong>Harvest — See it compound</strong>
              <p>
                Simulate real decisions before you commit. Watch your future
                grow on screen before it grows in real life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="features-section container fade-in">
        <p className="eyebrow" style={{ textAlign: "center" }}>
          YOUR GROWTH TOOLS
        </p>
        <TypewriterHeading
          text="Three roots. One flourishing future."
          style={{ textAlign: "center", marginBottom: "40px" }}
        />
        <div className="feature-cards">
          <div className="feature-card" onClick={() => transitionTo("/login")}>
            <div className="feature-icon"><Sprout size={28} strokeWidth={1.5} color="#84a794" /></div>
            <h3>Financial Health</h3>
            <p>
              Your financial soil report. See income, expenses, savings rate,
              and health score — all live, all connected.
            </p>
            <span className="feature-link">Check your health &rarr;</span>
          </div>
          <div
            className="feature-card feature-card--accent"
            onClick={() => transitionTo("/login")}
          >
            <div className="feature-icon"><TreePine size={28} strokeWidth={1.5} color="#84a794" /></div>
            <h3>Growth Paths</h3>
            <p>
              Choose the track that fits your season — property, foundation,
              balanced growth, or course correction.
            </p>
            <span className="feature-link">Find your path &rarr;</span>
          </div>
          <div className="feature-card" onClick={() => transitionTo("/login")}>
            <div className="feature-icon"><Leaf size={28} strokeWidth={1.5} color="#84a794" /></div>
            <h3>Decision Studio</h3>
            <p>
              Model the future before you live it. Simulate rent vs. buy, car
              finance, and investment scenarios.
            </p>
            <span className="feature-link">Simulate growth &rarr;</span>
          </div>
        </div>
      </section>

      {/* LEAF BREAK — soil/nurture interlude */}
      <div className="leaf-break fade-in">
        <img src={soilImg} alt="" className="leaf-break__bg" />
        <div className="leaf-break__vignette" />
        <div className="leaf-break__content container">
          <div className="leaf-break__pills">
            <span className="leaf-pill"><Sprout size={12} /> Plant</span>
            <span className="leaf-pill leaf-pill--active"><Leaf size={12} /> Nurture</span>
            <span className="leaf-pill"><TreePine size={12} /> Harvest</span>
          </div>
          <p className="leaf-break__line">
            Growth isn't a moment — it's a practice. Every session you spend here
            is a deposit into your future self.
          </p>
        </div>
      </div>

      {/* FINANCE SCHOOL */}
      <section className="section container fade-in">
        <div className="text">
          <p className="eyebrow">TEND YOUR KNOWLEDGE</p>
          <TypewriterHeading text="Learn what you need, when you need it." />
          <p>
            Like any living thing, growth needs tending. Finance School gives you
            structured lessons and real-world insights timed to where you are in
            your financial journey — not generic theory.
          </p>
          <p>
            Budgeting, property, investing, tax — knowledge that feeds directly
            back into the decisions you make inside the app.
          </p>
          <p className="highlight">
            Applied learning, rooted in your real finances.
          </p>
        </div>
        <div className="image-wrap fade-in">
          <img src={house} className="image" alt="learning" />
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="section container fade-in">
        <div className="text">
          <p className="eyebrow">YOUR GROWTH GUIDE</p>
          <TypewriterHeading text="You're never left to grow alone." />
          <p>
            A seed needs more than soil — it needs direction, light, and care.
            ABSA Wealth Studio gives you intelligent next steps and personalised
            recommendations based on your actual financial position.
          </p>
          <p>No guessing. No generic advice. Just your next move, clearly.</p>
        </div>
        <div className="image-wrap fade-in">
          <img src={settings} className="image" alt="settings" />
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section container fade-in">
        <p className="eyebrow">PLANT YOUR SEED</p>
        <TypewriterHeading
          text="Your forest starts with one decision."
          style={{ textAlign: "center" }}
        />
        <p className="cta-sub">Plant · Nurture · Grow · Harvest</p>
        <button className="cta-btn" onClick={() => transitionTo("/login")}>
          Begin growing today
        </button>
      </section>

      {/* FOOTER */}
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
          <p>&copy; 2025 ABSA Wealth Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
