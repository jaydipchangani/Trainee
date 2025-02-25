import React from "react";
import { Card, Button } from "antd";

interface Props {
  name: string;
  price: number;
  image: string;
  quantity?: number;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<Props> = ({ name, price, image, quantity, onAddToCart }) => (
  <Card className="product-card" hoverable>
    <img src={image} alt={name} className="product-image" />
    <h3>{name}</h3>
    <p>Price: ${price}</p>
    {quantity !== undefined && <p>Stock: {quantity}</p>}
    {onAddToCart && <Button type="primary" onClick={onAddToCart}>Add to Cart</Button>}
  </Card>
);

export default ProductCard;
