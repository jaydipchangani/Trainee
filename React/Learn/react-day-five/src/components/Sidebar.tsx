
import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, ShopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Sider collapsible style={{ height: "auto", background: "#001529" }}>
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<ShopOutlined />} onClick={() => navigate("/products")}>
          Products
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate("/users")}>
          Users
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
