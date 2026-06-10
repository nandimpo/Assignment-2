import { createPortal } from "react-dom";

export default function ScreenFlash({ tone = "orange" }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={`mst-flash${tone === "green" ? " mst-flash--green" : ""}`} />,
    document.body
  );
}
