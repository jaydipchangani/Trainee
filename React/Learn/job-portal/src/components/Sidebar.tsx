import { Layout, Menu } from "antd";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  PlusOutlined,
  UserOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Sider collapsible collapsed={collapsed} trigger={null} style={{ minHeight: "100vh" }}>
      

      <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>

        <Menu.Item key="/post-job" icon={<PlusOutlined />}>
          <Link to="/post-job">Post Job</Link>
        </Menu.Item>

        <Menu.Item key="/my-jobs" icon={<OrderedListOutlined />}> 
          <Link to="/my-jobs">My Jobs</Link>  {/* 👈 New My Jobs Link */}
        </Menu.Item>

        <Menu.Item key="/profile" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>

        <Menu.Item
          key="logout"
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </Menu.Item>
      </Menu>

      {/* Sidebar Toggle Button */}
      <div style={{ textAlign: "center", padding: "10px" }}>
        <span onClick={toggleSidebar} style={{ cursor: "pointer", color: "white" }}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
      </div>
    </Sider>
  );
};

export default Sidebar;
