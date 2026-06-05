import { useState } from "react";
import { useUser } from "../context/UserContext";
import { CheckCircle, Circle, XCircle, TrendingUp, AlertTriangle, RefreshCw } from "lucide-react";

export default function MonthlySavingsTracker({ monthlyTarget, goalAmount, goalLabel = "goal" }) {
  const { user, updateUser } = useUser();
  const [showMissedPanel, setShowMissedPanel] = useState(false);
  const [partialAmount, setPartialAmount]     = useState("");

  const log        = user?.savingsLog || [];
  const totalSaved = log.reduce((sum, e) => sum + (e.amount || 0), 0);

  const now       = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisEntry = log.find(e => e.month === thisMonth);
  const alreadyLogged = !!thisEntry;

  const progress   = goalAmount > 0 ? Math.min(100, Math.round((totalSaved / goalAmount) * 100)) : 0;
  const remaining  = Math.max(0, goalAmount - totalSaved);
  const monthsLeft = monthlyTarget > 0 ? Math.ceil(remaining / monthlyTarget) : "—";

  const missedMonths  = log.filter(e => e.missed).length;
  const savedMonths   = log.filter(e => !e.missed).length;

  // Catch-up: how much extra next month to stay on track
  const catchUpAmount = monthlyTarget + Math.round(monthlyTarget * 0.5);

  const formatMonth = (str) => {
    const [y, m] = str.split("-");
    const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${names[parseInt(m) - 1]} ${y}`;
  };

  const confirmSaved = (amount = monthlyTarget) => {
    if (alreadyLogged) return;
    const newLog = [...log, { month: thisMonth, amount: Number(amount), missed: false }];
    updateUser({ savingsLog: newLog, savings: totalSaved + Number(amount) });
    setShowMissedPanel(false);
  };

  const confirmMissed = () => {
    if (alreadyLogged) return;
    const newLog = [...log, { month: thisMonth, amount: 0, missed: true }];
    updateUser({ savingsLog: newLog });
    setShowMissedPanel(true);
  };

  const removeEntry = (month) => {
    const newLog     = log.filter(e => e.month !== month);
    const newSavings = newLog.filter(e => !e.missed).reduce((sum, e) => sum + e.amount, 0);
    updateUser({ savingsLog: newLog, savings: newSavings });
    if (month === thisMonth) setShowMissedPanel(false);
  };

  const missedTips = [
    { icon: "💡", tip: "Review your fixed expenses — even a R500 cut frees up meaningful savings." },
    { icon: "🔄", tip: `Try saving R${catchUpAmount.toLocaleString("en-ZA")} next month to catch up (50% extra).` },
    { icon: "📅", tip: "Set up an automatic transfer on payday — save before you spend." },
    { icon: "🎯", tip: `Your goal is R${goalAmount.toLocaleString("en-ZA")}. Every month missed adds ~1 month to your timeline.` },
    { icon: "📉", tip: "Check your spending breakdown in the Snapshot — lifestyle and transport are usually the biggest levers." },
  ];

  return (
    <div className="mst-card">

      {/* HEADER */}
      <div className="mst-header">
        <div>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} /> Monthly Savings Tracker
          </h3>
          <p className="mst-sub">Log R{monthlyTarget.toLocaleString("en-ZA")}/month toward your {goalLabel}</p>
        </div>
        <div className="mst-totals">
          <div className="mst-stat">
            <span className="mst-stat-label">Saved total</span>
            <strong className="mst-stat-value accent">R{totalSaved.toLocaleString("en-ZA")}</strong>
          </div>
          <div className="mst-stat">
            <span className="mst-stat-label">Months left</span>
            <strong className="mst-stat-value">{monthsLeft}</strong>
          </div>
          <div className="mst-stat">
            <span className="mst-stat-label">Progress</span>
            <strong className="mst-stat-value">{progress}%</strong>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mst-progress-bar">
        <div className="mst-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="mst-streak">
        <span className="mst-streak-item saved">✓ {savedMonths} saved</span>
        {missedMonths > 0 && <span className="mst-streak-item missed">✗ {missedMonths} missed</span>}
      </div>

      {/* THIS MONTH CHECK-IN */}
      {!alreadyLogged ? (
        <div className="mst-checkin">
          <Circle size={20} color="#8fa3a0" />
          <div style={{ flex: 1 }}>
            <p className="mst-checkin-title">{formatMonth(thisMonth)} — Did you save R{monthlyTarget.toLocaleString("en-ZA")}?</p>
            <p className="mst-checkin-sub">Be honest — tracking missed months helps you recover faster</p>
          </div>
          <div className="mst-checkin-btns">
            <button className="mst-yes-btn" onClick={() => confirmSaved()}>Yes ✓</button>
            <button className="mst-no-btn" onClick={confirmMissed}>No ✗</button>
          </div>
        </div>
      ) : thisEntry?.missed ? (
        <div className="mst-checkin mst-checkin--missed">
          <XCircle size={20} color="#d6a85a" />
          <div style={{ flex: 1 }}>
            <p className="mst-checkin-title">Missed {formatMonth(thisMonth)}</p>
            <p className="mst-checkin-sub">See recovery tips below</p>
          </div>
          <button className="mst-remove-inline" onClick={() => removeEntry(thisMonth)}>Undo</button>
        </div>
      ) : (
        <div className="mst-checkin mst-checkin--done">
          <CheckCircle size={20} color="#84a794" />
          <div style={{ flex: 1 }}>
            <p className="mst-checkin-title">Saved in {formatMonth(thisMonth)}</p>
            <p className="mst-checkin-sub">R{thisEntry?.amount.toLocaleString("en-ZA")} logged — great work!</p>
          </div>
          <button className="mst-remove-inline" onClick={() => removeEntry(thisMonth)}>Undo</button>
        </div>
      )}

      {/* MISSED MONTH PANEL */}
      {(showMissedPanel || (alreadyLogged && thisEntry?.missed)) && (
        <div className="mst-missed-panel">
          <div className="mst-missed-header">
            <AlertTriangle size={16} color="#d6a85a" />
            <h4>Recovery Plan — {formatMonth(thisMonth)}</h4>
          </div>

          <p className="mst-missed-intro">
            Missing a month happens. Here's how to get back on track:
          </p>

          {/* TIPS */}
          <div className="mst-tips">
            {missedTips.map((t, i) => (
              <div key={i} className="mst-tip">
                <span className="mst-tip-icon">{t.icon}</span>
                <p>{t.tip}</p>
              </div>
            ))}
          </div>

          {/* CATCH-UP: save partial amount now */}
          <div className="mst-catchup">
            <RefreshCw size={14} />
            <p>Did you manage to save <em>something</em> this month?</p>
          </div>
          <div className="mst-partial">
            <input
              type="number"
              placeholder={`Partial amount (max R${monthlyTarget.toLocaleString("en-ZA")})`}
              value={partialAmount}
              onChange={(e) => setPartialAmount(e.target.value)}
            />
            <button
              className="mst-confirm-btn"
              onClick={() => {
                if (partialAmount > 0) {
                  removeEntry(thisMonth);
                  setTimeout(() => confirmSaved(Math.min(Number(partialAmount), monthlyTarget)), 50);
                }
              }}
              disabled={!partialAmount || Number(partialAmount) <= 0}
            >
              Log partial saving
            </button>
          </div>

          {/* ADJUSTED GOAL */}
          <div className="mst-adjust-suggestion">
            <p className="label">Suggested catch-up plan</p>
            <p className="mst-adjust-text">
              Save <strong className="accent">R{catchUpAmount.toLocaleString("en-ZA")}</strong> next month to make up for this miss.
              That's your normal R{monthlyTarget.toLocaleString("en-ZA")} + 50% extra.
            </p>
            <p className="small" style={{ marginTop: 4, color: "#8fa3a0" }}>
              Your new estimated timeline: <strong>{monthlyTarget > 0 ? Math.ceil(remaining / monthlyTarget) : "—"} months</strong> (unchanged if you catch up next month)
            </p>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {log.length > 0 && (
        <div className="mst-history">
          <p className="label" style={{ marginBottom: 8 }}>History ({log.length} month{log.length !== 1 ? "s" : ""})</p>
          <div className="mst-history-grid">
            {[...log].reverse().map((entry) => (
              <div key={entry.month} className={`mst-history-item ${entry.missed ? "mst-history-item--missed" : ""}`}>
                {entry.missed
                  ? <XCircle size={13} color="#d6a85a" />
                  : <CheckCircle size={13} color="#84a794" />
                }
                <span>{formatMonth(entry.month)}</span>
                <span className={entry.missed ? "mst-missed-label" : "accent"}>
                  {entry.missed ? "Missed" : `+R${entry.amount.toLocaleString("en-ZA")}`}
                </span>
                <button className="mst-remove" onClick={() => removeEntry(entry.month)} title="Remove">×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
