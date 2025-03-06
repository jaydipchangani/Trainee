import React from 'react';
import { Table, Space, Tooltip } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';

interface GroupClassData {
  key: string;
  groupName: string;
  className: string;
  setupOrMapping: {
    mapped: number;
    unmapped: number;
  };
}

interface GroupClassTableProps {
  data: GroupClassData[];
}

const GroupClassTable: React.FC<GroupClassTableProps> = ({ data }) => {
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
      dataIndex: 'setupOrMapping',
      key: 'setupOrMapping',
      render: (setupOrMapping: { mapped: number; unmapped: number }) => (
        <a href="#" style={{ color: '#1890ff' }}>
          {setupOrMapping.mapped} Mapped {setupOrMapping.unmapped > 0 ? `& ${setupOrMapping.unmapped} Unmapped` : ''}
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

export default GroupClassTable;