import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";

/* ================= SCROLL FIX ================= */
import ScrollToTop from "./components/ScrollToTop";

/* ================= TRANSITION ================= */
import { TransitionProvider, useTransition } from "./context/TransitionContext";
import TransitionOverlay from "./components/TransitionOverlay";

/* ================= PAGES ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Setup from "./pages/Setup";
import StrategyTrack from "./pages/StrategyTrack";
import Home from "./pages/Home";
import MoneySnapshot from "./pages/MoneySnapshot";
import PropertyTrack from "./pages/PropertyTrack";
import SimulationLab from "./pages/SimulationLab.jsx";
import Profile from "./pages/Profile";
import FinanceSchool from "./pages/FinanceSchool";
import Support from "./pages/Support";
import BalancedLifestyleTrack from "./pages/BalancedLifestyleTrack";
import CatchUpTrack from "./pages/CatchUpTrack";
import LifestyleCorrectionTrack from "./pages/LifestyleCorrectionTrack";
import PropertyStudio from "./pages/PropertyStudio";
import CarStudio from "./pages/CarStudio";
import InvestingStudio from "./pages/InvestingStudio";
import DebtStudio from "./pages/DebtStudio";
import WaveCanvas from "./components/WaveCanvas";
import "./styles/tour.css";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  const session = localStorage.getItem("session");

  // not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ================= GLOBAL CURSOR ================= */
function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const move = (e) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top  = `${e.clientY}px`;
    };

    const expand = () => cursorRef.current?.classList.add("cursor--hover");
    const shrink = () => cursorRef.current?.classList.remove("cursor--hover");

    const interactives = "a, button, input, textarea, select, [role='button'], label";

    const addListeners = () => {
      document.querySelectorAll(interactives).forEach((el) => {
        el.addEventListener("mouseenter", expand);
        el.addEventListener("mouseleave", shrink);
      });
    };

    // run once + re-run on DOM changes (route changes add new elements)
    addListeners();
    const observer = new MutationObserver(() => {
      addListeners();
      // if the hovered element was removed, cursor--hover gets stuck — clear it
      if (!document.querySelector(`${interactives}:hover`)) shrink();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef} />;
}

/* ================= OVERLAY RENDERER ================= */
function AppOverlay() {
  const { active, phase, variant, message } = useTransition();
  return <TransitionOverlay active={active} phase={phase} variant={variant} message={message} />;
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TransitionProvider>
        <WaveCanvas
          style={{ position: "fixed", zIndex: 0 }}
          spacing={10}
          speed={0.0004}
          amplitude={[5, 9, 2.5]}
          opacity={[0.035, 0.013]}
          fadeAlpha={0.44}
        />
        <AppOverlay />
        <CustomCursor />
        <ScrollToTop />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<FinanceSchool />} />
        <Route path="/strategy" element={<StrategyTrack />} />
        {/* Setup can stay public for onboarding */}
        <Route path="/setup" element={<Setup />} />

        <Route path="/snapshot" element={<Navigate to="/money" replace />} />
        <Route path="/tracks" element={<Navigate to="/strategy" replace />} />

        {/* ================= MAIN APP (PROTECTED) ================= */}
        <Route
          path="/property"
          element={
            <ProtectedRoute>
              <PropertyTrack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/balanced"
          element={
            <ProtectedRoute>
              <BalancedLifestyleTrack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/catchup"
          element={
            <ProtectedRoute>
              <CatchUpTrack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/correction"
          element={
            <ProtectedRoute>
              <LifestyleCorrectionTrack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/money"
          element={
            <ProtectedRoute>
              <MoneySnapshot />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track"
          element={
            <ProtectedRoute>
              <PropertyTrack />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <SimulationLab />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation/property"
          element={
            <ProtectedRoute>
              <PropertyStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation/car"
          element={
            <ProtectedRoute>
              <CarStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation/investing"
          element={
            <ProtectedRoute>
              <InvestingStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/simulation/debt"
          element={
            <ProtectedRoute>
              <DebtStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            <h1
              style={{
                color: "white",
                textAlign: "center",
                marginTop: "50px",
              }}
            >
              404 Not Found
            </h1>
          }
        />
      </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}

