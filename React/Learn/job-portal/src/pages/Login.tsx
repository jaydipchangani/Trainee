import { Layout, Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");

      const validUser = users.find((user: any) => user.email === values.email);

      if (validUser) {
        const passwordMatch = await bcrypt.compare(values.password, validUser.password);
        
        if (passwordMatch) {
          localStorage.setItem("user", JSON.stringify(validUser));
          message.success("Login successful! Redirecting...");
          navigate("/dashboard");
        } else {
          message.error("Invalid email or password.");
        }
      } else {
        message.error("Invalid email or password.");
      }
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Content>
        <Card title="Login" style={{ width: 400, borderRadius: 10 }}>
          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Enter your password!" }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/register")}>
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
