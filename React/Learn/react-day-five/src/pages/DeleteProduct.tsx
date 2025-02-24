import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

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

  useEffect(() => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const foundProduct = storedProducts.find((p) => p.id === Number(id));

    if (!foundProduct) {
      message.error("Product not found!");
      navigate("/products");
      return;
    }

    setProduct(foundProduct);
  }, [id, navigate]);

  const handleDelete = () => {
    const storedProducts: Product[] = JSON.parse(localStorage.getItem("products") || "[]");
    const updatedProducts = storedProducts.filter((p) => p.id !== Number(id));

    localStorage.setItem("products", JSON.stringify(updatedProducts));
    message.success("Product deleted successfully!");
    navigate("/products");
  };

  return (
    <Card title="Delete Product">
      {product ? (
        <>
          <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
          <Button type="primary" danger onClick={handleDelete}>Yes, Delete</Button>
          <Button onClick={() => navigate("/products")} style={{ marginLeft: "10px" }}>Cancel</Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};

export default DeleteProduct;
