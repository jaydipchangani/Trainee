import { Layout, Card, List, Spin } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchJobs } from "../redux/jobSlice";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/Header";

const { Content } = Layout;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { jobs, status } = useSelector((state: any) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs()); // ✅ Fetch latest jobs on page load
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "20px" }}>
          <h2>Job Listings</h2>
          {status === "loading" ? (
            <Spin size="large" />
          ) : (
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={jobs}
              renderItem={(job) => (
                <List.Item>
                  <Card title={job.title}>
                    <p><strong>Salary:</strong> {job.salary}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Type:</strong> {job.type}</p>
                    <p><strong>Posted By:</strong> {job.postedBy}</p>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
