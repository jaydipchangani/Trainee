import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: any) => p.id === Number(id));
  const [name, setName] = useState(product ? product.name : "");

  const handleEdit = () => {
    const updatedProducts = products.map((p: any) => (p.id === Number(id) ? { ...p, name } : p));
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    navigate("/products");
  };

  return (
    <div className="text-center">
      <h2>Edit Product</h2>
      <Form>
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>
        <Button className="mt-3" onClick={handleEdit}>Update</Button>
      </Form>
    </div>
  );
};

export default EditProduct;