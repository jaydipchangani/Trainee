import React from "react";
import { Card, Button } from "antd";
import { useInventory } from "../context/InventoryContext";

const Products: React.FC = () => {
  const { state, dispatch } = useInventory();

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "20px" }}>
      {state.inventory.map((product) => (
        <Card
          key={product.id}
          title={product.name}
          bordered={true}
          style={{ width: 300, background: "#f0f2f5" }}
          cover={<img alt={product.name} src={product.image} style={{ height: 200, objectFit: "cover" }} />}
        >
          <p>{product.description}</p>
          <p>Quantity: {product.quantity}</p>
          <Button type="primary" onClick={() => dispatch({ type: "ADD_TO_CART", payload: product.id })}>
            Add to Cart
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default Products;
