import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Input, Button, Spin, Alert } from 'antd';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import GroupClassTable from '../components/GroupClassTable';
import GroupTable from '../components/GroupTable'; // Assuming a GroupTable component exists
import AppHeader from '../components/Header';
import AddClassDrawer from '../components/AddClassDrawer';
import AddGroupDrawer from '../components/AddGroupDrawer'; // Import the new drawer component
import './MultiEntityDisplay.css';
import {Link} from 'react-router-dom';
const { Content } = Layout;

const MultiEntityDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState('groupClass');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupClassData, setGroupClassData] = useState<any[]>([]);
  const [groupData, setGroupData] = useState<any[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [groupDrawerVisible, setGroupDrawerVisible] = useState(false); // State for group drawer visibility
  const auth = useContext(AuthContext);

  // Fetch Group Class Data from API
  const fetchGroupClassData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/GRC/GetGRCrecords', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      setGroupClassData(data.result.records.map((item: any, index: number) => ({
        key: String(index + 1),
        groupclassId: item.groupclassId,
        groupName: item.groupName,
        className: item.className,
        classValues: item.classValues,
        setupOrMapping: (
          <Link to={`/configurationDisplay?groupclassId=${item.groupclassId}`}>
            Mapped: {item.mappedAccountsCount}, Unmapped: {item.unMappedAccountsCount}
          </Link>
        ),
      })));
    } catch {
      setError('Failed to fetch Group Class data. Please try again.');
    }
    setLoading(false);
  };

  // Fetch Group Data from db.json (JSON Server)
  const fetchGroupData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/groups');
      if (!response.ok) throw new Error('Failed to fetch Group data.');
      const data = await response.json();
      setGroupData(data.map((item: any, index: number) => ({
        key: String(index + 1),
        ...item
      })));
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'groupClass') {
      fetchGroupClassData();
    } else if (activeTab === 'group') {
      fetchGroupData();
    }
  }, [activeTab]);

  const handleAddClass = async (newClass: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://sandboxgathernexusapi.azurewebsites.net/api/GRC/InsertUpdateGRCDetail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify({
            id: newClass.id || 0,
            groupId: newClass.groupId ?? 0,
            className: newClass.className || "",
            gRCValuesDetails: newClass.gRCValuesDetails?.map((item: any) => ({
              id: item.id || 0,
              classValue: item.classValue || "",
            })) || [],
          }),
        }
      );
      const responseData = await response.json();
      if (responseData.responseStatus !== 3) throw new Error(responseData.message || "Failed to add class");
      await fetchGroupClassData();
      setDrawerVisible(false);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleAddGroup = async (newGroup: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3000/groups",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newGroup),
        }
      );
      if (!response.ok) throw new Error('Failed to add group');
      await fetchGroupData();
      setGroupDrawerVisible(false);
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
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
            {activeTab === 'group' && (
              <Button type="primary" icon={<PlusOutlined />} className="add-button" onClick={() => setGroupDrawerVisible(true)}>
                Add Group
              </Button>
            )}
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'groupClass' ? (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <GroupClassTable data={groupClassData} setData={setGroupClassData} />
          ) : activeTab === 'group' ? (
            loading ? <Spin size="large" /> : error ? <Alert message={error} type="error" showIcon /> : <GroupTable data={groupData} setData={setGroupData} />
          ) : null}
        </div>
      </Content>
      <AddClassDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} onAdd={handleAddClass} />
      <AddGroupDrawer visible={groupDrawerVisible} onClose={() => setGroupDrawerVisible(false)} onAdd={handleAddGroup} />
    </Layout>
  );
};

export default MultiEntityDisplay;