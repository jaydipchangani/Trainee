import React, { useState, useEffect } from 'react';
import { Table, Space, Tooltip, message, Modal, Input, Drawer, Select, Button } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

const { Option } = Select;

interface GroupData {
  key: string;
  id: string;
  groupName: string;
  companies: string[];
  groupClass: string;
  financialYear: string;
  currency: string;
  transferOwnership: string;
}

const GroupTable: React.FC = () => {
  const [data, setData] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingRecord, setEditingRecord] = useState<GroupData | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [companies, setCompanies] = useState<{ label: string; value: string }[]>([]);
  
  const fyPeriods = ['2023-2024', '2024-2025', '2025-2026'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups');
        const currencyRes = await fetch('http://localhost:3000/currencies');
        const companyRes = await fetch('http://localhost:3000/companies');
        
        if (!response.ok || !currencyRes.ok || !companyRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        const currencyData = await currencyRes.json();
        const companyData = await companyRes.json();
        
        setCurrencies(currencyData);
        
        // Ensure companies are formatted correctly
        if (Array.isArray(companyData)) {
          setCompanies(companyData.map((company: any) => ({
            label: company.name,
            value: company.name
          })));
        } else {
          setCompanies([]);
        }

        setData(result.map((item: any, index: number) => ({
          key: String(index + 1),
          ...item,
          companies: Array.isArray(item.companies) ? item.companies : [],
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
        await fetch(`http://localhost:3000/groups/${editingRecord.key}`, {
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
          await fetch(`http://localhost:3000/groups/${id}`, {
            method: 'DELETE',
          });
          
          setData((prevData) => prevData.filter((item) => item.key !== id));
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
      await fetch('http://localhost:3000/groups', {
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
    { title: 'Companies', dataIndex: 'companies', key: 'companies', render: (companies: string[]) => companies.join(', ') },
    { title: 'Group Class', dataIndex: 'groupClass', key: 'groupClass' },
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
            <DeleteOutlined onClick={() => handleDelete(record.key)} style={{ color: 'red', cursor: 'pointer' }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={data} columns={columns} loading={loading}  pagination={{ pageSize: 5 }}  />
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
                <Option key={cur} value={cur}>{cur}</Option>
              ))}
            </Select>
            <label>Companies</label>
            <Select
              mode="multiple"
              value={editingRecord.companies}
              onChange={(value) => setEditingRecord({ ...editingRecord, companies: value })}
              options={companies}
              style={{ width: '100%', marginTop: 10 }}
              placeholder="Select Companies"
            />
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