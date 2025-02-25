import React from "react";
import { Table, Button, Image } from "antd";
import { useInventory } from "../context/InventoryContext";

const Cart: React.FC = () => {
  const { state, dispatch } = useInventory();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Cart</h2>
      {state.cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Table dataSource={state.cart} rowKey="id" pagination={{ pageSize: 5 }}>
          <Table.Column title="Image" dataIndex="image" render={(image) => <Image width={50} src={image} />} />
          <Table.Column title="Name" dataIndex="name" />
          <Table.Column title="Quantity" dataIndex="quantity" />
          <Table.Column title="Actions" render={(text, record) => (
            <>
              <Button type="link" onClick={() => dispatch({ type: "INCREASE_QUANTITY", payload: record.id })}>
                ➕
              </Button>
              <Button type="link" onClick={() => dispatch({ type: "DECREASE_QUANTITY", payload: record.id })}>
                ➖
              </Button>
              <Button type="link" danger onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: record.id })}>
                ❌
              </Button>
            </>
          )} />
        </Table>
      )}
    </div>
  );
};

export default Cart;
