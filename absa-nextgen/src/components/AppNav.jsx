import { useNavigate, useLocation } from "react-router-dom";
import "../styles/nav.css";
import logo from "../assets/logo.png"; // ✅ ADD THIS

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // 🔥 page-based class
  const getPageClass = () => {
    if (location.pathname.includes("learn")) return "nav-learn";
    if (location.pathname.includes("money")) return "nav-money";
    if (location.pathname.includes("track")) return "nav-track";
    if (location.pathname.includes("simulation")) return "nav-sim";
    if (location.pathname.includes("profile")) return "nav-profile";
    return "nav-home";
  };

  return (
    <div className={`nav ${getPageClass()}`}>
      {/* ✅ LOGO (UPDATED) */}
      <div className="logo" onClick={() => navigate("/home")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

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
