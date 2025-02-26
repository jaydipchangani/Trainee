import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { UserOutlined, AppstoreOutlined, PlusOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { key: "dashboard", icon: <AppstoreOutlined />, label: "Dashboard", onClick: () => navigate("/dashboard") },
    { key: "postJob", icon: <PlusOutlined />, label: "Post Job", onClick: () => navigate("/post-job") },
    { key: "profile", icon: <UserOutlined />, label: "Profile", onClick: () => navigate("/profile") }
  ];

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapse} width={200} style={{ background: "#fff" }}>
        <div onClick={toggleCollapse} style={{ padding: "10px", cursor: "pointer" }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      <Menu mode="vertical" defaultSelectedKeys={["dashboard"]} items={menuItems} />
      
      </div>
    </Sider>
  );
};

export default Sidebar;
