import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/Layout";
import axios from "axios";

const API_URL = "https://fakestoreapi.com/products"; // Replace with your API

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error("Failed to load product!");
      navigate("/products");
    }
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/${id}`, values);
      message.success("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      message.error("Failed to update product!");
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <Card title="Edit Product">
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Enter product name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Enter price" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Enter category" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Update Product</Button>
        </Form>
      </Card>
    </AppLayout>
  );
};

export default UpdateProduct;
