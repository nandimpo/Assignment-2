import { useNavigate, useLocation } from "react-router-dom";
import "../styles/nav.css";

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="nav">
      <h1 className="logo">ABSA Wealth Studio</h1>

      <div className="nav-links">
        <button
          className={isActive("/home") ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          Home
        </button>

        <button
          className={isActive("/money") ? "active" : ""}
          onClick={() => navigate("/money")}
        >
          Snapshot
        </button>

        <button
          className={isActive("/track") ? "active" : ""}
          onClick={() => navigate("/track")}
        >
          Tracks
        </button>

        <button
          className={isActive("/simulation") ? "active" : ""}
          onClick={() => navigate("/simulation")}
        >
          Simulation
        </button>

        <button
          className={isActive("/profile") ? "active" : ""}
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
