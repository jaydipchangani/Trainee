import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Button } from "antd";

const Cart: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div>
      <h2>Cart</h2>
      {state.cart.map((p) => (
        <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <img src={p.image} alt={p.name} style={{ width: "80px", height: "80px", objectFit: "cover" }} />
          <p>{p.name} - ${p.price} - Quantity: {p.quantity}</p>
          <Button onClick={() => dispatch({ type: "INCREMENT_CART", id: p.id })}>+</Button>
          <Button onClick={() => dispatch({ type: "DECREMENT_CART", id: p.id })}>-</Button>
          <Button onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: p.id })}>Remove</Button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
