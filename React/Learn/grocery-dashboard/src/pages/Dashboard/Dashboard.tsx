import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import styles from "./Dashboard.module.scss";

interface GroceryItem {
  key: string;
  name: string;
  quantity: string;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<GroceryItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

  const handleAdd = () => {
    form.resetFields();
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEdit = (record: GroceryItem) => {
    form.setFieldsValue(record);
    setEditingItem(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Item deleted successfully!");
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingItem) {
        setData(data.map((item) => (item.key === editingItem.key ? { ...values, key: editingItem.key } : item)));
      } else {
        setData([...data, { ...values, key: Date.now().toString() }]);
      }
      setIsModalVisible(false);
      message.success(editingItem ? "Item updated successfully!" : "Item added successfully!");
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: GroceryItem) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button danger onClick={() => handleDelete(record.key)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Button type="primary" onClick={handleAdd}>Add Item</Button>
      <Table columns={columns} dataSource={data} />
      <Modal title={editingItem ? "Edit Item" : "Add Item"} open={isModalVisible} onOk={handleSave} onCancel={() => setIsModalVisible(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Enter name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Enter quantity" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
