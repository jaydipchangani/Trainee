import React from "react";
import { Layout, Input, Avatar, Space } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import 'C:/Trainee_new/React/Learn/react-day-six/src/App.css'

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header className="header" style={{ background: "#1778ff", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      
      <div className="logo" style={{ color: "white", textAlign: "center", padding: "20px", fontSize: "18px", fontWeight: "bold" }}>
        Inventory App
      </div>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search inventory..."
        style={{ width: 300 }}
      />
      <Space>
        <Avatar size="large" icon={<UserOutlined />} />
      </Space>
    </Header>
  );
};

export default AppHeader;
