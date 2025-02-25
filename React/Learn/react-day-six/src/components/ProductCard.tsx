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
  <Card title={name} bordered={true} style={{ width: 300, margin: 10 }}>
    <img src={image} alt={name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
    <p>Price: ${price}</p>
    {quantity !== undefined && <p>Stock: {quantity}</p>}
    {onAddToCart && <Button type="primary" onClick={onAddToCart}>Add to Cart</Button>}
  </Card>
);

export default ProductCard;
