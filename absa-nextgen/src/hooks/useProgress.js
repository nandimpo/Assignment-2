import { useState, useEffect } from "react";

export default function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("globalProgress");
    return saved
      ? JSON.parse(saved)
      : {
          emergencyFund: false,
          deposit: false,
          purchase: false,
        };
  });

  useEffect(() => {
    localStorage.setItem("globalProgress", JSON.stringify(progress));
  }, [progress]);

  const toggle = (key) => {
    setProgress((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const completed = Object.values(progress).filter(Boolean).length;
  const total = Object.keys(progress).length;
  const percent = Math.round((completed / total) * 100);

  return { progress, toggle, percent };
}
