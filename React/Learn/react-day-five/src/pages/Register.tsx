import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import "../styles/auth.css";
import { nanoid } from "nanoid";


const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find((u: any) => u.email === values.email)) {
      message.error("Email already registered!");
      setLoading(false);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values.password, salt);

    const newUser = {
      id: nanoid(),
      name: values.name,
      email: values.email,
      password: hashedPassword, 
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    message.success("Registration successful! Please login.");
    setLoading(false);
    navigate("/");

  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <Title level={2} className="auth-title">Register</Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Full Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
            <Input placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
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
