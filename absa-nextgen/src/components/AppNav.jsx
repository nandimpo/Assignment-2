import { useNavigate, useLocation } from "react-router-dom";
import "../styles/nav.css";
import logo from "../assets/logo.png";
import { useUser } from "../context/UserContext";
import { useTransition } from "../context/TransitionContext";

const TRACK_ROUTES = {
  property: "/property",
  balanced: "/balanced",
  catchup: "/catchup",
  correction: "/correction",
};

export default function AppNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const { navTrigger } = useTransition();

  const isSetupPage = location.pathname === "/setup";

  const go = (path) => {
    if (isSetupPage) {
      window.dispatchEvent(new CustomEvent("setup-lock-attempt"));
      return;
    }
    navTrigger(path);
  };

  const handleLogout = () => {
    // Only clear the session token , keep user data so they can log back in
    localStorage.removeItem("session");
    navigate("/login", { replace: true });
  };

  const trackRoute = TRACK_ROUTES[user?.strategy] || "/strategy";

  const isActive = (path) => location.pathname === path;

  // page-based classes
  const getPageClass = () => {
    if (location.pathname.includes("learn")) return "nav-learn";
    if (location.pathname.includes("money")) return "nav-money";
    if (location.pathname.includes("strategy")) return "nav-track";
    if (location.pathname.includes("simulation")) return "nav-sim";
    if (location.pathname.includes("profile")) return "nav-profile";
    return "nav-home";
  };

  return (
    <div className={`nav ${getPageClass()}${isSetupPage ? " nav-locked" : ""}`}>
      {/* LOGO (UPDATED) */}
      <div className="logo" onClick={() => go("/home")}>
        <img src={logo} alt="logo" className="logo-img" />
        <span className="logo-text">ABSA Wealth Studio</span>
      </div>

      <div className="nav-links">
        <button
          className={isActive("/home") ? "active" : ""}
          onClick={() => go("/home")}
          title={isSetupPage ? "Complete setup first" : undefined}
        >
          Home
        </button>

        <button
          className={
            isActive("/money") || isActive("/snapshot") ? "active" : ""
          }
          onClick={() => go("/money")}
          title={isSetupPage ? "Complete setup first" : undefined}
        >
          Snapshot
        </button>

        <button
          className={
            [
              "/strategy",
              "/property",
              "/balanced",
              "/correction",
              "/catchup",
              "/tracks",
            ].some((p) => location.pathname.startsWith(p))
              ? "active"
              : ""
          }
          onClick={() => go("/strategy")}
          title={isSetupPage ? "Complete setup first" : undefined}
        >
          Tracks
        </button>

        <button
          className={
            location.pathname.startsWith("/simulation") ? "active" : ""
          }
          onClick={() => go("/simulation")}
          title={isSetupPage ? "Complete setup first" : undefined}
        >
          Simulation
        </button>

        <button
          className={isActive("/profile") ? "active" : ""}
          onClick={() => go("/profile")}
          title={isSetupPage ? "Complete setup first" : undefined}
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
