import { Layout, Table, Input, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;
const { Option } = Select;

const Dashboard = () => {
  interface Job {
    id: number;
    title: string;
    description: string;
    salary: string;
    location: string;
    type: string;
    postedBy: string;
  }
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs");
      setJobs(response.data);
      setFilteredJobs(response.data); // initial whole data show krva
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    }

    if (jobType) {
      filtered = filtered.filter((job) => job.type === jobType);
    }

    if (location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, jobType, location, jobs]);

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Posted By", dataIndex: "postedBy", key: "postedBy" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px" }}>
          <h2>All Job Listings</h2>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <Input
              placeholder="Search by Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "30%" }}
            />

            <Select
              placeholder="Filter by Job Type"
              value={jobType}
              onChange={(value) => setJobType(value)}
              allowClear
              style={{ width: "30%" }}
            >
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Remote">Remote</Option>
            </Select>

            <Input
              placeholder="Search by Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: "30%" }}
            />
          </div>

          <Table dataSource={filteredJobs} columns={columns} rowKey="id" />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
