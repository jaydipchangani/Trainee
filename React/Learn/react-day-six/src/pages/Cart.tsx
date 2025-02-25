import React from "react";
import { Card, Button } from "antd";
import { useInventory } from "../context/InventoryContext";

const Cart: React.FC = () => {
  const { state, dispatch } = useInventory();

  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "20px" }}>
      {state.cart.length > 0 ? (
        state.cart.map((product) => (
          <Card key={product.id} title={product.name} bordered={true} style={{ width: 300, background: "#f6ffed" }}>
            <p>{product.description}</p>
            <p>Quantity: {product.quantity}</p>
            <Button onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: product.id })}>+</Button>
            <Button onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: product.id })}>-</Button>
            <Button danger onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}>
              Remove
            </Button>
          </Card>
        ))
      ) : (
        <p style={{ fontSize: "18px", color: "#ff4d4f" }}>Your cart is empty!</p>
      )}
    </div>
  );
};

export default Cart;
