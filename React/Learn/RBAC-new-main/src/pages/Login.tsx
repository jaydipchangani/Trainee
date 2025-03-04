import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/types';
import { ShieldIcon } from 'lucide-react';

const { Title } = Typography;

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful');
    } catch (error) {
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div className="text-center mb-6">
          <ShieldIcon size={48} className="text-blue-500 mx-auto mb-2" />
          <Title level={2}>RBAC System</Title>
          <p className="text-gray-500">Please login to access the system</p>
        </div>
        
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Password is 'admin123'" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log in
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Default Admin: admin@example.com / admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;