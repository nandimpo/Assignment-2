import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= SCROLL FIX ================= */
import ScrollToTop from "./components/ScrollToTop";

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
import FoundationBuilderTrack from "./pages/FoundationBuilderTrack";
import LifestyleCorrectionTrack from "./pages/LifestyleCorrectionTrack";
import PropertyStudio from "./pages/PropertyStudio";
import CarStudio from "./pages/CarStudio";
import InvestingStudio from "./pages/InvestingStudio";
import "./styles/tour.css";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  const session = sessionStorage.getItem("session");

  // not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      {/* 🔥 THIS FIXES YOUR SCROLL ISSUE */}
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

        {/* Snapshot (you can protect later if needed) */}
        <Route path="/snapshot" element={<MoneySnapshot />} />

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
          path="/foundation"
          element={
            <ProtectedRoute>
              <FoundationBuilderTrack />
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
    </BrowserRouter>
  );
}
