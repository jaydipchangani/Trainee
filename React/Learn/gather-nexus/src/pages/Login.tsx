import React, { useState, useContext } from "react";
import { Form, Input, Button, message } from "antd";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await loginUser(values.email, values.password);
      message.success(`Welcome, ${values.email}`);
      auth?.login(response.data.token, response.data.userId);
    } catch (error) {
      message.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, background: "url('/login-image.jpg') center/cover" }} />
      <div style={{ flex: 1, padding: "50px" }}>
        <Form onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: "Enter your email" }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Link to="/forgot-password">Forgot Password?</Link>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
