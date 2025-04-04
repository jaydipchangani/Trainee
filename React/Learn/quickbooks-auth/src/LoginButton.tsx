import React from "react";

const LoginButton = () => {
  const handleLogin = () => {
    window.location.href = "https://localhost:7254/api/auth/login";
  };

  return <button onClick={handleLogin}>Connect to QuickBooks</button>;
};

export default LoginButton;
