import { createPortal } from "react-dom";

//used for UI , I just like it

export default function ScreenFlash({ tone = "orange" }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`mst-flash${tone === "green" ? " mst-flash--green" : ""}`}
    />,
    document.body,
  );
}
