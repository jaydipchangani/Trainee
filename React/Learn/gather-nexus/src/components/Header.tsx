import React, { useContext } from "react";
import { Layout, Tooltip,Typography } from "antd";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const auth = useContext(AuthContext);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Guest"; // Default to "Guest" if no user

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", color: "#fff", padding: "0 20px" }}>
      <div className="logo">
          <Title level={3} style={{ color: '#2E8B57', margin: 0 }}>
            GATHER<span style={{ fontSize: '16px', fontWeight: 'normal' }}>.nexus</span>
          </Title>
        </div>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#000000", fontWeight: "bold" }}> {userName}</span>
        {getToken() && (
    <Tooltip title="Logout">
    <LogoutOutlined 
      onClick={auth?.logout} 
      style={{ fontSize: "18px", color: "#000000", cursor: "pointer" }} 
    />
  </Tooltip>
)}

      </div>
    </Header>
  );
};

export default AppHeader;
