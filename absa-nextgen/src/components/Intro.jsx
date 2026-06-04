import { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";

/* ── canvas wave background ── */
function WaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const SPACING = 9;   // gap between flow lines
    const SPEED   = 0.0006;

    const draw = () => {
      ctx.fillStyle = "rgba(2,2,2,0.35)"; // faster fade = cleaner, more subtle
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      t += 1;

      const rows = Math.ceil(canvas.height / SPACING);

      for (let row = 0; row < rows; row++) {
        const baseY = row * SPACING;
        const phase = row * 0.28; // each row offset so they ripple

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= canvas.width; x += 3) {
          const y =
            baseY +
            Math.sin(x * 0.012 + t * SPEED * 60 + phase) * 6 +
            Math.sin(x * 0.005 + t * SPEED * 35 + phase * 0.5) * 10 +
            Math.sin(x * 0.020 + t * SPEED * 80 + phase * 1.5) * 3;
          ctx.lineTo(x, y);
        }

        // very faint sage green — growth theme, barely there
        const opacity = 0.06 + Math.sin(row * 0.15 + t * SPEED * 20) * 0.025;
        ctx.strokeStyle = `rgba(132, 167, 148, ${opacity})`;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ── main intro ── */
export default function Intro({ onEnter, fadeOut }) {
  const [showLogo,   setShowLogo]   = useState(false);
  const [showText,   setShowText]   = useState(false);
  const [showLine,   setShowLine]   = useState(false);
  const [showButton, setShowButton] = useState(false);
  const bgRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLogo(true),   400);
    const t2 = setTimeout(() => setShowText(true),   1200);
    const t3 = setTimeout(() => setShowLine(true),   3900); // after typing finishes
    const t4 = setTimeout(() => setShowButton(true), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  /* gentle mouse parallax on dreamy orbs */
  useEffect(() => {
    const handleMove = (e) => {
      if (!bgRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
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
          <div className={`intro-underline ${showLine ? "intro-underline--show" : ""}`}></div>
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
