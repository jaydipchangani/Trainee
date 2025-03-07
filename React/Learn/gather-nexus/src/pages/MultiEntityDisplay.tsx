import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Input, Button, Spin, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import GroupClassTable from '../components/GroupClassTable';
import './MultiEntityDisplay.css';
import AppHeader from '../components/Header';
import AddClassDrawer from '../components/AddClassDrawer'; // Import the new drawer component

const { Content } = Layout;

const MultiEntityDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groupClass');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupClassData, setGroupClassData] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const auth = useContext(AuthContext);

  const fetchGroupClassData = async () => {
    setLoading(true);
    setError(null);
    const token = getToken();
    try {
      const response = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetGRCrecords', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      const mappedData = data.result.records.map((item: any, index: number) => ({
        key: String(index + 1),
        groupclassId: item.groupclassId,
        groupName: item.groupName,
        className: item.className,
        classValues: item.classValues,
        setupOrMapping: {
          mapped: item.mappedAccountsCount,
          unmapped: item.unMappedAccountsCount,
        },
      }));
      setGroupClassData(mappedData);
      localStorage.setItem('groupClassData', JSON.stringify(mappedData));
    } catch {
      setError('Failed to fetch data. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'groupClass') {
      fetchGroupClassData();
    }
  }, [activeTab]);

  const handleAddClass = async (newClass: any) => {
    setLoading(true);
    try {
      const response = await fetch("https://sandboxgathernexusapi.azurewebsites.net/api/GRC/AddClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newClass),
      });

      if (response.ok) {
        await fetchGroupClassData(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to add class", error);
    } finally {
      setLoading(false);
      setDrawerVisible(false);
    }
  };

  return (
    <Layout className="entity-display-layout">
      <AppHeader />

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
              <Button type="primary" icon={<PlusOutlined />} className="add-button" onClick={() => setDrawerVisible(true)}>
                Add Class
              </Button>
            )}
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'groupClass' && (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <GroupClassTable data={groupClassData} setData={setGroupClassData} />
          )}
        </div>
      </Content>

      <AddClassDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onAdd={handleAddClass} />
    </Layout>
  );
};

export default MultiEntityDisplay;
