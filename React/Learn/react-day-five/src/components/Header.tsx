import React from "react";
import { Layout, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#001529", padding: "0 20px" }}>
      <Title level={3} style={{ color: "white", margin: 0 }}>Product Management</Title>
      <Button type="primary" danger onClick={handleSignOut}>Sign Out</Button>
    </Header>
  );
};

export default AppHeader;
