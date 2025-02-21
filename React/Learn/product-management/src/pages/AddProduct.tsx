import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleAdd = useCallback(() => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const newProduct = { id: Date.now(), name, quantity, price };
    localStorage.setItem("products", JSON.stringify([...products, newProduct]));
    navigate("/products");
  }, [name, quantity, price, navigate]);

  return (
    <div className="text-center">
      <h2>Add Product</h2>
      <Form>
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Form.Group>
        <Button className="mt-3" onClick={handleAdd}>Add</Button>
      </Form>
    </div>
  );
};

export default AddProduct;