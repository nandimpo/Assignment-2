import { useNavigate } from "react-router-dom";
import { useTransition } from "../context/TransitionContext";

export default function useTransitionNavigate() {
  const { trigger } = useTransition();

  return (to, variant = "green") => trigger(to, variant);
}
