import React from "react";
import { Table, Button, Image } from "antd";
import { useInventory } from "../context/InventoryContext";

const Cart: React.FC = () => {
  const { state, dispatch } = useInventory();

  // Calculate total cart price
  const totalCartPrice = state.cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => <Image width={50} src={image} />,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: record.id })}
          >
            +
          </Button>
          <Button
            type="default"
            onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: record.id })}
          >
            -
          </Button>
          <Button
            type="dashed"
            danger
            onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: record.id })}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Shopping Cart</h2>
      {state.cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <Table
            dataSource={state.cart}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
          <h3 style={{ marginTop: "20px" }}>Total Price: ${totalCartPrice.toFixed(2)}</h3>
        </>
      )}
    </div>
  );
};

export default Cart;
