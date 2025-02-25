import React, { useState } from "react";
import { Button, Input, List } from "antd";
import { useInventory } from "../context/InventoryContext";

const Inventory: React.FC = () => {
  const { state, dispatch } = useInventory();
  const [product, setProduct] = useState({ id: 0, name: "", quantity: 0, description: "" });

  const addProduct = () => {
    dispatch({ type: "ADD_PRODUCT", payload: { ...product, id: Date.now() } });
  };

  return (
    <div>
      <Input placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
      <Input type="number" placeholder="Quantity" onChange={(e) => setProduct({ ...product, quantity: +e.target.value })} />
      <Input placeholder="Description" onChange={(e) => setProduct({ ...product, description: e.target.value })} />
      <Button onClick={addProduct}>Add Product</Button>
      <List
        dataSource={state.inventory}
        renderItem={(item) => (
          <List.Item>
            {item.name} - {item.quantity} 
            <Button onClick={() => dispatch({ type: "DELETE_PRODUCT", payload: item.id })}>Delete</Button>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Inventory;
