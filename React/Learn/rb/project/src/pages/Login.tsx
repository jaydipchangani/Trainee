import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../types/types';
import { useAuth } from '../contexts/AuthContext';
import { LockIcon, MailIcon } from 'lucide-react';

const { Title } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <div className="text-center mb-6">
          <Title level={2}>RBAC System</Title>
          <p className="text-gray-500">Sign in to your account</p>
        </div>
        
        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input 
              prefix={<MailIcon size={16} className="mr-2" />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockIcon size={16} className="mr-2" />} 
              placeholder="Password" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Default Admin: admin@example.com / password</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;