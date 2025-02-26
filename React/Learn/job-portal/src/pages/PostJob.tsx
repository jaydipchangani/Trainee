import { Layout, Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;
const { Option } = Select;

const PostJob = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}"); // Get logged-in user

  const handlePostJob = async (values: any) => {
    try {
      await axios.post("http://localhost:5000/jobs", {
        ...values,
        postedBy: user.email, // 👈 Store user ID (email)
      });

      message.success("Job posted successfully!");
      form.resetFields();
      navigate("/dashboard");
    } catch (error) {
      message.error("Failed to post job.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px" }}>
          <h2>Post a Job</h2>
          <Form form={form} layout="vertical" onFinish={handlePostJob}>
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
                Post Job
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PostJob;
