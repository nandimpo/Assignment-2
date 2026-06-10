import { useMemo, useState } from "react";
import { Check, ChevronDown, ClipboardCheck } from "lucide-react";

// MilestoneChecklist component: collapsible checklist showing progress towards milestones. Displays title, progress bar, next milestone, and allows toggling items as done/undone.
export default function MilestoneChecklist({
  items,
  doneItems,
  onToggle,
  title = "Milestone Checklist",
  getStateIndex = (index) => index,
  total,
}) {
  const [open, setOpen] = useState(false);
  const doneCount = doneItems.filter(Boolean).length;
  const totalCount = total || doneItems.length || items.length;
  const progress =
    totalCount > 0
      ? Math.min(100, Math.round((doneCount / totalCount) * 100))
      : 0;
  const nextItem = useMemo(() => {
    return items.find((_, index) => !doneItems[getStateIndex(index)]);
  }, [doneItems, getStateIndex, items]);

  return (
    <section
      className={`track-card milestone-dropdown${open ? " milestone-dropdown--open" : ""}`}
    >
      <button
        className="milestone-dropdown__header"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="milestone-dropdown__icon">
          <ClipboardCheck size={18} />
        </span>
        <span className="milestone-dropdown__main">
          <span className="milestone-dropdown__title">{title}</span>
          <span className="milestone-dropdown__meta">
            {doneCount}/{totalCount} done
          </span>
        </span>
        <span className="milestone-dropdown__chevron">
          <ChevronDown size={18} />
        </span>
      </button>

      <div className="milestone-dropdown__progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="milestone-dropdown__summary">
        <span>{progress}% complete</span>
        <span>
          {nextItem ? `Next: ${nextItem.label}` : "All milestones complete"}
        </span>
      </div>

      {open && (
        <div className="milestone-dropdown__body">
          {items.map((item, index) => {
            const stateIndex = getStateIndex(index);
            const done = doneItems[stateIndex];
            return (
              <button
                key={`${item.label}-${index}`}
                type="button"
                className={`milestone-dropdown__item${done ? " milestone-dropdown__item--done" : ""}`}
                onClick={() => onToggle(stateIndex)}
              >
                <span className="milestone-dropdown__check">
                  {done && <Check size={13} />}
                </span>
                <span className="milestone-dropdown__copy">
                  <span>{item.label}</span>
                  <small>{item.tip}</small>
                </span>
                {done && (
                  <Check className="milestone-dropdown__done-icon" size={15} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
