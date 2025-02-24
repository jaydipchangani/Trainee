import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/Layout"; // Import Layout

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
}

const DeleteProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");

  useEffect(() => {
    const foundProduct = storedProducts.find((p) => p.id === Number(id));
    setProduct(foundProduct || null);
  }, [id]);

  const handleDelete = () => {
    const filteredProducts = storedProducts.filter((p) => p.id !== Number(id));
    localStorage.setItem("products", JSON.stringify(filteredProducts));
    message.success("Product deleted successfully!");
    navigate("/products");
  };

  return (
    <AppLayout>
      <Card title="Delete Product">
        {product ? (
          <>
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <Button type="primary" danger onClick={handleDelete}>
              Confirm Delete
            </Button>
          </>
        ) : (
          <p>Product not found.</p>
        )}
      </Card>
    </AppLayout>
  );
};

export default DeleteProduct;
