import { Layout, Form, Input, Button, Card } from "antd";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/Header";

const { Content } = Layout;

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleUpdateProfile = (values: any) => {
    localStorage.setItem("user", JSON.stringify(values));
    setUser(values);
    alert("Profile updated successfully!");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
          <Card title="Edit Profile" style={{ width: 400 }}>
            <Form layout="vertical" onFinish={handleUpdateProfile} initialValues={user}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter your name!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: "Enter your email!" }]}>
                <Input />
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
