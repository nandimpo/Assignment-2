import { useEffect, useState } from "react";

export default function Tour({ steps = [], storageKey }) {
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  // START TOUR
  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) setShowTour(true);
  }, [storageKey]);

  // HANDLE STEP CHANGE
  useEffect(() => {
    if (!showTour) return;
    if (tourStep >= steps.length) return;

    const step = steps[tourStep];
    const el = document.getElementById(step.target);

    if (!el) {
      console.warn("❌ Missing tour target ID:", step.target);
      return;
    }

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const pad = 12;
      setSpotlight({
        top:    rect.top    - pad,
        left:   rect.left   - pad,
        width:  rect.width  + pad * 2,
        height: rect.height + pad * 2,
      });
    };

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    // Wait for smooth scroll to finish before measuring
    const timer = setTimeout(measure, 520);

    // Re-measure if user scrolls or window resizes while tour is active
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [tourStep, showTour, steps]);

  const endTour = () => {
    localStorage.setItem(storageKey, "true");
    setShowTour(false);
  };

  if (!showTour || !spotlight) return null;

  return (
    <>
      {/* MASK */}
      <div
        className="tour-mask-top"
        style={{ top: 0, left: 0, right: 0, height: spotlight.top }}
      />
      <div
        className="tour-mask-bottom"
        style={{
          top: spotlight.top + spotlight.height,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      <div
        className="tour-mask-left"
        style={{
          top: spotlight.top,
          left: 0,
          width: spotlight.left,
          height: spotlight.height,
        }}
      />
      <div
        className="tour-mask-right"
        style={{
          top: spotlight.top,
          left: spotlight.left + spotlight.width,
          right: 0,
          height: spotlight.height,
        }}
      />

      {/* CUTOUT */}
      <div
        className="tour-cutout"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
        }}
      />

      {/* BOX */}
      <div className="tour-box">
        <p className="tour-counter">
          Step {tourStep + 1} of {steps.length}
        </p>

        <p className="tour-text">{steps[tourStep].text}</p>

        {steps[tourStep].action && (
          <button className="coach-action" onClick={steps[tourStep].action}>
            {steps[tourStep].actionLabel}
          </button>
        )}

        <div className="tour-actions">
          <button onClick={endTour}>Skip</button>

          <button
            onClick={() => {
              if (tourStep < steps.length - 1) {
                setTourStep(tourStep + 1);
              } else {
                endTour();
              }
            }}
          >
            {tourStep === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}
