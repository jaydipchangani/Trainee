import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, message, Typography } from 'antd';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { employeesApi } from '../api/api';
import { Employee } from '../types/types';
import { usePermission } from '../contexts/PermissionContext';
import dayjs from 'dayjs';

const { Title } = Typography;

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { hasPermission } = usePermission();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
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
    form.setFieldsValue({
      ...record,
      joinDate: record.joinDate ? dayjs(record.joinDate) : undefined,
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await employeesApi.delete(id);
          message.success('Employee deleted successfully');
          fetchEmployees();
        } catch (error) {
          console.error('Failed to delete employee:', error);
          message.error('Failed to delete employee');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        joinDate: values.joinDate ? values.joinDate.format('YYYY-MM-DD') : '',
      };
      
      if (editingId) {
        await employeesApi.update(editingId, formattedValues);
        message.success('Employee updated successfully');
      } else {
        await employeesApi.create(formattedValues);
        message.success('Employee created successfully');
      }
      
      setModalVisible(false);
      fetchEmployees();
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
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          {hasPermission('employees', 'edit') && (
            <Button 
              type="text" 
              icon={<Edit size={16} />} 
              onClick={() => handleEdit(record)}
            />
          )}
          {hasPermission('employees', 'delete') && (
            <Button 
              type="text" 
              danger 
              icon={<Trash2 size={16} />} 
              onClick={() => handleDelete(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Employees</Title>
        {hasPermission('employees', 'add') && (
          <Button 
            type="primary" 
            icon={<PlusCircle size={16} />} 
            onClick={handleAdd}
          >
            Add Employee
          </Button>
        )}
      </div>

      <Table 
        columns={columns} 
        dataSource={employees} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit Employee' : 'Add Employee'}
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
            name="joinDate"
            label="Join Date"
            rules={[{ required: true, message: 'Please select join date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;