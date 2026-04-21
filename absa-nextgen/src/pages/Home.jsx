import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const income = 55000;
  const expenses = 29000;
  const net = income - expenses;

  return (
    <div className="home">
      <AppNav />

      {/* HEADER */}
      <section className="home-header">
        <h2>Welcome back, {user?.name}</h2>
        <p>
          You are on the <span className="accent">{user?.strategy}</span> track
        </p>
      </section>

      {/* MONEY SNAPSHOT */}
      <section className="stats">
        <div className="stat">
          <p>Monthly income</p>
          <h3>R{income.toLocaleString()}</h3>
        </div>

        <div className="stat">
          <p>Fixed Costs</p>
          <h3>R{expenses.toLocaleString()}</h3>
        </div>

        <div
          className="stat highlight clickable"
          onClick={() => navigate("/money")}
        >
          <p>Net Position</p>
          <h3>R{net.toLocaleString()}</h3>
          <span className="view-link">View full breakdown →</span>
        </div>
      </section>

      {/* INSIGHT */}
      <section className="insight-box">
        <p>
          You are saving <strong>{Math.round((net / income) * 100)}%</strong> of
          your income — strong position for your {user?.strategy} strategy.
        </p>
      </section>

      {/* STRATEGY */}
      <section className="strategy-box">
        <h3>Your Strategy Focus</h3>

        {user?.strategy === "Property" && (
          <p>Focus on saving for a home deposit and bond readiness.</p>
        )}

        {user?.strategy === "Balanced" && (
          <p>Balance saving, investing, and lifestyle growth.</p>
        )}

        {user?.strategy === "Catch-Up" && (
          <p>Reduce debt and rebuild financial stability.</p>
        )}
      </section>

      {/* HERO */}
      <section className="hero-row">
        <div className="hero-text">
          <h2>Take control of your financial future</h2>
          <p>
            Track your money, simulate decisions, and move forward with clarity.
          </p>
        </div>

        <button className="primary-btn" onClick={() => navigate("/money")}>
          View Money Snapshot →
        </button>
      </section>

      {/* SIMULATIONS */}
      <section className="simulation-box">
        <h3>Your Simulations</h3>

        {user?.simulations?.length > 0 ? (
          user.simulations.map((sim, i) => (
            <div key={i} className="sim-item">
              {sim}
            </div>
          ))
        ) : (
          <p className="empty">
            No simulations yet — start exploring scenarios
          </p>
        )}
      </section>

      {/* FEATURES */}
      <section className="feature-row">
        <div onClick={() => navigate("/money")} className="feature-card">
          <h3>Money Snapshot</h3>
          <p>See your income, expenses, and net position</p>
        </div>

        <div onClick={() => navigate("/track")} className="feature-card">
          <h3>Strategy Track</h3>
          <p>Set and monitor financial goals</p>
        </div>

        <div onClick={() => navigate("/simulation")} className="feature-card">
          <h3>Simulation Lab</h3>
          <p>Test “what-if” scenarios</p>
        </div>
      </section>
    </div>
  );
}
