import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Products: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div>
      <h2>Products</h2>
      {state.inventory.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} image={p.image} quantity={p.quantity} onAddToCart={() => dispatch({ type: "ADD_TO_CART", id: p.id })} />
      ))}
    </div>
  );
};

export default Products;
