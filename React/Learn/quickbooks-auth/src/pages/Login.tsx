import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the token exists in localStorage
    const token = localStorage.getItem("qb_access_token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "https://localhost:7254/api/auth/login";
  };

  return (
    <div>
      <h1>QuickBooks OAuth Authentication</h1>
      {isAuthenticated ? (
        <h2>✅ Connected to QuickBooks!</h2>
      ) : (
        <button onClick={handleLogin}>Connect to QuickBooks</button>
      )}
    </div>
  );
};

export default App;
