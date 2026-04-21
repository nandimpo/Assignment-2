import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= PAGES ================= */
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Setup from "./pages/Setup";

import Home from "./pages/Home";
import MoneySnapshot from "./pages/MoneySnapshot";
import PropertyTrack from "./pages/PropertyTrack";
import SimulationLab from "./pages/SimulationLab";
import Profile from "./pages/Profile";
import FinanceSchool from "./pages/FinanceSchool";
import Support from "./pages/Support";

/* ================= PROTECTED ROUTE ================= */
function ProtectedRoute({ children }) {
  const session = sessionStorage.getItem("session");

  // ❌ not logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ================= APP ================= */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<FinanceSchool />} />

        {/* Setup can stay public for onboarding */}
        <Route path="/setup" element={<Setup />} />

        {/* Snapshot (you can protect later if needed) */}
        <Route path="/snapshot" element={<MoneySnapshot />} />

        {/* ================= MAIN APP (PROTECTED) ================= */}

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
