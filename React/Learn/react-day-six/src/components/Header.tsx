import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AppHeader: React.FC = () => (
  <Header style={{ position: "sticky", top: 0, zIndex: 1000, background: "#1890ff", color: "white", textAlign: "center" }}>
    Inventory Management
  </Header>
);

export default AppHeader;
