import React from "react";
import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
 

interface Account {
    Id: string;
    Name: string;
    AccountType: string;
    AccountSubType: string;
    CurrentBalance?: number;
    BankBalance?: number;
  }

const AccountTable = ({ accounts }: { accounts: Account[] }) => {
  const columns: ColumnsType<Account> = [
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      sorter: (a, b) => a.Name.localeCompare(b.Name),
    },
    {
      title: "Account Type",
      dataIndex: "AccountType",
      key: "AccountType",
      sorter: (a, b) => a.AccountType.localeCompare(b.AccountType),
    },
    {
      title: "Detail Type",
      dataIndex: "AccountSubType",
      key: "AccountSubType",
      sorter: (a, b) => a.AccountSubType.localeCompare(b.AccountSubType),
    },
    // {
    //   title: "QuickBooks Balance",
    //   dataIndex: "CurrentBalance",
    //   key: "CurrentBalance",
    //   sorter: (a, b) => (a.CurrentBalance ?? 0) - (b.CurrentBalance ?? 0),
    //   render: (balance?: number) => (balance !== undefined ? `$${balance.toFixed(2)}` : "N/A"),
    // },
    // {
    //   title: "Bank Balance",
    //   dataIndex: "BankBalance",
    //   key: "BankBalance",
    //   sorter: (a, b) => (a.BankBalance ?? 0) - (b.BankBalance ?? 0),
    //   render: (balance?: number) => (balance !== undefined ? `$${balance.toFixed(2)}` : "N/A"),
    // },
    
    
        {
        title: "Classification",
        dataIndex: "classification",
        key: "classification",
        render: (classification: string) => <span>{classification}</span>,
        },
        {
        title: "QuickBooks ID",
        dataIndex: "quickBooksId",
        key: "quickBooksId",
        render: (quickBooksId: number) => <span>{quickBooksId}</span>,
    },
    {
        title: "Action",
        key: "action",
        render: (_, record: Account) => (
          <Button type="primary" onClick={() => console.log("View", record.Id)}>
            View
          </Button>
        ),
      },
  ];

  return <Table columns={columns} dataSource={accounts} rowKey={(record) => record.Id || Math.random().toString(36).substr(2, 9)} pagination={{ pageSize: 5 }} />;
};

export default AccountTable;
