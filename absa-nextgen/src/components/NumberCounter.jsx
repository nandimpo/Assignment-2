import { useEffect, useMemo, useRef, useState } from "react";

const growLikeRoots = (t) => {
  if (t < 0.38) return 0.12 * (t / 0.38) ** 2;
  if (t < 0.82) return 0.12 + 0.58 * ((t - 0.38) / 0.44);
  return 0.7 + 0.3 * (1 - (1 - (t - 0.82) / 0.18) ** 2);
};

export default function NumberCounter({
  value,
  prefix = "",
  suffix = "",
  locale = "en-ZA",
  duration = 8400,
  decimals = 0,
  compact = false,
  className = "",
  style = {},
  as: Tag = "span",
}) {
  const numericValue = Number(value);
  const isNumeric = Number.isFinite(numericValue);
  const [display, setDisplay] = useState(isNumeric ? 0 : value);
  const [started, setStarted] = useState(false);
  const elementRef = useRef(null);
  const previous = useRef(isNumeric ? 0 : value);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals, locale],
  );

  useEffect(() => {
    if (!isNumeric) {
      setStarted(true);
      return;
    }

    const el = elementRef.current;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion || !el || !("IntersectionObserver" in window)) {
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
  }, [isNumeric]);

  useEffect(() => {
    if (!started) return;

    if (!isNumeric) {
      previous.current = value;
      setDisplay(value);
      return;
    }

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    const startValue = Number(previous.current) || 0;
    const endValue = numericValue;

    if (prefersReducedMotion || duration <= 0 || startValue === endValue) {
      previous.current = endValue;
      setDisplay(endValue);
      return;
    }

    let frameId;
    const startedAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = growLikeRoots(progress);
      const nextValue = startValue + (endValue - startValue) * eased;

      setDisplay(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        previous.current = endValue;
        setDisplay(endValue);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [duration, isNumeric, numericValue, started, value]);

  if (!isNumeric) {
    return (
      <Tag ref={elementRef} className={className} style={style}>
        {value}
      </Tag>
    );
  }

  const shownValue = compact ? display / 1000 : display;
  const formatted = formatter.format(shownValue);

  return (
    <Tag ref={elementRef} className={className} style={style}>
      {prefix}
      {formatted}
      {compact ? "k" : ""}
      {suffix}
    </Tag>
  );
}
