import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, message, Modal, Drawer, Select, Button } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Option } = Select;

interface GroupData {
  key: string;
  id: string;
  groupName: string;
  companies: string[];
  financialYear: string;
  currency: string;
}

interface Company {
  erpCompanyId: string;
  erpCompanyName: string;
}

interface Currency {
  code: string;
  name: string;
}

const GroupTable: React.FC = () => {
  const [data, setData] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRecord, setEditingRecord] = useState<GroupData | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const fyPeriods = ['2023-2024', '2024-2025', '2025-2026'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No token found in local storage');
        }

        const response = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroups', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data from API');
        }

        const result = await response.json();
        if (result.responseStatus !== 3) {
          throw new Error('Failed to fetch data from API');
        }

        const records = result.result.records;

        setData(records.map((item: any, index: number) => ({
          key: String(index + 1),
          id: item.id,
          groupName: item.groupName,
          companies: item.erpCompanyData.map((company: any) => company.erpCompanyName),
          financialYear: item.financialYear,
          currency: item.currencyCode,
        })));
      } catch (error) {
        console.error('Error fetching data from API:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No token found in local storage');
        }
    
        const response = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Group/GetGroupDropdown?groupType=all&reportType=0', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch companies from API: ${errorText}`);
        }
    
        const result = await response.json();
        if (!result || result.responseStatus !== 3 || !Array.isArray(result.result)) {
          throw new Error('Unexpected response format from API');
        }
    
        setCompanies(result.result);
      } catch (error) {
        console.error('Error fetching companies from API:', error);
        message.error('Failed to load companies. Please try again later.');
      }
    };
    

    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('No token found in local storage');
        }

        const response = await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Configuration/GetCurrencyDropdown', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch currencies from API');
        }

        const result = await response.json();
        if (result.responseStatus !== 3) {
          throw new Error('Failed to fetch currencies from API');
        }

        setCurrencies(result.result[0].currencies);
      } catch (error) {
        console.error('Error fetching currencies from API:', error);
        message.error('Failed to load currencies');
      }
    };

    fetchData();
    fetchCompanies();
    fetchCurrencies();
  }, []);

  const handleEdit = (record: GroupData) => {
    setEditingRecord(record);
    setDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setEditingRecord(null);
  };

  const handleSave = async () => {
    if (editingRecord) {
      try {
        await fetch(`https://sandboxgathernexusapi.azurewebsites.net/api/Group/UpdateGroup`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingRecord),
        });
        
        setData((prevData) => prevData.map((item) => (item.key === editingRecord.key ? editingRecord : item)));
        message.success('Group updated successfully!');
        handleDrawerClose();
      } catch (error) {
        console.error('Error updating data:', error);
        message.error('Failed to update group.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this group?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error('No token found in local storage');
          }

          await fetch(`https://sandboxgathernexusapi.azurewebsites.net/api/Company/DeleteCompanyRecord/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          setData((prevData) => prevData.filter((item) => item.id !== id));
          message.success('Group deleted successfully!');
        } catch (error) {
          console.error('Error deleting data:', error);
          message.error('Failed to delete group.');
        }
      },
    });
  };

  const handleCopy = async (record: GroupData) => {
    try {
      const newRecord = { ...record, key: String(Date.now()), groupName: `${record.groupName} Copy` };
      await fetch('https://sandboxgathernexusapi.azurewebsites.net/api/Group/AddGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      
      setData((prevData) => [...prevData, newRecord]);
      message.success('Group copied successfully!');
    } catch (error) {
      console.error('Error copying data:', error);
      message.error('Failed to copy group.');
    }
  };

  const columns = [
    { title: 'Group Name', dataIndex: 'groupName', key: 'groupName' },
    {
      title: "Companies",
      dataIndex: "companies",
      key: "companies",
      render: (companies: string[]) => (
        <Select
          defaultValue={`${companies.length} Companies`} // Show count
          style={{ border: "none"}} // Remove border
          dropdownRender={() => (
            <div style={{ padding: 8 }}>
              {companies.map((company, index) => (
                <div key={index} style={{ padding: "4px 0" }}>
                  {company}
                </div>
              ))}
            </div>
          )}
        />
      ),
    },
    { title: 'Financial Year', dataIndex: 'financialYear', key: 'financialYear' },
    { title: 'Currency', dataIndex: 'currency', key: 'currency' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: GroupData) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <EditOutlined onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Copy">
            <CopyOutlined onClick={() => handleCopy(record)} style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined onClick={() => handleDelete(record.id)} style={{ color: 'red', cursor: 'pointer' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} loading={loading} pagination={{ pageSize: 5 }} />
      <Drawer title="Edit Group" placement="right" onClose={handleDrawerClose} visible={drawerVisible}>
        {editingRecord && (
          <>
            <label>Group Name</label>
            <Select
              value={editingRecord.groupName}
              onChange={(value) => setEditingRecord({ ...editingRecord, groupName: value })}
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Select Group Name"
            >
              {data.map((group) => (
                <Option key={group.groupName} value={group.groupName}>
                  {group.groupName}
                </Option>
              ))}
            </Select>
            <label>Financial Year</label>
            <Select
              value={editingRecord.financialYear}
              onChange={(value) => setEditingRecord({ ...editingRecord, financialYear: value })}
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Select Financial Year"
            >
              {fyPeriods.map((fy) => (
                <Option key={fy} value={fy}>{fy}</Option>
              ))}
            </Select>
            <label>Currency</label>
            <Select
              value={editingRecord.currency}
              onChange={(value) => setEditingRecord({ ...editingRecord, currency: value })}
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Select Currency"
            >
              {currencies.map((cur) => (
                <Option key={cur.code} value={cur.code}>
                  {cur.name}
                </Option>
              ))}
            </Select>
            <label>Companies</label>
            <Select
              mode="multiple"
              value={editingRecord.companies}
              onChange={(value) => setEditingRecord({ ...editingRecord, companies: value })}
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Select Companies"
            >
              {companies.map((company) => (
                <Option key={company.erpCompanyId} value={company.erpCompanyName}>
                  {company.erpCompanyName}
                </Option>
              ))}
            </Select>
            <Space style={{ marginTop: 20 }}>
              <Button onClick={handleSave} type="primary">Save</Button>
              <Button onClick={handleDrawerClose}>Cancel</Button>
            </Space>
          </>
        )}
      </Drawer>
    </>
  );
};

export default GroupTable;