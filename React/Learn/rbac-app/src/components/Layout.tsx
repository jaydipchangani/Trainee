import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";

const { Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar />

      <Layout style={{ marginLeft: 200 }}>
        {/* Fixed Header */}
        <Header />

        {/* Scrollable Main Content */}
        <Content
          style={{
            padding: "24px",
            margin: "0",
            minHeight: "calc(100vh - 64px)", // Adjusted to leave space for the fixed header
            overflowY: "auto",
            backgroundColor: "#f0f2f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
