import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/fiveyear.css";
import NumberCounter from "./NumberCounter";
import { projectCompoundFixedWindow, projectLinearFixedWindow } from "../utils/projections";

// Track-specific config: milestone labels per year + growth model
const trackConfig = {
  balanced: {
    yearLabels: ["Emergency Fund", "Consistent Investing", "Portfolio Growth", "Diversify", "Financial Independence"],
    rate: 0.10,
    valueLabel: "portfolio",
    verb: "invested & grown",
    compute: (monthly, currentSaved, year, elapsedMonths = 0) =>
      projectCompoundFixedWindow({ monthly, currentSaved, elapsedMonths, totalMonths: year * 12, annualRate: 0.10 }),
  },
  property: {
    yearLabels: ["Saving Starts", "10% Deposit", "Pre-Approval Ready", "Strong Offer", "Keys in Hand"],
    rate: 0,
    valueLabel: "deposit saved",
    verb: "saved toward deposit",
    compute: (monthly, currentSaved, year, elapsedMonths = 0) =>
      projectLinearFixedWindow({ monthly, currentSaved, elapsedMonths, totalMonths: year * 12 }),
  },
  catchup: {
    yearLabels: ["Debt Audit", "Halfway Clear", "Debt Free", "Building Wealth", "Fully Caught Up"],
    rate: 0,
    valueLabel: "debt remaining",
    verb: "debt eliminated",
    // currentSaved = total debt passed in; counts DOWN toward zero
    compute: (monthly, totalDebt, year) =>
      Math.max(0, Math.round(totalDebt - monthly * 12 * year)),
  },
  correction: {
    yearLabels: ["Budget Locked", "Habits Fixed", "Debt Cleared", "Saving Starts", "Financial Control"],
    rate: 0,
    valueLabel: "savings built",
    verb: "saved & corrected",
    compute: (monthly, currentSaved, year, elapsedMonths = 0) =>
      projectLinearFixedWindow({ monthly, currentSaved, elapsedMonths, totalMonths: year * 12 }),
  },
};

export default function FiveYearJourney({ trackKey, monthlyAmount, currentSaved = 0, fiveYearTarget = 0, elapsedMonths = 0 }) {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const cfg = trackConfig[trackKey] || trackConfig.balanced;
  const monthly = Math.max(monthlyAmount || 0, 0);
  const monthsElapsed = Math.max(0, Number(elapsedMonths) || 0);

  const yearValues = [1, 2, 3, 4, 5].map((y) => cfg.compute(monthly, currentSaved, y, monthsElapsed));
  const year5Value = yearValues[4];
  const currentYearIndex = Math.min(4, Math.max(0, Math.floor(monthsElapsed / 12)));

  // For catch-up track, lower is better (debt going to 0). Invert on-track logic.
  const isCatchup = trackKey === "catchup";
  const totalDebt = isCatchup ? currentSaved : 0;
  // Which year does debt clear? (first year where value hits 0)
  const clearYear = isCatchup ? (yearValues.findIndex(v => v === 0) + 1) || null : null;
  const debtCleared = isCatchup && year5Value === 0;

  const targetGap = !isCatchup && fiveYearTarget > 0 ? Math.max(0, fiveYearTarget - year5Value) : 0;
  const onTrack = !isCatchup && fiveYearTarget > 0 && year5Value >= fiveYearTarget;

  // Progress bar: for catchup = % debt cleared so far (currentSaved = totalDebt, actual paid = 0 at start)
  const barPct = isCatchup
    ? totalDebt > 0 ? Math.min(100, Math.round(((totalDebt - year5Value) / totalDebt) * 100)) : 0
    : year5Value > 0 ? Math.min(100, Math.round((currentSaved / year5Value) * 100)) : 0;

  // Flash + adjust state
  const [screenFlash, setScreenFlash]   = useState(false);
  const [badgeFlash, setBadgeFlash]     = useState(false);
  const [showAdjust, setShowAdjust]     = useState(false);
  const [adjTarget, setAdjTarget]       = useState(fiveYearTarget || "");
  const badgeRef = useRef(null);

  // Required monthly to hit current target (compound for balanced, linear otherwise)
  const remainingProjectionMonths = Math.max(1, 60 - monthsElapsed);
  const requiredMonthly = fiveYearTarget > 0
    ? trackKey === "balanced"
      ? (() => {
          // Solve PMT from FV: PMT = FV * r / ((1+r)^n - 1)
          const r = 0.10 / 12;
          const n = remainingProjectionMonths;
          return Math.round((fiveYearTarget - currentSaved) * r / (Math.pow(1 + r, n) - 1));
        })()
      : Math.round((fiveYearTarget - currentSaved) / remainingProjectionMonths)
    : 0;

  const handleGapClick = () => {
    // 1. Screen flash first
    setScreenFlash(true);
    setTimeout(() => {
      setScreenFlash(false);
      // 2. Then badge flash
      setBadgeFlash(true);
      setTimeout(() => {
        setBadgeFlash(false);
        // 3. Then show adjust panel
        setShowAdjust(true);
      }, 900);
    }, 600);
  };

  const handleApplyTarget = () => {
    const newTarget = Number(adjTarget);
    if (!newTarget || newTarget <= 0) return;
    updateUser({ fiveYearGoal: newTarget });
    setShowAdjust(false);
  };

  return (
    <>
      {/* Full-screen orange flash overlay */}
      {screenFlash && <div className="fy-screen-flash" />}

      <div className="fy-wrap">
        <p className="fy-eyebrow">Your 5-Year Journey</p>

        {/* YEAR NODES */}
        <div className="fy-track">
          <div className="fy-line-bg" />
          <div className="fy-line-fill" style={{ width: `${barPct}%` }} />

          {[1, 2, 3, 4, 5].map((y, i) => {
            // For catchup: a year is "done" when debt reaches 0 at or before it
            // For other tracks: a year is "done" when you've already saved past that milestone
            const isFuture = isCatchup ? yearValues[i] > 0 : currentSaved < yearValues[i];
            const nodeCleared = isCatchup && yearValues[i] === 0;
            const isCurrentNode = i === currentYearIndex;
            return (
              <div key={y} className={`fy-node ${!isFuture ? "fy-node--done" : ""} ${y === 5 ? "fy-node--end" : ""} ${isCurrentNode ? "fy-node--current" : ""}`}>
                <div className="fy-dot">{!isFuture ? "✓" : y}</div>
                {isCurrentNode && <span className="fy-you-are-here">▲ You are here</span>}
                <p className="fy-year-label">Year {y}</p>
                <p className="fy-milestone">{cfg.yearLabels[i]}</p>
                {isCatchup ? (
                  <p className="fy-value" style={{ color: nodeCleared ? "#2a9d8f" : undefined }}>
                    {nodeCleared ? "Gone ✓" : `R${yearValues[i].toLocaleString("en-ZA")} left`}
                  </p>
                ) : (
                  <p className="fy-value">R{yearValues[i].toLocaleString("en-ZA")}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* YEAR 5 OUTCOME CARD */}
        <div className="fy-outcome">
          <div className="fy-outcome-left">
            <p className="fy-outcome-eyebrow">{isCatchup ? (clearYear ? `Debt Free by Year ${clearYear}` : "By Year 5") : "By Year 5"}</p>
            {isCatchup ? (
              debtCleared ? (
                <p className="fy-outcome-number" style={{ color: "#2a9d8f" }}>Debt Free ✓</p>
              ) : (
                <p className="fy-outcome-number" style={{ color: "#ff8a80" }}>
                  <NumberCounter value={year5Value} prefix="R" /> left
                </p>
              )
            ) : (
              <p className="fy-outcome-number"><NumberCounter value={year5Value} prefix="R" /></p>
            )}
            {isCatchup ? (
              <p className="fy-outcome-sub">
                {debtCleared
                  ? `${cfg.verb} at R${monthly.toLocaleString("en-ZA")}/month`
                  : `R${(totalDebt - year5Value).toLocaleString("en-ZA")} cleared · R${year5Value.toLocaleString("en-ZA")} remaining`}
              </p>
            ) : (
              <p className="fy-outcome-sub">{cfg.verb} at R{monthly.toLocaleString("en-ZA")}/month</p>
            )}
          </div>

          <div className="fy-outcome-right">
            {isCatchup ? (
              // Catch-up track: show debt clearance status badge
              debtCleared ? (
                <div className="fy-badge fy-badge--good">
                  {clearYear === 1 ? "Debt gone in Year 1 🚀" : `Debt-free by Year ${clearYear} ✓`}
                </div>
              ) : monthly > 0 ? (
                <div className="fy-badge fy-badge--gap">
                  <span>Still R{year5Value.toLocaleString("en-ZA")} remaining after 5 years</span>
                  <p className="fy-badge-hint">
                    Increase monthly payment to clear faster · go to Setup to adjust
                  </p>
                </div>
              ) : (
                <button className="fy-badge fy-badge--neutral fy-badge--link" onClick={() => navigate("/setup")}>
                  Set your monthly debt payment in Setup →
                </button>
              )
            ) : fiveYearTarget > 0 ? (
              onTrack ? (
                <div className="fy-badge fy-badge--good">
                  On track for your R{fiveYearTarget.toLocaleString("en-ZA")} goal ✓
                </div>
              ) : (
                <div ref={badgeRef} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                  <button
                    className={`fy-badge fy-badge--gap fy-badge--link${badgeFlash ? " fy-badge--flashing" : ""}`}
                    onClick={handleGapClick}
                    title="Click to adjust your goal"
                  >
                    <span>R{targetGap.toLocaleString("en-ZA")} short of your goal</span>
                    <p className="fy-badge-hint">
                      To hit R{fiveYearTarget.toLocaleString("en-ZA")}, invest R{requiredMonthly.toLocaleString("en-ZA")}/month · tap to adjust
                    </p>
                  </button>

                  {/* ADJUST PANEL */}
                  {showAdjust && (
                    <div className="fy-adjust-panel">
                      <p className="fy-adjust-title">⚡ Readjust your 5-year goal</p>
                      <p className="fy-adjust-hint">
                        At R{monthly.toLocaleString("en-ZA")}/month you'll reach <strong>R{year5Value.toLocaleString("en-ZA")}</strong> by Year 5.
                        Update your target to match, or go to Setup to increase your monthly contribution.
                      </p>
                      <div className="fy-adjust-row">
                        <div className="fy-adjust-option">
                          <p className="fy-adjust-option-label">Match target to projection</p>
                          <button
                            className="fy-adjust-btn fy-adjust-btn--primary"
                            onClick={() => { updateUser({ fiveYearGoal: year5Value }); setShowAdjust(false); }}
                          >
                            Set goal to R{year5Value.toLocaleString("en-ZA")}
                          </button>
                        </div>
                        <div className="fy-adjust-divider">or</div>
                        <div className="fy-adjust-option">
                          <p className="fy-adjust-option-label">Increase monthly contribution</p>
                          <button
                            className="fy-adjust-btn fy-adjust-btn--secondary"
                            onClick={() => { navigate("/setup"); setShowAdjust(false); }}
                          >
                            Go to Setup → invest R{requiredMonthly.toLocaleString("en-ZA")}/month
                          </button>
                        </div>
                      </div>
                      <div className="fy-adjust-custom">
                        <p className="fy-adjust-option-label">Or set a custom target</p>
                        <div className="fy-adjust-input-row">
                          <input
                            type="number"
                            className="fy-adjust-input"
                            placeholder="e.g. 500 000"
                            value={adjTarget}
                            onChange={(e) => setAdjTarget(e.target.value)}
                          />
                          <button className="fy-adjust-btn fy-adjust-btn--ghost" onClick={handleApplyTarget}>Apply</button>
                        </div>
                      </div>
                      <button className="fy-adjust-close" onClick={() => setShowAdjust(false)}>Dismiss</button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <button className="fy-badge fy-badge--neutral fy-badge--link" onClick={() => navigate("/setup")}>
                Set a 5-year target in Setup to track your gap →
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
