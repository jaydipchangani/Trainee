import { Layout, Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    try {
      // Check if the user already exists
      const { data: users } = await axios.get("http://localhost:5000/users");
      const existingUser = users.find((user: any) => user.email === values.email);

      if (existingUser) {
        message.error("User already exists. Please login.");
        navigate("/"); // Redirect to login page
        return;
      }

      // Register the user (add to JSON Server)
      await axios.post("http://localhost:5000/users", values);

      // Store user in localStorage and redirect to Dashboard
      localStorage.setItem("user", JSON.stringify(values));
      message.success("Registration successful! Redirecting...");
      navigate("/dashboard");

    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Content>
        <Card title="Register" style={{ width: 400 }}>
          <Form layout="vertical" onFinish={handleRegister}>
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
                Register
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/")} block>
                Already have an account? Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;
