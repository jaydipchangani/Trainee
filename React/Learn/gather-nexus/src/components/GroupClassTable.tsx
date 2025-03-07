import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, message, Drawer, Form, Input, Button } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface MappedAccount {
  mappedClassId: number;
  companyAccountId: string;
  classId: string;
  className: string;
  trackingCategoryId: string;
}

interface ClassValue {
  classValueId: number;
  classValue: string;
  mappedAccounts: MappedAccount[];
}

interface GroupClassData {
  key: string;
  groupClassId: number;
  groupId: number;
  className: string;
  classValues: ClassValue[];
}

interface GroupClassTableProps {
  data: GroupClassData[];
  setData: (updatedData: GroupClassData[]) => void;
}

const GroupClassTable: React.FC<GroupClassTableProps> = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GroupClassData | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedData = localStorage.getItem('groupClassData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [setData]);

  const handleCopy = async (record: GroupClassData) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://sandboxgathernexusapi.azurewebsites.net/api/GRC/CloneGRC?groupclassId=${record.groupClassId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );
  
      if (!response.ok) throw new Error('Failed to clone the record');
  
      const clonedData = await response.json();
      
      // Generate a unique ID for the copied row
      const newId = Date.now(); 
  
      // Ensure the copied row gets a unique class name
      const existingCopies = data.filter(item =>
        item.className.startsWith(`${record.className}_Copy`)
      );
  
      const copyNumber = existingCopies.length + 1;
      const newClassName = `${record.className}_Copy_${copyNumber}`;
  
      const newRecord: GroupClassData = {
        ...clonedData.result,
        id: newId, // Assign unique ID
        className: newClassName,
      };
  
      const updatedData = [...data, newRecord];
      message.success('Class copied successfully');
      
      // Update state and local storage
      setData(updatedData);
      localStorage.setItem('groupClassData', JSON.stringify(updatedData));
    } catch (error) {
      message.error('Copy failed');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleEdit = (record: GroupClassData) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setEditDrawerVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedValues = await form.validateFields();
      const updatedData = data.map(item => item.key === editingRecord?.key ? { ...item, ...updatedValues } : item);
      setData(updatedData);
      localStorage.setItem('groupClassData', JSON.stringify(updatedData));

      await fetch("https://sandboxgathernexusapi.azurewebsites.net/api/GRC/InsertUpdateGRCDetail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(updatedValues),
      });

      message.success("Record updated successfully");
      setEditDrawerVisible(false);
      setEditingRecord(null);
    } catch (error) {
      message.error("Record not updated");
      setEditDrawerVisible(false);
      setEditingRecord(null);
    }
  };

  const addClassValue = () => {
    form.setFieldsValue({
      classValues: [...form.getFieldValue('classValues'), { classValueId: Date.now(), classValue: '', mappedAccounts: [] }],
    });
  };

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Setup or Mapping',
      dataIndex: 'mappedAccountsCount',
      key: 'mappedAccountsCount', 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: GroupClassData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined className="action-icon" onClick={() => handleEdit(record)} style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Copy">
            <CopyOutlined className="action-icon" onClick={() => handleCopy(record)} style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined className="action-icon" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} pagination={false} className="entity-table" loading={loading} />
      <Drawer title="Edit Record" visible={editDrawerVisible} onClose={() => setEditDrawerVisible(false)} width={400}>
        <Form form={form} layout="vertical">
          <Form.Item name="groupName" label="Group Name" rules={[{ required: true, message: "Please enter the group Name" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="className" label="Class Name" rules={[{ required: true, message: "Please enter the class name" }]}> 
            <Input />
          </Form.Item>
          <Form.List name="classValues">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <Form.Item name={[name, 'classValue']} label="Class Value" rules={[{ required: true, message: "Enter class value" }]}> 
                      <Input />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>Remove</Button>
                  </div>
                ))}
                <Button type="dashed" onClick={add} icon={<PlusOutlined />}>Add Class Value</Button>
              </>
            )}
          </Form.List>
          <Button type="primary" onClick={handleUpdate} style={{ marginTop: 16 }}>Update</Button>
        </Form>
      </Drawer>
    </>
  );
};

export default GroupClassTable;
