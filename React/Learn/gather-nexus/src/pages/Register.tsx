import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      message.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, background: "url('/register-image.jpg') center/cover" }} />
      <div style={{ flex: 1, padding: "50px" }}>
        <Form onFinish={onFinish}>
          <Form.Item name="name" rules={[{ required: true, message: "Enter your name" }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item name="company">
            <Input placeholder="Company (Optional)" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: "Enter your email" }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Enter password" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" dependencies={["password"]} rules={[{ required: true, message: "Confirm password" }]}>
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item name="agreement" valuePropName="checked" rules={[{ required: true }]}>
            <Checkbox>I agree to the terms</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
