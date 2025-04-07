import React from "react";
import { Button } from "antd";

interface AuthProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setRealmId: React.Dispatch<React.SetStateAction<string | null>>;
}

const Auth: React.FC<AuthProps> = ({ setToken, setRealmId }) => {
  const handleLogin = () => {
    // Simulating login and token retrieval
    const token = "sample-token";
    const realmId = "sample-realmId";
    setToken(token);
    setRealmId(realmId);
  };

  return (
    <div>
      <Button type="primary" onClick={handleLogin}>
        Login with QuickBooks
      </Button>
    </div>
  );
};

export default Auth;
