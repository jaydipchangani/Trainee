import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === values.email && u.password === values.password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        message.success("Login successful!");
        navigate("/products");
      } else {
        message.error("Invalid email or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>Login</Button>
    </Form>
  );
};

export default Login;
