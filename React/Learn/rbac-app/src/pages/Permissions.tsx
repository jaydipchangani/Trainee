import React, { useEffect, useState } from "react";
import { Table, Checkbox, message } from "antd";
import { fetchPermissions, updatePermissions } from "../api/permissions";
import { getCurrentUser } from "../api/auth";

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    fetchPermissions().then(setPermissions);
  }, []);

  const handlePermissionChange = async (role: string, action: string, checked: boolean) => {
    if (user?.role !== "Admin") return;
    const updatedPermissions = permissions.map((perm) =>
      perm.role === role ? { ...perm, [action]: checked } : perm
    );
    await updatePermissions(role, updatedPermissions);
    message.success("Permissions updated.");
    setPermissions(updatedPermissions);
  };

  return user?.role !== "Admin" ? (
    <p>Access Denied</p>
  ) : (
    <Table
      dataSource={permissions}
      rowKey="role"
      columns={[
        { title: "Role", dataIndex: "role" },
        {
          title: "Manage Users",
          render: (_, record) => (
            <Checkbox checked={record.manageUsers} onChange={(e) => handlePermissionChange(record.role, "manageUsers", e.target.checked)} />
          ),
        },
      ]}
    />
  );
};

export default Permissions;
