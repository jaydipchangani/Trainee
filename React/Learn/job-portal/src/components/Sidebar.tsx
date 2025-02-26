import { Layout, Menu } from "antd";
const { Sider } = Layout;

const Sidebar = () => (
  <Sider style={{ height: "100vh", background: "#001529" }}>
    <Menu theme="dark" mode="vertical" items={[{ key: 1, label: "Dashboard" }]} />
  </Sider>
);
export default Sidebar;
