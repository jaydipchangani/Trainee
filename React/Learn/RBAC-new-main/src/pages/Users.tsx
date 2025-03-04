import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Popconfirm, Typography } from 'antd';
import { PlusIcon, Trash2Icon, EditIcon } from 'lucide-react';
import { usersAPI, rolesAPI } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { User, UserFormData, Role } from '../types/types';
import PermissionGuard from '../components/common/PermissionGuard';
import { hashPassword } from '../utils/auth';

const { Title } = Typography;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { authState } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesAPI.getAll();
      setRoles(data);
    } catch (error) {
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

  const handleEdit = (record: User) => {
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role,
      password: '',
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await usersAPI.delete(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSubmit = async (values: UserFormData) => {
    try {
      if (values.password) {
        values.password = await hashPassword(values.password);
      }

      if (editingId) {
        // If editing, only update the password if it's provided
        const updateData = { ...values };
        if (!updateData.password) {
          delete updateData.password;
        }
        await usersAPI.update(editingId, updateData);
        message.success('User updated successfully');
      } else {
        if (!values.password) {
          message.error('Password is required for new users');
          return;
        }
        await usersAPI.create(values);
        message.success('User created successfully');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Failed to save user');
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
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <div className="flex gap-2">
          <PermissionGuard module="users" action="edit">
            <Button 
              icon={<EditIcon size={16} />} 
              onClick={() => handleEdit(record)}
              disabled={record.id === authState.user?.id && record.role === 'Admin'}
            />
          </PermissionGuard>
          <PermissionGuard module="users" action="delete">
            <Popconfirm
              title="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              disabled={record.id === authState.user?.id}
            >
              <Button 
                danger 
                icon={<Trash2Icon size={16} />} 
                disabled={record.id === authState.user?.id}
              />
            </Popconfirm>
          </PermissionGuard>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Users</Title>
        <PermissionGuard module="users" action="add">
          <Button 
            type="primary" 
            icon={<PlusIcon size={16} />} 
            onClick={handleAdd}
          >
            Add User
          </Button>
        </PermissionGuard>
      </div>

      <Table 
        dataSource={users} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' },
              {
              pattern: /^[A-Za-z]+$/,
              message: "Only letters are allowed (No numbers or special characters)"
            }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: !editingId, message: 'Please enter password' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character'
              }
              
            ]}
          >
            <Input.Password placeholder={editingId ? 'Leave blank to keep current password' : ''} />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              {roles.map(role => (
                <Select.Option key={role.id} value={role.name}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;