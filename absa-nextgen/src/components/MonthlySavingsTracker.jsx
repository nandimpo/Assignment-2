import { useState } from "react";
import { useUser } from "../context/UserContext";
import { CheckCircle, Circle, XCircle, TrendingUp, AlertTriangle, RefreshCw, Lightbulb, CalendarClock, Target, BarChart2 } from "lucide-react";

export default function MonthlySavingsTracker({
  monthlyTarget,
  goalAmount,
  goalLabel    = "goal",
  logKey       = "savingsLog",   // separate log per track
  trackerTitle = "Monthly Savings Tracker",
  verb         = "saved",        // "saved" or "paid"
}) {
  const { user, updateUser } = useUser();
  const [showMissedPanel, setShowMissedPanel] = useState(false);
  const [partialAmount, setPartialAmount]     = useState("");
  const [flashing, setFlashing]               = useState(false);
  const [flashGreen, setFlashGreen]           = useState(false);

  const log        = user?.[logKey] || [];
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
    updateUser({ [logKey]: newLog, savings: logKey === "savingsLog" ? totalSaved + Number(amount) : undefined });
    setShowMissedPanel(false);
  };

  const confirmMissed = () => {
    if (alreadyLogged) return;
    const newLog = [...log, { month: thisMonth, amount: 0, missed: true }];
    updateUser({ [logKey]: newLog });
    setShowMissedPanel(true);
    setFlashing(true);
    setTimeout(() => setFlashing(false), 2400);
  };

  const removeEntry = (month) => {
    const newLog     = log.filter(e => e.month !== month);
    const newSavings = newLog.filter(e => !e.missed).reduce((sum, e) => sum + e.amount, 0);
    updateUser({ [logKey]: newLog, ...(logKey === "savingsLog" ? { savings: newSavings } : {}) });
    if (month === thisMonth) setShowMissedPanel(false);
  };

  const missedTips = [
    { icon: <Lightbulb size={14} color="#d6a85a" />, tip: "Review your fixed expenses — even a R500 cut frees up meaningful savings." },
    { icon: <RefreshCw size={14} color="#84a794" />, tip: `Try saving R${catchUpAmount.toLocaleString("en-ZA")} next month to catch up (50% extra).` },
    { icon: <CalendarClock size={14} color="#84a794" />, tip: "Set up an automatic transfer on payday — save before you spend." },
    { icon: <Target size={14} color="#d6a85a" />, tip: `Your goal is R${goalAmount.toLocaleString("en-ZA")}. Every month missed adds ~1 month to your timeline.` },
    { icon: <BarChart2 size={14} color="#8fa3a0" />, tip: "Check your spending breakdown in the Snapshot — lifestyle and transport are usually the biggest levers." },
  ];

  return (
    <>
    {flashing && <div className="mst-flash" />}
    {flashGreen && <div className="mst-flash mst-flash--green" />}
    <div className="mst-card">

      {/* HEADER */}
      <div className="mst-header">
        <div>
          <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} /> {trackerTitle}
          </h3>
          <p className="mst-sub">Log R{monthlyTarget.toLocaleString("en-ZA")}/month toward your {goalLabel}</p>
        </div>
        <div className="mst-totals">
          <div className="mst-stat money-glow">
            <span className="mst-stat-label">{verb === "paid" ? "Paid total" : "Saved total"}</span>
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
        <span className="mst-streak-item saved"><CheckCircle size={11} /> {savedMonths} {verb}</span>
        {missedMonths > 0 && <span className="mst-streak-item missed"><XCircle size={11} /> {missedMonths} missed</span>}
      </div>

      {/* THIS MONTH CHECK-IN */}
      {!alreadyLogged ? (
        <div className="mst-checkin">
          <Circle size={20} color="#8fa3a0" />
          <div style={{ flex: 1 }}>
            <p className="mst-checkin-title">{formatMonth(thisMonth)} — Did you {verb === "paid" ? "pay" : "save"} R{monthlyTarget.toLocaleString("en-ZA")}?</p>
            <p className="mst-checkin-sub">Be honest — tracking missed months helps you recover faster</p>
          </div>
          <div className="mst-checkin-btns">
            <button className="mst-yes-btn" onClick={() => confirmSaved()}><CheckCircle size={13} /> Yes</button>
            <button className="mst-no-btn" onClick={confirmMissed}><XCircle size={13} /> No</button>
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
            <p className="mst-checkin-title">{verb === "paid" ? "Paid" : "Saved"} in {formatMonth(thisMonth)}</p>
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
                const amount = Math.min(Number(partialAmount), monthlyTarget);
                if (!partialAmount || amount <= 0) return;
                const newLog = [
                  ...log.filter(e => e.month !== thisMonth),
                  { month: thisMonth, amount, missed: false },
                ];
                const newSavings = newLog.filter(e => !e.missed).reduce((sum, e) => sum + e.amount, 0);
                updateUser({ [logKey]: newLog, ...(logKey === "savingsLog" ? { savings: newSavings } : {}) });
                setPartialAmount("");
                setShowMissedPanel(false);
                setFlashGreen(true);
                setTimeout(() => setFlashGreen(false), 2400);
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
    </>
  );
}
