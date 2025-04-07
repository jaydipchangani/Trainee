import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Space, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Account } from "../src/types/types"; // Ensure that the Account type is imported

interface DashboardProps {
  token: string | null;
  realmId: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ token, realmId }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Page number
  const [pageSize, setPageSize] = useState(5); // Items per page
  const [totalItems, setTotalItems] = useState(0); // Total items in the data set

  const fetchAccounts = (page: number = currentPage) => {
    if (!token || !realmId) {
      console.error("Access Token or Realm ID is missing!");
      return;
    }

    setLoading(true);
    axios
      .get(`https://localhost:7254/api/quickbooks/accounts`, {
        params: { accessToken: token, realmId, page, pageSize },
      })
      .then((response) => {
        const fetchedAccounts = response.data.QueryResponse.Account || [];
        const total = response.data.QueryResponse.TotalCount || 0;
        setAccounts(fetchedAccounts);
        setTotalItems(total); // Set the total number of items for pagination
      })
      .catch((error) => {
        console.error("Error fetching accounts:", error.response?.data || error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAccounts(currentPage); // Fetch accounts on mount and when page changes
  }, [currentPage]);

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

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div>
      <Space style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <Button onClick={() => fetchAccounts(currentPage)} type="primary" loading={loading}>
          Fetch QuickBooks Accounts
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="Id"
        pagination={false} // Disable default pagination on Table
        loading={loading}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={[5, 10, 15, 20]}
        style={{ marginTop: "1rem", textAlign: "center" }}
      />
    </div>
  );
};

export default Dashboard;
