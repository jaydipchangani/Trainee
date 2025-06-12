import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user === null) {
    // Not authenticated; redirect to backend SAML login
    window.location.href = "http://localhost:5000/Saml/Login";
    return null;
  }

  return children;
};

export default ProtectedRoute;
