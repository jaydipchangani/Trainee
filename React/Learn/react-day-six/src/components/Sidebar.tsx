import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { AppstoreOutlined, ShoppingCartOutlined, DatabaseOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  return (
    <Sider className="sidebar">
      <Menu theme="dark" mode="vertical" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DatabaseOutlined />}>
          <Link to="/">Inventory</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<AppstoreOutlined />}>
          <Link to="/products">Products</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
          <Link to="/cart">Cart</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
