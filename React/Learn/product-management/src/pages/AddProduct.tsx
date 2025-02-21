import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleAdd = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const newProduct = { id: Date.now(), name, quantity, price };
      localStorage.setItem("products", JSON.stringify([...products, newProduct]));
      navigate("/products");
    }
    setValidated(true);
  }, [name, quantity, price, navigate]);

  return (
    <div className="text-center">
      <h2>Add Product</h2>
      <Form noValidate validated={validated} onSubmit={handleAdd}>
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            Please provide a product name.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid quantity.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
          <Form.Control.Feedback type="invalid">
            Please provide a valid price.
          </Form.Control.Feedback>
        </Form.Group>
        <Button className="mt-3" type="submit">Add</Button>
      </Form>
    </div>
  );
};

export default AddProduct;