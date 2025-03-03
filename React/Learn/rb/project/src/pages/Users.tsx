import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Typography } from 'antd';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { usersApi, rolesApi } from '../api/api';
import { UserResponse, Role } from '../types/types';
import { usePermission } from '../contexts/PermissionContext';
import { useAuth } from '../contexts/AuthContext';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { hasPermission } = usePermission();
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error('Failed to fetch roles');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record: UserResponse) => {
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      roleId: record.roleId,
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (currentUser?.id === id) {
      message.error('You cannot delete your own account');
      return;
    }

    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await usersApi.delete(id);
          message.success('User deleted successfully');
          fetchUsers();
        } catch (error) {
          console.error('Failed to delete user:', error);
          message.error('Failed to delete user');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        // Prevent changing own role
        if (currentUser?.id === editingId && values.roleId !== currentUser.roleId) {
          message.error('You cannot change your own role');
          return;
        }
        
        await usersApi.update(editingId, values);
        message.success('User updated successfully');
      } else {
        await usersApi.create({
          ...values,
          password: values.password || 'password', // Default password
        });
        message.success('User created successfully');
      }
      
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'roleId',
      render: (roleId: number) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.name : 'Unknown';
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserResponse) => (
        <Space>
          {hasPermission('users', 'edit') && (
            <Button 
              type="text" 
              icon={<Edit size={16} />} 
              onClick={() => handleEdit(record)}
              disabled={currentUser?.id === record.id && record.roleId === 1} // Admin can't edit themselves
            />
          )}
          {hasPermission('users', 'delete') && (
            <Button 
              type="text" 
              danger 
              icon={<Trash2 size={16} />} 
              onClick={() => handleDelete(record.id)}
              disabled={currentUser?.id === record.id} // Can't delete yourself
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Users</Title>
        {hasPermission('users', 'add') && (
          <Button 
            type="primary" 
            icon={<PlusCircle size={16} />} 
            onClick={handleAdd}
          >
            Add User
          </Button>
        )}
      </div>

      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingId ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          {!editingId && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;