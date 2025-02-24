import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

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
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const foundProduct = storedProducts.find((p) => p.id === Number(id));

    if (!foundProduct) {
      message.error("Product not found!");
      navigate("/products");
      return;
    }

    setProduct(foundProduct);
    form.setFieldsValue(foundProduct);
  }, [id, navigate, form]);

  const handleUpdate = (values: Omit<Product, "id">) => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const updatedProducts = storedProducts.map((p) =>
      p.id === Number(id) ? { ...values, id: Number(id) } : p
    );

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    message.success("Product updated successfully!");
    navigate("/products");
  };

  return (
    <Card title="Update Product">
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
        <Button type="primary" htmlType="submit">Update</Button>
      </Form>
    </Card>
  );
};

export default UpdateProduct;
