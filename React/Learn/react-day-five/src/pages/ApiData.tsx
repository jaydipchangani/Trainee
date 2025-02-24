import React, { useEffect, useState } from "react";
import { Table, message, Card } from "antd";
import AppLayout from "../components/Layout";
import { fetchUsers } from "../components/ApiService";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

const ApiData: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchUsers();
    if (data.length > 0) {
      setUsers(data);
    } else {
      message.error("Failed to fetch data!");
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card title="User Data from API">
        <Table
          dataSource={users}
          rowKey="id"
          loading={loading}
          columns={[
            { title: "ID", dataIndex: "id" },
            { title: "Name", dataIndex: "name" },
            { title: "Username", dataIndex: "username" },
            { title: "Email", dataIndex: "email" },
            { title: "Phone", dataIndex: "phone" },
          ]}
        />
      </Card>
    </AppLayout>
  );
};

export default ApiData;
