import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/Layout"; // Import the Layout

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleAdd = (values: Omit<Product, "id">) => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");

    const newProduct: Product = {
      id: Date.now(),
      ...values,
    };

    localStorage.setItem("products", JSON.stringify([...storedProducts, newProduct]));
    message.success("Product added successfully!");
    navigate("/products");
  };

  return (
    <AppLayout> {/* Wrap inside AppLayout */}
      <Card title="Add New Product">
        <Form form={form} layout="vertical" onFinish={handleAdd}>
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
          <Button type="primary" htmlType="submit">Add Product</Button>
        </Form>
      </Card>
    </AppLayout>
  );
};

export default AddProduct;
