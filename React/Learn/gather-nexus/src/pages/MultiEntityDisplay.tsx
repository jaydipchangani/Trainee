import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Input, Button, Table, Space, Tooltip, Spin, Alert } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  PlusOutlined, 
  EditOutlined, 
  CopyOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import './MultiEntityDisplay.css';

const { Header, Content } = Layout;

interface GroupClassData {
  key: string;
  groupName: string;
  className: string;
  setupOrMapping: {
    mapped: number;
    unmapped: number;
  };
}

interface GroupData {
  key: string;
  groupName: string;
  companies: string;
  groupClass: string;
  financialYear: string;
  currency: string;
  transferOwnership: string;
}

const MultiEntityDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groupClass');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupClassData, setGroupClassData] = useState<GroupClassData[]>([]);
  const [groupData, setGroupData] = useState<GroupData[]>([]);
  const auth = useContext(AuthContext);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Guest";

  // Fetch data from API
  useEffect(() => {
    const fetchData = async (url: string, setData: React.Dispatch<React.SetStateAction<any[]>>, mapData: (data: any) => any[]) => {
      setLoading(true);
      setError(null);
      const token = getToken();
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log(data);
        setData(mapData(data.result.records));
      } catch {
        setError('Failed to fetch data. Please try again.');
      }
      setLoading(false);
    };

    if (activeTab === 'groupClass') {
      fetchData(
        'https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetGRCrecords',
        setGroupClassData,
        (records) => records.map((item: any, index: number) => ({
          key: String(index + 1),
          groupName: item.groupName,
          className: item.className,
          setupOrMapping: {
            mapped: item.mappedAccountsCount,
            unmapped: item.unMappedAccountsCount,
          },
        }))
      );
    } else if (activeTab === 'group') {
      fetchData(
        'https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroups',
        setGroupData,
        (records) => records.map((item: any, index: number) => ({
          key: String(index + 1),
          groupName: item.groupName,
          companies: item.erpCompanyData.map((company: any) => company.erpCompanyName).join(', '),
          groupClass: 'N/A', // Assuming groupClass is not available in the response
          financialYear: item.financialYear,
          currency: item.currencyName,
          transferOwnership: item.groupTranferStatus === 0 ? 'No' : 'Yes',
        }))
      );
    }
  }, [activeTab]);

  // Table columns for groupClass
  const groupClassColumns = [
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

  // Table columns for group
  const groupColumns = [
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

  return (
    <Layout className="entity-display-layout">
      <Header className="header">
        <div className="logo">
          <ArrowLeftOutlined /> Multi- Entity & Display
        </div>
        <div className="user-info">
          <span>{userName}</span>
          <Tooltip title="Logout">
            <LogoutOutlined 
              onClick={auth?.logout} 
              style={{ fontSize: "18px", color: "#000000", cursor: "pointer" }} 
            />
          </Tooltip>
        </div>
      </Header>

      <Content className="content">
        <div className="page-header">
          <div className="help-link">
            <a href="#">How to Add Company?</a>
          </div>
        </div>

        <div className="tab-container">
          <Menu mode="horizontal" selectedKeys={[activeTab]} className="entity-menu">
            <Menu.Item key="company" onClick={() => setActiveTab('company')}>Company</Menu.Item>
            <Menu.Item key="group" onClick={() => setActiveTab('group')}>Group</Menu.Item>
            <Menu.Item key="groupClass" onClick={() => setActiveTab('groupClass')}>Group Class</Menu.Item>
            <Menu.Item key="configurationDisplay" onClick={() => setActiveTab('configurationDisplay')}>Configuration Display</Menu.Item>
          </Menu>
          
          <div className="actions-container">
            <Input
              placeholder="Search here..."
              prefix={<SearchOutlined />}
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} className="filter-button">Filter</Button>
            {activeTab === 'groupClass' && (
              <Button type="primary" icon={<PlusOutlined />} className="add-button">Add Class</Button>
            )}
            {activeTab === 'group' && (
              <Button type="primary" icon={<PlusOutlined />} className="add-button">Add Group</Button>
            )}
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'groupClass' && (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <Table dataSource={groupClassData} columns={groupClassColumns} pagination={false} className="entity-table" />
          )}
          {activeTab === 'group' && (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <Table dataSource={groupData} columns={groupColumns} pagination={false} className="entity-table" />
          )}
          {activeTab === 'company' && <div className="placeholder-content"><p>Company content would appear here</p></div>}
          {activeTab === 'configurationDisplay' && <div className="placeholder-content"><p>Configuration Display content would appear here</p></div>}
        </div>
      </Content>
    </Layout>
  );
};

export default MultiEntityDisplay;