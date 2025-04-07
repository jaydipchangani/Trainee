import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const MenuComponent = () => {
  return (
    <Menu
      style={{ height: "100%", borderRight: 0 }}
      defaultSelectedKeys={["/"]}
      mode="inline"
    >
      <Menu.Item key="/account-data">
        <Link to="/account-data">Account Data</Link>
      </Menu.Item>
      <Menu.Item key="/add-account">
        <Link to="/add-account">Add Account</Link>
      </Menu.Item>
    </Menu>
  );
};

export default MenuComponent;
