import React, { useState, useEffect } from 'react';
import { Table, Spin, Alert } from 'antd';

const CompanyTable = () => {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/companies');
      if (!response.ok) throw new Error('Failed to fetch Company data.');
      const data = await response.json();
      setCompanyData(data.map((item, index) => ({ key: index + 1, ...item })));
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Industry', dataIndex: 'industry', key: 'industry' },
    { title: 'Location', dataIndex: 'location', key: 'location' },
  ];

  return (
    <div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Table dataSource={companyData} columns={columns} pagination={{ pageSize: 5 }} />
      )}
    </div>
  );
};

export default CompanyTable;
