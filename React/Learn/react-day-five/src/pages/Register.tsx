import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {  // Simulate API delay
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push({ ...values, createdAt: new Date().toISOString() });
      localStorage.setItem("users", JSON.stringify(users));
      message.success("Registered successfully!");
      navigate("/");
      setLoading(false);
    }, 1000);
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Register</Button>
    </Form>
  );
};

export default Register;
