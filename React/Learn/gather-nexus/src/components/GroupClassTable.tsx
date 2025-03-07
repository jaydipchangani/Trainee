import React, { useState } from 'react';
import { Table, Space, Tooltip, message } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

interface GroupClassData {
  key: string;
  groupclassId: number; // Unique ID for cloning
  groupName: string;
  className: string;
  mappedAccountsCount: number;
  unMappedAccountsCount: number;
}

interface GroupClassTableProps {
  data: GroupClassData[];
  setData: (updatedData: GroupClassData[]) => void; // Function to update table data
}

const GroupClassTable: React.FC<GroupClassTableProps> = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);

  // Function to handle copying a record
  const handleCopy = async (record: GroupClassData) => {
    setLoading(true);

    try {
      // Call API to clone the record using groupclassId
      const response = await fetch(
        `https://sandboxgathernexusapi.azurewebsites.net/api/GRC/CloneGRC?groupclassId=${record.groupclassId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Debugging

      if (!response.ok) throw new Error('Failed to clone the record');

      const clonedData = await response.json(); // Assuming API returns new cloned record with groupclassId

      // Generate a new unique class name
      const newClassName = `${record.className}_Copy_1`;

      // Create the new record
      const newRecord: GroupClassData = {
        ...clonedData.result, // Assuming API response contains cloned data inside 'result'
        key: clonedData.result.groupclassId, // Use new groupclassId from API response
        className: newClassName, // Updated class name
      };

      message.success('Class copied successfully');

      // Add copied record to the table UI
      setData([...data, newRecord]);
    } catch (error) {
      message.error('Copy failed');
    } finally {
      setLoading(false);

    }
  };

  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      sorter: (a: GroupClassData, b: GroupClassData) => a.groupName.localeCompare(b.groupName),
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className',
      sorter: (a: GroupClassData, b: GroupClassData) => a.className.localeCompare(b.className),
    },
    {
      title: 'Setup or Mapping',
      key: 'setupOrMapping',
      render: (_: any, record: GroupClassData) => (
        <a href="#" style={{ color: '#1890ff' }}>
          {record.mappedAccountsCount} Mapped {record.unMappedAccountsCount > 0 ? `& ${record.unMappedAccountsCount} Unmapped` : ''}
        </a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: GroupClassData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined className="action-icon" />
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

  return <Table dataSource={data} columns={columns} pagination={false} className="entity-table" loading={loading} />;
};

export default GroupClassTable;
