import { useEffect, useState } from "react";

export default function Tour({ steps = [], storageKey }) {
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey);
    if (!seen) setShowTour(true);
  }, [storageKey]);

  useEffect(() => {
    if (!showTour || tourStep >= steps.length) return;

    const step = steps[tourStep];
    const el = document.getElementById(step.target);

    if (!el) {
      console.warn("Missing tour target ID:", step.target);
      setSpotlight(null);
      const skipTimer = setTimeout(() => {
        if (tourStep >= steps.length - 1) {
          localStorage.setItem(storageKey, "true");
          setShowTour(false);
          return;
        }
        setTourStep((current) => (
          current === tourStep && current < steps.length - 1 ? current + 1 : current
        ));
      }, 80);
      return () => clearTimeout(skipTimer);
    }

    const getVisibleRect = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 1 && rect.height > 1) return rect;

      const visibleChild = Array.from(el.querySelectorAll("*")).find((child) => {
        const childRect = child.getBoundingClientRect();
        return childRect.width > 1 && childRect.height > 1;
      });

      return visibleChild?.getBoundingClientRect() || rect;
    };

    const measure = () => {
      const rect = getVisibleRect();
      if (rect.width <= 1 || rect.height <= 1) {
        setSpotlight(null);
        return;
      }

      const pad = 12;
      const top = Math.max(8, rect.top - pad);
      const left = Math.max(8, rect.left - pad);
      const right = Math.min(window.innerWidth - 8, rect.right + pad);
      const bottom = Math.min(window.innerHeight - 8, rect.bottom + pad);

      setSpotlight({
        top,
        left,
        width: Math.max(24, right - left),
        height: Math.max(24, bottom - top),
      });
    };

    const scrollToTarget = () => {
      const rect = getVisibleRect();
      const top = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };

    setSpotlight(null);
    scrollToTarget();

    const firstMeasure = setTimeout(measure, 560);
    const settledMeasure = setTimeout(measure, 900);

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      clearTimeout(firstMeasure);
      clearTimeout(settledMeasure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [tourStep, showTour, steps]);

  useEffect(() => {
    if (!showTour || !steps.length || tourStep < steps.length) return;
    localStorage.setItem(storageKey, "true");
    setShowTour(false);
  }, [showTour, steps.length, storageKey, tourStep]);

  const endTour = () => {
    localStorage.setItem(storageKey, "true");
    setShowTour(false);
  };

  if (!showTour || !spotlight || !steps[tourStep]) return null;

  const step = steps[tourStep];

  return (
    <>
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

      <div
        className="tour-cutout"
        style={{
          top: spotlight.top,
          left: spotlight.left,
          width: spotlight.width,
          height: spotlight.height,
        }}
      />

      <div className="tour-box">
        <p className="tour-counter">
          Step {tourStep + 1} of {steps.length}
        </p>

        <p className="tour-text">{step.text}</p>

        {step.action && (
          <button className="coach-action" onClick={step.action}>
            {step.actionLabel}
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
