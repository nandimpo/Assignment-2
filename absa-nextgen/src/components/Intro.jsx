import { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import WaveCanvas from "./WaveCanvas";

//main into : logo etc
export default function Intro({ onEnter, fadeOut }) {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const bgRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(true), 400);
    const t2 = setTimeout(() => setShowText(true), 1200);
    const t3 = setTimeout(() => setShowLine(true), 3900); // after typing finishes
    const t4 = setTimeout(() => setShowButton(true), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  /* gentle mouse parallax on dreamy orbs */
  useEffect(() => {
    const handleMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className={`intro ${fadeOut ? "fade-out" : "show"}`}>
      {/* ── WAVE BACKGROUND ── */}
      <WaveCanvas />

      {/* ── DREAMY ORBS (parallax) ── */}
      <div className="intro-bg" ref={bgRef}>
        <div className="dream-orb dream-orb--1"></div>
        <div className="dream-orb dream-orb--2"></div>
        <div className="dream-orb dream-orb--3"></div>
      </div>

      {/* ── CONTENT ── */}
      <img
        src={logo}
        className={`intro-logo ${showLogo ? "intro-logo--show" : ""}`}
        alt="ABSA logo"
      />

      {showText && (
        <div className="intro-text-wrap">
          <h1 className="intro-text intro-text--show">
            ABSA NextGen Wealth Studio
          </h1>
          {/* animated underline */}
          <div
            className={`intro-underline ${showLine ? "intro-underline--show" : ""}`}
          ></div>
        </div>
      )}

      <button
        className={`cta-btn intro-btn ${showButton ? "intro-btn--show" : ""}`}
        onClick={onEnter}
      >
        Explore
      </button>
    </div>
  );
}
