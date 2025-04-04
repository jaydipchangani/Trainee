import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("quickbooks_access_token");
    localStorage.removeItem("quickbooks_refresh_token");
    localStorage.removeItem("quickbooks_token_expiry");
    navigate("/");
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>You are successfully authenticated with QuickBooks.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
