import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Button, Input } from "antd";

const Inventory: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState("");

  return (
    <div className="inventory-page">
      <h2>Manage Inventory</h2>
      <div className="inventory-form">
        <Input placeholder="Product Name" onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Price" type="number" onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="Image URL" onChange={(e) => setImage(e.target.value)} />
        <Input placeholder="Quantity" type="number" onChange={(e) => setQuantity(e.target.value)} />
        <Button type="primary" onClick={() => dispatch({ type: "ADD_PRODUCT", product: { id: Date.now(), name, price: Number(price), image, quantity: Number(quantity) } })}>
          Add Product
        </Button>
      </div>
    </div>
  );
};

export default Inventory;
