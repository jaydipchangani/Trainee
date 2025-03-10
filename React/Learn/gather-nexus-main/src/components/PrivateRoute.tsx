import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/storage";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken(); // Get token from storage

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
