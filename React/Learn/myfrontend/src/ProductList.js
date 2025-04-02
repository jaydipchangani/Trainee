import React, { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct } from "./api/productService";
import { Table, Button, Modal, Input, message } from "antd";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: "", price: "" });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price) {
            message.error("Please enter all details!");
            return;
        }
        await addProduct(newProduct);
        message.success("Product added successfully!");
        setNewProduct({ name: "", price: "" });
        setModalVisible(false);
        fetchProducts();
    };

    const handleDeleteProduct = async (id) => {
        await deleteProduct(id);
        message.success("Product deleted successfully!");
        fetchProducts();
    };

    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Price ($)",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Button type="primary" danger onClick={() => handleDeleteProduct(record.id)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Product List</h2>
            <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: "10px" }}>
                + Add Product
            </Button>
            <Table 
  dataSource={products} 
  columns={columns} 
  rowKey="id" 
  loading={loading} 
  pagination={{ pageSize: 5 }}  // ✅ Show only 5 rows per page
/>


            {/* Add Product Modal */}
            <Modal
                title="Add New Product"
                visible={modalVisible}
                onOk={handleAddProduct}
                onCancel={() => setModalVisible(false)}
            >
                <Input
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Enter price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
            </Modal>
        </div>
    );
}

export default ProductList;
