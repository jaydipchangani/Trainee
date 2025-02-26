import { Layout, Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      // Fetch users from JSON Server
      const { data: users } = await axios.get("http://localhost:5000/users");

      // Check if the user exists with matching email & password
      const validUser = users.find((user: any) => user.email === values.email && user.password === values.password);

      if (validUser) {
        // Store user in localStorage and navigate to Dashboard
        localStorage.setItem("user", JSON.stringify(validUser));
        message.success("Login successful! Redirecting...");
        navigate("/dashboard");
      } else {
        message.error("Invalid email or password. Please try again.");
      }

    } catch (error) {
      message.error("Login failed. Please check your connection.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Card title="Login" style={{ width: 400, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Enter your email!" }, { type: "email", message: "Enter a valid email!" }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter your password!" }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ background: "#1890ff", borderColor: "#1890ff" }}>
                Login
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/register")} block>
                Don't have an account? Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
