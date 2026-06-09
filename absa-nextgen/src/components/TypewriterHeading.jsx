import { useEffect, useRef, useState } from "react";

export default function TypewriterHeading({
  text,
  className,
  style,
  speed = 70,
  delay = 0,
  tag: Tag = "h2",
  scrollTriggered = true,
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) {
      setDisplayed(text);
      setStarted(true);
      return;
    }

    if (scrollTriggered) {
      // scroll-triggered: wait until element enters viewport
      const el = ref.current;
      if (!el) return;

      if (!("IntersectionObserver" in window)) {
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
      }

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setStarted(true); },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    } else {
      // default: start on mount after optional delay
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay, scrollTriggered, text]);

  useEffect(() => {
    if (!started) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    if (displayed.length >= text.length) return;
    // when scrollTriggered, use delay for first char; otherwise already handled above
    const wait = (scrollTriggered && displayed.length === 0) ? delay : speed;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), wait);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return (
    <Tag ref={ref} className={className} style={{ minHeight: "1em", ...style }}>
      {displayed}
      {displayed.length < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </Tag>
  );
}
