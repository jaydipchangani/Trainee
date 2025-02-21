import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: any) => p.id === parseInt(id || "0"));

  const [name, setName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product?.quantity || "");
  const [price, setPrice] = useState(product?.price || "");

  const handleEdit = useCallback(() => {
    const updatedProducts = products.map((p: any) =>
      p.id === parseInt(id || "0") ? { ...p, name, quantity, price } : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    navigate("/products");
  }, [id, name, quantity, price, products, navigate]);


  return (
    <div className="text-center">
      <h2>Edit Product</h2>
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
        <Button className="mt-3" onClick={handleEdit}>Save Changes</Button>
      </Form>
    </div>
  );
};

export default EditProduct;
