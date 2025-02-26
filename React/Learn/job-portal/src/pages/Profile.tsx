import { Layout, Form, Input, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const Profile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      form.setFieldsValue(parsedUser);
    } else {
      message.error("You must be logged in to access your profile.");
      navigate("/login");
    }
  }, [form, navigate]);

  const handleUpdateProfile = async (values: { name: string; email: string; password: string }) => {
    if (!user) return;

    try {
      // Send PATCH request to update user in db.json
      await axios.patch(`http://localhost:5000/users/${user.id}`, values);

      // Update localStorage with new user data
      const updatedUser = { ...user, ...values };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Clear form fields after successful update
      form.resetFields();

      message.success("Profile updated successfully!");

    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header & Sidebar */}
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card title="Edit Profile" style={{ width: 400 }}>
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter your name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Enter your email!" }, { type: "email", message: "Enter a valid email!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter your password!" }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Update Profile
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Profile;
