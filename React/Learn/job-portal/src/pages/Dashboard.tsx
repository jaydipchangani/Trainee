import { Layout, Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs");
      setJobs(response.data); // Fetch all jobs
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Posted By", dataIndex: "postedBy", key: "postedBy" }, // 👈 Show who posted the job
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px" }}>
          <h2>All Job Listings</h2>
          <Table dataSource={jobs} columns={columns} rowKey="id" />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
