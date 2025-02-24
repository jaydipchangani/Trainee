import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import "../styles/auth.css";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === values.email);
  
    if (!user) {
      message.error("User not found!");
      setLoading(false);
      return;
    }
  
    const isPasswordValid = await bcrypt.compare(values.password, user.password);
    if (isPasswordValid) {
      const jwt = localStorage.getItem("jwtToken");
      if (jwt) {
        try {
          const { payload } = await jwtVerify(jwt, new TextEncoder().encode("your-secret-key"));
          if (payload.email === user.email) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            message.success("Login successful!");
            navigate("/products", { replace: true });
          } else {
            message.error("Invalid token!");
          }
        } catch (error) {
          message.error("Token verification failed!");
        }
      } else {
        message.error("Token not found!");
      }
    } else {
      message.error("Invalid email or password!");
    }
  
    setLoading(false);

    
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">Login</Title>
        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Text>Don't have an account? <a href="/register">Register</a></Text>
      </Card>
    </div>
  );
};

export default Login;
