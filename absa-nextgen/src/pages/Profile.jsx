import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : {};

  const income = Number(user.salary) || 0;
  const expenses = Number(user.expenses) || 0;
  const savings = Math.max(income - expenses, 0);
  const savingRate = income > 0 ? Math.round((savings / income) * 100) : 0;

  const simulation = user.simulation || {};

  const goals =
    user.strategy === "Property"
      ? [
          { name: "Emergency Fund", value: savingRate > 20 ? 70 : 40 },
          { name: "Deposit Saved", value: savingRate > 15 ? 40 : 20 },
          { name: "Bond Readiness", value: savingRate > 25 ? 20 : 10 },
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
      <AppNav />

      <div className="container">
        <div className="profile-container">
          {/* LEFT */}
          <div className="left-column">
            {/* MAIN CARD */}
            <div className="card glass">
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

                <button onClick={() => navigate("/setup")}>Edit</button>
              </div>

              <div className="profile-main">
                <div>
                  <div
                    className="donut"
                    style={{
                      background: `conic-gradient(#84a794 ${
                        savingRate * 3.6
                      }deg, #1a1f1e 0deg)`,
                    }}
                  >
                    <div className="donut-inner">{savingRate}%</div>
                  </div>
                  <p className="center-text">Saving Rate</p>
                </div>

                <div className="snapshot">
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

            {/* PROPERTY */}
            {user.housePrice && (
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

            {/* GOALS */}
            <div className="card glass">
              <h3>Goals & Progress</h3>

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
          <div className="profile-side">
            <div className="card glass">
              <h3>Insights</h3>

              <p>
                {savingRate > 25
                  ? "You're in a strong financial position"
                  : "Increase your savings to improve your position"}
              </p>

              <p>
                Strategy:{" "}
                <span className="accent">
                  {user.strategy || "Not selected"}
                </span>
              </p>

              <button onClick={() => navigate("/learn")} className="pill">
                Go to Finance School →
              </button>
            </div>

            <div className="card glass">
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

      {/* FINANCE SCHOOL ORB */}
      <div
        className="finance-orb"
        onClick={() => navigate("/learn")}
        title="Go to Finance School"
      >
        🎓
      </div>
    </div>
  );
}
