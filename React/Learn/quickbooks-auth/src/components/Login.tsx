// src/components/Login.tsx
import React from "react";
import { Button } from "antd";

const Login = () => {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem", textAlign: "center" }}>
      <h1>Connect to QuickBooks</h1>
      <a href="https://localhost:7254/api/auth/login">
        <Button type="primary" size="large">
          Connect to QuickBooks
        </Button>
      </a>
    </div>
  );
};

export default Login;
