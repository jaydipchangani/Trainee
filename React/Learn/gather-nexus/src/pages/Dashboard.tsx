import React, { useEffect, useState } from "react";
import { Layout, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/storage";
import AppHeader from "../components/Header";
import Group from "./Group";

const { Content } = Layout;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("group");

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: "20px", marginTop: "20px" }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="Group" key="group">
            <Group />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Group Class" key="groupClass">
            <p>This is the Group Class page.</p>
          </Tabs.TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
};

export default Dashboard;
