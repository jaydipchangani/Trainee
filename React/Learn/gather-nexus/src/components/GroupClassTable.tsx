import React, { useState } from 'react';
import { Table, Space, Tooltip, message } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

interface GroupClassData {
  key: string;
  groupclassId: number;
  groupName: string;
  className: string;
  mappedAccountsCount: number;
  unMappedAccountsCount: number;
}

interface GroupClassTableProps {
  data: GroupClassData[];
  setData: (updatedData: GroupClassData[]) => void;
}

const GroupClassTable: React.FC<GroupClassTableProps> = ({ data, setData }) => {
  const [loading, setLoading] = useState(false);

  // Function to get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Ensure authToken is stored in localStorage
  };

  // Fetch latest data from API with authentication
  const fetchGroupClassById = async (groupclassId: number) => {
    const token = getAuthToken();
    if (!token) {
      message.error('Authentication failed: No token found.');
      return null;
    }

    try {
      const response = await fetch(
        'https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetAllGroupClasses',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch group classes');

      const responseData = await response.json();
      const records = responseData?.result?.records || [];

      return records.find((record: GroupClassData) => record.groupclassId === groupclassId);
    } catch (error) {
      console.error('Error fetching group class:', error);
      message.error('Failed to fetch data.');
      return null;
    }
  };

  // Handle copying a record
  const handleCopy = async (record: GroupClassData) => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      message.error('Authentication failed: No token found.');
      setLoading(false);
      return;
    }

    try {
      // Fetch the latest data before copying
      const latestRecord = await fetchGroupClassById(record.groupclassId);
      if (!latestRecord) {
        message.error('Failed to fetch the latest data before copying.');
        return;
      }

      // Call API to clone the record
      const response = await fetch(
        `https://sandboxgathernexusapi.azurewebsites.net/api/GRC/CloneGRC?groupclassId=${latestRecord.groupclassId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        }
      );

      if (!response.ok) throw new Error('Failed to clone the record');

      message.success('Class copied successfully');
    } catch (error) {
      console.error('Copy failed:', error);
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
