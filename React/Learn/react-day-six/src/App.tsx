import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { AppProvider } from "./context/AppContext";
import "./styles/global.css";

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout className="app-layout">
          <Sidebar />
          <Layout className="main-layout">
            <Header />
            <Content className="content">
              <Routes>
                <Route path="/" element={<Inventory />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
