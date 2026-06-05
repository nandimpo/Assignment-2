import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const TransitionContext = createContext();

export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | in | out

  const [variant, setVariant] = useState("green");
  const [message, setMessage] = useState(null);

  const trigger = useCallback((to, v = "green", msg = null) => {
    setVariant(v);
    setMessage(msg);
    setActive(true);
    setPhase("in");

    // Navigate as vortex fill covers screen
    setTimeout(() => navigate(to), 4200);
    setTimeout(() => setPhase("out"), 5000);
    setTimeout(() => { setActive(false); setPhase("idle"); setMessage(null); }, 5700);
  }, [navigate]);

  // Fast nav transition — simple fade/slide, no vortex
  const navTrigger = useCallback((to) => {
    setVariant("nav");
    setMessage(null);
    setActive(true);
    setPhase("in");

    setTimeout(() => navigate(to), 180);
    setTimeout(() => setPhase("out"), 200);
    setTimeout(() => { setActive(false); setPhase("idle"); }, 500);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ active, phase, variant, message, trigger, navTrigger }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
