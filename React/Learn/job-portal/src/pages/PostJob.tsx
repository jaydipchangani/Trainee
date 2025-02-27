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

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handlePostJob = async (values: any) => {
    try {
      await axios.post("http://localhost:5000/jobs", {
        ...values,
        postedBy: user.email, 
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
        <Content style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
          <h2>Post a Job</h2>
          <Form form={form} layout="vertical" onFinish={handlePostJob}>
            
            <Form.Item 
              label="Title" 
              name="title" 
              rules={[
                { required: true, message: "Enter job title" },
                { min: 5, max: 50, message: "Title must be between 5 to 50 characters" }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              label="Description" 
              name="description" 
              rules={[
                { required: true, message: "Enter job description" },
                { min: 20, max: 500, message: "Description must be between 20 to 500 characters" }
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item 
              label="Salary" 
              name="salary" 
              rules={[
                { required: true, message: "Enter salary" },
                { pattern: /^[1-9]\d*$/, message: "Salary must be a valid number greater than 0" }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              label="Location" 
              name="location" 
              rules={[
                { required: true, message: "Enter location" },
                { pattern: /^[A-Za-z\s]+$/, message: "Location must contain only letters and spaces" }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item 
              label="Job Type" 
              name="type" 
              rules={[{ required: true, message: "Select job type" }]}
            >
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
