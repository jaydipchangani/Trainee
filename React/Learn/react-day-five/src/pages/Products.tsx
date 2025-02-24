import React, { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { Link } from "react-router-dom";
import AppLayout from "../components/Layout";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(storedProducts);
  }, []);

  return (
    <AppLayout>
      <Link to="/products/add">
        <Button type="primary" style={{ marginBottom: 16 }}>Add Product</Button>
      </Link>

      <Table
        dataSource={products}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Price", dataIndex: "price" },
          { title: "Category", dataIndex: "category" },
          { title: "Description", dataIndex: "description" },
          {
            title: "Actions",
            render: (_, record) => (
              <>
                <Link to={`/products/update/${record.id}`}>
                  <Button type="link">Edit</Button>
                </Link>
                <Link to={`/products/delete/${record.id}`}>
                  <Button type="link" danger>Delete</Button>
                </Link>
              </>
            ),
          },
        ]}
      />
    </AppLayout>
  );
};

export default Products;
