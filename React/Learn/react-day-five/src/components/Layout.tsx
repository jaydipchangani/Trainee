import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";

const { Content } = Layout;

interface LayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "20px" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
