import React from "react";
import { useParams } from "react-router-dom";

const ViewProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const product = products.find((p: any) => p.id === Number(id));

  return (
    <div className="text-center">
      <h2>Product Details</h2>
      {product ? <p>Name: {product.name}</p> : <p>Product not found</p>}
    </div>
  );
};

export default ViewProduct;