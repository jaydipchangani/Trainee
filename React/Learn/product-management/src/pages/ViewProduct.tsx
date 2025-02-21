import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: any) => p.id === parseInt(id || "0"));

  if (!product) {
    return <h2 className="text-center">Product not found</h2>;
  }

  return (
    <div className="text-center">
      <h2>Product Details</h2>
      <Card className="mx-auto" style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>Quantity: {product.quantity}</Card.Text>
          <Card.Text>Price: ${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewProduct;