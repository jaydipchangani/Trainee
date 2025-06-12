import React, { useState } from 'react';
import { Button, Table, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface Account {
  id: string;
  name: string;
  fullyQualifiedName: string;
  accountType: string;
  accountSubType: string;
  classification: string;
  currencyName: string;
  currencyValue: string;
  currentBalance: number;
  currentBalanceWithSubAccounts: number;
  active: boolean;
  subAccount: boolean;
  syncToken: string;
  domain: string;
  createTime: string;
  lastUpdatedTime: string;
}

const AccountDashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const syncAndFetchAccounts = async () => {
    try {
      setLoading(true);
      message.info('Syncing from QuickBooks to SQL...');

      // 1. Sync from QuickBooks to SQL Server
      await axios.post('http://localhost:5000/api/accounts/sync');

      message.success('Synced successfully! Fetching data from SQL...');

      // 2. Fetch from SQL Server
      const response = await axios.get<Account[]>('http://localhost:5000/api/accounts');
      setAccounts(response.data);
    } catch (err) {
      console.error(err);
      message.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Account> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Type', dataIndex: 'accountType' },
    { title: 'SubType', dataIndex: 'accountSubType' },
    { title: 'Balance', dataIndex: 'currentBalance' },
    { title: 'Currency', dataIndex: 'currencyValue' },
    { title: 'Active', dataIndex: 'active', render: (val) => (val ? 'Yes' : 'No') },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>QuickBooks Accounts Dashboard</h2>

      <Button type="primary" onClick={syncAndFetchAccounts} disabled={loading}>
        Sync & Show Accounts
      </Button>

      <Spin spinning={loading} style={{ marginTop: 20 }}>
        <Table
          columns={columns}
          dataSource={accounts}
          rowKey="id"
          style={{ marginTop: 20 }}
          bordered
        />
      </Spin>
    </div>
  );
};

export default AccountDashboard;
