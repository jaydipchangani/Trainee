import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/Header";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { InventoryProvider } from "./context/InventoryContext";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <InventoryProvider>
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <AppHeader />
          <Layout>
            <Sidebar />
            <Content style={{ padding: "20px", background: "#ffffff", marginLeft: "100px" }}>
              <Routes>
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </InventoryProvider>
  );
};

export default App;
