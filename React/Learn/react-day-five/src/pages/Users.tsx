import React, { useEffect, useState } from "react";
import { Table } from "antd";
import AppLayout from "../components/Layout";

interface User {
  name: string;
  email: string;
  createdAt: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Registered Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),   // convert data into humna readble form
    },
  ];

  return (
    <AppLayout>
      <h2>Registered Users</h2>
      <Table dataSource={users} columns={columns} rowKey="email" />
    </AppLayout>
  );
};

export default Users;
