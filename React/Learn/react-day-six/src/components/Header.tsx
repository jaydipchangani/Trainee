import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className="header">
      Inventory Management System
    </Header>
  );
};

export default AppHeader;
