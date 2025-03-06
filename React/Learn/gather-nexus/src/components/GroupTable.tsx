import React from 'react';
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

interface GroupTableProps {
  data: GroupData[];
}

const GroupTable: React.FC<GroupTableProps> = ({ data }) => {
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

  return <Table dataSource={data} columns={columns} pagination={false} className="entity-table" />;
};

export default GroupTable;