import { Layout, Form, Input, Button, Card, message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

const Profile = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [user, setUser] = useState<any>(null);



  useEffect(() => {

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      if (!parsedUser.id) {
        message.error("User ID is missing. Please log in again.");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
      setUser(parsedUser);

      form.setFieldsValue({
        name: parsedUser.name,
        email: parsedUser.email,
        password: "",
      });
    } else {
      message.error("You must be logged in to access your profile.");
      navigate("/login");
    }
  }, [form, navigate]);

  const handleUpdateProfile = async (values: { name: string; email: string; password: string }) => {
    if (!user) return;

    try {
      let updatedUser = { ...user, name: values.name, email: values.email };

      if (values.password) {
        const hashedPassword = await bcrypt.hash(values.password, 10);
        updatedUser.password = hashedPassword;
      }

      await axios.patch(`http://localhost:5000/users/${user.id}`, updatedUser);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      form.resetFields();

      message.success("Profile updated successfully!");
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card title="Edit Profile" style={{ width: 400 }}>
            <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
              <Form.Item label="Name" name="name" >
                <Input />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ type: "email", message: "Enter a valid email!" }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="New Password"
                name="password"
                tooltip="Leave empty if you don't want to change the password."
                rules={[
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character!",
                  },
                ]}
              >
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
