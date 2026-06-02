import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import "../styles/profile.css";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [spotlight, setSpotlight] = useState(null);

  const income = Number(user?.salary) || 0;
  const expenses = Number(user?.expenses) || 0;
  const savings = Math.max(income - expenses, 0);
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  // ── Tour steps ──────────────────────────────────────────────────────────────

  const getProfileSteps = () => {
    const steps = [];

    // 👶 New user — no income set yet
    if (!income) {
      steps.push({
        text: "Start by setting up your financial details to build your profile.",
        target: "profile-header",
      });
      return steps;
    }

    // 💸 Low savings
    if (savingsRate < 15) {
      steps.push({
        text: `You're currently saving ${savingsRate}% — increasing this will improve your financial stability.`,
        target: "savings",
        tone: "warning",
      });
      steps.push({
        text: "Focus on reducing expenses or increasing income.",
        target: "snapshot",
      });
    }
    // ⚖️ Mid savings
    else if (savingsRate < 30) {
      steps.push({
        text: `You're saving ${savingsRate}% — you're on the right track.`,
        target: "savings",
      });
    }
    // 🚀 High savings
    else {
      steps.push({
        text: `You're saving ${savingsRate}% — strong financial position.`,
        target: "savings",
      });
    }

    // 🎯 Always show core steps
    steps.push(
      {
        text: "This is your financial snapshot — your income, spending, and savings.",
        target: "snapshot",
      },
      {
        text: "These goals track your financial progress over time.",
        target: "goals",
      },
      {
        text: "Here are insights and suggested next actions.",
        target: "insights",
      },
    );

    return steps;
  };

  const profileSteps = getProfileSteps();

  // ── Tour handlers ───────────────────────────────────────────────────────────

  const endTour = () => {
    localStorage.setItem("seenProfileTour", "true");
    setShowTour(false);
    setSpotlight(null);
  };

  const nextStep = () => {
    if (tourStep < profileSteps.length - 1) {
      setTourStep((s) => s + 1);
    } else {
      endTour();
    }
  };

  // ── Effects ─────────────────────────────────────────────────────────────────

  // Show tour for new users or anyone with a low savings rate
  useEffect(() => {
    const seen = localStorage.getItem("seenProfileTour");
    if (!seen || savingsRate < 15) {
      setShowTour(true);
    }
  }, []);

  // Reset to step 0 whenever income or expenses change
  useEffect(() => {
    if (showTour) {
      setTourStep(0);
    }
  }, [income, expenses]);

  // Spotlight the target element for the current step
  useEffect(() => {
    if (!showTour || tourStep >= profileSteps.length) return;

    const step = profileSteps[tourStep];
    const el = document.getElementById(step.target);

    if (!el) {
      console.warn("❌ Missing tour target ID:", step.target);
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const pad = 10;
      setSpotlight({
        top: rect.top + window.scrollY - pad,
        left: rect.left + window.scrollX - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      });
    }, 300);
  }, [tourStep, showTour]);

  // ── Goals ───────────────────────────────────────────────────────────────────

  const goals =
    user?.strategy === "Property"
      ? [
          { name: "Emergency Fund", value: savingsRate > 20 ? 70 : 40 },
          { name: "Deposit Saved", value: savingsRate > 15 ? 40 : 20 },
          { name: "Bond Readiness", value: savingsRate > 25 ? 20 : 10 },
        ]
      : user?.strategy === "Catch-Up"
        ? [
            { name: "Debt Reduction", value: 50 },
            { name: "Emergency Fund", value: 30 },
            { name: "Stability", value: 40 },
          ]
        : [
            { name: "Emergency Fund", value: 70 },
            { name: "Investing", value: 40 },
            { name: "Lifestyle", value: 50 },
          ];

  // ── Logout ──────────────────────────────────────────────────────────────────

  const handleLogout = () => {
    sessionStorage.removeItem("session");
    navigate("/login");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="profile">
      <AppNav />

      <div className="container">
        <div className="profile-container">
          {/* LEFT */}
          <div className="left-column">
            {/* Main card */}
            <div className="card glass" id="profile-header">
              <div className="profile-top">
                <div className="avatar">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="profile-info">
                  <h2>{user?.name || "User"}</h2>
                  <p>Financial growth journey</p>
                  <span className="tag">
                    {user?.strategy || "No strategy"} Track
                  </span>
                </div>

                <button onClick={() => navigate("/setup")}>Edit</button>

                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: "10px",
                    background: "#ff4d4f",
                    color: "white",
                  }}
                >
                  Logout
                </button>
              </div>

              <div className="profile-main">
                <div>
                  <div
                    className="donut"
                    id="savings"
                    style={{
                      background: `conic-gradient(#84a794 ${
                        savingsRate * 3.6
                      }deg, #1a1f1e 0deg)`,
                    }}
                  >
                    <div className="donut-inner">{savingsRate}%</div>
                  </div>
                  <p className="center-text">Saving Rate</p>
                </div>

                <div className="snapshot" id="snapshot">
                  <div>
                    <p>Income</p>
                    <h4>R {income.toLocaleString()}</h4>
                  </div>
                  <div>
                    <p>Expenses</p>
                    <h4>R {expenses.toLocaleString()}</h4>
                  </div>
                  <div>
                    <p>Savings</p>
                    <h4>R {savings.toLocaleString()}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Property goal */}
            {user?.housePrice && (
              <div className="card glass property-box">
                <h3>Property Goal</h3>
                <div className="property-row">
                  <span>Target</span>
                  <strong>R {Number(user.housePrice).toLocaleString()}</strong>
                </div>
                <div className="property-row">
                  <span>Deposit</span>
                  <strong>
                    R {Number(user.depositAmount || 0).toLocaleString()}
                  </strong>
                </div>
                <div className="property-row">
                  <span>Deposit %</span>
                  <strong>{user.depositPercent || 0}%</strong>
                </div>
              </div>
            )}

            {/* Goals */}
            <div className="card glass" id="goals">
              <h3>Goals &amp; Progress</h3>
              <div className="goals-grid">
                {goals.map((goal, i) => (
                  <div key={i} className="goal-card">
                    <div className="goal">
                      <span>{goal.name}</span>
                      <span>{goal.value}%</span>
                    </div>
                    <div className="bar">
                      <div
                        className="bar-fill"
                        style={{ width: `${goal.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="profile-side" id="insights">
            <div className="card glass">
              <h3>Insights</h3>
              <p>
                {savingsRate > 25
                  ? "You're in a strong financial position"
                  : "Increase your savings to improve your position"}
              </p>
              <p>
                Strategy:{" "}
                <span className="accent">
                  {user?.strategy || "Not selected"}
                </span>
              </p>
              <button onClick={() => navigate("/learn")} className="pill">
                Go to Finance School →
              </button>
            </div>

            <div className="card glass" id="next-actions">
              <h3>Next Actions</h3>
              <p>Update financial details</p>
              <p>Run simulation</p>
              <div className="side-actions">
                <button onClick={() => navigate("/setup")}>Edit</button>
                <button onClick={() => navigate("/simulation")}>
                  Simulate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Finance school orb */}
      <div
        className="finance-orb"
        onClick={() => navigate("/learn")}
        title="Go to Finance School"
      >
        🎓
      </div>

      {/* ── Tour overlay ── */}
      {showTour && spotlight && (
        <>
          <div
            className="tour-mask-top"
            style={{ top: 0, left: 0, right: 0, height: spotlight.top }}
          />
          <div
            className="tour-mask-bottom"
            style={{
              top: spotlight.top + spotlight.height,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <div
            className="tour-mask-left"
            style={{
              top: spotlight.top,
              left: 0,
              width: spotlight.left,
              height: spotlight.height,
            }}
          />
          <div
            className="tour-mask-right"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              right: 0,
              height: spotlight.height,
            }}
          />

          <div
            className="tour-cutout"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
          />

          <div className={`tour-box ${profileSteps[tourStep]?.tone || ""}`}>
            <p className="tour-counter">
              Step {tourStep + 1} of {profileSteps.length}
            </p>

            <p className="tour-text">{profileSteps[tourStep]?.text}</p>

            <div className="tour-actions">
              <button onClick={endTour}>Skip</button>
              <button onClick={nextStep}>
                {tourStep === profileSteps.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
