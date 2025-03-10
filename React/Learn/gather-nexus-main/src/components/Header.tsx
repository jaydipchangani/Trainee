import React, { useContext } from "react";
import { Layout, Tooltip, Typography, Dropdown, Menu } from "antd";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const auth = useContext(AuthContext);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Guest"; // Default to "Guest" if no user

  const handleLogout = () => {
    localStorage.clear(); // Clear all data in local storage
    sessionStorage.clear(); // Optionally clear session storage too
    auth?.logout(); // Call the logout function from context
  };

  // Dropdown menu for user options
  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", color: "#fff", padding: "0 20px" }}>
      <div className="logo">
        <Title level={3} style={{ color: '#2E8B57', margin: 0 }}>
          GATHER<span style={{ fontSize: '16px', fontWeight: 'normal' }}>.nexus</span>
        </Title>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Dropdown overlay={menu} trigger={["click"]}>
          <span style={{ color: "#000000", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            <UserOutlined style={{ fontSize: "16px" }} /> {userName}
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
