import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Pagination, Space } from "antd";
import { Account } from "../types/types";  // Adjust import path for the Account type

interface AccountDataProps {
  token: string | null;
  realmId: string | null;
}

const AccountData: React.FC<AccountDataProps> = ({ token, realmId }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchAccounts = (page: number = currentPage) => {
    if (!token || !realmId) return;

    setLoading(true);
    axios
      .get(`https://localhost:7254/api/quickbooks/accounts`, {
        params: { accessToken: token, realmId, page },
      })
      .then((response) => {
        const accountsData = response.data.QueryResponse.Account || [];
        const total = response.data.QueryResponse.TotalCount || 0;
        setAccounts(accountsData);
        setTotalItems(total);
      })
      .catch((error) => console.error("Error fetching accounts:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts(currentPage);
  }, [currentPage]);

  const columns = [
    { title: "Name", dataIndex: "Name", key: "name" },
    { title: "Account Type", dataIndex: "AccountType", key: "accountType" },
    { title: "Detail Type", dataIndex: "AccountSubType", key: "detailType" },
    { title: "Balance", dataIndex: "CurrentBalance", key: "balance" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Account) => (
        <Button type="primary" onClick={() => console.log("View", record.Id)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={accounts}
        rowKey="Id"
        pagination={false}
        loading={loading}
      />
      <Pagination
        current={currentPage}
        total={totalItems}
        onChange={(page) => setCurrentPage(page)}
        pageSize={5}
        style={{ marginTop: "20px", textAlign: "center" }}
      />
    </div>
  );
};

export default AccountData;
