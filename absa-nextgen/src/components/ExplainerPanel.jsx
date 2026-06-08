import { useEffect } from "react";
import "../styles/explainer.css";
import Typewriter from "./Typewriter";

export default function ExplainerPanel({ show, onClose, content }) {
  /* CLOSE ON ESC */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* CLOSE ON OUTSIDE CLICK */
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="explainer-panel">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>{content?.title}</h2>
        {content?.text && <Typewriter text={content.text} speed={14} />}

        <div className="why">
          <strong>Why this matters</strong>
          <Typewriter text="Understanding this helps you make better financial decisions and avoid costly mistakes." speed={14} delay={300} />
        </div>
      </div>
    </div>
  );
}
