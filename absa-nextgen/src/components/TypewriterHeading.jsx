import { useEffect, useRef, useState } from "react";

export default function TypewriterHeading({ text, className, style, speed = 70 }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  // Trigger when element enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Type characters one by one once started
  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return (
    <h2 ref={ref} className={className} style={style}>
      {displayed}
      {displayed.length < text.length && (
        <span className="typewriter-cursor">|</span>
      )}
    </h2>
  );
}
