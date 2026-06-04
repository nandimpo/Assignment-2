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
    setTimeout(() => {
      navigate(to);
    }, 4200);

    // Start exit fade
    setTimeout(() => {
      setPhase("out");
    }, 5000);

    // Hide overlay and clear message
    setTimeout(() => {
      setActive(false);
      setPhase("idle");
      setMessage(null);
    }, 5700);
  }, [navigate]);

  return (
    <TransitionContext.Provider value={{ active, phase, variant, message, trigger }}>
      {children}
    </TransitionContext.Provider>
  );
}

export const useTransition = () => useContext(TransitionContext);
