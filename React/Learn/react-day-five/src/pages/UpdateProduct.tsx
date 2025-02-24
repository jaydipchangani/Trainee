import React, { useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/Layout"; // Import Layout

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const UpdateProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
  
  useEffect(() => {
    const product = storedProducts.find((p) => p.id === Number(id));
    if (product) {
      form.setFieldsValue(product);
    }
  }, [id]);

  const handleUpdate = (values: Omit<Product, "id">) => {
    const updatedProducts = storedProducts.map((p) =>
      p.id === Number(id) ? { ...p, ...values } : p
    );

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    message.success("Product updated successfully!");
    navigate("/products");
  };

  return (
    <AppLayout> {/* Wrap inside AppLayout */}
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
          <Button type="primary" htmlType="submit">Update Product</Button>
        </Form>
      </Card>
    </AppLayout>
  );
};

export default UpdateProduct;
