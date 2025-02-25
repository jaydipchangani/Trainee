import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => (
  <Sider style={{ height: "100vh", background: "#001529", color: "white" }}>
    <Menu theme="dark" mode="vertical">
      <Menu.Item key="inventory">
        <Link to="/inventory">Inventory</Link>
      </Menu.Item>
      <Menu.Item key="products">
        <Link to="/products">Products</Link>
      </Menu.Item>
      <Menu.Item key="cart">
        <Link to="/cart">Cart</Link>
      </Menu.Item>
    </Menu>
  </Sider>
);

export default Sidebar;
