import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Input, Button, Spin, Alert,Tooltip,Table } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined, ArrowLeftOutlined, LogoutOutlined } from '@ant-design/icons';
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import GroupTable from '../components/GroupTable';
import GroupClassTable from '../components/GroupClassTable';
import './MultiEntityDisplay.css';

import AddGroupDrawer from './AddGroupDrawer';

const { Header, Content } = Layout;

const MultiEntityDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groupClass');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupClassData, setGroupClassData] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any[]>([]);
  const auth = useContext(AuthContext);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Guest";


  
  const handleAddGroup = async (newGroup: any) => {
    setLoading(true);
    try {
      // API call to add group
      // Replace this with your API URL
      await fetch("https://api.example.com/addGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newGroup),
      });

      setGroupClassData([...groupClassData, newGroup]); // Update UI
    } catch (error) {
      console.error("Failed to add group", error);
    } finally {
      setLoading(false);
    }
  };
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
            

            <Layout className="entity-display-layout">
      <div className="actions-container">
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add Group
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Table dataSource={groupClassData} columns={[]} pagination={false} />
      )}

      {/* Drawer Component */}
      <AddGroupDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onAddGroup={handleAddGroup} />
    </Layout>

              
            )}
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'groupClass' && (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <GroupClassTable data={groupClassData} />
          )}
          {activeTab === 'group' && (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <GroupTable data={groupData} />
          )}
          {activeTab === 'company' && <div className="placeholder-content"><p>Company content would appear here</p></div>}
          {activeTab === 'configurationDisplay' && <div className="placeholder-content"><p>Configuration Display content would appear here</p></div>}
        </div>
      </Content>
    </Layout>
  );
};

export default MultiEntityDisplay;