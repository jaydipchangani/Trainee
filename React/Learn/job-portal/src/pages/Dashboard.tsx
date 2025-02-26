import { Layout, Card, List } from "antd";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/Header";

const { Content } = Layout;

const Dashboard = () => {
  const jobs = useSelector((state: any) => state.jobs.jobs || []); // ✅ Ensure it's always an array

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "20px" }}>
          <h2>Job Listings</h2>
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={jobs}
            renderItem={(job) => (
              <List.Item>
                <Card title={job.title}>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Type:</strong> {job.type}</p>
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
