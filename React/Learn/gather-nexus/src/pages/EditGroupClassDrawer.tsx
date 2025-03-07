import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, Button, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface EditGroupClassDrawerProps {
  visible: boolean;
  onClose: () => void;
  selectedId: string | null; // ID of the selected group class
}

const EditGroupClassDrawer: React.FC<EditGroupClassDrawerProps> = ({ visible, onClose, selectedId }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedId) {
      fetchGroupClassData(selectedId);
    }
  }, [selectedId]);

  // Fetch data by ID and populate the form
  const fetchGroupClassData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/GRC/GetGroupClassById/${id}`);
      if (!response.ok) throw new Error('Failed to fetch group class data');
      
      const data = await response.json();
      form.setFieldsValue({
        group: data.groupName,
        className: data.className,
        classValues: data.classValues.join(', '),
      });
    } catch (error) {
      message.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/GRC/UpdateGroupClass/${selectedId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: values.className,
          classValues: values.classValues.split(',').map((v: string) => v.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to update group class');
      message.success('Group class updated successfully');
      onClose();
    } catch (error) {
      message.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Edit Group Class"
      width={400}
      visible={visible}
      onClose={onClose}
      destroyOnClose
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleUpdate}
      >
        <Form.Item label="Group" name="group">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Class Name" name="className" rules={[{ required: true, message: 'Please enter Class Name' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Class Values" name="classValues" rules={[{ required: true, message: 'Please enter Class Values' }]}>
          <Input placeholder="Separate values with commas" />
        </Form.Item>

        <Button type="link" icon={<PlusOutlined />}>
          Add Class Value
        </Button>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditGroupClassDrawer;
