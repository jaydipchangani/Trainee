import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, Image } from "antd";
import { useInventory } from "../context/InventoryContext";

const Inventory: React.FC = () => {
  const { state, dispatch } = useInventory();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [form] = Form.useForm();

  const showModal = (product?: any) => {
    setEditingProduct(product);
    form.setFieldsValue(
      product || { name: "", quantity: 1, price: 0, description: "", image: "" }
    );
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        dispatch({
          type: "EDIT_PRODUCT",
          payload: { ...editingProduct, ...values },
        });
      } else {
        dispatch({ type: "ADD_PRODUCT", payload: { ...values, id: Date.now() } });
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: "16px" }}>
        Add Product
      </Button>
      <Table dataSource={state.inventory} rowKey="id" pagination={{ pageSize: 5 }}>
        <Table.Column title="Image" dataIndex="image" render={(image) => <Image width={50} src={image} />} />
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Quantity" dataIndex="quantity" />
        <Table.Column title="Price ($)" dataIndex="price" />
        <Table.Column title="Actions" render={(_, record) => (
          <>
            <Button type="link" onClick={() => showModal(record)}>Edit</Button>
            <Button type="link" danger onClick={() => dispatch({ type: "DELETE_PRODUCT", payload: record.id })}>
              Delete
            </Button>
          </>
        )} />
      </Table>

      <Modal
        title="Product Form"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please enter a product name" },
              { pattern: /^[A-Za-z\s]+$/, message: "Only letters and spaces are allowed" }
            ]}
          >
            <Input />
          </Form.Item>

            <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: "Please enter a quantity" },
              { type: "number", min: 1, message: "Quantity must be a positive number" },
              { type: "integer", message: "Quantity must be an integer" }
            ]}
            >
            <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

          <Form.Item
            name="price"
            label="Price ($)"
            rules={[
              { required: true, message: "Please enter a price" },
              { type: "number", min: 0.01, message: "Price must be greater than 0" }
            ]}
          >
            <InputNumber min={0.01} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[
              { required: true, message: "Please enter an image URL" },
              { pattern: /\.(jpg|jpeg|png|gif)$/i, message: "Please enter a valid image URL (e.g., .jpg, .png)" }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Inventory;
