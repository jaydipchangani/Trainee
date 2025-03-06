import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Input, Button, Table, Space, Tooltip, Spin, Alert } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined, 
  EditOutlined, 
  CopyOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import axios from 'axios'; // Import axios for API calls
import './MultiEntityDisplay.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface GroupClassData {
  key: string;
  groupName: string;
  className: string;
  setupOrMapping: {
    mapped: number;
    unmapped: number;
  };
}

const MultiEntityDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groupClass');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupClassData, setGroupClassData] = useState<GroupClassData[]>([]);
  const [groupData, setGroupData] = useState<GroupClassData[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchGroupClassData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/GRC/GetGRCrecords'); // Replace with your actual API
        console.log("Group Data:", response.data);
        setGroupClassData(response.data.map((item: any, index: number) => ({
          key: String(index + 1),
          groupName: item.groupName,
          className: item.className,
          setupOrMapping: {
            mapped: item.mapped || 0,
            unmapped: item.unmapped || 0,
          },
        })));
      } catch (err) {
        setError('Failed to fetch group class data. Please try again.');
      }
      setLoading(false);
    };

    const fetchGroupData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/Group/GetGroups'); // Replace with your actual API
        console.log("Group Data:", response.data); // Debugging
        setGroupData(response.data.map((item: any, index: number) => ({
          key: String(index + 1),
          groupName: item.groupName,
          className: item.className,
          setupOrMapping: {
            mapped: item.mapped || 0,
            unmapped: item.unmapped || 0,
          },
        })));
      } catch (err) {
        setError('Failed to fetch group data. Please try again.');
      }
      setLoading(false);
    };

    if (activeTab === 'groupClass') {
      fetchGroupClassData();
    } else if (activeTab === 'group') {
      fetchGroupData();
    }
  }, [activeTab]);

  // Table columns definition
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

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Layout className="entity-display-layout">
      <Header className="header">
        <div className="logo">
          <Title level={3} style={{ color: '#2E8B57', margin: 0 }}>
            GATHER<span style={{ fontSize: '16px', fontWeight: 'normal' }}>.nexus</span>
          </Title>
        </div>
        
        <div className="user-info">
          <Space>
            <Avatar size="large" style={{ backgroundColor: '#333' }}>
              <Text style={{ color: 'white' }}>MT</Text>
            </Avatar>
            <div>
              <Text strong>Manav Test</Text>
              <br />
              <Text type="secondary">My Profile</Text>
            </div>
          </Space>
        </div>
      </Header>
      
      <Content className="content">
        <div className="page-header">
          <div className="back-navigation">
            <ArrowLeftOutlined /> Multi- Entity & Display
          </div>
          <div className="help-link">
            <a href="#">How to Add Company?</a>
          </div>
        </div>

        <div className="tab-container">
          <Menu mode="horizontal" selectedKeys={[activeTab]} className="entity-menu">
            <Menu.Item key="company" onClick={() => handleTabChange('company')}>
              Company
            </Menu.Item>
            <Menu.Item key="group" onClick={() => handleTabChange('group')}>
              Group
            </Menu.Item>
            <Menu.Item key="groupClass" onClick={() => handleTabChange('groupClass')}>
              Group Class
              <div className={activeTab === 'groupClass' ? 'active-tab-indicator' : ''}></div>
            </Menu.Item>
            <Menu.Item key="configurationDisplay" onClick={() => handleTabChange('configurationDisplay')}>
              Configuration Display
            </Menu.Item>
          </Menu>
          
          <div className="actions-container">
            <Input
              placeholder="Search here..."
              prefix={<SearchOutlined />}
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} className="filter-button">
              Filter
            </Button>
            <Button type="primary" icon={<PlusOutlined />} className="add-button">
              Add Class
            </Button>
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'groupClass' && (
            <>
              {loading ? (
                <Spin size="large" />
              ) : error ? (
                <Alert message={error} type="error" showIcon />
              ) : (
                <Table 
                  dataSource={groupClassData}
                  columns={columns}
                  pagination={false}
                  className="entity-table"
                />
              )}
            </>
          )}
          {activeTab === 'group' && (
            <>
              {loading ? (
                <Spin size="large" />
              ) : error ? (
                <Alert message={error} type="error" showIcon />
              ) : (
                <Table 
                  dataSource={groupData}
                  columns={columns}
                  pagination={false}
                  className="entity-table"
                />
              )}
            </>
          )}
          {activeTab === 'company' && (
            <div className="placeholder-content">
              <p>Company content would appear here</p>
            </div>
          )}
          {activeTab === 'configurationDisplay' && (
            <div className="placeholder-content">
              <p>Configuration Display content would appear here</p>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default MultiEntityDisplay;