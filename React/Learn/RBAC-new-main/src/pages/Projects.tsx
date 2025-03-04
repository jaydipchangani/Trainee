import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Popconfirm, Typography } from 'antd';
import { PlusIcon, Trash2Icon, EditIcon } from 'lucide-react';
import { projectsAPI } from '../api/api';
import { Project, ProjectFormData } from '../types/types';
import PermissionGuard from '../components/common/PermissionGuard';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
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
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)],
    });
    setEditingId(record.id);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await projectsAPI.delete(id);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      message.error('Failed to delete project');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const projectData: ProjectFormData = {
        name: values.name,
        description: values.description,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        status: values.status,
      };

      if (editingId) {
        await projectsAPI.update(editingId, projectData);
        message.success('Project updated successfully');
      } else {
        await projectsAPI.create(projectData);
        message.success('Project created successfully');
      }
      setModalVisible(false);
      fetchProjects();
    } catch (error) {
      message.error('Failed to save project');
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
        let color = 'blue';
        if (status === 'Completed') color = 'green';
        if (status === 'On Hold') color = 'orange';
        if (status === 'Cancelled') color = 'red';
        return (
          <span className={`px-2 py-1 bg-${color}-100 text-${color}-800 rounded text-sm`}>
            {status}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Project) => (
        <div className="flex gap-2">
          <PermissionGuard module="projects" action="edit">
            <Button 
              icon={<EditIcon size={16} />} 
              onClick={() => handleEdit(record)}
            />
          </PermissionGuard>
          <PermissionGuard module="projects" action="delete">
            <Popconfirm
              title="Are you sure you want to delete this project?"
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
        <Title level={2}>Projects</Title>
        <PermissionGuard module="projects" action="add">
          <Button 
            type="primary" 
            icon={<PlusIcon size={16} />} 
            onClick={handleAdd}
          >
            Add Project
          </Button>
        </PermissionGuard>
      </div>

      <Table 
        dataSource={projects} 
        columns={columns} 
        rowKey="id" 
        loading={loading} 
      />

      <Modal
        title={editingId ? 'Edit Project' : 'Add Project'}
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
            rules={[{ required: true, message: 'Please select date range' }]}
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

export default Projects;