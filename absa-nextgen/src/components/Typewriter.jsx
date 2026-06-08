import { useState, useEffect, useRef } from "react";

export default function Typewriter({ text = "", speed = 16, delay = 0, tag: Tag = "p", className = "", style = {} }) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const delayRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    indexRef.current = 0;
    clearInterval(timerRef.current);
    clearTimeout(delayRef.current);

    delayRef.current = setTimeout(() => {
      timerRef.current = setInterval(() => {
        indexRef.current += 1;
        setDisplayed(text.slice(0, indexRef.current));
        if (indexRef.current >= text.length) clearInterval(timerRef.current);
      }, speed);
    }, delay);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(delayRef.current);
    };
  }, [text, speed, delay]);

  return (
    <Tag className={`typewriter ${className}`} style={style}>
      {displayed}
      <span className="typewriter-cursor" aria-hidden="true" />
    </Tag>
  );
}
