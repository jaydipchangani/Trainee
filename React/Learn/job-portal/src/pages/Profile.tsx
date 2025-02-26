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

  const passwordValidator = (_: any, value: string) => {
    if (!value) return Promise.reject("Enter your password!");
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPasswordRegex.test(value)) {
      return Promise.reject(
        "Password must be at least 8 characters long, with uppercase, lowercase, number, and special character."
      );
    }
    return Promise.resolve();
  };

  useEffect(() => {
    // Get logged-in user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Ensure user ID is present (important for db.json updates)
      if (!parsedUser.id) {
        message.error("User ID is missing. Please log in again.");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setUser(parsedUser);

      // Fill form fields (password field remains empty for security)
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

      // If a new password is provided, hash it before saving
      if (values.password) {
        const hashedPassword = await bcrypt.hash(values.password, 10);
        updatedUser.password = hashedPassword;
      }

      // Update user in db.json (JSON Server)
      await axios.patch(`http://localhost:5000/users/${user.id}`, updatedUser);

      // Update localStorage with new user data
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
              <Form.Item
                label="New Password"
                name="password"
                tooltip="Leave empty if you don't want to change the password."
                rules={[{ validator: passwordValidator }]}
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
