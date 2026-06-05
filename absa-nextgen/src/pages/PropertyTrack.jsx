import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/track.css";
import ExplainerPanel from "../components/ExplainerPanel";
import TypewriterHeading from "../components/TypewriterHeading";
import { useUser } from "../context/UserContext";
import useProgress from "../hooks/useProgress";
import { Target, TrendingUp, AlertTriangle, BookOpen, Lightbulb, FileText } from "lucide-react";
import MonthlySavingsTracker from "../components/MonthlySavingsTracker";

export default function PropertyTrack() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [showPanel, setShowPanel]       = useState(false);
  const [content, setContent]           = useState(null);
  const [savingFocus, setSavingFocus]   = useState(50);
  const [lifestyle, setLifestyle]       = useState(50);
  const [growth, setGrowth]             = useState(50);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const { progress, milestoneStatus, percent } = useProgress();

  const income   = Number(user?.netSalary || user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings  = Math.max(income - expenses, 0);
  const housePrice = Number(user?.housePrice) || 1000000;
  const goal = Number(user?.depositAmount) || Number(user?.depositGoal) || Math.round(housePrice * 0.1);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;
  const depositProgress = goal > 0 ? Math.min(100, Math.round((savings / goal) * 100)) : 0;

  const savingsMultiplier = 1 + (savingFocus - 50) / 100 - (lifestyle - 50) / 120;
  const adjustedSavings   = Math.max(0, Math.round(savings * savingsMultiplier));
  const remainingAmount   = Math.max(goal - savings, 0);
  const monthsToGoal      = adjustedSavings > 0 ? Math.ceil(remainingAmount / adjustedSavings) : null;
  const yearsToGoal       = monthsToGoal !== null ? (monthsToGoal / 12).toFixed(1) : null;

  const insights = [];
  if (savingsRate < 15)            insights.push("Your savings rate is below optimal. Increasing savings will significantly accelerate your deposit timeline.");
  if (depositProgress < 20)        insights.push("You are in the early stage of your property journey. Consistency matters more than large once-off contributions.");
  if (income > 60000 && savingsRate > 25) insights.push("Your income and savings rate position you strongly for early property acquisition.");
  if (expenses > income * 0.5)     insights.push("High fixed expenses are limiting your ability to build your deposit efficiently.");
  if (insights.length === 0)       insights.push("Your financial position is stable. Small optimisations can improve your timeline further.");

  const getSuggestedTrack = () => {
    if (savingFocus > 70 && lifestyle < 40) return { title: "Property Track", insight: "You are prioritising rapid deposit accumulation with reduced lifestyle flexibility." };
    if (growth > 70) return { title: "Investing Track", insight: "Your preferences indicate a focus on long-term wealth growth over immediate property ownership." };
    return { title: "Balanced Lifestyle Track", insight: "You are balancing lifestyle spending with steady progress toward property ownership." };
  };
  const suggestedTrack = getSuggestedTrack();

  const explainers = {
    bond:     { title: "Bond Pre-Approval",  text: "A bank assessment confirming how much you can borrow before purchasing property." },
    transfer: { title: "Transfer Duty",       text: "A government tax applied when purchasing property, based on property value." },
  };

  const milestones = [
    { key: "emergencyFund", label: milestoneStatus?.emergencyFund?.label || "Emergency Fund", hint: milestoneStatus?.emergencyFund?.hint },
    { key: "deposit",       label: milestoneStatus?.deposit?.label       || "Deposit Saved",  hint: milestoneStatus?.deposit?.hint },
    { key: "purchase",      label: milestoneStatus?.purchase?.label      || "Property Bought",hint: milestoneStatus?.purchase?.hint },
  ];

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container">

        {/* HEADER */}
        <p className="tracks-eyebrow">Property Track</p>
        <TypewriterHeading tag="h1" text="Property Strategy Path" speed={50} />
        <p className="subtitle">
          Savings rate: <span className="accent">{savingsRate}%</span> · Monthly surplus: <span className="accent">R{savings.toLocaleString("en-ZA")}</span>
        </p>

        {/* ROW 1: DEPOSIT PROGRESS + TIMELINE */}
        <div className="pt-row">
          <div className="track-card">
            <h3>Deposit Progress</h3>
            <p className="small" style={{ marginBottom: 10 }}>R{savings.toLocaleString("en-ZA")} saved of R{goal.toLocaleString("en-ZA")} target</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${depositProgress}%` }}>
                <span className="progress-text">{depositProgress}%</span>
              </div>
            </div>
            <p className="small" style={{ marginTop: 8 }}>Estimated monthly contribution: <strong>R{savings.toLocaleString("en-ZA")}</strong></p>
          </div>

          <div className="track-card">
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><Target size={16} /> Deposit Timeline</h3>
            {monthsToGoal ? (
              <>
                <p style={{ marginTop: 8 }}>At your current pace, you could reach your deposit in <strong>{monthsToGoal} months</strong> (~{yearsToGoal} years).</p>
                <p className="small" style={{ marginTop: 6, color: adjustedSavings > savings ? "#84a794" : adjustedSavings < savings ? "#d6a85a" : "#8fa3a0" }}>
                  {adjustedSavings > savings ? "Your strategy is accelerating your timeline" : adjustedSavings < savings ? "Your lifestyle is slowing your progress" : "No change to your timeline"}
                </p>
              </>
            ) : (
              <p className="warning-text" style={{ marginTop: 8 }}>No available savings. Reducing expenses or increasing income will unlock your timeline.</p>
            )}
          </div>
        </div>

        {/* MONTHLY SAVINGS TRACKER */}
        <MonthlySavingsTracker
          monthlyTarget={savings}
          goalAmount={goal}
          goalLabel="deposit"
        />

        {/* ROW 2: AI INSIGHTS + MILESTONES */}
        <div className="pt-row">
          <div className="track-card" id="insights">
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><Lightbulb size={16} /> AI Insights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              {insights.map((item, i) => (
                <div key={i} className="insight"><p>{item}</p></div>
              ))}
            </div>
          </div>

          <div className="track-card" id="milestones">
            <h3>Milestones <span className="small" style={{ fontWeight: 400 }}>— auto-tracked</span></h3>
            <div className="ms-track" style={{ marginTop: 14 }}>
              {milestones.map(({ key, label, hint }, index) => {
                const isCompleted = progress[key];
                const isPrevDone  = index === 0 || progress[milestones[index - 1].key];
                const isLocked    = !isPrevDone;
                const isCurrent   = !isCompleted && isPrevDone;
                return (
                  <div key={key} className="ms-step-col">
                    <div className="ms-circle-row">
                      {index > 0 && <div className={`ms-line ${progress[milestones[index-1].key] ? "filled" : ""}`} />}
                      <div className={`step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`} title={isCompleted ? "Achieved" : isLocked ? "Complete previous milestone first" : hint}>
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      {index < milestones.length - 1 && <div className={`ms-line ${isCompleted ? "filled" : ""}`} />}
                    </div>
                    <div className="ms-label">
                      <span className="step-label">{label}</span>
                      {isCurrent && hint && <span className="ms-hint" onClick={() => navigate("/money")}>{hint}</span>}
                      {isLocked && <span className="step-locked-label">Locked</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="muted" style={{ marginTop: 10 }}>{percent}% complete</p>
          </div>
        </div>

        {/* ROW 3: NEXT STEPS + KEY DRIVERS */}
        <div className="pt-row">
          <div className="track-card">
            <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={16} /> Smart Next Steps</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              <div className="nudge available" onClick={() => { setContent(explainers.bond); setShowPanel(true); }}>
                <Lightbulb size={14} style={{ flexShrink: 0 }} /> Secure bond pre-approval
                <div className="tooltip-box">{explainers.bond.text}</div>
              </div>
              <div className="nudge available" onClick={() => { setContent(explainers.transfer); setShowPanel(true); }}>
                <FileText size={14} style={{ flexShrink: 0 }} /> Estimate transfer costs
                <div className="tooltip-box">{explainers.transfer.text}</div>
              </div>
            </div>
          </div>

          <div className="track-card">
            <h3>Key Drivers</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
              <p className="small">Monthly savings: <strong className="accent">R{savings.toLocaleString("en-ZA")}</strong></p>
              <p className="small">Affordability linked to income</p>
              <p className="small">Spending behaviour affects progress</p>
              <p className="small" style={{ marginTop: 4, color: depositProgress > 40 ? "#84a794" : "#8fa3a0" }}>
                {depositProgress > 40 ? "You are ahead of your projected timeline." : "Maintaining consistency will improve your position."}
              </p>
            </div>
          </div>
        </div>

        {/* STRATEGY GUIDE */}
        <div className="track-card">
          <h3>Strategy Guide</h3>
          <div className="grid-2" style={{ marginTop: 14 }}>
            <div>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 8 }}><BookOpen size={14} /> What to do</p>
              <ul className="list">
                <li>Save 20–30% of income consistently</li>
                <li>Keep expenses stable and predictable</li>
                <li>Avoid taking on new debt</li>
                <li>Use safe, low-risk savings accounts</li>
              </ul>
            </div>
            <div>
              <p style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: 8 }}><AlertTriangle size={14} /> Risks to watch</p>
              <ul className="list">
                <li>Burnout from extreme saving</li>
                <li>Unexpected costs (transfer duty, legal fees)</li>
                <li>Interest rate increases affecting affordability</li>
                <li>Delaying investing too long</li>
              </ul>
            </div>
          </div>
          <div className="explanation-box" style={{ marginTop: 14 }}>
            <p style={{ lineHeight: 1.7 }}>
              This strategy works because property requires a large upfront deposit. The fastest way to reach that goal is by increasing your savings rate and reducing unnecessary spending. Small monthly contributions compound into a large deposit over time.
            </p>
          </div>
        </div>

        {/* ADJUST STRATEGY */}
        <div className="track-grid">
          <div className="track-card">
            <h3>Adjust Strategy</h3>
            {[
              { label: "Saving Priority", value: savingFocus, set: setSavingFocus, hint: "Higher = faster deposit timeline" },
              { label: "Lifestyle Flexibility", value: lifestyle, set: setLifestyle, hint: "Higher = more discretionary spending" },
              { label: "Wealth Growth Focus", value: growth, set: setGrowth, hint: "Higher = long-term investing focus" },
            ].map(({ label, value, set, hint }) => (
              <div className="slider-group" key={label}>
                <label>{label}</label>
                <input type="range" min="0" max="100" value={value} onChange={(e) => set(Number(e.target.value))} />
                <span className="slider-hint">{hint}</span>
              </div>
            ))}
            <button className="pill outline" onClick={() => setShowSuggestion(true)}>Generate Recommendation</button>
          </div>

          <div className={`track-card ${showSuggestion ? "active" : ""}`}>
            <h3>Recommended Strategy</h3>
            {!showSuggestion ? (
              <p className="placeholder" style={{ marginTop: 8, color: "#8fa3a0" }}>Adjust your inputs to generate a recommendation.</p>
            ) : (
              <>
                <p className="accent" style={{ marginTop: 8, fontWeight: 600 }}>{suggestedTrack.title}</p>
                <p className="small" style={{ marginTop: 6, lineHeight: 1.6 }}>{suggestedTrack.insight}</p>
              </>
            )}
          </div>
        </div>

      </div>

      <ExplainerPanel show={showPanel} onClose={() => setShowPanel(false)} content={content} />

      <div className="finance-orb" onClick={() => navigate("/learn")} title="Finance School">
        🎓
      </div>
    </div>
  );
}
