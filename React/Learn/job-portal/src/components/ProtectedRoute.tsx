import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("user");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
