import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Input } from "antd";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const handleLogin = () => {
    authContext?.loginUser(email, password);
  };

  return (
    <div style={{ maxWidth: 300, margin: "auto", padding: "50px" }}>
      <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <Button type="primary" onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
