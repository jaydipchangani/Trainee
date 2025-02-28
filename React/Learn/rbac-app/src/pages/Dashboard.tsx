import React from "react";
import { Card } from "antd";
import { getCurrentUser } from "../api/auth";

const Dashboard: React.FC = () => {
  const user = getCurrentUser();

  return (
    <Card title="Dashboard">
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </Card>
  );
};

export default Dashboard;
