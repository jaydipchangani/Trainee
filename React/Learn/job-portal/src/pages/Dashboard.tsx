import { Layout } from "antd";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import JobForm from "../components/JobForm";

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Layout.Content style={{ padding: "20px" }}>
          <h2>Post a Job</h2>
          <JobForm />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
