import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div style={{ color: "var(--muted)", padding: 40 }}>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}
