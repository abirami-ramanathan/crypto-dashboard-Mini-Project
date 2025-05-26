import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check authentication status when route changes
    if (!isAuthenticated()) {
      localStorage.removeItem("user");
    }
  }, [location.pathname, isAuthenticated]);

  if (!isAuthenticated()) {
    // Save the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute; 