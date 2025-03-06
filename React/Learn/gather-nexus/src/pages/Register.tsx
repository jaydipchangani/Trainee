import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Row, Col, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "../styles/Register.css";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber: values.phone,
      isAcceptTerms: values.terms,
      isVerified: false, // ✅ User must verify their email first
      tenant: {
        id: "666c0babed5e6722a23c4aba",
        name: "Satva",
        currency: null,
      },
    };

    console.log("Register Payload:", payload);

    try {
      const response = await registerUser(payload);
      if (response.data.success) {
        message.success("Registration successful! Please check your email for verification.");
        navigate("/verify-email");
      }
    } catch (error: any) {
      console.error("Registration Failed:", error.response?.data || error.message);
      message.error("Registration failed! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="register-container">
      <Col xs={24} md={10} className="register-image-container">
        <div className="register-image-wrapper">
          <img
            src="https://sandboxgathernexus.azurewebsites.net/assets/images/Log-in-Vector.svg"
            alt="Register Illustration"
            className="register-image"
          />
        </div>
      </Col>
      <Col xs={24} md={14} className="register-form-container">
        <div className="register-form-box">
          <Title level={2} className="register-title">
            <span className="logo-text">GATHER</span>
            <span className="highlight">.nexus</span>
          </Title>
          <Text className="register-subtitle">Welcome to <strong>GATHER.nexus!</strong> Please Enter your Details.</Text>
          
          <Form layout="vertical" onFinish={onFinish} className="register-form">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
                  <Input placeholder="Enter your Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Full Company Name" name="companyName" rules={[{ required: true, message: "Please enter your company name" }]}>
                  <Input placeholder="Enter your Company Name" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Email Address" name="email" rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Invalid email format" }]}>
                  <Input placeholder="Enter your Email Address" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: "Please enter your phone number" }, { pattern: /^[0-9]{10}$/, message: "Phone number must be 10 digits" }]}>
                  <Input placeholder="Enter Phone Number" />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter a password" }, { min: 8, message: "Password must be at least 8 characters" }]}>
                  <Input.Password placeholder="Type your password" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Confirm Password" name="confirmPassword" dependencies={["password"]} rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match!"));
                    },
                  }),
                ]}>
                  <Input.Password placeholder="Type your password" />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item name="terms" valuePropName="checked" rules={[{ required: true, message: "You must agree to the terms" }]}>
              <Checkbox>
                I am authorized to enter into this Contract on behalf of the Company and agree to the <Link to="/terms">Terms of Service</Link>.
              </Checkbox>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" className="register-btn" loading={loading} block>
                Register Now!
              </Button>
            </Form.Item>
          </Form>
          
          <Text className="register-footer">
            Already have an account? <Link to="/login">Sign in Now!</Link>
          </Text>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
