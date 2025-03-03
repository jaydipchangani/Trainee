import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Select, message, Typography } from 'antd';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { projectsApi } from '../api/api';
import { Project } from '../types/types';
import { usePermission } from '../contexts/PermissionContext';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { hasPermission } = usePermission();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Project) => {
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
      dateRange: [
        record.startDate ? dayjs(record.startDate) : undefined,
        record.endDate ? dayjs(record.endDate) : undefined,
      ],
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await projectsApi.delete(id);
          message.success('Project deleted successfully');
          fetchProjects();
        } catch (error) {
          console.error('Failed to delete project:', error);
          message.error('Failed to delete project');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.dateRange || [null, null];
      
      const formattedValues = {
        name: values.name,
        description: values.description,
        status: values.status,
        startDate: startDate ? startDate.format('YYYY-MM-DD') : '',
        endDate: endDate ? endDate.format('YYYY-MM-DD') : '',
      };
      
      if (editingId) {
        await projectsApi.update(editingId, formattedValues);
        message.success('Project updated successfully');
      } else {
        await projectsApi.create(formattedValues);
        message.success('Project created successfully');
      }
      
      setModalVisible(false);
      fetchProjects();
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
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'In Progress') color = 'processing';
        else if (status === 'Completed') color = 'success';
        else if (status === 'Planning') color = 'warning';
        
        return (
          <span className={`text-${color}`}>{status}</span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <Space>
          {hasPermission('projects', 'edit') && (
            <Button 
              type="text" 
              icon={<Edit size={16} />} 
              onClick={() => handleEdit(record)}
            />
          )}
          {hasPermission('projects', 'delete') && (
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
        <Title level={2}>Projects</Title>
        {hasPermission('projects', 'add') && (
          <Button 
            type="primary" 
            icon={<PlusCircle size={16} />} 
            onClick={handleAdd}
          >
            Add Project
          </Button>
        )}
      </div>

      <Table 
        columns={columns} 
        dataSource={projects} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit Project' : 'Add Project'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingId ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label="Project Duration"
            rules={[{ required: true, message: 'Please select project duration' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="Planning">Planning</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="On Hold">On Hold</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;