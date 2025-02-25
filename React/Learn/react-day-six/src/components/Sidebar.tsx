import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => (
  <Sider style={{ height: "100vh", position: "sticky", left: 0, background: "#001529" }}>
    <Menu theme="dark" mode="vertical">
      <Menu.Item key="1">
        <Link to="/inventory">Inventory</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/cart">Cart</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default Sidebar;
