// Dashboard.tsx
import React, { useState } from "react";
import axios from "axios";
import { Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Account } from "C:/Trainee_new/React/Learn/quickbooks-auth/src/types/types";  // Assuming you create a separate types file

interface DashboardProps {
  token: string | null;
  realmId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ token, realmId }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAccounts = () => {
    if (!token || !realmId) {
      console.error("Access Token or Realm ID is missing!");
      return;
    }

    setLoading(true);
    axios
      .get(`https://localhost:7254/api/quickbooks/accounts`, {
        params: { accessToken: token, realmId },
      })
      .then((response) => {
        setAccounts(response.data.QueryResponse.Account || []);
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.response?.data || error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<Account> = [
    { title: "Name", dataIndex: "Name", key: "name" },
    { title: "Account Type", dataIndex: "AccountType", key: "accountType" },
    { title: "Detail Type", dataIndex: "AccountSubType", key: "detailType" },
    {
      title: "QuickBooks Balance",
      dataIndex: "CurrentBalance",
      key: "quickBooksBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Bank Balance",
      dataIndex: "BankBalance",
      key: "bankBalance",
      render: (balance?: number) =>
        balance !== undefined ? `$${balance.toFixed(2)}` : "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Account) => (
        <Button type="primary" onClick={() => console.log("View", record.Id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Button onClick={fetchAccounts} type="primary" loading={loading}>
          Fetch QuickBooks Accounts
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="Id"
        pagination={{ pageSize: 5 }}
        loading={loading}
      />
    </div>
  );
};

export default Dashboard;
