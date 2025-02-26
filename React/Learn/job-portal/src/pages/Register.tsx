import { Layout, Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

const { Content } = Layout;

const Register = () => {
  const navigate = useNavigate();

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

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    try {
      const { data: users } = await axios.get("http://localhost:5000/users");
      const existingUser = users.find((user: any) => user.email === values.email);

      if (existingUser) {
        message.error("User already exists. Please login.");
        navigate("/");
        return;
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(values.password, 10);

      // Save user with hashed password
      const newUser = { ...values, password: hashedPassword };
      await axios.post("http://localhost:5000/users", newUser);

      message.success("Registration successful! Redirecting...");
      navigate("/");
    } catch (error) {
      message.error("Registration failed. Please try again.");
    }
  };

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}
    >
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Card title="Register" style={{ width: 400, borderRadius: 10, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Form layout="vertical" onFinish={handleRegister}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter your name!" }]}>
              <Input placeholder="Enter your name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }, { validator: passwordValidator }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ background: "#1890ff", borderColor: "#1890ff" }}>
                Register
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="link" onClick={() => navigate("/")}>
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
