import "../styles/fiveyear.css";

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
            <p className="y5-callout-item-value">{value}</p>
          </div>
        ))}
      </div>
      {note && <p className="y5-callout-note">{note}</p>}
    </div>
  );
}
