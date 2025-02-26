import { Layout, Table, Button, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Get logged-in user

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs");
      const userJobs = response.data.filter((job: any) => job.postedBy === user.email); // 👈 Fetch only jobs posted by the user
      setJobs(userJobs);
    } catch (error) {
      message.error("Failed to fetch jobs.");
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      setJobs(jobs.filter(job => job.id !== jobId));
      message.success("Job deleted successfully!");
    } catch (error) {
      message.error("Failed to delete job.");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Action",
      key: "action",
      render: (_: any, job: any) => (
        <>
          <Button danger onClick={() => handleDeleteJob(job.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px" }}>
          <h2>My Job Listings</h2>
          <Table dataSource={jobs} columns={columns} rowKey="id" />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyJobs;
