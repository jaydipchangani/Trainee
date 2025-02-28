import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import { fetchUsers, deleteUser } from "../api/users";
import { getCurrentUser } from "../api/auth";

const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success("User deleted.");
    setUsers(users.filter((user) => user.id !== id));
  };

  if (user?.role !== "Admin") return <p>Access Denied</p>;

  return (
    <Table
      dataSource={users}
      rowKey="id"
      columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Email", dataIndex: "email" },
        { title: "Role", dataIndex: "role" },
        {
          title: "Action",
          render: (_, record) => (
            <Button danger onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          ),
        },
      ]}
    />
  );
};

export default Users;
