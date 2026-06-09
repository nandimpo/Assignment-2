import { useState, useEffect, useRef } from "react";

export default function Typewriter({ text = "", speed = 24, delay = 0, tag: Tag = "p", className = "", style = {} }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const containerRef = useRef(null);
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) {
      setDisplayed(text);
      setStarted(true);
      return;
    }

    if (!el || !("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    setDisplayed("");
    indexRef.current = 0;
    clearInterval(timerRef.current);
    clearTimeout(delayRef.current);

    const growthSpeed = Math.max(28, Math.round(speed * 2.4));
    const growthDelay = Math.round(delay * 1.25);

    delayRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) clearInterval(timerRef.current);
      }, growthSpeed);
    }, growthDelay);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(delayRef.current);
    };
  }, [text, speed, delay, started]);

  return (
    <Tag ref={containerRef} className={`typewriter ${className}`} style={style}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true" />
    </Tag>
  );
}
