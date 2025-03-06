import React, { useState, useContext } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./Login.css"; // Add CSS file for styling

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values.email, values.password);
      auth?.login(response.data.token, response.data.userId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Image */}
      <div className="login-left">
        <div className="overlay"></div>
      </div>

      {/* Right Side - Form */}
      <div className="login-right">
        <Card className="login-card">
          <Title level={3} className="login-title">Welcome Back</Title>
          <Text type="secondary">Enter your credentials to access your account</Text>

          <Form layout="vertical" onFinish={onFinish} className="login-form">
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter your email" }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please enter your password" }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <div className="login-links">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign In
            </Button>
          </Form>

          <div className="register-link">
            <Text>Don't have an account? <Link to="/register">Register</Link></Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;