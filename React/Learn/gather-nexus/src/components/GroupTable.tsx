import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

interface GroupData {
  key: string;
  groupName: string;
  companies: string;
  groupClass: string;
  financialYear: string;
  currency: string;
  transferOwnership: string;
}

const GroupTable: React.FC = () => {
  const [data, setData] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result.map((item:any, index:any) => ({ key: String(index + 1), ...item })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      sorter: (a: GroupData, b: GroupData) => a.groupName.localeCompare(b.groupName),
    },
    {
      title: 'Companies',
      dataIndex: 'companies',
      key: 'companies',
    },
    {
      title: 'Group Class',
      dataIndex: 'groupClass',
      key: 'groupClass',
    },
    {
      title: 'Financial Year',
      dataIndex: 'financialYear',
      key: 'financialYear',
    },
    {
      title: 'Currency',
      dataIndex: 'currency',
      key: 'currency',
    },
    {
      title: 'Transfer Ownership',
      dataIndex: 'transferOwnership',
      key: 'transferOwnership',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: GroupData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined className="action-icon" />
          </Tooltip>
          <Tooltip title="Copy">
            <CopyOutlined className="action-icon" />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined className="action-icon" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} loading={loading} pagination={false} className="entity-table" />;
};

export default GroupTable;
