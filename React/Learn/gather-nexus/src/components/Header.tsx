import React, { useContext } from "react";
import { Layout, Tooltip } from "antd";
import { AuthContext } from "../context/AuthContext";
import { getToken } from "../utils/storage";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const auth = useContext(AuthContext);

  // Fetch user data from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "Guest"; // Default to "Guest" if no user

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", color: "#fff", padding: "0 20px" }}>
      <h2 style={{ color: "#fff" }}>Gather.nexus</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ color: "#fff", fontWeight: "bold" }}> {userName}</span>
        {getToken() && (
    <Tooltip title="Logout">
    <LogoutOutlined 
      onClick={auth?.logout} 
      style={{ fontSize: "18px", color: "#fff", cursor: "pointer" }} 
    />
  </Tooltip>
)}

      </div>
    </Header>
  );
};

export default AppHeader;
