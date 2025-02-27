import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); 
  };

  return (
    <Header style={{ background: "#001529", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ flex: 1, textAlign: "center", color: "#fff" }}>
        <h1 style={{ margin: 0 }}>Job Portal</h1>
      </div>
      <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
