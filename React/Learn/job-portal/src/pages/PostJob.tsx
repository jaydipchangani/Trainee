import { Layout, Form, Input, Button, Card, Select } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addJob } from "../redux/jobSlice";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/Header";

const { Content } = Layout;
const { Option } = Select;

const PostJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handlePostJob = (values: any) => {
    const newJob = { ...values, postedBy: user.name }; // ✅ Store who posted the job
    dispatch(addJob(newJob)); // ✅ Add job to JSON Server & Redux Store
    navigate("/dashboard");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
          <Card title="Post a Job" style={{ width: 400 }}>
            <Form layout="vertical" onFinish={handlePostJob}>
              <Form.Item label="Job Title" name="title" rules={[{ required: true, message: "Enter job title!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true, message: "Enter job description!" }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Salary" name="salary" rules={[{ required: true, message: "Enter salary!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Location" name="location" rules={[{ required: true, message: "Enter location!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Job Type" name="type" rules={[{ required: true, message: "Select job type!" }]}>
                <Select placeholder="Select job type">
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
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PostJob;
