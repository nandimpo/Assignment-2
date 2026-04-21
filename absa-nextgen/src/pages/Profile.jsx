import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  // USER DATA
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const income = Number(localStorage.getItem("income")) || 45000;
  const expenses = Number(localStorage.getItem("expenses")) || 29000;
  const savings = income - expenses;

  const savingRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  // LEARNING DATA (Finance School preview)
  const learning = JSON.parse(localStorage.getItem("learning")) || {
    completed: ["basics", "spending", "property"],
    xp: 120,
    level: 2,
    streak: 4,
  };

  // GOALS (dynamic per strategy)
  const goals =
    user.strategy === "Property"
      ? [
          { name: "Emergency Fund", value: 60 },
          { name: "Deposit Saved", value: 25 },
          { name: "Bond Readiness", value: 10 },
        ]
      : user.strategy === "Catch-Up"
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

  return (
    <div className="profile">
      <div className="container">
        {/* ================= NAV ================= */}
        <nav className="navbar">
          <h1 className="logo">ABSA Wealth Studio</h1>

          <div className="nav-links">
            <button onClick={() => navigate("/money")}>Snapshot</button>
            <button onClick={() => navigate("/track")}>Tracks</button>
            <button onClick={() => navigate("/simulation")}>Simulation</button>
            <button className="active">Profile</button>
          </div>
        </nav>

        {/* ================= GRID ================= */}
        <div className="profile-container">
          {/* ========== LEFT MAIN CARD ========== */}
          <div className="card glass">
            {/* TOP */}
            <div className="profile-top">
              <div className="avatar">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="profile-info">
                <h2>{user.name || "User"}</h2>
                <p>Financial growth journey</p>
                <span className="tag">
                  {user.strategy || "No strategy"} Track
                </span>
              </div>

              <button className="edit-btn" onClick={() => navigate("/setup")}>
                Edit Profile
              </button>
            </div>

            {/* DONUT */}
            <div className="donut-section">
              <div
                className="donut"
                style={{
                  background: `conic-gradient(
                    #84a794 ${savingRate * 3.6}deg,
                    #1a1f1e 0deg
                  )`,
                }}
              >
                <div className="donut-inner">{savingRate}%</div>
              </div>
              <p>Saving Rate</p>
            </div>

            {/* SNAPSHOT */}
            <div className="snapshot">
              <div>
                <p>Income</p>
                <h4>R{income.toLocaleString()}</h4>
              </div>

              <div>
                <p>Savings</p>
                <h4>R{savings.toLocaleString()}</h4>
              </div>

              <div>
                <p>Expenses</p>
                <h4>R{expenses.toLocaleString()}</h4>
              </div>
            </div>

            {/* GOALS */}
            <div className="section">
              <h3>Goals & Progress</h3>

              {goals.map((goal, i) => (
                <div key={i} className="goal-block">
                  <div className="goal">
                    <span>{goal.name}</span>
                    <span>{goal.value}%</span>
                  </div>

                  <div className="bar">
                    <div
                      className="bar-fill"
                      style={{ width: `${goal.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="pill wide" onClick={() => navigate("/track")}>
              Adjust Strategy →
            </button>
          </div>

          {/* ========== RIGHT SIDE ========== */}
          <div className="profile-side">
            {/* INSIGHTS */}
            <div className="card glass">
              <h3>Insights</h3>

              <div className="side-item">
                {savingRate > 25
                  ? "You're building strong financial momentum"
                  : "Increase your savings to improve growth"}
              </div>

              <div className="side-item">
                Based on your track:{" "}
                <span className="accent">{user.strategy}</span>
              </div>
            </div>

            {/* NEXT ACTIONS */}
            <div className="card glass">
              <h3>Next Actions</h3>

              <div className="side-item">Update financial details</div>
              <div className="side-item">Run a simulation</div>

              <div className="side-actions">
                <button onClick={() => navigate("/setup")}>Edit</button>

                <button onClick={() => navigate("/simulation")}>
                  Simulate
                </button>
              </div>
            </div>

            {/* FINANCE SCHOOL PREVIEW */}
            <div className="card glass">
              <h3>Finance School</h3>

              <p>Continue building your financial knowledge</p>

              <div className="mini-progress">
                <div
                  style={{
                    width: `${(learning.completed.length / 10) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="side-item">
                {learning.completed.length} / 10 modules completed
              </div>

              <div className="side-item">🔥 {learning.streak} day streak</div>

              <button className="pill" onClick={() => navigate("/learn")}>
                Open Finance School →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
