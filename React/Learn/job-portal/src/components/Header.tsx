import { Layout, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ Remove user session
    navigate("/"); // ✅ Redirect to login page
  };

  return (
    <Header style={{ background: "#001529", padding: "0 20px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
      <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
