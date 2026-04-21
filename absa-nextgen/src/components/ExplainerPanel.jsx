import { useEffect } from "react";
import "../styles/explainer.css";

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
        <p>{content?.text}</p>

        <div className="why">
          <strong>Why this matters</strong>
          <p>
            Understanding this helps you make better financial decisions and
            avoid costly mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
