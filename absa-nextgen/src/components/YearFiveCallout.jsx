import "../styles/fiveyear.css";
import NumberCounter from "./NumberCounter";

function AnimatedCalloutValue({ value }) {
  const text = String(value);
  const match = text.match(/^R([\d\s,]+)(.*)$/);

  if (!match) return value;

  const amount = Number(match[1].replace(/[,\s]/g, ""));
  if (!Number.isFinite(amount)) return value;

  return (
    <>
      <NumberCounter value={amount} prefix="R" />
      {match[2] && <> {match[2].trim()}</>}
    </>
  );
}

/**
 * Compact "By Year 5" callout card for simulation studios.
 * Shows two values side-by-side with a gold "Year 5" badge.
 */
export default function YearFiveCallout({ label, items, note }) {
  return (
    <div className="y5-callout">
      <div className="y5-callout-badge">Year 5 · 60 months</div>
      <p className="y5-callout-label">{label}</p>
      <div className="y5-callout-values">
        {items.map(({ name, value, highlight }) => (
          <div key={name} className={`y5-callout-item ${highlight ? "y5-callout-item--highlight" : ""}`}>
            <p className="y5-callout-item-name">{name}</p>
            <p className="y5-callout-item-value"><AnimatedCalloutValue value={value} /></p>
          </div>
        ))}
      </div>
      {note && <p className="y5-callout-note">{note}</p>}
    </div>
  );
}
