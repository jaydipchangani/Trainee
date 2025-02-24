import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined, ShopOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider collapsible style={{ height: "100vh", background: "#001529", paddingTop: "50px" }}>
      <Menu 
        theme="dark" 
        mode="vertical" 
        selectedKeys={[location.pathname]} 
        defaultSelectedKeys={["/products"]}
      >
        {/* Products Sub-Menu */}
        <SubMenu key="products" icon={<ShopOutlined />} title="Products">
          <Menu.Item key="/products" onClick={() => navigate("/products")}>
            View Products
          </Menu.Item>
          <Menu.Item key="/products/add" icon={<PlusOutlined />} onClick={() => navigate("/products/add")}>
            Add Product
          </Menu.Item>
        </SubMenu>

        {/* Users Menu */}
        <Menu.Item key="/users" icon={<UserOutlined />} onClick={() => navigate("/users")}>
          Users
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
