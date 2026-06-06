import { useState } from "react";
import { useUser } from "../context/UserContext";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import useProgress from "../hooks/useProgress";
import SlideIn from "../components/SlideIn";
import FiveYearJourney from "../components/FiveYearJourney";
import { TrendingUp, AlertTriangle, BookOpen, ChevronDown } from "lucide-react";

export default function CatchUpTrack() {
  const { user } = useUser();

  // ✅ ALL HOOKS FIRST
  const [extraSaving, setExtraSaving] = useState(0);
  const { progress: milestoneProgress, milestoneStatus, percent } = useProgress();
  const [openCards, setOpenCards] = useState({ engine: false, insights: false, guide: false, milestones: false });
  const toggleCard = (key) => setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));

  /* ================= DATA ================= */
  const income = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = income - expenses;

  /* ================= TARGET ================= */
  const targetWealth = 1000000;
  const currentWealth = Math.max(150000, savings * 5);
  const wealthProgress = Math.min((currentWealth / targetWealth) * 100, 100);

  /* ================= TIME MODEL ================= */
  const yearlySaving = savings * 12 + extraSaving * 12;
  const remaining = Math.max(targetWealth - currentWealth, 0);
  const yearsToGoal =
    yearlySaving > 0 ? Math.ceil(remaining / yearlySaving) : null;
  const improvedYears =
    yearsToGoal !== null ? Math.max(yearsToGoal - 2, 1) : null;

  /* ================= SCORE SYSTEM ================= */
  let score = 0;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  score += Math.min(savingsRate * 1.5, 40);
  score += Math.min(wealthProgress * 0.4, 40);
  if (yearsToGoal !== null) {
    if (yearsToGoal < 5) score += 20;
    else if (yearsToGoal < 10) score += 10;
    else score += 5;
  }
  score = Math.round(score);

  let scoreStatus = "";
  let scoreColor = "";
  if (score < 40) {
    scoreStatus = "Behind";
    scoreColor = "#ff6b6b";
  } else if (score < 70) {
    scoreStatus = "Improving";
    scoreColor = "#f4a261";
  } else {
    scoreStatus = "Strong";
    scoreColor = "#2a9d8f";
  }

  /* ================= INSIGHTS ================= */
  let insight1 = "";
  let insight2 = "";
  if (wealthProgress < 30) {
    insight1 =
      "You are slightly behind, but recovery is achievable with consistency.";
    insight2 =
      "Increasing contributions by 5% could reduce your timeline significantly.";
  } else if (wealthProgress < 60) {
    insight1 =
      "You are making steady progress — keep increasing your savings rate.";
    insight2 =
      "Small increases in savings will have a strong long-term impact.";
  } else {
    insight1 = "You are on track — your current pace is strong.";
    insight2 = "Maintain consistency to reach your goal faster.";
  }

  /* ================= MILESTONE INSIGHTS ================= */
  const milestoneInsights = [];
  if (!milestoneProgress.emergencyFund) {
    milestoneInsights.push(
      "Stabilise your finances by building an emergency fund first.",
    );
  }
  if (milestoneProgress.emergencyFund && !milestoneProgress.deposit) {
    milestoneInsights.push(
      "Good progress — now shift focus to saving for your deposit.",
    );
  }
  if (milestoneProgress.deposit && !milestoneProgress.purchase) {
    milestoneInsights.push(
      "You're close — prepare for property or investment opportunities.",
    );
  }

  const steps = ["emergencyFund", "deposit", "purchase"];
  const timelineLabels = {
    emergencyFund: "Stabilise",
    deposit: "Accelerate Saving",
    purchase: "Wealth Catch-Up",
  };

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">
        {/* ================= HEADER ================= */}
        <p className="tracks-eyebrow">Catch-Up Wealth</p>
        <SlideIn tag="h1" text={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`} />
        <SlideIn tag="p" className="subtitle" delay={120} text="You are on the Catch-Up track · accelerate your progress and close the gap" />

        {/* ================= 5-YEAR JOURNEY ================= */}
        <FiveYearJourney
          trackKey="catchup"
          monthlyAmount={savings}
          currentSaved={Number(user?.savings) || 0}
          fiveYearTarget={Number(user?.fiveYearGoal) || 0}
        />

        {/* ================= STATUS ================= */}
        <div className="track-card">
          <h2>Catch Up Status</h2>

          <div style={{ marginBottom: "12px" }}>
            <p>🎯 Target Wealth: R{targetWealth.toLocaleString()}</p>
            <p>📊 Current: R{currentWealth.toLocaleString()}</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${wealthProgress}%` }}
            />
          </div>

          <p className="small">{Math.round(wealthProgress)}% of target</p>

          {/* TIME MODEL */}
          <div style={{ display: "flex", gap: "8px", margin: "12px 0" }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background:
                    i < Math.round((percent / 100) * 5) ? "#84a794" : "#1a1f1e",
                }}
              />
            ))}
          </div>

          <p className="small">
            Current pace:{" "}
            {yearsToGoal !== null ? `${yearsToGoal} years` : "N/A"}
          </p>
          <p className="small">
            Optimised pace:{" "}
            {improvedYears !== null ? `${improvedYears} years` : "N/A"}
          </p>
        </div>

        {/* ================= SCORE ================= */}
        <div className="track-card">
          <h2>📊 Financial Score</h2>

          <div className="score-box">
            <h1 style={{ color: scoreColor }}>{score}/100</h1>
            <p className="small">{scoreStatus}</p>
          </div>

          <div className="score-bar">
            <div
              className="score-fill"
              style={{ width: `${score}%`, background: scoreColor }}
            />
          </div>

          <p className="small">
            Your score reflects your savings rate, progress, and time to goal.
          </p>
        </div>

        <div className="track-card" style={{ display: "none" }}>
          <h2>Catch-Up Journey Timeline (legacy)</h2>

          {/* HORIZONTAL TIMELINE */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "30px",
              paddingBottom: "20px",
            }}
          >
            {/* BACKGROUND LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                right: "0",
                height: "3px",
                background: "#1a1f1e",
                zIndex: 0,
              }}
            />
            {/* FILLED LINE */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "0",
                height: "3px",
                width: `${percent}%`,
                background: "linear-gradient(to right, #d6a85a, #84a794)",
                zIndex: 1,
                transition: "width 0.4s ease",
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = milestoneProgress[step];
              const isCurrent =
                !milestoneProgress[step] &&
                (index === 0 || milestoneProgress[steps[index - 1]]);
              const isLocked =
                index > 0 && !milestoneProgress[steps[index - 1]];

              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: 1,
                    zIndex: 2,
                  }}
                >
                  <div
                    className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                  >
                    {isCompleted ? "✓" : index + 1}
                  </div>
                  <span className="step-label">{timelineLabels[step]}</span>
                  {index < steps.length - 1 && (
                    <div
                      className={`step-line ${milestoneProgress[step] ? "filled" : ""}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <p className="small">{percent}% complete</p>

          <p className="insight neutral">
            {percent < 25 &&
              "You're behind — focus on stabilising your finances."}
            {percent >= 25 &&
              percent < 50 &&
              "Progress started — increase your savings rate."}
            {percent >= 50 &&
              percent < 75 &&
              "Momentum building — stay disciplined."}
            {percent >= 75 &&
              percent < 100 &&
              "Catch-up almost complete — final push."}
            {percent === 100 &&
              "🚀 You're back on track — wealth growth unlocked."}
          </p>
        </div>

        {/* ── TOOLS & EDUCATION ── */}
        <div className="bl-tools-section">
          <p className="bl-tools-label">Tools &amp; Education</p>
          <div className="bl-tools-grid">

            {/* ALLOCATION ENGINE */}
            <div className={`bl-tile${openCards.engine ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("engine")}>
                <div className="bl-tile-top">
                  <TrendingUp size={15} color="#4facfe" />
                  <span className="bl-tile-title">Allocation Engine</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.engine ? " rotated" : ""}`} />
                </div>
                {!openCards.engine && (<>
                  <p className="bl-tile-summary">Adjust monthly saving · see time impact</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.engine && (
                <div className="bl-tile-body">
                  <div className="slider-group">
                    <label>Extra Monthly Saving</label>
                    <input type="range" min="0" max="10000" step="500" value={extraSaving} onChange={(e) => setExtraSaving(Number(e.target.value))} />
                    <span className="slider-hint">+R{extraSaving.toLocaleString()} / month — reduces time to goal</span>
                  </div>
                  <p className="small" style={{ marginTop: 10 }}>
                    {score < 40 ? "⚠️ Falling behind — increase savings urgently" : score < 70 ? "📈 Improving — stay consistent" : "🚀 On track — maintain your strategy"}
                  </p>
                </div>
              )}
            </div>

            {/* AI INSIGHTS */}
            <div className={`bl-tile${openCards.insights ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("insights")}>
                <div className="bl-tile-top">
                  <TrendingUp size={15} color="#84a794" />
                  <span className="bl-tile-title">AI Insights</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.insights ? " rotated" : ""}`} />
                </div>
                {!openCards.insights && (<>
                  <p className="bl-tile-summary">{insight1.slice(0, 45)}…</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.insights && (
                <div className="bl-tile-body">
                  <div className="insight-block">
                    <div className="insight">💡 {insight1}</div>
                    <div className="insight">🔔 {insight2}</div>
                    {milestoneInsights.map((item, i) => <div key={i} className="insight">{item}</div>)}
                  </div>
                </div>
              )}
            </div>

            {/* TRACK RATIONALE */}
            <div className={`bl-tile${openCards.milestones ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("milestones")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#d6a85a" />
                  <span className="bl-tile-title">Track Rationale</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.milestones ? " rotated" : ""}`} />
                </div>
                {!openCards.milestones && (<>
                  <p className="bl-tile-summary">Trade-offs · numbers · warnings</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.milestones && (
                <div className="bl-tile-body">
                  <div className="grid-2" style={{ gap: 12 }}>
                    <div style={{ background: "rgba(214,168,90,0.06)", border: "1px solid rgba(214,168,90,0.2)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#d6a85a", margin: "0 0 8px" }}>⚖ Trade-offs</p>
                      {[
                        { pro: true, text: "Fastest path to closing the wealth gap" },
                        { pro: true, text: "High discipline = high reward" },
                        { pro: false, text: "Lifestyle heavily restricted" },
                        { pro: false, text: "Burnout risk if too aggressive" },
                      ].map(({ pro, text }, i) => (
                        <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                          <span style={{ color: pro ? "#84a794" : "#d6a85a", fontWeight: 700, flexShrink: 0 }}>{pro ? "✓" : "✗"}</span>
                          <p style={{ margin: 0, fontSize: "0.76rem", color: "#c0ccc8" }}>{text}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.15)", borderRadius: 10, padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9898", margin: "0 0 8px" }}>⚠ Watch for</p>
                      {["Neglecting emergency savings", "High-risk investments to compensate", "Unrealistic speed expectations", "Skipping emergency fund"].map((t, i) => (
                        <p key={i} style={{ margin: "0 0 5px", fontSize: "0.76rem", color: "#c0ccc8" }}>· {t}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STRATEGY GUIDE */}
            <div className={`bl-tile${openCards.guide ? " bl-tile--open" : ""}`}>
              <button className="bl-tile-header" onClick={() => toggleCard("guide")}>
                <div className="bl-tile-top">
                  <BookOpen size={15} color="#8a9a96" />
                  <span className="bl-tile-title">Strategy Guide</span>
                  <ChevronDown size={14} color="#667c74" className={`bl-tile-chevron${openCards.guide ? " rotated" : ""}`} />
                </div>
                {!openCards.guide && (<>
                  <p className="bl-tile-summary">What to do · risks to watch</p>
                  <p className="bl-tile-hint">Tap to explore →</p>
                </>)}
              </button>
              {openCards.guide && (
                <div className="bl-tile-body">
                  <div className="grid-2">
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}>📌 What to do</p>
                      <ul className="list">
                        <li>Increase savings rate aggressively (20–40%)</li>
                        <li>Cut unnecessary lifestyle expenses</li>
                        <li>Pay off high-interest debt first</li>
                        <li>Invest consistently once stable</li>
                      </ul>
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 8, fontSize: "0.82rem" }}>⚠️ Risks to watch</p>
                      <ul className="list">
                        <li>Burnout from saving too aggressively</li>
                        <li>Neglecting emergency savings</li>
                        <li>High-risk investments to compensate</li>
                        <li>Unrealistic catch-up expectations</li>
                      </ul>
                    </div>
                  </div>
                  <div className="explanation-box" style={{ marginTop: 10 }}>
                    <p style={{ lineHeight: 1.6, fontSize: "0.8rem" }}>
                      Catching up requires discipline — increasing income, reducing expenses, and staying consistent. The biggest mistake is rushing with risky decisions instead of building a strong foundation first.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
