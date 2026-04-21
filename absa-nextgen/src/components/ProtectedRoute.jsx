import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const session = sessionStorage.getItem("session");

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
}
