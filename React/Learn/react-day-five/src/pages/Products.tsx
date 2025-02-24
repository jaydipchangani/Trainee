import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, message } from "antd";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
  }, []);

  const handleAddOrUpdate = (values: Product) => {
    const updatedProducts = editingProduct
      ? products.map(p => (p.id === editingProduct.id ? { ...values, id: editingProduct.id } : p))
      : [...products, { ...values, id: Date.now() }];

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    message.success(editingProduct ? "Product updated!" : "Product added!");
    setModalVisible(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setModalVisible(true)}>Add Product</Button>
      <Table dataSource={products} rowKey="id" columns={[
        { title: "Name", dataIndex: "name" },
        { title: "Price", dataIndex: "price" },
        { title: "Category", dataIndex: "category" },
        { title: "Description", dataIndex: "description" },
        { title: "Actions", render: (_, record) => <Button onClick={() => setEditingProduct(record)}>Edit</Button> },
      ]} />
    </div>
  );
};

export default Products;
