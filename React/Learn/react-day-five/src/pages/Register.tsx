import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      if (users.some((u: any) => u.email === values.email)) {
        message.error("Email already registered!");
      } else {
        const newUser = { ...values, createdAt: new Date().toISOString() };
        localStorage.setItem("users", JSON.stringify([...users, newUser]));
        message.success("Registration successful! Redirecting to login...");
        
        setTimeout(() => {
          navigate("/", { replace: true }); // ✅ Ensure proper redirection
        }, 1000);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">Register</Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <Text>Already have an account? <a href="/">Login</a></Text>
      </Card>
    </div>
  );
};

export default Register;
