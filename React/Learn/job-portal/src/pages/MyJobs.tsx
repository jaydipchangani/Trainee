import { Layout, Table, Button, message, Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;
const { Option } = Select;

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Get logged-in user

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/jobs");
      const userJobs = response.data.filter((job: any) => job.postedBy === user.email);
      setJobs(userJobs);
    } catch (error) {
      message.error("Failed to fetch jobs.");
    }
  };

  // DELETE JOB
  const handleDeleteJob = async (jobId: number) => {
    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job.id !== jobId));
      message.success("Job deleted successfully!");
    } catch (error) {
      message.error("Failed to delete job.");
    }
  };

  // SHOW EDIT MODAL
  const showEditModal = (job: any) => {
    setSelectedJob(job);
    form.setFieldsValue(job);
    setIsModalVisible(true);
  };

  // UPDATE JOB
  const handleUpdateJob = async (values: any) => {
    try {
      await axios.put(`http://localhost:5000/jobs/${selectedJob.id}`, {
        ...values,
        postedBy: selectedJob.postedBy, // Keep original postedBy
      });

      message.success("Job updated successfully!");
      setIsModalVisible(false);
      fetchJobs(); // Refresh jobs
    } catch (error) {
      message.error("Failed to update job.");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "Location", dataIndex: "location", key: "location" },
    { title: "Type", dataIndex: "type", key: "type" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, job: any) => (
        <>
          <Button type="primary" onClick={() => showEditModal(job)} style={{ marginRight: 8 }}>
            Edit
          </Button>
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

          {/* Edit Job Modal */}
          <Modal title="Edit Job" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleUpdateJob}>
              <Form.Item label="Title" name="title" rules={[{ required: true, message: "Enter job title" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Enter job description" }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Salary" name="salary" rules={[{ required: true, message: "Enter salary" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Location" name="location" rules={[{ required: true, message: "Enter location" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Job Type" name="type" rules={[{ required: true, message: "Select job type" }]}>
                <Select>
                  <Option value="Full-time">Full-time</Option>
                  <Option value="Part-time">Part-time</Option>
                  <Option value="Remote">Remote</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Update Job
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MyJobs;
