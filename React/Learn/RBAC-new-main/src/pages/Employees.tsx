import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Typography } from 'antd';
import { PlusIcon, Trash2Icon, EditIcon } from 'lucide-react';
import { employeesAPI } from '../api/api';
import { Employee, EmployeeFormData } from '../types/types';
import PermissionGuard from '../components/common/PermissionGuard';

const { Title } = Typography;

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeesAPI.getAll();
      setEmployees(data);
    } catch (error) {
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Employee) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await employeesAPI.delete(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const handleSubmit = async (values: EmployeeFormData) => {
    try {
      if (editingId) {
        await employeesAPI.update(editingId, values);
        message.success('Employee updated successfully');
      } else {
        await employeesAPI.create(values);
        message.success('Employee created successfully');
      }
      setModalVisible(false);
      fetchEmployees();
    } catch (error) {
      message.error('Failed to save employee');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <div className="flex gap-2">
          <PermissionGuard module="employees" action="edit">
            <Button 
              icon={<EditIcon size={16} />} 
              onClick={() => handleEdit(record)}
            />
          </PermissionGuard>
          <PermissionGuard module="employees" action="delete">
            <Popconfirm
              title="Are you sure you want to delete this employee?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                icon={<Trash2Icon size={16} />} 
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
        <Title level={2}>Employees</Title>
        <PermissionGuard module="employees" action="add">
          <Button 
            type="primary" 
            icon={<PlusIcon size={16} />} 
            onClick={handleAdd}
          >
            Add Employee
          </Button>
        </PermissionGuard>
      </div>

      <Table 
        dataSource={employees} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit Employee' : 'Add Employee'}
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
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please enter department' }]}
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
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
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

export default Employees;