import React from "react";
import { Layout } from "antd";

const { Header } = Layout;

const AppHeader: React.FC = () => (
  <Header style={{ background: "#1890ff", color: "white", textAlign: "center",fontSize: "18px", fontWeight: "bold" }}>
    Inventory Management System
  </Header>
);

export default AppHeader;
