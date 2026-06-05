import { useNavigate, useLocation } from "react-router-dom";
import "../styles/nav.css";
import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext";
import { useTransition } from "../context/TransitionContext";

const TRACK_ROUTES = {
  property:   "/property",
  balanced:   "/balanced",
  catchup:    "/catchup",
  correction: "/correction",
  foundation: "/foundation",
};

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { navTrigger } = useTransition();

  const go = (path) => navTrigger(path);

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate("/login");
  };

  const trackRoute = TRACK_ROUTES[user?.strategy] || "/strategy";

  const isActive = (path) => location.pathname === path;

  // 🔥 page-based class
  const getPageClass = () => {
    if (location.pathname.includes("learn")) return "nav-learn";
    if (location.pathname.includes("money")) return "nav-money";
    if (location.pathname.includes("strategy")) return "nav-track";
    if (location.pathname.includes("simulation")) return "nav-sim";
    if (location.pathname.includes("profile")) return "nav-profile";
    return "nav-home";
  };

  return (
    <div className={`nav ${getPageClass()}`}>
      {/* ✅ LOGO (UPDATED) */}
      <div className="logo" onClick={() => go("/home")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

      <div className="nav-links">
        <button
          className={isActive("/home") ? "active" : ""}
          onClick={() => go("/home")}
        >
          Home
        </button>

        <button
          className={isActive("/money") || isActive("/snapshot") ? "active" : ""}
          onClick={() => go("/money")}
        >
          Snapshot
        </button>

        <button
          className={
            ["/strategy", "/property", "/balanced", "/foundation", "/correction", "/catchup", "/tracks"].some(
              (p) => location.pathname.startsWith(p)
            )
              ? "active"
              : ""
          }
          onClick={() => go("/strategy")}
        >
          Tracks
        </button>

        <button
          className={isActive("/simulation") ? "active" : ""}
          onClick={() => go("/simulation")}
        >
          Simulation
        </button>

        <button
          className={isActive("/profile") ? "active" : ""}
          onClick={() => go("/profile")}
        >
          Profile
        </button>

        <button className="nav-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}
