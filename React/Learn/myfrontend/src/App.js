import React from "react";
import ProductList from "./ProductList";
import { Layout } from "antd";

const { Header, Content, Footer } = Layout;

function App() {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ color: "white", fontSize: "20px", textAlign: "center" }}>
                My Product Manager
            </Header>
            <Content style={{ padding: "20px" }}>
               
                <ProductList />
            </Content>
            <Footer style={{ textAlign: "center" }}>
                © 2025 My Company
            </Footer>
        </Layout>
    );
}

export default App;
