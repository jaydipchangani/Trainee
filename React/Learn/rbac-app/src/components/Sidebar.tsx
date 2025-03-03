import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getCurrentUser } from "../api/auth";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // Define menu items based on role permissions
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <UserOutlined />, path: "/" },
    user?.role === "Admin" && {
      key: "users",
      label: "Users",
      icon: <UserOutlined />,
      path: "/users",
    },
    (user?.role === "Admin" || user?.role === "HR") && {
      key: "employees",
      label: "Employees",
      icon: <TeamOutlined />,
      path: "/employees",
    },
    (user?.role === "Admin" || user?.role === "Manager") && {
      key: "projects",
      label: "Projects",
      icon: <ProjectOutlined />,
      path: "/projects",
    },
    user?.role === "Admin" && {
      key: "permissions",
      label: "Permissions",
      icon: <SettingOutlined />,
      path: "/permissions",
    },
  ].filter((item) => item !== false); // Remove `false` entries

  return (
    <Sider
      width={200}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        backgroundColor: "#001529",
      }}
    >
      <div
        style={{
          height: "64px",
          color: "white",
          fontSize: "18px",
          textAlign: "center",
          lineHeight: "64px",
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        OM
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        onClick={({ key }) => navigate(menuItems.find((item) => item?.key === key)?.path || "/")}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
