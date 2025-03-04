import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Typography, Descriptions } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../api/api';
import { hashPassword } from '../utils/auth';

const { Title } = Typography;

const Profile: React.FC = () => {
  const { authState } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { currentPassword: string; newPassword: string }) => {
    setLoading(true);
    try {
      // Verify current password
      const isValid = await fetch(`http://localhost:3001/users/${authState.user?.id}`)
        .then(res => res.json())
        .then(user => bcrypt.compare(values.currentPassword, user.password));

      if (!isValid) {
        message.error('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Update password
      const hashedPassword = await hashPassword(values.newPassword);
      await usersAPI.update(authState.user?.id || 0, { password: hashedPassword });
      
      message.success('Password updated successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Profile</Title>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="User Information">
          <Descriptions layout="vertical" bordered>
            <Descriptions.Item label="Name" span={3}>
              {authState.user?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>
              {authState.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={3}>
              {authState.user?.role}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        
        <Card title="Change Password">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: 'Please enter current password' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;